import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Categorias, { categorias } from "./Categorias";
import BuscaProdutos from "./BuscaProdutos";

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const slugAtual = location.pathname.replace("/", "");
  const categoriaAtual = categorias.find((cat) => cat.slug === slugAtual);

  const toggleMenu = () => setMenuAberto((aberto) => !aberto);
  const fecharMenu = () => setMenuAberto(false);

  // Fecha o menu ao trocar de rota
  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  // Fecha o menu ao clicar fora do dropdown
  useEffect(() => {
    if (!menuAberto) return;

    function handleClickFora(evento) {
      if (dropdownRef.current && !dropdownRef.current.contains(evento.target)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, [menuAberto]);

  return (
    <nav className="nav-bar">
      <div className="nav-titulo">
        <h1>Faça seu pedido</h1>
        <p>Escolha os produtos, monte o carrinho e envie o pedido pelo WhatsApp.</p>
      </div>
      <div className="div-logo">
        <Link to="/" onClick={fecharMenu}>
          <img src="logo-bourached-branco.png" alt="Logo da bourached" />
        </Link>
      </div>
      <div className="div-logo-saint">
        <img src="logo-saint-louis.png" alt="Logo Saint Louis" />
      </div>
      <div className="input-div">
        <BuscaProdutos />
      </div>

      {/* Seletor de Categorias (dropdown com imagens) */}
      <div className="categoria-select-div" ref={dropdownRef}>
        <button
          type="button"
          className={`categoria-select ${menuAberto ? "aberto" : ""}`}
          onClick={toggleMenu}
          aria-haspopup="true"
          aria-expanded={menuAberto}
        >
          {categoriaAtual ? categoriaAtual.titulo : "Selecione uma categoria"}
        </button>

        <div className={`menu-categorias ${menuAberto ? "aberto" : ""}`}>
          <Categorias onSelectCategory={fecharMenu} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
