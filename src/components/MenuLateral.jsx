import { NavLink } from "react-router-dom";
import { categorias, promocoes } from "../utils/categorias.js";

// Lista de categorias da loja (coluna no computador, faixa rolável no celular)
function MenuLateral() {
  return (
    <aside className="menu-lateral" aria-label="Categorias">
      <div className="menu-lateral-aviso">
        <strong>
          Pedido pelo <em>WhatsApp</em>
        </strong>
        <p>Monte o carrinho e envie: o pedido chega pronto para a equipe.</p>
      </div>

      <nav className="menu-lateral-lista">
        <h2>Categorias</h2>
        <NavLink to={`/${promocoes.slug}`} className="menu-lateral-item destaque">
          Promoções <span aria-hidden="true">%</span>
        </NavLink>
        {categorias.map((cat) => (
          <NavLink to={`/${cat.slug}`} className="menu-lateral-item" key={cat.slug}>
            {cat.titulo}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default MenuLateral;
