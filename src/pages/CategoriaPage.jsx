import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import ListagemLoja from "../components/ListagemLoja.jsx";
import SetasCategorias from "../components/SetasCategorias.jsx";
import { buscarCategoria, promocoes } from "../utils/categorias.js";
import { useDados } from "../hooks/useDados.js";
import { usePagina } from "../hooks/usePagina.js";
import { DESCRICOES, tituloCategoria } from "../seo.js";
import { extrairPromocoes, produtosDaCategoria } from "../utils/catalogo.js";

function CategoriaPage() {
  const { slug } = useParams();
  const categoria = buscarCategoria(slug);
  const { dados, carregando, erro } = useDados();
  usePagina({
    titulo: categoria ? tituloCategoria(categoria.titulo) : undefined,
    descricao: DESCRICOES[slug],
    caminho: `/${slug}`,
  });

  const produtos = useMemo(() => {
    if (!dados || !categoria) return [];
    return slug === promocoes.slug
      ? extrairPromocoes(dados)
      : produtosDaCategoria(dados, slug);
  }, [dados, slug, categoria]);

  if (!categoria) {
    return <Navigate to="/" replace />;
  }

  return (
    <ListagemLoja
      key={slug}
      titulo={categoria.titulo}
      descricao={DESCRICOES[slug]}
      produtos={produtos}
      carregando={carregando}
      erro={erro}
      vazio="Nenhum produto nesta categoria no momento."
      rodape={
        slug !== promocoes.slug && <SetasCategorias atual={slug} />
      }
    />
  );
}

export default CategoriaPage;
