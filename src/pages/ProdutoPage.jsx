import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import MenuLateral from "../components/MenuLateral.jsx";
import { CardProduto } from "../components/ProdutosGrid.jsx";
import { useDados } from "../hooks/useDados.js";
import { usePagina } from "../hooks/usePagina.js";
import { NOME_SITE, USOS, descricaoProduto, tituloProduto, urlCompleta } from "../seo.js";
import { buscarCategoria } from "../utils/categorias.js";
import {
  descreverEmbalagem,
  extrairPromocoes,
  indiceProdutos,
  nomeProduto,
  urlImagemProduto,
} from "../utils/catalogo.js";
import { linkWhatsApp } from "../utils/pedido.js";

// Dados do produto para o Google (schema.org Product) com os preços atuais.
// Fica só no navegador: o HTML gerado no build não leva preços.
function useSchemaProduto(produto, nome, categoria, caminho) {
  useEffect(() => {
    if (!produto) return undefined;
    const precos = (produto.variacoes || []).map((v) => Number(v.precoVenda)).filter((p) => p > 0);
    const imagem = urlImagemProduto(produto.imagem);
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: nome,
      description: descricaoProduto(nome, (produto.variacoes || []).map(descreverEmbalagem)),
      sku: produto.variacoes?.[0]?.codigo,
      category: categoria?.titulo,
      url: urlCompleta(caminho),
      ...(imagem ? { image: /^https?:/.test(imagem) ? imagem : urlCompleta(imagem) } : {}),
      ...(precos.length
        ? {
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "BRL",
              lowPrice: Math.min(...precos).toFixed(2),
              highPrice: Math.max(...precos).toFixed(2),
              offerCount: precos.length,
              seller: { "@type": "Organization", name: NOME_SITE },
            },
          }
        : {}),
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => el.remove();
  }, [produto, nome, categoria, caminho]);
}

function ProdutoPage() {
  const { slug } = useParams();
  const { dados, carregando, erro } = useDados();
  const caminho = `/produto/${slug}`;

  const achado = useMemo(() => {
    if (!dados) return null;
    const item = indiceProdutos(dados).porSlug.get(slug);
    if (!item) return null;
    const emPromocao = extrairPromocoes(dados).some((p) => String(p.id) === String(item.produto.id));
    return { ...item, produto: { ...item.produto, isPromocao: emPromocao } };
  }, [dados, slug]);

  const produto = achado?.produto;
  const categoria = achado ? buscarCategoria(achado.categoria) : null;
  const nome = produto ? nomeProduto(produto.descricao) : "";
  const embalagens = (produto?.variacoes || []).map((v) => ({ ...v, texto: descreverEmbalagem(v) }));

  usePagina({
    titulo: produto ? tituloProduto(nome, achado.categoria) : undefined,
    descricao: produto ? descricaoProduto(nome, embalagens.map((v) => v.texto)) : undefined,
    caminho,
    // produto que não existe (link antigo) não deve aparecer no Google
    indexar: carregando || Boolean(produto),
  });
  useSchemaProduto(produto, nome, categoria, caminho);

  const mensagem = produto
    ? `Olá! Vim pelo site e quero pedir: ${produto.descricao} (Cód. ${embalagens.map((v) => v.codigo).join(" / ")})`
    : "";

  return (
    <div className="loja">
      <MenuLateral />

      <section className="loja-conteudo">
        <nav className="trilha" aria-label="Você está em">
          <Link to="/">Início</Link>
          {categoria && (
            <>
              {" "}
              <span aria-hidden="true">/</span> <Link to={`/${categoria.slug}`}>{categoria.titulo}</Link>
            </>
          )}
          {produto && (
            <>
              {" "}
              <span aria-hidden="true">/</span> {nome}
            </>
          )}
        </nav>

        {carregando && <p className="aviso-carregando">Carregando produto...</p>}
        {!carregando && erro && <p className="aviso-carregando">{erro}</p>}
        {!carregando && !erro && !produto && (
          <p className="aviso-carregando">
            Produto não encontrado. <Link to="/">Veja todas as categorias</Link>.
          </p>
        )}

        {produto && <h1 className="produto-pagina-titulo">{nome}</h1>}

        {produto && (
          <article className="produto-pagina">
            <div className="produto-pagina-card">
              <CardProduto produto={produto} />
            </div>

            <div className="produto-pagina-info">
              <p>{descricaoProduto(nome, embalagens.map((v) => v.texto))}</p>

              <h2>Embalagens</h2>
              <ul>
                {embalagens.map((v) => (
                  <li key={v.codigo}>
                    {v.texto.charAt(0).toUpperCase() + v.texto.slice(1)} <small>· Cód. {v.codigo}</small>
                  </li>
                ))}
              </ul>

              {USOS[achado.categoria] && (
                <>
                  <h2>Usos</h2>
                  <p>{USOS[achado.categoria]}</p>
                </>
              )}

              <a
                className="produto-pagina-whats"
                href={linkWhatsApp(mensagem)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pedir pelo WhatsApp
              </a>

              {categoria && (
                <p>
                  <Link to={`/${categoria.slug}`}>Ver todos os produtos de {categoria.titulo.toLowerCase()}</Link>
                </p>
              )}
            </div>
          </article>
        )}
      </section>
    </div>
  );
}

export default ProdutoPage;
