// Roda depois do "vite build" (npm run build).
// O site é React: sem isto, o HTML que o Google recebe é só <div id="root">.
// Aqui geramos um HTML por página (início, cada categoria e cada produto) com título,
// descrição, endereço canônico, dados da loja (schema.org) e o conteúdo em
// texto (categorias, produtos e embalagens). Ao abrir no navegador, o React
// substitui esse conteúdo pela loja normal.
// Também gera robots.txt e sitemap.xml.
//
// Os preços NÃO entram no HTML: mudam com frequência e ficariam velhos até o
// próximo deploy. O Google lê os preços atuais quando executa o site.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Variáveis VITE_ do .env (a Vercel também as passa pelo ambiente)
const arquivoEnv = resolve(".env");
if (existsSync(arquivoEnv)) {
  for (const linha of readFileSync(arquivoEnv, "utf8").split(/\r?\n/)) {
    const m = /^\s*(VITE_[A-Z_]+)\s*=\s*(.*)\s*$/.exec(linha);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { categorias, promocoes, buscarCategoria } = await import("../src/utils/categorias.js");
const {
  SITE_URL, HOME, DESCRICOES, TEXTOS, PERGUNTAS, USOS, NEGOCIO,
  tituloCategoria, tituloProduto, descricaoProduto, urlCompleta,
} = await import("../src/seo.js");
const {
  PRODUTOS_URL, extrairPromocoes, produtosDaCategoria, urlImagemProduto,
  indiceProdutos, caminhoProduto, nomeProduto, descreverEmbalagem,
} = await import("../src/utils/catalogo.js");
const { linkWhatsApp } = await import("../src/utils/pedido.js");

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

// Imagem do produto em endereço completo (a imagem padrão fica no próprio site).
function imagemCompleta(produto) {
  const caminho = urlImagemProduto(produto.imagem);
  if (!caminho) return undefined;
  return /^https?:/.test(caminho) ? caminho : urlCompleta(caminho);
}

// Lista dos produtos da página para o Google (schema.org ItemList). Sem preço,
// pelo mesmo motivo do HTML; por isso cada item é um ListItem, não um Product
// (o Google pede preço, avaliação ou nota em todo Product).
function listaDeProdutos(cat, produtos) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat.titulo,
    url: urlCompleta(`/${cat.slug}`),
    numberOfItems: produtos.length,
    itemListElement: produtos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.descricao,
      url: caminhoProduto(dados, p) ? urlCompleta(caminhoProduto(dados, p)) : undefined,
      description: `Embalagens: ${embalagens(p)}`,
      image: imagemCompleta(p),
    })),
  };
}

function montarHtml({ titulo, descricao, caminho, conteudo, jsonLdExtra = [], imagem = `${SITE_URL}/amendoim.jpeg` }) {
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
    <meta property="og:image" content="${esc(imagem)}" />
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
    .map((p) => {
      const href = caminhoProduto(dados, p);
      const nome = href ? `<a href="${esc(href)}">${esc(p.descricao)}</a>` : esc(p.descricao);
      return `<li><h2>${nome}</h2><p>Embalagens: ${esc(embalagens(p))}</p></li>`;
    })
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
    ...(produtos.length ? [listaDeProdutos(cat, produtos)] : []),
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

function paginaProduto(slug, { produto, categoria }) {
  const cat = buscarCategoria(categoria) || { titulo: categoria, slug: categoria };
  const nome = nomeProduto(produto.descricao);
  const variacoes = produto.variacoes || [];
  const textos = variacoes.map(descreverEmbalagem);
  const descricao = descricaoProduto(nome, textos);
  const caminho = `/produto/${slug}`;
  const imagem = urlImagemProduto(produto.imagem);
  const mensagem = `Olá! Vim pelo site e quero pedir: ${produto.descricao} (Cód. ${variacoes.map((v) => v.codigo).join(" / ")})`;
  const lista = variacoes
    .map((v, i) => `<li>${esc(textos[i].charAt(0).toUpperCase() + textos[i].slice(1))} · Cód. ${esc(v.codigo)}</li>`)
    .join("");
  // O schema Product (com preços) é colocado pelo React, no navegador.
  const jsonLdExtra = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: urlCompleta("/") },
        { "@type": "ListItem", position: 2, name: cat.titulo, item: urlCompleta(`/${cat.slug}`) },
        { "@type": "ListItem", position: 3, name: nome, item: urlCompleta(caminho) },
      ],
    },
  ];
  return montarHtml({
    titulo: tituloProduto(nome, categoria),
    descricao,
    caminho,
    jsonLdExtra,
    ...(imagem ? { imagem: /^https?:/.test(imagem) ? imagem : urlCompleta(imagem) } : {}),
    conteudo: `<header><a href="/">Bourached Alimentos</a></header>
<main>
<nav aria-label="Você está em"><a href="/">Início</a> / <a href="/${esc(cat.slug)}">${esc(cat.titulo)}</a> / ${esc(nome)}</nav>
<h1>${esc(nome)}</h1>
<p>${esc(descricao)}</p>
<h2>Embalagens</h2>
<ul>${lista}</ul>
${USOS[categoria] ? `<h2>Usos</h2><p>${esc(USOS[categoria])}</p>` : ""}
<p><a href="${esc(linkWhatsApp(mensagem))}">Pedir pelo WhatsApp</a></p>
<p><a href="/${esc(cat.slug)}">Ver todos os produtos de ${esc(cat.titulo.toLowerCase())}</a></p>
</main>`,
  });
}

const dados = await baixarProdutos();
const paginas = [promocoes, ...categorias];
const produtos = dados ? [...indiceProdutos(dados).porSlug] : [];

writeFileSync(resolve(DIST, "index.html"), paginaInicial(dados));
for (const cat of paginas) {
  // cleanUrls (vercel.json) serve /arroz a partir de arroz.html
  writeFileSync(resolve(DIST, `${cat.slug}.html`), paginaCategoria(cat, dados));
}

const hoje = new Date().toISOString().slice(0, 10);
// cleanUrls serve /produto/alho-frito a partir de produto/alho-frito.html
mkdirSync(resolve(DIST, "produto"), { recursive: true });
for (const [slug, item] of produtos) {
  writeFileSync(resolve(DIST, "produto", `${slug}.html`), paginaProduto(slug, item));
}

const urls = ["/", ...paginas.map((c) => `/${c.slug}`), ...produtos.map(([slug]) => `/produto/${slug}`)];
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
