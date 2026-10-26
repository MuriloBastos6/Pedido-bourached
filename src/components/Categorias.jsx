import { Link } from "react-router-dom";
import { categorias } from "../utils/categorias.js";

function Categorias({ onSelectCategory }) {
  return (
    <div className="card-categorias">
      {categorias.map((cat) => (
        <Link to={`/${cat.slug}`} key={cat.slug} onClick={onSelectCategory}>
          <img src={cat.capa} alt="" loading="lazy" />
          <span>{cat.titulo}</span>
        </Link>
      ))}
    </div>
  );
}

export default Categorias;
