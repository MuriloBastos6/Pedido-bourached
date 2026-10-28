// Roda depois do "vite build" (npm run build).
// O site é React: sem isto, o HTML que o Google recebe é só <div id="root">.
// Aqui geramos um HTML por página (início e cada categoria) com título,
// descrição, endereço canônico, dados da loja (schema.org) e o conteúdo em
// texto (categorias, produtos e embalagens). Ao abrir no navegador, o React
// substitui esse conteúdo pela loja normal.
// Também gera robots.txt e sitemap.xml.
//
// Os preços NÃO entram no HTML: mudam com frequência e ficariam velhos até o
// próximo deploy. O Google lê os preços atuais quando executa o site.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Variáveis VITE_ do .env (a Vercel também as passa pelo ambiente)
const arquivoEnv = resolve(".env");
if (existsSync(arquivoEnv)) {
  for (const linha of readFileSync(arquivoEnv, "utf8").split(/\r?\n/)) {
    const m = /^\s*(VITE_[A-Z_]+)\s*=\s*(.*)\s*$/.exec(linha);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { categorias, promocoes } = await import("../src/utils/categorias.js");
const { SITE_URL, HOME, DESCRICOES, TEXTOS, PERGUNTAS, NEGOCIO, tituloCategoria, urlCompleta } =
  await import("../src/seo.js");
const { PRODUTOS_URL, extrairPromocoes, produtosDaCategoria } = await import("../src/utils/catalogo.js");

const DIST = resolve("dist");
const base = readFileSync(resolve(DIST, "index.html"), "utf8");

const esc = (t) =>
  String(t ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function embalagens(produto) {
  return (produto.variacoes || [])
    .map((v) => `${String(v.pesoValor).replace(".", ",")} ${v.pesoUnidade} (${v.unidade})`)
    .join(", ");
}

async function baixarProdutos() {
  try {
    const r = await fetch(PRODUTOS_URL, { signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (erro) {
    // sem a lista, as páginas saem só com título e descrição (o build não falha)
    console.warn(`prerender: não consegui baixar ${PRODUTOS_URL} (${erro.message})`);
    return null;
  }
}

function montarHtml({ titulo, descricao, caminho, conteudo, jsonLdExtra = [] }) {
  const url = urlCompleta(caminho);
  const jsonLd = [NEGOCIO, ...jsonLdExtra]
    .map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`)
    .join("\n    ");
  const head = `<title>${esc(titulo)}</title>
    <meta name="description" content="${esc(descricao)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${esc(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Bourached Alimentos" />
    <meta property="og:title" content="${esc(titulo)}" />
    <meta property="og:description" content="${esc(descricao)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:image" content="${esc(`${SITE_URL}/amendoim.jpeg`)}" />
    ${jsonLd}`;

  const html = base
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root"><div class="pre-render">${conteudo}</div></div>`);
  if (html === base) throw new Error("prerender: index.html sem <title> ou sem <div id=\"root\"></div>");
  return html;
}

function navCategorias() {
  return `<nav aria-label="Categorias"><ul>${[promocoes, ...categorias]
    .map((c) => `<li><a href="/${c.slug}">${esc(c.titulo)}</a></li>`)
    .join("")}</ul></nav>`;
}

function paginaInicial(dados) {
  const lista = categorias
    .map((c) => {
      const qtd = dados && Array.isArray(dados[c.slug]) ? ` (${dados[c.slug].length} produtos)` : "";
      return `<li><h2><a href="/${c.slug}">${esc(c.titulo)}</a>${qtd}</h2><p>${esc(DESCRICOES[c.slug] || "")}</p></li>`;
    })
    .join("");
  return montarHtml({
    titulo: HOME.titulo,
    descricao: HOME.descricao,
    caminho: "/",
    conteudo: `<header><img src="/logo-bourached-branco.png" alt="Bourached Alimentos" width="160" height="160" /></header>
<main>
<h1>Bourached Alimentos: distribuidora de produtos naturais, grãos e temperos no Brás</h1>
<p>${esc(HOME.descricao)}</p>
<p>Rua do Lucas, 306 - Brás, São Paulo - SP · Segunda a sexta, das 06:00 às 16:30 · WhatsApp (11) 96418-1200</p>
<ul>${lista}</ul>
</main>`,
  });
}

function paginaCategoria(cat, dados) {
  const produtos = !dados
    ? []
    : cat.slug === promocoes.slug
      ? extrairPromocoes(dados)
      : produtosDaCategoria(dados, cat.slug);
  const itens = produtos
    .map((p) => `<li><h2>${esc(p.descricao)}</h2><p>Embalagens: ${esc(embalagens(p))}</p></li>`)
    .join("");
  const jsonLdExtra = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: urlCompleta("/") },
        { "@type": "ListItem", position: 2, name: cat.titulo, item: urlCompleta(`/${cat.slug}`) },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: PERGUNTAS.map(({ pergunta, resposta }) => ({
        "@type": "Question",
        name: pergunta,
        acceptedAnswer: { "@type": "Answer", text: resposta },
      })),
    },
  ];
  const sobre = (TEXTOS[cat.slug] || []).map((t) => `<p>${esc(t)}</p>`).join("");
  const perguntas = PERGUNTAS.map(
    ({ pergunta, resposta }) => `<h3>${esc(pergunta)}</h3><p>${esc(resposta)}</p>`,
  ).join("");
  return montarHtml({
    titulo: tituloCategoria(cat.titulo, cat.slug),
    descricao: DESCRICOES[cat.slug] || HOME.descricao,
    caminho: `/${cat.slug}`,
    jsonLdExtra,
    conteudo: `<header><a href="/">Bourached Alimentos</a></header>
<main>
<h1>${esc(cat.titulo)}</h1>
<p>${esc(DESCRICOES[cat.slug] || "")}</p>
${produtos.length ? `<p>${produtos.length} produtos</p><ul>${itens}</ul>` : ""}
${sobre ? `<h2>Sobre ${esc(cat.titulo.toLowerCase())} na Bourached</h2>${sobre}` : ""}
<h2>Perguntas frequentes</h2>${perguntas}
${navCategorias()}
</main>`,
  });
}

const dados = await baixarProdutos();
const paginas = [promocoes, ...categorias];

writeFileSync(resolve(DIST, "index.html"), paginaInicial(dados));
for (const cat of paginas) {
  // cleanUrls (vercel.json) serve /arroz a partir de arroz.html
  writeFileSync(resolve(DIST, `${cat.slug}.html`), paginaCategoria(cat, dados));
}

const hoje = new Date().toISOString().slice(0, 10);
const urls = ["/", ...paginas.map((c) => `/${c.slug}`)];
writeFileSync(
  resolve(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${urlCompleta(u)}</loc><lastmod>${hoje}</lastmod></url>`).join("\n")}
</urlset>
`,
);

writeFileSync(
  resolve(DIST, "robots.txt"),
  `User-agent: *
Allow: /
Disallow: /atendente
Disallow: /meus-pedidos
Disallow: /busca

Sitemap: ${SITE_URL}/sitemap.xml
`,
);

console.log(
  `prerender: ${urls.length} páginas para ${SITE_URL}${dados ? "" : " (sem lista de produtos)"} + sitemap.xml e robots.txt`,
);
