import { PERGUNTAS, TEXTOS } from "../seo.js";

// Texto maior da categoria + perguntas frequentes, embaixo dos produtos.
function SobreCategoria({ slug, titulo }) {
  const paragrafos = TEXTOS[slug] || [];

  return (
    <section className="sobre-categoria" aria-label={`Sobre ${titulo}`}>
      {paragrafos.length > 0 && (
        <>
          <h2>Sobre {titulo.toLowerCase()} na Bourached</h2>
          {paragrafos.map((texto) => (
            <p key={texto}>{texto}</p>
          ))}
        </>
      )}

      <h2>Perguntas frequentes</h2>
      <div className="perguntas">
        {PERGUNTAS.map(({ pergunta, resposta }) => (
          <details key={pergunta}>
            <summary>{pergunta}</summary>
            <p>{resposta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default SobreCategoria;
