// Leitor de pedidos para o atendente.
// Recebe o texto colado do WhatsApp e devolve linhas { codigo, qtd, ... }
// prontas para lançar no Flutt. Funções puras (sem React) para poderem ser
// testadas por scripts/teste-lancador.mjs.

const STOP = new Set(["de", "da", "do", "das", "dos", "e", "em", "com", "a", "o", "um", "uma", "c", "s", "pra", "para"]);

// Palavras que mudam a forma do produto. Se o cliente não escreveu, o
// produto com ela perde pontos ("ameixa" não deve virar "ameixa em pó").
const FORMAS = new Set(["po", "farinha", "flocos", "floco", "chips", "pasta", "creme", "doce", "extrato", "oleo", "farelo", "xarope", "biscoito", "bala", "granulado", "triturado", "moido", "laminado", "palito"]);

const UNIDADES = {
  cx: "CX", caixa: "CX", caixas: "CX",
  pc: "PC", pct: "PC", pcts: "PC", pacote: "PC", pacotes: "PC",
  sc: "SC", saco: "SC", sacos: "SC",
  fd: "FD", fardo: "FD", fardos: "FD",
  un: "UN", und: "UN", unidade: "UN", unidades: "UN",
};

export function normalizar(texto = "") {
  return String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/(\d)[.,](\d)/g, "$1_$2")
    .replace(/[^a-z0-9_]+/g, " ")
    .replace(/(\d+(?:_\d+)?)\s+(kg|g|gr|ml|l|lt|lts|un)\b/g, (_, n, u) => `${n}${u === "lt" || u === "lts" ? "l" : u === "gr" ? "g" : u}`)
    .replace(/\s+/g, " ")
    .trim();
}

const RE_PESO = /^\d+(?:_\d+)?(?:kg|g|ml|l|un)$/;
const RE_PESO_X = /^(\d+(?:_\d+)?)x(\d+(?:_\d+)?)(kg|g|ml|l)$/;

// Plural simples: "passas" -> "passa", "castanhas" -> "castanha".
// Aplicado igual na frase e na lista, então "nozes" -> "noze" casa dos dois lados.
function singular(t) {
  return t.length > 3 && t.endsWith("s") && !/\d/.test(t) ? t.slice(0, -1) : t;
}

function tokensNome(texto) {
  return normalizar(texto)
    .split(" ")
    .filter((t) => t && !STOP.has(t) && !RE_PESO.test(t) && !RE_PESO_X.test(t) && !UNIDADES[t] && (t.length > 1 || /\d/.test(t)))
    .map(singular);
}

function tokensPeso(texto) {
  return normalizar(texto)
    .split(" ")
    .filter((t) => RE_PESO.test(t) || RE_PESO_X.test(t));
}

// Transforma o catálogo (Map "id|codigo" -> {produto, variacao}) em uma lista
// plana de variações já com os tokens de busca.
export function montarIndice(catalogoMap) {
  const lista = [];
  catalogoMap.forEach(({ produto, variacao }) => {
    const pu = String(variacao.pesoUnidade || "");
    const pesoNorm = normalizar(`${variacao.pesoValor}${pu}`).replace(/\s+/g, "");
    const pesos = new Set([pesoNorm]);
    const m = /^x(\d+(?:\.\d+)?)(kg|g|ml|l|lt)$/i.exec(pu.trim());
    if (m) {
      const u = m[2].toLowerCase() === "lt" ? "l" : m[2].toLowerCase();
      pesos.add(`${m[1].replace(".", "_")}${u}`);
    }
    lista.push({
      produtoId: produto.id,
      codigo: String(variacao.codigo),
      descricao: produto.descricao,
      pesoLabel: `${variacao.pesoValor}${variacao.pesoUnidade} - ${variacao.unidade}`,
      unidade: String(variacao.unidade || "").toUpperCase(),
      // peso da embalagem em kg (só quando vendida em KG), para converter
      // "10 kg" pedidos em quantidade de pacotes
      pesoKg: pu.trim().toUpperCase() === "KG" ? Number(variacao.pesoValor) || null : null,
      precoVenda: variacao.precoVenda,
      nome: tokensNome(produto.descricao),
      pesos,
    });
  });
  return lista;
}

// Distância de edição limitada a 1 (troca, falta ou sobra de uma letra).
function quaseIgual(a, b) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let erros = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++erros > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  return erros + (a.length - i) + (b.length - j) <= 1;
}

function tokenCasa(q, n) {
  if (q === n) return 1;
  if (q.length >= 4 && n.startsWith(q)) return 0.85;
  if (n.length >= 4 && q.startsWith(n)) return 0.85;
  if (q.length >= 5 && n.length >= 5 && quaseIgual(q, n)) return 0.8; // erro de digitação
  return 0;
}

// Pontua só pelo NOME. O peso não entra aqui: ele escolhe a embalagem dentro
// do mesmo produto (ver ordenarEmbalagens), senão "uva passa 5kg" viraria
// "farinha de uva 5kg" só porque a uva passa vem em caixa de 10 kg.
export function pontuar(consulta, item) {
  const { nome } = consulta;
  if (!nome.length || !item.nome.length) return 0;
  let acertos = 0;
  const casados = new Set();
  nome.forEach((q) => {
    let melhor = 0;
    let qual = -1;
    item.nome.forEach((n, i) => {
      const c = tokenCasa(q, n);
      if (c > melhor) { melhor = c; qual = i; }
    });
    acertos += melhor;
    if (qual >= 0) casados.add(qual);
  });
  const cobertura = acertos / item.nome.length;
  const precisao = acertos / nome.length;
  let s = 0.6 * cobertura + 0.4 * precisao;
  // forma que o cliente não pediu ("em pó", "flocos", "chips"...). Pesa mais
  // quando é a primeira palavra, porque é o que o produto É ("FARINHA de uva").
  // Palavras genéricas como "TEMPERO orégano" não entram em FORMAS.
  const formaNaoPedida = item.nome.findIndex((n, i) => FORMAS.has(n) && !casados.has(i));
  if (formaNaoPedida === 0) s -= 0.2;
  else if (formaNaoPedida > 0) s -= 0.1;
  return Math.max(0, Math.min(1, s));
}

function lerConsulta(consultaTexto) {
  const consulta = {
    nome: tokensNome(consultaTexto),
    pesos: tokensPeso(consultaTexto),
    unidade: null,
    kg: null,
  };
  for (const p of normalizar(consultaTexto).split(" ")) if (UNIDADES[p]) { consulta.unidade = UNIDADES[p]; break; }
  const kg = consulta.pesos.map((p) => /^(\d+(?:_\d+)?)kg$/.exec(p)).find(Boolean);
  if (kg) consulta.kg = Number(kg[1].replace("_", "."));
  return consulta;
}

// Entre as embalagens do mesmo produto: peso exato > unidade pedida (cx, sc)
// > múltiplo exato do peso (10 kg = 2 × 5 kg) > menor embalagem que atende
// o peso pedido > a mais próxima.
function preferenciaEmbalagem(consulta, item) {
  let p = 0;
  if (consulta.pesos.some((x) => item.pesos.has(x))) p += 4;
  if (consulta.unidade && consulta.unidade === item.unidade) p += 2;
  if (consulta.kg && item.pesoKg) {
    if (Number.isInteger(consulta.kg / item.pesoKg)) p += 1.5;
    if (item.pesoKg >= consulta.kg) p += 1 - item.pesoKg / 1000;
    else p -= (consulta.kg - item.pesoKg) / 1000;
  }
  return p;
}

export function sugerir(consultaTexto, indice, limite = 5) {
  const consulta = lerConsulta(consultaTexto);
  return indice
    .map((item) => ({ item, score: pontuar(consulta, item), pref: preferenciaEmbalagem(consulta, item) }))
    .filter((r) => r.score > 0.2)
    // empate de nome (mesmo produto, outra embalagem) é decidido pelo peso
    .sort((a, b) => b.score - a.score || b.pref - a.pref)
    .slice(0, limite)
    .map(({ item, score }) => ({ item, score }));
}

// Chave usada para lembrar a escolha do atendente: só as palavras do produto
// ("3 kg Nozes" e "2 KG nozes" são a mesma). O peso pedido escolhe a
// embalagem do produto lembrado.
export function chaveAprendizado(consultaTexto) {
  return [...lerConsulta(consultaTexto).nome].sort().join(" ");
}

// Produto lembrado -> embalagem que melhor atende o peso/unidade pedidos.
function embalagemDoLembrado(consulta, lembrado, indice) {
  if (!consulta.pesos.length && !consulta.unidade) return lembrado;
  return indice
    .filter((i) => i.produtoId === lembrado.produtoId)
    .sort((a, b) => preferenciaEmbalagem(consulta, b) - preferenciaEmbalagem(consulta, a))[0] || lembrado;
}

// ---------- Mensagem gerada pelo site ----------
// Formato atual: "1) *CÓD. 3124 - BALA JUJUBA*" + "*QTD: 3*".
// Formato antigo: "1) *BALA JUJUBA*" + "Qtd: 3" + "Cód.: 3124".
export function ehMensagemDoSite(texto) {
  return /C[óo]d\.?\s*:?\s*\d/i.test(texto) && /Qtd\s*:/i.test(texto);
}

export function lerMensagemDoSite(texto) {
  const cab = { numero: "", cliente: "", cnpj: "", telefone: "", obs: "" };
  const itens = [];
  let atual = null;
  const fechar = () => { if (atual && atual.codigo) itens.push(atual); atual = null; };

  texto.split(/\r?\n/).forEach((bruta) => {
    // remove prefixo do WhatsApp Web: "[10:32, 26/10/2026] Fulano: "
    const linha = bruta.replace(/^\s*\[[^\]]+\]\s*[^:]{1,40}:\s*/, "").trim();
    let m;
    if ((m = /^Pedido\s*:\s*\*?#?([^*]+)\*?/i.exec(linha))) cab.numero = m[1].trim();
    else if ((m = /^Cliente\s*:\s*\*?([^*]+)\*?/i.exec(linha))) cab.cliente = m[1].trim();
    else if ((m = /^CNPJ\s*:\s*(.+)/i.exec(linha))) cab.cnpj = m[1].trim();
    else if ((m = /^Telefone\s*:\s*(.+)/i.exec(linha))) cab.telefone = m[1].trim();
    else if ((m = /^Obs\w*\s*:\s*(.+)/i.exec(linha))) cab.obs = m[1].trim();
    else if ((m = /^(\d+)\s*\)\s*\*?(.+?)\*?\s*$/.exec(linha))) {
      fechar();
      const comCodigo = /^C[óo]d\.?\s*:?\s*(\S+)\s*[-–]\s*(.+)$/i.exec(m[2].trim());
      atual = comCodigo
        ? { descricao: comCodigo[2].trim(), pesoLabel: "", qtd: 1, codigo: comCodigo[1] }
        : { descricao: m[2].trim(), pesoLabel: "", qtd: 1, codigo: "" };
    } else if (atual) {
      if ((m = /^Peso\s*:\s*(.+)/i.exec(linha))) atual.pesoLabel = m[1].trim();
      else if ((m = /^\*?Qtd\s*:\s*(\d+)/i.exec(linha))) atual.qtd = Number(m[1]);
      else if ((m = /^C[óo]d\.?\s*:\s*(\S+)/i.exec(linha))) atual.codigo = m[1].trim();
    }
  });
  fechar();
  return { cabecalho: cab, itens };
}

// ---------- Texto livre ----------
const UN = "(?:cx|caixas?|pc|pct|pacotes?|sc|sacos?|fd|fardos?|un|und)";
const RE_INICIO = new RegExp(`^(\\d{1,3})(?![\\d.,]\\d)\\s*(?:[x×]\\s*)?(${UN}\\b)?\\s+(?!(?:kg|g|gr|ml|l|lt)\\b)(.+)$`, "i");
const RE_FIM_SEP = new RegExp(`^(.+?)(?:\\s*[-–:]\\s*|\\s+[x×]\\s*)(\\d{1,3})\\s*(${UN})?\\s*$`, "i");
const RE_FIM = new RegExp(`^(.+?)\\s+(\\d{1,3})\\s*(${UN})?\\s*$`, "i");

// Separa a quantidade do restante da frase do cliente.
export function extrairQtd(linha) {
  const l = linha.replace(/^\s*(?:[-•*·>]+|\d+[.)])\s+/, "").trim();
  let m = RE_INICIO.exec(l);
  if (m) return { qtd: Number(m[1]), texto: m[2] ? `${m[2]} ${m[3]}` : m[3] };
  m = RE_FIM_SEP.exec(l) || RE_FIM.exec(l);
  if (m) return { qtd: Number(m[2]), texto: m[3] ? `${m[3]} ${m[1]}` : m[1] };
  return { qtd: 1, texto: l };
}

function formatarKg(n) {
  return `${String(n).replace(".", ",")} kg`;
}

// aprendido: { chave -> codigo } com as escolhas que o atendente já corrigiu.
export function lerTextoLivre(texto, indice, aprendido = {}) {
  const linhas = texto
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*\[[^\]]+\]\s*[^:]{1,40}:\s*/, "").trim())
    .filter((l) => l && normalizar(l).length >= 3);

  return linhas.map((original) => {
    const extraido = extrairQtd(original);
    let qtd = extraido.qtd;
    const consultaTexto = extraido.texto;
    const consulta = lerConsulta(consultaTexto);
    const chave = chaveAprendizado(consultaTexto);
    let sugestoes = sugerir(consultaTexto, indice, 8);
    let confianca = "nenhuma";
    let nota = "";

    const codigoLembrado = aprendido[chave];
    const achadoLembrado = codigoLembrado && indice.find((i) => i.codigo === codigoLembrado);
    const lembrado = achadoLembrado && embalagemDoLembrado(consulta, achadoLembrado, indice);
    if (lembrado) {
      sugestoes = [{ item: lembrado, score: 1 }, ...sugestoes.filter((s) => s.item.codigo !== lembrado.codigo)];
      confianca = "alta";
      nota = "Escolha lembrada do atendente";
    } else if (sugestoes[0]) {
      const top = sugestoes[0];
      // a folga é contra o melhor produto DIFERENTE (outra embalagem do mesmo
      // produto não é dúvida)
      const rival = sugestoes.find((s) => s.item.produtoId !== top.item.produtoId);
      const folga = top.score - (rival ? rival.score : 0);
      confianca = top.score >= 0.75 && folga >= 0.12 ? "alta" : top.score >= 0.5 ? "revisar" : "baixa";
    }

    const escolhida = sugestoes[0] ? sugestoes[0].item : null;

    // "10 kg" pedidos de um produto em pacote de 5 kg -> 2 pacotes
    if (escolhida && consulta.kg && escolhida.pesoKg && consulta.kg !== escolhida.pesoKg) {
      const vezes = consulta.kg / escolhida.pesoKg;
      const prefixo = lembrado ? "Escolha lembrada. " : "";
      if (qtd === 1 && Number.isInteger(vezes) && vezes > 1) {
        qtd = vezes;
        nota = `${prefixo}Cliente pediu ${formatarKg(consulta.kg)} = ${vezes} × ${formatarKg(escolhida.pesoKg)}`;
      } else {
        nota = `${prefixo}Cliente pediu ${formatarKg(consulta.kg)}; a embalagem é de ${formatarKg(escolhida.pesoKg)}`;
        if (confianca === "alta") confianca = "revisar";
      }
    }

    return { original, qtd, chave, sugestoes, escolhida, confianca, nota };
  });
}

// ---------- Saída para o Flutt ----------
export function textoParaFlutt(linhas, separador = "\t") {
  return linhas
    .filter((l) => l.codigo && l.qtd > 0)
    .map((l) => `${l.codigo}${separador}${l.qtd}`)
    .join("\n");
}
