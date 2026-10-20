import { chaveItem } from "./pedido.js";

let promessa = null;

// Carrega o produtos.json uma única vez e devolve um Map
// "idProduto|codigo" -> { produto, variacao }
export function carregarCatalogo() {
  if (!promessa) {
    promessa = fetch("/produtos.json")
      .then((r) => {
        if (!r.ok) throw new Error("Falha ao carregar produtos");
        return r.json();
      })
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
