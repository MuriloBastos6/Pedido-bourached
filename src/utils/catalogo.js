import { chaveItem } from "./pedido.js";

// Os produtos e as imagens ficam no repositório bourached-dados, compartilhado
// pelos sites. A URL vem do .env (VITE_PRODUTOS_URL).
export const PRODUTOS_URL =
  import.meta.env?.VITE_PRODUTOS_URL || "https://bourached-dados.vercel.app/produtos.json";

let promessaDados = null;
let promessa = null;

export function normalizarTexto(texto = "") {
  return String(texto)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function ehChavePromocao(chave = "") {
  const normalizada = normalizarTexto(chave);
  return normalizada === "promocao" || normalizada === "promocoes";
}

// As imagens no JSON são caminhos como "/images/graos/arroz.jpg"; elas ficam
// no mesmo servidor do produtos.json.
export function urlImagemProduto(caminho = "") {
  const limpo = String(caminho || "").trim();
  if (!limpo || limpo === "/arroz.jpeg") return limpo;
  try {
    return new URL(limpo, PRODUTOS_URL).href;
  } catch {
    return limpo;
  }
}

// Carrega o produtos.json uma única vez (compartilhado por todas as páginas).
export function carregarDados() {
  if (!promessaDados) {
    promessaDados = fetch(PRODUTOS_URL, { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error("Falha ao carregar produtos");
        return r.json();
      })
      .catch((erro) => {
        promessaDados = null;
        throw erro;
      });
  }
  return promessaDados;
}

// Lista de promoções com as imagens da categoria própria (a lista de
// promoções às vezes vem sem foto ou com a foto padrão).
export function extrairPromocoes(dados = {}) {
  const imagemPorId = new Map();
  let promocoes = [];

  Object.entries(dados).forEach(([chave, itens]) => {
    if (!Array.isArray(itens)) return;
    if (ehChavePromocao(chave)) {
      promocoes = itens;
      return;
    }
    itens.forEach((item) => {
      const id = String(item?.id || "").trim();
      const imagem = typeof item?.imagem === "string" ? item.imagem.trim() : "";
      if (id && imagem && imagem !== "/arroz.jpeg" && !imagemPorId.has(id)) {
        imagemPorId.set(id, imagem);
      }
    });
  });

  return promocoes.map((produto) => {
    const imagem = imagemPorId.get(String(produto?.id || "").trim());
    return { ...produto, isPromocao: true, ...(imagem ? { imagem } : {}) };
  });
}

// Produtos de uma categoria, marcando os que também estão em promoção.
export function produtosDaCategoria(dados = {}, slug) {
  const idsPromocao = new Set(
    extrairPromocoes(dados).map((p) => String(p.id || "").trim()),
  );
  const itens = Array.isArray(dados?.[slug]) ? dados[slug] : [];
  return itens.map((produto) => ({
    ...produto,
    isPromocao: idsPromocao.has(String(produto?.id || "").trim()),
  }));
}

export function menorPreco(produto) {
  const precos = (produto.variacoes || [])
    .map((v) => Number(v.precoVenda))
    .filter((p) => p > 0);
  return precos.length ? Math.min(...precos) : 0;
}

export const ordenacoes = [
  { valor: "padrao", rotulo: "Mais relevantes" },
  { valor: "nome", rotulo: "Nome (A–Z)" },
  { valor: "menor", rotulo: "Menor preço" },
  { valor: "maior", rotulo: "Maior preço" },
];

export function ordenarProdutos(produtos = [], ordem = "padrao") {
  const lista = [...produtos];
  if (ordem === "nome") {
    lista.sort((a, b) => a.descricao.localeCompare(b.descricao, "pt-BR"));
  } else if (ordem === "menor") {
    lista.sort((a, b) => menorPreco(a) - menorPreco(b));
  } else if (ordem === "maior") {
    lista.sort((a, b) => menorPreco(b) - menorPreco(a));
  }
  return lista;
}

// Acha um item de carrinho/pedido no catálogo. Primeiro pela chave
// "idProduto|codigo"; se não achar, pelo código da embalagem (que é único).
// O código recupera itens salvos com id diferente, como os que vinham da
// busca com o id prefixado pela categoria ("graos-canjica-branca").
export function acharNoCatalogo(catalogo, { produtoId, codigo }) {
  const direto = catalogo.get(chaveItem(produtoId, codigo));
  if (direto) return direto;
  const codigoTexto = String(codigo ?? "").trim();
  if (!codigoTexto) return null;
  for (const achado of catalogo.values()) {
    if (String(achado.variacao.codigo).trim() === codigoTexto) return achado;
  }
  return null;
}

// Map "idProduto|codigo" -> { produto, variacao }
export function carregarCatalogo() {
  if (!promessa) {
    promessa = carregarDados()
      .then((dados) => {
        const mapa = new Map();
        Object.values(dados).forEach((itens) => {
          if (!Array.isArray(itens)) return;
          itens.forEach((produto) => {
            (produto.variacoes || []).forEach((variacao) => {
              const chave = chaveItem(produto.id, variacao.codigo);
              if (!mapa.has(chave)) mapa.set(chave, { produto, variacao });
            });
          });
        });
        return mapa;
      })
      .catch((erro) => {
        promessa = null;
        throw erro;
      });
  }
  return promessa;
}

// Endereço da página de cada produto: /produto/<id sem acento>. Se o mesmo id
// aparece em duas categorias, o da segunda ganha o nome da categoria no fim.
const indices = new WeakMap();

export function indiceProdutos(dados = {}) {
  if (indices.has(dados)) return indices.get(dados);
  const porSlug = new Map(); // slug -> { produto, categoria }
  const slugPorChave = new Map(); // "categoria|id" -> slug
  const slugPorId = new Map(); // id -> slug da primeira categoria

  Object.entries(dados).forEach(([categoria, itens]) => {
    if (!Array.isArray(itens) || ehChavePromocao(categoria)) return;
    itens.forEach((produto) => {
      const id = String(produto?.id || "").trim();
      const base = normalizarTexto(id).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      if (!base) return;
      const slug = porSlug.has(base) ? `${base}-${categoria}` : base;
      porSlug.set(slug, { produto, categoria });
      slugPorChave.set(`${categoria}|${id}`, slug);
      if (!slugPorId.has(id)) slugPorId.set(id, slug);
    });
  });

  const indice = { porSlug, slugPorChave, slugPorId };
  indices.set(dados, indice);
  return indice;
}

// "/produto/alho-frito" (ou null se o produto não está em nenhuma categoria).
// Itens de promoção caem na página do produto da categoria própria.
export function caminhoProduto(dados, produto) {
  if (!dados || !produto) return null;
  const { slugPorChave, slugPorId } = indiceProdutos(dados);
  const id = String(produto.id || "").trim();
  const slug = slugPorChave.get(`${produto.categoria}|${id}`) || slugPorId.get(id);
  return slug ? `/produto/${slug}` : null;
}

// "ALHO FRITO C/ SAL" -> "Alho Frito c/ Sal"
const PALAVRAS_MINUSCULAS = new Set(["a", "o", "e", "de", "da", "do", "das", "dos", "em", "com", "sem", "para", "c/", "s/", "p/"]);

export function nomeProduto(descricao = "") {
  return String(descricao)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((p, i) => (i > 0 && PALAVRAS_MINUSCULAS.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ");
}

const NOMES_EMBALAGEM = { PC: "pacote", SC: "saco", CX: "caixa", FD: "fardo", PT: "pote", LT: "lata", UN: "unidade" };
const NOMES_MEDIDA = { KG: "kg", G: "g", ML: "ml", L: "L", LT: "L", UN: "unidades", UM: "unidades" };

// "1.1KG" -> "1,1 kg"; "KG" -> "kg"
function formatarMedida(texto = "") {
  const m = /^([\d.,]*)\s*([A-Z]+)$/.exec(String(texto).toUpperCase());
  if (!m) return String(texto).toLowerCase();
  const nome = NOMES_MEDIDA[m[2]] || m[2].toLowerCase();
  return m[1] ? `${m[1].replace(".", ",")} ${nome}` : nome;
}

// Embalagem por extenso: "saco de 25 kg", "fardo com 12 x 1 L", "caixa com 12 unidades"
export function descreverEmbalagem(v = {}) {
  const nome = NOMES_EMBALAGEM[String(v.unidade).toUpperCase()] || String(v.unidade || "").toLowerCase();
  const valor = String(v.pesoValor ?? "").replace(".", ",");
  const medida = String(v.pesoUnidade || "").toUpperCase();
  const multiplo = /^X(.+)$/.exec(medida);
  if (multiplo) return `${nome} com ${valor} x ${formatarMedida(multiplo[1])}`;
  if (medida === "UN" || medida === "UM") {
    return Number(v.pesoValor) === 1 ? nome : `${nome} com ${valor} unidades`;
  }
  return `${nome} de ${valor} ${formatarMedida(medida)}`;
}
