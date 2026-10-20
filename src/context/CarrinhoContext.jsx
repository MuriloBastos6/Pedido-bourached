import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { QTD_MAX_ITEM } from "../config.js";
import { carrinhoStorage } from "../storage/pedidosStorage.js";
import { carregarCatalogo } from "../utils/catalogo.js";
import {
  chaveItem,
  formatarPeso,
  totalDoPedido,
} from "../utils/pedido.js";

const CarrinhoContext = createContext(null);

function limitar(qtd) {
  return Math.max(0, Math.min(QTD_MAX_ITEM, Math.floor(Number(qtd) || 0)));
}

function reducer(itens, acao) {
  switch (acao.tipo) {
    case "adicionar": {
      const existente = itens.find((i) => i.key === acao.item.key);
      if (existente) {
        return itens.map((i) =>
          i.key === acao.item.key
            ? { ...i, qtd: limitar(i.qtd + (acao.item.qtd || 1)) }
            : i,
        );
      }
      return [...itens, { ...acao.item, qtd: limitar(acao.item.qtd || 1) }];
    }
    case "definirQtd": {
      const qtd = limitar(acao.qtd);
      if (qtd === 0) return itens.filter((i) => i.key !== acao.key);
      return itens.map((i) => (i.key === acao.key ? { ...i, qtd } : i));
    }
    case "remover":
      return itens.filter((i) => i.key !== acao.key);
    case "limpar":
      return [];
    case "sincronizar":
      return acao.itens;
    default:
      return itens;
  }
}

export function CarrinhoProvider({ children }) {
  const [itens, dispatch] = useReducer(reducer, undefined, () =>
    carrinhoStorage.ler(),
  );
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    carrinhoStorage.gravar(itens);
  }, [itens]);

  // Ao abrir o site, atualiza os preços do carrinho salvo com o catálogo atual
  // e remove itens que não existem mais (a lista de preços muda com frequência).
  useEffect(() => {
    let cancelado = false;
    carregarCatalogo()
      .then((catalogo) => {
        if (cancelado) return;
        const atual = carrinhoStorage.ler();
        if (atual.length === 0) return;
        const atualizados = atual
          .filter((i) => catalogo.has(i.key))
          .map((i) => {
            const { produto, variacao } = catalogo.get(i.key);
            return {
              ...i,
              descricao: produto.descricao,
              pesoLabel: formatarPeso(variacao),
              precoVenda: variacao.precoVenda,
            };
          });
        dispatch({ tipo: "sincronizar", itens: atualizados });
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, []);

  const adicionar = useCallback((produto, variacao, qtd = 1) => {
    dispatch({
      tipo: "adicionar",
      item: {
        key: chaveItem(produto.id, variacao.codigo),
        produtoId: produto.id,
        descricao: produto.descricao,
        codigo: variacao.codigo,
        pesoLabel: formatarPeso(variacao),
        precoVenda: variacao.precoVenda,
        qtd,
      },
    });
  }, []);

  const definirQtd = useCallback(
    (key, qtd) => dispatch({ tipo: "definirQtd", key, qtd }),
    [],
  );
  const remover = useCallback((key) => dispatch({ tipo: "remover", key }), []);
  const limpar = useCallback(() => dispatch({ tipo: "limpar" }), []);
  const abrirCarrinho = useCallback(() => setAberto(true), []);
  const fecharCarrinho = useCallback(() => setAberto(false), []);

  const valor = useMemo(
    () => ({
      itens,
      totalItens: itens.reduce((s, i) => s + i.qtd, 0),
      total: totalDoPedido(itens),
      aberto,
      adicionar,
      definirQtd,
      remover,
      limpar,
      abrirCarrinho,
      fecharCarrinho,
    }),
    [
      itens,
      aberto,
      adicionar,
      definirQtd,
      remover,
      limpar,
      abrirCarrinho,
      fecharCarrinho,
    ],
  );

  return (
    <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error("useCarrinho precisa estar dentro de CarrinhoProvider");
  return ctx;
}
