import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MenuLateral from "./MenuLateral.jsx";
import ProdutosGrid from "./ProdutosGrid.jsx";
import { ordenacoes, ordenarProdutos } from "../utils/catalogo.js";

// Layout das páginas de listagem (categoria, promoções, busca):
// menu lateral + trilha + título + ordenação + grade de produtos.
function ListagemLoja({ titulo, produtos = [], carregando, erro, vazio, rodape }) {
  const [ordem, setOrdem] = useState("padrao");
  const ordenados = useMemo(() => ordenarProdutos(produtos, ordem), [produtos, ordem]);

  return (
    <div className="loja">
      <MenuLateral />

      <section className="loja-conteudo">
        <nav className="trilha" aria-label="Você está em">
          <Link to="/">Início</Link> <span aria-hidden="true">/</span> {titulo}
        </nav>

        <header className="loja-cab">
          <div>
            <h1>{titulo}</h1>
            {!carregando && !erro && produtos.length > 0 && (
              <p>
                {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}
              </p>
            )}
          </div>
          {produtos.length > 1 && (
            <label className="ordenar">
              <span>Ordenar:</span>
              <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
                {ordenacoes.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </select>
            </label>
          )}
        </header>

        {carregando && <p className="aviso-carregando">Carregando produtos...</p>}
        {!carregando && erro && <p className="aviso-carregando">{erro}</p>}
        {!carregando && !erro && produtos.length === 0 && (
          <p className="aviso-carregando">{vazio}</p>
        )}
        {!carregando && !erro && produtos.length > 0 && (
          <ProdutosGrid produtos={ordenados} />
        )}

        {rodape}
      </section>
    </div>
  );
}

export default ListagemLoja;
