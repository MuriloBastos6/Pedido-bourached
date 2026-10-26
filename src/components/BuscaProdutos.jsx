import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BuscaProdutos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [termo, setTermo] = useState("");

  useEffect(() => {
    if (location.pathname !== "/busca") return;

    const params = new URLSearchParams(location.search);
    const termoUrl = params.get("q") || "";
    setTermo(termoUrl);
  }, [location.pathname, location.search]);

  function abrirResultados(texto) {
    const textoBusca = texto.trim();
    if (!textoBusca) {
      if (location.pathname === "/busca") {
        navigate("/busca", { replace: true });
      }
      return;
    }

    navigate(`/busca?q=${encodeURIComponent(textoBusca)}`, { replace: true });
  }

  function onSubmit(event) {
    event.preventDefault();
    abrirResultados(termo);
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      abrirResultados(termo);
    }, 350);

    return () => clearTimeout(debounce);
  }, [termo]);

  return (
    <form className="busca-produtos" onSubmit={onSubmit}>
      <input
        type="search"
        placeholder="Encontre um produto ou código"
        aria-label="Buscar produtos"
        value={termo}
        onChange={(event) => setTermo(event.target.value)}
      />

      <button type="submit" className="btn-pesquisar" aria-label="Pesquisar">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 2a8 8 0 0 1 6.32 12.9l5.39 5.4-1.41 1.4-5.4-5.38A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"
          />
        </svg>
      </button>
    </form>
  );
}

export default BuscaProdutos;
