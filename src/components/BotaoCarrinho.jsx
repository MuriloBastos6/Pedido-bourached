import { useCarrinho } from "../context/CarrinhoContext.jsx";
import { formatarPreco } from "../utils/pedido.js";

function IconeCarrinho({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM1 2v2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 7 17h12v-2H7.42a.25.25 0 0 1-.22-.37L8.1 13h7.45a2 2 0 0 0 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1z"
      />
    </svg>
  );
}

// variante "flutuante": círculo no desktop + barra inferior no celular (só com itens)
// variante "topo": botão no cabeçalho (celular)
function BotaoCarrinho({ variante = "flutuante" }) {
  const { totalItens, total, abrirCarrinho } = useCarrinho();
  const rotulo = `Abrir carrinho, ${totalItens} ${totalItens === 1 ? "item" : "itens"}`;

  if (variante === "topo") {
    return (
      <button
        type="button"
        className="carrinho-header-btn"
        onClick={abrirCarrinho}
        aria-label={rotulo}
      >
        <IconeCarrinho className="carrinho-icon" />
        {totalItens > 0 && <span className="carrinho-badge">{totalItens}</span>}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className="carrinho-float"
        onClick={abrirCarrinho}
        aria-label={rotulo}
        title="Meu pedido"
      >
        <IconeCarrinho className="carrinho-icon" />
        {totalItens > 0 && <span className="carrinho-badge">{totalItens}</span>}
      </button>

      {totalItens > 0 && (
        <button
          type="button"
          className="carrinho-barra"
          onClick={abrirCarrinho}
          aria-label={rotulo}
        >
          <span className="carrinho-barra-qtd">{totalItens}</span>
          <span className="carrinho-barra-texto">Ver meu pedido</span>
          <strong>{formatarPreco(total)}</strong>
        </button>
      )}
    </>
  );
}

export default BotaoCarrinho;
