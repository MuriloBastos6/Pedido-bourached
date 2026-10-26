import { useMemo } from "react";
import { Link } from "react-router-dom";
import CarrosselProdutos from "../components/CarrosselProdutos.jsx";
import { categorias } from "../utils/categorias.js";
import { useDados } from "../hooks/useDados.js";
import { extrairPromocoes, produtosDaCategoria } from "../utils/catalogo.js";
import "./home.css";

// Categorias que ganham vitrine própria na página inicial
const vitrines = ["amendoim", "graos", "especiarias", "produtosnaturais", "doces"];
const ITENS_POR_VITRINE = 12;

// Fotos que se alternam no fundo do destaque (com zoom lento, efeito de vídeo).
// Ao mudar a quantidade, ajuste também o tempo total da animação em home.css.
const fotosHero = ["/amendoim.jpeg", "/especiarias.jpeg", "/frutas.jpeg", "/graos.jpeg"];
const SEGUNDOS_POR_FOTO = 6;

const beneficios = [
  {
    icone: "🛒",
    titulo: "Monte seu pedido",
    texto: "Escolha a embalagem e a quantidade de cada item",
  },
  {
    icone: "💬",
    titulo: "Envie pelo WhatsApp",
    texto: "O pedido chega pronto, com códigos e valores",
  },
  {
    icone: "📦",
    titulo: "Pacotes, caixas e sacos",
    texto: "Do pacote de 1 kg ao saco de 25 kg",
  },
  {
    icone: "📍",
    titulo: "No coração do Brás",
    texto: "Rua do Lucas 306 · Seg a Sex, 06:00 às 16:30",
  },
];

function HomePage() {
  const { dados, carregando, erro } = useDados();

  const promocoes = useMemo(() => (dados ? extrairPromocoes(dados) : []), [dados]);

  const totalProdutos = useMemo(() => {
    if (!dados) return 0;
    return categorias.reduce(
      (soma, cat) => soma + (Array.isArray(dados[cat.slug]) ? dados[cat.slug].length : 0),
      0,
    );
  }, [dados]);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-fundo" aria-hidden="true">
          {fotosHero.map((img, i) => (
            <span
              key={img}
              style={{
                backgroundImage: `url(${img})`,
                animationDelay: `${i * SEGUNDOS_POR_FOTO}s`,
              }}
            />
          ))}
        </div>
        <div className="hero-inner">
          <div className="hero-texto">
            <span className="hero-etiqueta">Atacado de alimentos</span>
            <h1>
              Faça seu pedido <em>em poucos cliques</em>
            </h1>
            <p>
              Escolha os produtos, monte o carrinho e envie o pedido pelo
              WhatsApp.
            </p>
            <div className="hero-botoes">
              <Link to="/promocoes" className="btn-hero primario">
                Ver promoções
              </Link>
              <a href="#categorias" className="btn-hero secundario">
                Ver categorias
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="beneficios" aria-label="Como funciona">
        {beneficios.map((b) => (
          <div className="beneficio" key={b.titulo}>
            <span className="beneficio-icone" aria-hidden="true">
              {b.icone}
            </span>
            <div>
              <strong>{b.titulo}</strong>
              <p>{b.texto}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="home-conteudo">
        <section className="atalhos" id="categorias" aria-label="Categorias">
          <header className="vitrine-cab">
            <h2>Compre por categoria</h2>
            {totalProdutos > 0 && (
              <span className="vitrine-nota">{totalProdutos} produtos</span>
            )}
          </header>
          <div className="atalhos-trilho">
            {categorias.map((cat) => (
              <Link to={`/${cat.slug}`} className="atalho" key={cat.slug}>
                <span
                  className="atalho-foto"
                  style={{ backgroundImage: `url(${cat.capa})` }}
                />
                <span className="atalho-nome">{cat.titulo}</span>
              </Link>
            ))}
          </div>
        </section>

        {carregando && <p className="aviso-carregando">Carregando produtos...</p>}
        {erro && <p className="aviso-carregando">{erro}</p>}

        {dados && (
          <>
            <CarrosselProdutos
              id="promocoes"
              titulo="Promoções da semana"
              verTodos="/promocoes"
              produtos={promocoes}
            />

            <section className="faixa-destaque">
              <p>
                Preços especiais toda semana.
                <strong> Os melhores preços da região, direto pra sua casa.</strong>
              </p>
              <Link to="/promocoes" className="btn-hero primario">
                Aproveitar
              </Link>
            </section>

            {vitrines.map((slug) => {
              const cat = categorias.find((c) => c.slug === slug);
              return (
                <CarrosselProdutos
                  key={slug}
                  titulo={cat.titulo}
                  verTodos={`/${slug}`}
                  produtos={produtosDaCategoria(dados, slug).slice(0, ITENS_POR_VITRINE)}
                />
              );
            })}

            <section className="vitrine">
              <header className="vitrine-cab">
                <h2>Todas as categorias</h2>
              </header>
              <div className="grade-categorias">
                {categorias.map((cat) => (
                  <Link to={`/${cat.slug}`} className="cartao-categoria" key={cat.slug}>
                    <span
                      className="cartao-categoria-foto"
                      style={{ backgroundImage: `url(${cat.capa})` }}
                    />
                    <span className="cartao-categoria-info">
                      <strong>{cat.titulo}</strong>
                      <small>
                        {(dados[cat.slug] || []).length} produtos{" "}
                        <span aria-hidden="true">›</span>
                      </small>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
