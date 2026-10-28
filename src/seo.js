// Textos e endereços usados para o Google: no navegador (usePagina) e no
// build (scripts/prerender.mjs gera um HTML por página com estes dados).

// Endereço público do site. Ao trocar de domínio, mude VITE_SITE_URL no .env.
export const SITE_URL = (
  globalThis.process?.env?.VITE_SITE_URL ||
  import.meta.env?.VITE_SITE_URL ||
  "https://www.bourached.com.br"
).replace(/\/+$/, "");

export const NOME_SITE = "Bourached Alimentos";

export const HOME = {
  titulo: "Bourached Alimentos | Distribuidora de produtos naturais, grãos e temperos no Brás",
  descricao:
    "Distribuidora de amendoins, castanhas, grãos, farinhas, temperos, chás e doces no Brás, São Paulo. Monte seu pedido no site e envie pelo WhatsApp.",
};

// Uma frase por categoria: aparece embaixo do título da página e na
// descrição que o Google mostra nos resultados.
export const DESCRICOES = {
  promocoes: "Ofertas da semana da distribuidora em amendoins, farinhas, grãos, frutas secas, sementes e balas. Preços especiais por tempo limitado.",
  amendoim: "Distribuidora de amendoins, castanhas de caju e do Pará, amêndoas, avelãs e crocantes. Crus, torrados, salgados e caramelizados.",
  arroz: "Distribuidora de arroz agulha, arbóreo, cateto, preto, vermelho e sete grãos, em pacotes e sacos.",
  sucrilhos: "Distribuidora de cereais matinais: corn flakes, sucrilhos açucarados, choco boll e fruit rings.",
  cha: "Distribuidora de chás e ervas a granel: camomila, hibisco, erva-doce, boldo, capim-limão, espinheira-santa, sene e muitas outras.",
  farinhas: "Distribuidora de farinhas: mandioca, aveia, amêndoa, coco, linhaça, arroz, banana verde, grão-de-bico e muitas outras.",
  graos: "Distribuidora de grãos e feijões: feijão carioca, preto, fradinho e azuki, canjica, lentilha, grão-de-bico, ervilha, favas e milho de pipoca.",
  panificacao: "Distribuidora de produtos para panificação: amido de milho, féculas, polvilho, fubá, flocão, tapioca granulada e proteína texturizada de soja.",
  especiarias: "Distribuidora de temperos e especiarias a granel: alho, orégano, canela, cravo, sal do Himalaia, sal marinho e temperos prontos.",
  frutas: "Distribuidora de frutas secas e desidratadas: uva-passa, ameixa, damasco, tâmara, cranberry, goji berry e frutas cristalizadas.",
  sementes: "Distribuidora de sementes: chia, gergelim, girassol, abóbora, quinoa, alpiste e painço.",
  produtosnaturais: "Distribuidora de produtos naturais a granel: granolas, aveia, coco ralado, cacau e chocolate em pó, açúcar de coco, colágeno, creatina e farofas.",
  refris: "Distribuidora de bebidas: cajuína São Geraldo e Guaraná Jesus, em garrafa e lata.",
  oleo: "Distribuidora de azeite de dendê e leite de coco.",
  goma: "Distribuidora de goma de tapioca pronta: Lopes, Pantanal e Terrinha.",
  salgadinhos: "Distribuidora de salgadinhos e snacks: banana chips, batata mexicana, mandioca chips, banana palha e torresmo.",
  doces: "Distribuidora de doces e balas: balas de goma, jujubas, azedinhas, balas de gelatina, cocadas, goiabada, bananada e crocantes.",
  bolachas: "Distribuidora de bolachas mineiras: roscas, palmier, bambolê, casadinha, pão de mel e muitas outras.",
  potes: "Potes plásticos quadrados, redondos e retangulares e conchas para lojas de produtos a granel.",
};

export function tituloCategoria(titulo) {
  return `${titulo} | Distribuidora ${NOME_SITE}`;
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
