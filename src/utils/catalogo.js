import { chaveItem } from "./pedido.js";

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

// Carrega o produtos.json uma única vez (compartilhado por todas as páginas).
export function carregarDados() {
  if (!promessaDados) {
    promessaDados = fetch("/produtos.json")
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
