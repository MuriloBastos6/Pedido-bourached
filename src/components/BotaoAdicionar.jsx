import { useCarrinho } from "../context/CarrinhoContext.jsx";
import { chaveItem } from "../utils/pedido.js";

// Botão "Adicionar" de uma variação (peso). Depois de adicionado vira um
// seletor de quantidade (- 2 +).
function BotaoAdicionar({ produto, variacao }) {
  const { itens, adicionar, definirQtd } = useCarrinho();
  const key = chaveItem(produto.id, variacao.codigo);
  const noCarrinho = itens.find((i) => i.key === key);

  if (!noCarrinho) {
    return (
      <button
        type="button"
        className="btn-adicionar"
        onClick={() => adicionar(produto, variacao, 1)}
        aria-label={`Adicionar ${produto.descricao} ao carrinho`}
      >
        + Adicionar
      </button>
    );
  }

  return (
    <div className="qtd-controle" role="group" aria-label="Quantidade">
      <button
        type="button"
        onClick={() => definirQtd(key, noCarrinho.qtd - 1)}
        aria-label="Diminuir quantidade"
      >
        −
      </button>
      <span aria-live="polite">{noCarrinho.qtd}</span>
      <button
        type="button"
        onClick={() => definirQtd(key, noCarrinho.qtd + 1)}
        aria-label="Aumentar quantidade"
      >
        +
      </button>
    </div>
  );
}

export default BotaoAdicionar;
