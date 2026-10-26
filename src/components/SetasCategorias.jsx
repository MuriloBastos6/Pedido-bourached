import { Link } from "react-router-dom";
import { categorias } from "../utils/categorias.js";

// Ciclo de navegação: Ofertas (home) -> categorias... -> volta às Ofertas
const sequencia = [
  { slug: null, titulo: "Ofertas", to: "/" },
  ...categorias.map((c) => ({ slug: c.slug, titulo: c.titulo, to: `/${c.slug}` })),
];

function SetasCategorias({ atual = null }) {
  const indice = Math.max(
    0,
    sequencia.findIndex((c) => c.slug === atual),
  );
  const anterior = sequencia[(indice - 1 + sequencia.length) % sequencia.length];
  const proxima = sequencia[(indice + 1) % sequencia.length];

  return (
    <nav className="setas-categorias" aria-label="Navegar entre categorias">
      <Link
        to={anterior.to}
        className="seta-btn seta-anterior"
        aria-label={`Categoria anterior: ${anterior.titulo}`}
      >
        <span className="seta-icone" aria-hidden="true">‹</span>
        <span className="seta-texto">
          <small>Anterior</small>
          <strong>{anterior.titulo}</strong>
        </span>
      </Link>

      <button
        type="button"
        className="seta-topo"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Voltar ao topo"
      >
        ↑
      </button>

      <Link
        to={proxima.to}
        className="seta-btn seta-proxima"
        aria-label={`Próxima categoria: ${proxima.titulo}`}
      >
        <span className="seta-texto">
          <small>Próxima</small>
          <strong>{proxima.titulo}</strong>
        </span>
        <span className="seta-icone" aria-hidden="true">›</span>
      </Link>
    </nav>
  );
}

export default SetasCategorias;
