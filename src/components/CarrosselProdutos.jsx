import { useRef } from "react";
import { Link } from "react-router-dom";
import { CardProduto } from "./ProdutosGrid.jsx";

// Vitrine horizontal: título, "Ver todos" e setas que rolam uma "página".
function CarrosselProdutos({ titulo, verTodos, produtos = [], id }) {
  const trilho = useRef(null);

  function rolar(direcao) {
    const el = trilho.current;
    if (!el) return;
    el.scrollBy({ left: direcao * el.clientWidth * 0.9, behavior: "smooth" });
  }

  if (produtos.length === 0) return null;

  return (
    <section className="vitrine" id={id}>
      <header className="vitrine-cab">
        <h2>{titulo}</h2>
        {verTodos && (
          <Link to={verTodos} className="vitrine-ver-todos">
            Ver todos <span aria-hidden="true">›</span>
          </Link>
        )}
      </header>

      <div className="carrossel">
        <button
          type="button"
          className="carrossel-seta anterior"
          onClick={() => rolar(-1)}
          aria-label={`Voltar em ${titulo}`}
        >
          ‹
        </button>
        <div className="carrossel-trilho" ref={trilho}>
          {produtos.map((produto) => (
            <div className="carrossel-item" key={produto.id}>
              <CardProduto produto={produto} />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="carrossel-seta proxima"
          onClick={() => rolar(1)}
          aria-label={`Avançar em ${titulo}`}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default CarrosselProdutos;
