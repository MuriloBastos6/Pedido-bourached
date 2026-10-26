import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Categorias from "./Categorias";
import { buscarCategoria } from "../utils/categorias.js";
import BuscaProdutos from "./BuscaProdutos";
import BotaoCarrinho from "./BotaoCarrinho";

function IconePedidos() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8 12v2h8v-2H8zm0 4v2h5v-2H8z"
      />
    </svg>
  );
}

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const categoriaAtual = buscarCategoria(location.pathname.replace("/", ""));

  // Fecha o menu ao trocar de rota
  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  // Fecha o menu ao clicar fora do dropdown ou apertar Esc
  useEffect(() => {
    if (!menuAberto) return;

    function handleClickFora(evento) {
      if (dropdownRef.current && !dropdownRef.current.contains(evento.target)) {
        setMenuAberto(false);
      }
    }
    function handleTecla(evento) {
      if (evento.key === "Escape") setMenuAberto(false);
    }

    document.addEventListener("mousedown", handleClickFora);
    document.addEventListener("keydown", handleTecla);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
      document.removeEventListener("keydown", handleTecla);
    };
  }, [menuAberto]);

  const ehCategoria = categoriaAtual && categoriaAtual.slug !== "promocoes";

  return (
    <header className="topo">
      <div className="topo-barra">
        <div className="topo-inner">
          <Link to="/" className="topo-logo" aria-label="Bourached - início">
            <img src="/logo-bourached-branco.png" alt="Bourached" />
          </Link>

          <div className="topo-busca">
            <BuscaProdutos />
          </div>

          <Link to="/meus-pedidos" className="topo-acao topo-pedidos">
            <span className="topo-acao-icone">
              <IconePedidos />
            </span>
            <span className="topo-acao-texto">
              <strong>Meus pedidos</strong>
              <small>Histórico e repetir</small>
            </span>
          </Link>

          <BotaoCarrinho variante="topo" />

          <img
            src="/logo-saint-louis.png"
            alt="Saint Louis"
            className="topo-saint"
          />
        </div>
      </div>

      <nav className="topo-menu" aria-label="Menu principal">
        <div className="topo-inner" ref={dropdownRef}>
          <NavLink to="/" end className="topo-link">
            Início
          </NavLink>

          <button
            type="button"
            className={`topo-link topo-link-categorias ${menuAberto ? "aberto" : ""} ${ehCategoria ? "active" : ""}`}
            onClick={() => setMenuAberto((aberto) => !aberto)}
            aria-haspopup="true"
            aria-expanded={menuAberto}
          >
            {ehCategoria ? categoriaAtual.titulo : "Categorias"}
            <span className="topo-seta" aria-hidden="true">▾</span>
          </button>

          <NavLink to="/promocoes" className="topo-link">
            Promoções
          </NavLink>
          <NavLink to="/meus-pedidos" className="topo-link">
            Meus pedidos
          </NavLink>

          <span className="topo-selo">Pedido rápido pelo WhatsApp</span>

          <div className={`menu-categorias ${menuAberto ? "aberto" : ""}`}>
            <Categorias onSelectCategory={() => setMenuAberto(false)} />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
