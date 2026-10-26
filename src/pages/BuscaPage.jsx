import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ListagemLoja from "../components/ListagemLoja.jsx";
import { useDados } from "../hooks/useDados.js";
import { ehChavePromocao, extrairPromocoes, normalizarTexto } from "../utils/catalogo.js";

function montarCodigos(produto) {
  const variacoes = Array.isArray(produto.variacoes) ? produto.variacoes : [];
  return variacoes
    .map((v) => v.codigo)
    .filter(Boolean)
    .join(" ");
}

function BuscaPage() {
  const [searchParams] = useSearchParams();
  const termo = searchParams.get("q") || "";
  const { dados, carregando, erro } = useDados();

  // Todos os produtos uma vez só. O item de promoção some quando o mesmo
  // produto já existe na categoria própria (evita cards duplicados).
  const todosProdutos = useMemo(() => {
    if (!dados) return [];
    const promocoes = extrairPromocoes(dados);
    const idsPromocao = new Set(promocoes.map((p) => String(p.id)));
    const vistos = new Set();
    const lista = [];

    Object.entries(dados).forEach(([slug, itens]) => {
      if (!Array.isArray(itens) || ehChavePromocao(slug)) return;
      itens.forEach((produto, index) => {
        const idOriginal = String(produto.id ?? index);
        vistos.add(idOriginal);
        lista.push({
          ...produto,
          // o id do produto continua o original (é ele que vai para o
          // carrinho); a chave da lista só evita repetição na grade
          chaveLista: `${slug}-${idOriginal}`,
          isPromocao: idsPromocao.has(idOriginal),
          codigosBusca: montarCodigos(produto),
        });
      });
    });

    promocoes.forEach((produto, index) => {
      const idOriginal = String(produto.id ?? index);
      if (vistos.has(idOriginal)) return;
      lista.push({
        ...produto,
        chaveLista: `promocoes-${idOriginal}`,
        codigosBusca: montarCodigos(produto),
      });
    });

    return lista;
  }, [dados]);

  const resultados = useMemo(() => {
    const termoNormalizado = normalizarTexto(termo);
    if (!termoNormalizado) return [];

    return todosProdutos.filter((produto) => {
      const baseBusca = `${produto.descricao || ""} ${produto.codigosBusca || ""}`;
      return normalizarTexto(baseBusca).includes(termoNormalizado);
    });
  }, [todosProdutos, termo]);

  return (
    <ListagemLoja
      titulo={termo ? `Resultados para “${termo}”` : "Buscar produtos"}
      produtos={resultados}
      carregando={carregando}
      erro={erro}
      vazio={
        termo
          ? "Produto não encontrado. Tente outro nome ou o código."
          : "Digite algo na barra de pesquisa para buscar produtos."
      }
    />
  );
}

export default BuscaPage;
