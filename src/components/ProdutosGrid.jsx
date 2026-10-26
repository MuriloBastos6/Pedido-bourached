import { useState } from "react";
import BotaoAdicionar from "./BotaoAdicionar.jsx";
import { useCarrinho } from "../context/CarrinhoContext.jsx";
import { chaveItem, formatarPreco } from "../utils/pedido.js";
import { urlImagemProduto } from "../utils/catalogo.js";

function removerExtensao(arquivo = "") {
  const semQuery = String(arquivo).split("?")[0].split("#")[0];
  const ultimoPonto = semQuery.lastIndexOf(".");
  const ultimaBarra = semQuery.lastIndexOf("/");
  if (ultimoPonto > ultimaBarra) {
    return semQuery.slice(0, ultimoPonto);
  }
  return semQuery;
}

function montarCandidatosImagem(caminhoImagem = "") {
  const caminhoLimpo = urlImagemProduto(caminhoImagem);
  if (!caminhoLimpo) {
    return ["/arroz.jpeg"];
  }

  const base = removerExtensao(caminhoLimpo);
  const candidatos = [
    caminhoLimpo,
    `${base}.jpg`,
    `${base}.jpeg`,
    `${base}.png`,
    `${base}.webp`,
    "/arroz.jpeg",
  ];

  return [...new Set(candidatos)];
}

// Rótulo curto da embalagem: "25 KG", "12X1KG"
function rotuloPeso(v) {
  const separador = /^x/i.test(v.pesoUnidade) ? "" : " ";
  return `${String(v.pesoValor).replace(".", ",")}${separador}${v.pesoUnidade}`;
}

// Preço por kg quando a embalagem é vendida em KG (ex.: saco de 25 kg)
function precoPorKg(v) {
  const peso = Number(v.pesoValor);
  if (String(v.pesoUnidade).toUpperCase() !== "KG" || !(peso > 1)) return null;
  return Number(v.precoVenda) / peso;
}

function ImagemProduto({ produto }) {
  const candidatos = montarCandidatosImagem(
    typeof produto.imagem === "string" ? produto.imagem.trim() : "",
  );

  return (
    <img
      src={candidatos[0]}
      alt={produto.descricao}
      className="imagem-produto"
      loading="lazy"
      decoding="async"
      data-fallback-index="0"
      onError={(event) => {
        const img = event.currentTarget;
        const proximoIndice = Number(img.dataset.fallbackIndex || "0") + 1;

        if (proximoIndice < candidatos.length) {
          img.dataset.fallbackIndex = String(proximoIndice);
          img.src = candidatos[proximoIndice];
          return;
        }

        img.onerror = null;
      }}
    />
  );
}

export function CardProduto({ produto, exibirSeloPromocao = true }) {
  const { itens } = useCarrinho();
  const variacoes = [...(produto.variacoes || [])].sort(
    (a, b) => Number(b.pesoValor || 0) - Number(a.pesoValor || 0),
  );
  const [indice, setIndice] = useState(0);
  const selecionada = variacoes[indice] || variacoes[0];

  if (!selecionada) return null;

  const qtdNoCarrinho = (v) =>
    itens.find((i) => i.key === chaveItem(produto.id, v.codigo))?.qtd || 0;
  const porKg = precoPorKg(selecionada);

  return (
    <article className="card-produto">
      {exibirSeloPromocao && produto.isPromocao && (
        <span className="selo-promocao">Promoção</span>
      )}
      <div className="card-produto-foto">
        <ImagemProduto produto={produto} />
      </div>

      <div className="card-produto-corpo">
        <h3 className="nome-produto" title={produto.descricao}>
          {produto.descricao}
        </h3>
        <p className="codigo-produto">Cód. {selecionada.codigo}</p>

        {variacoes.length > 1 && (
          <div className="pesos" role="radiogroup" aria-label="Embalagem">
            {variacoes.map((v, i) => {
              const qtd = qtdNoCarrinho(v);
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={i === indice}
                  key={v.codigo || i}
                  className={`peso-chip ${i === indice ? "ativo" : ""}`}
                  onClick={() => setIndice(i)}
                  title={`${rotuloPeso(v)} · ${v.unidade}`}
                >
                  {rotuloPeso(v)}
                  {qtd > 0 && <span className="peso-chip-qtd">{qtd}</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="card-produto-preco">
          <small>
            {rotuloPeso(selecionada)} · {selecionada.unidade}
          </small>
          <strong>{formatarPreco(selecionada.precoVenda)}</strong>
          {porKg !== null && <span>≈ {formatarPreco(porKg)}/kg</span>}
        </div>

        <div className="acao-variacao">
          <BotaoAdicionar produto={produto} variacao={selecionada} />
        </div>
      </div>
    </article>
  );
}

function ProdutosGrid({ produtos = [], exibirSeloPromocao = true }) {
  return (
    <div className="categoria-grid">
      {produtos.map((produto) => (
        <CardProduto
          key={produto.id}
          produto={produto}
          exibirSeloPromocao={exibirSeloPromocao}
        />
      ))}
    </div>
  );
}

export default ProdutosGrid;
