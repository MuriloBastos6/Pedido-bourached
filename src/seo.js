// Textos e endereços usados para o Google: no navegador (usePagina) e no
// build (scripts/prerender.mjs gera um HTML por página com estes dados).

// Endereço público do site. Ao trocar de domínio, mude VITE_SITE_URL no .env.
export const SITE_URL = (
  globalThis.process?.env?.VITE_SITE_URL ||
  import.meta.env?.VITE_SITE_URL ||
  "https://produtos-bourached.vercel.app"
).replace(/\/+$/, "");

export const NOME_SITE = "Bourached Alimentos";

export const HOME = {
  titulo: "Bourached Alimentos | Atacado de produtos naturais, grãos e temperos no Brás",
  descricao:
    "Atacado de amendoins, castanhas, grãos, farinhas, temperos, chás e doces no Brás, São Paulo. Monte seu pedido no site e envie pelo WhatsApp.",
};

// Uma frase por categoria: aparece embaixo do título da página e na
// descrição que o Google mostra nos resultados.
export const DESCRICOES = {
  promocoes: "Ofertas da semana em amendoins, farinhas, grãos, frutas secas, sementes e balas no atacado. Preços especiais por tempo limitado.",
  amendoim: "Amendoins, castanhas de caju e do Pará, amêndoas, avelãs e crocantes no atacado. Crus, torrados, salgados e caramelizados.",
  arroz: "Arroz agulha, arbóreo, cateto, preto, vermelho e sete grãos no atacado, em pacotes e sacos.",
  sucrilhos: "Cereais matinais no atacado: corn flakes, sucrilhos açucarados, choco boll e fruit rings.",
  cha: "Chás e ervas a granel no atacado: camomila, hibisco, erva-doce, boldo, capim-limão, espinheira-santa, sene e muitas outras.",
  farinhas: "Farinhas no atacado: mandioca, aveia, amêndoa, coco, linhaça, arroz, banana verde, grão-de-bico e muitas outras.",
  graos: "Grãos e feijões no atacado: feijão carioca, preto, fradinho e azuki, canjica, lentilha, grão-de-bico, ervilha, favas e milho de pipoca.",
  panificacao: "Para panificação no atacado: amido de milho, féculas, polvilho, fubá, flocão, tapioca granulada e proteína texturizada de soja.",
  especiarias: "Temperos e especiarias a granel no atacado: alho, orégano, canela, cravo, sal do Himalaia, sal marinho e temperos prontos.",
  frutas: "Frutas secas e desidratadas no atacado: uva-passa, ameixa, damasco, tâmara, cranberry, goji berry e frutas cristalizadas.",
  sementes: "Sementes no atacado: chia, gergelim, girassol, abóbora, quinoa, alpiste e painço.",
  produtosnaturais: "Produtos naturais a granel no atacado: granolas, aveia, coco ralado, cacau e chocolate em pó, açúcar de coco, colágeno, creatina e farofas.",
  refris: "Bebidas no atacado: cajuína São Geraldo e Guaraná Jesus, em garrafa e lata.",
  oleo: "Azeite de dendê e leite de coco no atacado.",
  goma: "Goma de tapioca pronta no atacado: Lopes, Pantanal e Terrinha.",
  salgadinhos: "Salgadinhos e snacks no atacado: banana chips, batata mexicana, mandioca chips, banana palha e torresmo.",
  doces: "Doces e balas no atacado: balas de goma, jujubas, azedinhas, balas de gelatina, cocadas, goiabada, bananada e crocantes.",
  bolachas: "Bolachas mineiras no atacado: roscas, palmier, bambolê, casadinha, pão de mel e muitas outras.",
  potes: "Potes plásticos quadrados, redondos e retangulares e conchas para lojas de produtos a granel.",
};

export function tituloCategoria(titulo) {
  return `${titulo} no atacado | ${NOME_SITE}`;
}

export function urlCompleta(caminho = "/") {
  return `${SITE_URL}${caminho === "/" ? "/" : caminho}`;
}

// Dados da loja para o Google (schema.org). Vão em todas as páginas.
export const NEGOCIO = {
  "@context": "https://schema.org",
  "@type": "WholesaleStore",
  name: NOME_SITE,
  url: SITE_URL,
  image: `${SITE_URL}/amendoim.jpeg`,
  logo: `${SITE_URL}/logoBourached.png`,
  telephone: "+55-11-96418-1200",
  email: "bourachedalimentos@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua do Lucas, 306 - Brás",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  areaServed: "São Paulo",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "06:00",
      closes: "16:30",
    },
  ],
  sameAs: ["https://www.instagram.com/bourachedalimentos/"],
};
