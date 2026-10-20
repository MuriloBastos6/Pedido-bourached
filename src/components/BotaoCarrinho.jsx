import { useCarrinho } from "../context/CarrinhoContext.jsx";

function BotaoCarrinho() {
  const { totalItens, abrirCarrinho } = useCarrinho();

  return (
    <button
      type="button"
      className="carrinho-float"
      onClick={abrirCarrinho}
      aria-label={`Abrir carrinho, ${totalItens} ${totalItens === 1 ? "item" : "itens"}`}
      title="Meu pedido"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="carrinho-icon">
        <path
          fill="currentColor"
          d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM1 2v2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 7 17h12v-2H7.42a.25.25 0 0 1-.22-.37L8.1 13h7.45a2 2 0 0 0 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1z"
        />
      </svg>
      {totalItens > 0 && <span className="carrinho-badge">{totalItens}</span>}
    </button>
  );
}

export default BotaoCarrinho;
