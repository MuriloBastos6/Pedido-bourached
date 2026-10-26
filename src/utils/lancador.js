// Leitor de pedidos para o atendente.
// Recebe o texto colado do WhatsApp e devolve linhas { codigo, qtd, ... }
// prontas para lançar no Flutt. Funções puras (sem React) para poderem ser
// testadas por scripts/teste-lancador.mjs.

const STOP = new Set(["de", "da", "do", "das", "dos", "e", "com", "a", "o", "um", "uma", "c", "s", "pra", "para"]);

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

function tokensNome(texto) {
  return normalizar(texto)
    .split(" ")
    .filter((t) => t && !STOP.has(t) && !RE_PESO.test(t) && !RE_PESO_X.test(t) && !UNIDADES[t] && (t.length > 1 || /\d/.test(t)));
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
      precoVenda: variacao.precoVenda,
      nome: tokensNome(produto.descricao),
      pesos,
    });
  });
  return lista;
}

function tokenCasa(q, n) {
  if (q === n) return 1;
  if (q.length >= 4 && n.startsWith(q)) return 0.85;
  if (n.length >= 4 && q.startsWith(n)) return 0.85;
  return 0;
}

export function pontuar(consulta, item) {
  const { nome, pesos, unidade } = consulta;
  if (!nome.length || !item.nome.length) return 0;
  let acertos = 0;
  nome.forEach((q) => {
    let melhor = 0;
    item.nome.forEach((n) => { melhor = Math.max(melhor, tokenCasa(q, n)); });
    acertos += melhor;
  });
  const cobertura = acertos / item.nome.length;
  const precisao = acertos / nome.length;
  let s = 0.6 * cobertura + 0.4 * precisao;
  if (pesos.length) {
    const casou = pesos.some((p) => item.pesos.has(p));
    s += casou ? 0.25 : -0.2;
  }
  if (unidade && unidade === item.unidade) s += 0.1;
  return Math.max(0, Math.min(1.35, s));
}

export function sugerir(consultaTexto, indice, limite = 5) {
  const consulta = {
    nome: tokensNome(consultaTexto),
    pesos: tokensPeso(consultaTexto),
    unidade: null,
  };
  const palavras = normalizar(consultaTexto).split(" ");
  for (const p of palavras) if (UNIDADES[p]) { consulta.unidade = UNIDADES[p]; break; }
  return indice
    .map((item) => ({ item, score: pontuar(consulta, item) }))
    .filter((r) => r.score > 0.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite);
}

// ---------- Mensagem gerada pelo site ----------
export function ehMensagemDoSite(texto) {
  return /C[óo]d\.?\s*:/i.test(texto) && /Qtd\s*:/i.test(texto);
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
      atual = { descricao: m[2].trim(), pesoLabel: "", qtd: 1, codigo: "" };
    } else if (atual) {
      if ((m = /^Peso\s*:\s*(.+)/i.exec(linha))) atual.pesoLabel = m[1].trim();
      else if ((m = /^Qtd\s*:\s*(\d+)/i.exec(linha))) atual.qtd = Number(m[1]);
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

export function lerTextoLivre(texto, indice) {
  const linhas = texto
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*\[[^\]]+\]\s*[^:]{1,40}:\s*/, "").trim())
    .filter((l) => l && normalizar(l).length >= 3);

  return linhas.map((original) => {
    const { qtd, texto: consulta } = extrairQtd(original);
    const sugestoes = sugerir(consulta, indice, 5);
    const top = sugestoes[0];
    const segundo = sugestoes[1];
    let confianca = "nenhuma";
    if (top) {
      const folga = top.score - (segundo ? segundo.score : 0);
      confianca = top.score >= 0.85 && folga >= 0.12 ? "alta" : top.score >= 0.55 ? "revisar" : "baixa";
    }
    return {
      original,
      qtd,
      sugestoes,
      escolhida: top ? top.item : null,
      confianca,
    };
  });
}

// ---------- Saída para o Flutt ----------
export function textoParaFlutt(linhas, separador = "\t") {
  return linhas
    .filter((l) => l.codigo && l.qtd > 0)
    .map((l) => `${l.codigo}${separador}${l.qtd}`)
    .join("\n");
}
