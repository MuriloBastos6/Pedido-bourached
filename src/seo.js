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

// Título que o Google mostra para cada categoria (até uns 60 caracteres).
const LOCAL = "Distribuidora no Brás, SP";
export const TITULOS = {
  promocoes: `Promoções da Semana | ${LOCAL}`,
  amendoim: `Amendoins e Castanhas a Granel | ${LOCAL}`,
  arroz: `Arroz em Sacos de 5 e 25 kg | ${LOCAL}`,
  sucrilhos: `Cereais Matinais e Sucrilhos | ${LOCAL}`,
  cha: `Chás e Ervas a Granel | ${LOCAL}`,
  farinhas: `Farinhas a Granel | ${LOCAL}`,
  graos: `Grãos e Feijões a Granel | ${LOCAL}`,
  panificacao: `Produtos para Panificação | ${LOCAL}`,
  especiarias: `Temperos e Especiarias a Granel | ${LOCAL}`,
  frutas: `Frutas Secas e Desidratadas | ${LOCAL}`,
  sementes: `Sementes a Granel | ${LOCAL}`,
  produtosnaturais: `Produtos Naturais a Granel | ${LOCAL}`,
  refris: `Cajuína e Guaraná Jesus | ${LOCAL}`,
  oleo: `Azeite de Dendê e Leite de Coco | ${LOCAL}`,
  goma: `Goma de Tapioca Pronta | ${LOCAL}`,
  salgadinhos: `Salgadinhos e Snacks | ${LOCAL}`,
  doces: `Doces e Balas a Granel | ${LOCAL}`,
  bolachas: `Bolachas Mineiras | ${LOCAL}`,
  potes: `Potes para Loja a Granel | ${LOCAL}`,
};

export function tituloCategoria(titulo, slug) {
  return TITULOS[slug] || `${titulo} | Distribuidora ${NOME_SITE}`;
}

// Texto maior de cada categoria (um item por parágrafo). Aparece embaixo dos
// produtos e no HTML que o Google lê.
export const TEXTOS = {
  promocoes: [
    "Esta página reúne as ofertas da semana da Bourached Alimentos, distribuidora de produtos naturais, grãos e temperos no Brás, em São Paulo. A lista muda com frequência e costuma trazer amendoins, farinhas de mandioca e de aveia, féculas, milho de pipoca, frutas secas como tâmara e uva-passa, sementes de chia e de abóbora e balas, sempre em embalagens fechadas de distribuidora, como pacotes de 3 e 5 kg, caixas de 10 e 15 kg e sacos de 20 e 25 kg.",
    "As promoções valem enquanto durar o estoque. Para aproveitar, adicione os itens ao carrinho, escolha a embalagem e envie o pedido pelo WhatsApp. É uma boa forma de empórios, lojas de produtos a granel, mercados e restaurantes reforçarem o estoque pagando menos. Se não encontrar o que procura aqui, veja as categorias completas: cada uma lista todos os produtos e embalagens disponíveis. A retirada é na nossa loja na Rua do Lucas, 306, no Brás, de segunda a sexta.",
  ],
  amendoim: [
    "Na Bourached Alimentos você encontra amendoins e castanhas a granel para revenda e para uso em cozinhas e confeitarias. São quase 50 itens: castanha de caju inteira, castanha-do-pará, amêndoas cruas, torradas, defumadas e confeitadas, avelãs sem casca, macadâmia, nozes, mix de castanhas, amendoim cru e torrado com casca, amendoim frito com sal ou alho, amendoim ovinho, amendoins caramelizados com coco, gergelim ou mel e crocantes, inclusive o japonês.",
    "Os produtos são vendidos em embalagens de distribuidora, como pacotes de 1,1 kg, caixas de 10 e 11 kg e sacos de 12,5 a 25 kg, conforme o item. É o tamanho certo para empórios e lojas a granel que fracionam em potes e saquinhos, para bares que servem petiscos e para padarias e confeitarias que usam castanhas e amêndoas em bolos, doces e granolas.",
    "Somos uma distribuidora na Zona Cerealista do Brás, em São Paulo. Monte o pedido no site, escolha a embalagem de cada produto e envie pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306.",
  ],
  arroz: [
    "A Bourached Alimentos trabalha com arroz em pacotes de 5 kg e sacos de 5 e 25 kg, para quem compra em quantidade. Além do arroz agulha branco, temos variedades especiais procuradas por empórios e restaurantes: arroz arbóreo para risoto, arroz cateto, arroz preto, arroz vermelho e o mix de arroz sete grãos.",
    "Os arrozes especiais têm boa saída em lojas de produtos naturais e a granel, que vendem por peso, e em restaurantes que montam pratos diferentes no cardápio. O arroz agulha em saco de 25 kg atende cozinhas industriais, marmitarias e restaurantes por quilo que precisam de volume.",
    "Somos uma distribuidora no Brás, em São Paulo, e atendemos lojistas e consumidores. Escolha os produtos e as embalagens no site e envie o pedido pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306, de segunda a sexta, das 6h às 16h30.",
  ],
  sucrilhos: [
    "A Bourached Alimentos distribui cereais matinais a granel em sacos de 6 e 8 kg, para empórios, lojas a granel, padarias e cafeterias. Temos corn flakes natural, sucrilhos açucarados (tradicional, com banana, com leite condensado e com açúcar mascavo), corn com mel, choco boll e fruit rings coloridos.",
    "Vender cereal a granel permite ao lojista fracionar na quantidade que o cliente quer e montar misturas com granola, aveia e frutas secas, produtos que você também encontra na nossa distribuidora. Os cereais também são usados em sobremesas, coberturas de açaí, barrinhas e doces de padaria.",
    "Estamos no Brás, em São Paulo, perto da Zona Cerealista. Monte o pedido no site, escolha as embalagens e envie pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306.",
  ],
  cha: [
    "Na Bourached Alimentos você encontra chás e ervas a granel para lojas de produtos naturais, empórios, farmácias de manipulação e casas de chá. São cerca de 40 itens, como camomila, hibisco, erva-doce, boldo-do-chile, capim-limão, carqueja, cavalinha, espinheira-santa, sene, casca de aroeira, barbatimão, arruda, anis-estrelado, além de ervas em pó como catuaba e ashwagandha.",
    "As ervas são vendidas em embalagens de distribuidora, de pacotes de 1 e 2 kg até sacos de 10, 20 e 25 kg, conforme o item. Isso permite ao lojista fracionar em saquinhos e potes, montar blends próprios e vender por peso, que é como o cliente de chá a granel costuma comprar.",
    "Somos uma distribuidora no Brás, em São Paulo. Escolha os chás e as embalagens no site e envie o pedido pelo WhatsApp. A retirada é na nossa loja, na Rua do Lucas, 306, de segunda a sexta, das 6h às 16h30.",
  ],
  farinhas: [
    "A Bourached Alimentos distribui farinhas a granel para padarias, confeitarias, empórios, lojas de produtos naturais e restaurantes. São mais de 35 tipos: farinha de mandioca fina e grossa, farinha d'água, farinha baianinha, farinha de acarajé, farinha de aveia, de amêndoa, de amendoim, de coco, de linhaça, de arroz branco e integral, de banana verde, de grão-de-bico e abóbora em pó, entre outras.",
    "As embalagens vão de pacotes de 3 kg e fardos de 10 x 1 kg até sacos de 10, 20, 25 e 30 kg, conforme o produto. As farinhas sem glúten e as farinhas de oleaginosas são muito procuradas em lojas a granel e por confeitarias que fazem receitas low carb e sem glúten; as farinhas de mandioca atendem restaurantes, casas do Norte e Nordeste e cozinhas que preparam farofas.",
    "Estamos no Brás, em São Paulo. Monte o pedido no site, escolha a embalagem de cada farinha e envie pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306.",
  ],
  graos: [
    "Na Bourached Alimentos você encontra grãos e feijões a granel em sacos de 10 a 50 kg e pacotes de 3 kg. São mais de 40 itens: feijão carioca, preto, fradinho, branco e azuki, lentilha, grão-de-bico, ervilha inteira e partida, favas, canjica branca e amarela, canjiquinha, cevada em grão e milho de pipoca.",
    "Os grãos são a base de empórios e lojas a granel, que vendem por peso, e de restaurantes, marmitarias e cozinhas industriais que precisam de volume. Grão-de-bico, lentilha e feijão azuki também têm boa saída em lojas de produtos naturais e veganos, e a canjica e o milho de pipoca vendem bem nas festas juninas.",
    "Somos uma distribuidora na Zona Cerealista do Brás, em São Paulo, e atendemos empresas e consumidores. Escolha os grãos e as embalagens no site e envie o pedido pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306, de segunda a sexta, das 6h às 16h30.",
  ],
  panificacao: [
    "A Bourached Alimentos distribui produtos para panificação e confeitaria: amido de milho, fécula de mandioca e de batata, polvilho doce e azedo, fubá mimoso e italiano, flocão de milho e de arroz, flocos de arroz, fibras de trigo e de maçã, tapioca granulada e proteína texturizada de soja.",
    "As embalagens vão de pacotes de 1 e 5 kg e fardos de 500 g até sacos de 10, 20 e 25 kg, conforme o item. São produtos do dia a dia de padarias, confeitarias, fábricas de pão de queijo e biscoito de polvilho, lanchonetes que fazem cuscuz e tapioca e restaurantes. Os empórios a granel também vendem esses itens fracionados para quem cozinha em casa.",
    "Estamos no Brás, em São Paulo. Monte o pedido no site, escolha as embalagens e envie pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306.",
  ],
  especiarias: [
    "Na Bourached Alimentos você encontra temperos e especiarias a granel para restaurantes, açougues, empórios, lojas de produtos naturais e fábricas de alimentos. São cerca de 80 itens: alho frito, granulado e moído, cebola moída, orégano, canela em casca e em pó, cravo-da-índia, cominho, páprica, pimentas, sal do Himalaia, sal marinho, temperos prontos, amaciante de carne e bicarbonato de sódio, entre outros.",
    "Os temperos são vendidos em embalagens de distribuidora, como pacotes de 1 kg, caixas e fardos com 15 a 20 pacotes de 1 kg e sacos de 10 a 25 kg, conforme o produto. Comprar a granel permite ao lojista fracionar em potes e saquinhos e vender por peso, e às cozinhas profissionais manter o estoque gastando menos por quilo.",
    "Somos uma distribuidora na Zona Cerealista do Brás, em São Paulo. Escolha os temperos e as embalagens no site e envie o pedido pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306, de segunda a sexta, das 6h às 16h30.",
  ],
  frutas: [
    "A Bourached Alimentos distribui frutas secas, desidratadas e cristalizadas: uva-passa preta e branca, ameixa sem caroço, damasco, tâmara com caroço, cranberry, goji berry, maçã e laranja desidratadas em fatias, morango chips, mix de frutas desidratadas e tropicais e frutas cristalizadas.",
    "As embalagens vão de pacotes de 1 e 2,5 kg até caixas de 10 e 12,5 kg, conforme o item. As frutas secas são muito vendidas em empórios e lojas a granel, e usadas por padarias e confeitarias em panetones, bolos e granolas. A procura cresce bastante no fim do ano, quando vale reforçar o estoque com antecedência.",
    "Estamos no Brás, em São Paulo, perto da Zona Cerealista. Monte o pedido no site, escolha as embalagens e envie pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306.",
  ],
  sementes: [
    "Na Bourached Alimentos você encontra sementes a granel para empórios, lojas de produtos naturais, padarias e lojas de ração para pássaros. Temos chia, gergelim branco, preto e com pele, girassol graúdo e miúdo, pepita de girassol, semente de abóbora, quinoa em grão e em flocos, mix de quinoa, germe de trigo tostado, alpiste e painço.",
    "As sementes são vendidas em pacotes de 2,5 kg e sacos de 10 a 25 kg, conforme o item. Chia, gergelim e quinoa estão entre os itens mais procurados em lojas a granel, e são usados por padarias em pães e biscoitos integrais. Alpiste, painço e girassol atendem casas de ração e lojas agropecuárias.",
    "Somos uma distribuidora no Brás, em São Paulo. Escolha as sementes e as embalagens no site e envie o pedido pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306, de segunda a sexta, das 6h às 16h30.",
  ],
  produtosnaturais: [
    "A Bourached Alimentos distribui produtos naturais a granel para empórios, lojas de produtos naturais, academias, padarias e cafeterias. São mais de 70 itens: aveia em flocos finos, médios e laminada, granolas, coco ralado fino e em flocos, cacau e chocolate em pó, açúcar de coco e demerara, açaí em pó, albumina, colágeno, creatina e farofas prontas, entre outros.",
    "As embalagens vão de fardos e caixas com pacotes de 500 g e 1 kg até sacos de 10 kg, conforme o produto. Com esses itens o lojista monta a seção de naturais da loja, vende por peso e oferece opções para quem busca uma alimentação mais saudável ou suplementos para treino.",
    "Estamos no Brás, em São Paulo, perto da Zona Cerealista. Monte o pedido no site, escolha as embalagens e envie pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306.",
  ],
  refris: [
    "A Bourached Alimentos distribui bebidas regionais muito procuradas em São Paulo: cajuína São Geraldo, inclusive zero, refrigerante de laranja São Geraldo e Guaraná Jesus, em garrafas de 1 e 2 litros e latas.",
    "As bebidas são vendidas em fardos de 6 ou 12 unidades, conforme a embalagem. São produtos com público fiel entre nordestinos e maranhenses que moram em São Paulo, e por isso vendem bem em casas do Norte e Nordeste, restaurantes de comida nordestina, bares, lanchonetes, mercados de bairro e empórios.",
    "Somos uma distribuidora no Brás, em São Paulo, e atendemos lojistas e consumidores. Escolha as bebidas e os fardos no site e envie o pedido pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306, de segunda a sexta, das 6h às 16h30.",
  ],
  oleo: [
    "A Bourached Alimentos distribui azeite de dendê e leite de coco em fardos de 6, 12 e 24 unidades, em garrafas de 200 ml, 500 ml, 1 litro e 2 litros, conforme o produto.",
    "O azeite de dendê é ingrediente essencial do acarajé, da moqueca, do vatapá e de outros pratos da cozinha baiana. O leite de coco é usado em moquecas, doces, bolos e bebidas. São itens de compra frequente para restaurantes de comida nordestina, baianas de acarajé, casas do Norte, confeitarias e mercados de bairro. Para o acarajé, temos também a farinha de acarajé na categoria de farinhas.",
    "Estamos no Brás, em São Paulo. Monte o pedido no site, escolha os fardos e envie pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306.",
  ],
  goma: [
    "A Bourached Alimentos distribui goma de tapioca pronta das marcas Lopes, Pantanal e Terrinha, em caixas e fardos com pacotes de 500 g e 1 kg (10, 12, 20 ou 24 pacotes, conforme a marca).",
    "A goma pronta já vem hidratada e peneirada: é só espalhar na frigideira para fazer a tapioca. Por isso é a escolha de tapiocarias, lanchonetes, padarias, cafeterias, barracas de feira e restaurantes de comida nordestina, que precisam de agilidade no preparo. Mercados de bairro e empórios também revendem os pacotes para o consumidor final.",
    "Somos uma distribuidora no Brás, em São Paulo. Escolha a marca e a embalagem no site e envie o pedido pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306, de segunda a sexta, das 6h às 16h30.",
  ],
  salgadinhos: [
    "A Bourached Alimentos distribui salgadinhos e snacks: banana chips doce, salgada, de bacon e de salsa e cebola, banana-da-terra chips, batata frita mexicana nos sabores tradicional, pimenta, salsa e lemon pepper, mandioca chips, banana palha, anéis de cebola, torresmo e biscoito de polvilho com queijo.",
    "As embalagens vão de pacotes de 500 g, 1 kg e 2 kg até fardos com 20 pacotes de 180 g, conforme o item. Os pacotes grandes são próprios para empórios e lojas a granel que vendem por peso e para bares e restaurantes que servem porções. Os pacotes menores vão direto para a prateleira de mercados, padarias e lanchonetes.",
    "Estamos no Brás, em São Paulo. Monte o pedido no site, escolha as embalagens e envie pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306.",
  ],
  doces: [
    "Na Bourached Alimentos você encontra doces e balas a granel para empórios, lojas de doces, bomboniéres, buffets e festas. São quase 80 itens: balas de goma em vários formatos (ursinhos, anéis, frutas, açaí), jujubas, balas azedinhas de cereja, morango e tutti-frutti, balas de gelatina, dentes de vampiro, cocadas, goiabada, bananada, paçocas e crocantes.",
    "As balas são vendidas em pacotes e caixas de 1 kg e 10 kg e em fardos com pacotes de 250 a 400 g, conforme o produto. Comprar a granel permite montar potes de balas para vender por peso, kits de festa e saquinhos de lembrança. A procura aumenta perto do Dia das Crianças, da Páscoa e das festas de fim de ano.",
    "Somos uma distribuidora no Brás, em São Paulo. Escolha os doces e as embalagens no site e envie o pedido pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306, de segunda a sexta, das 6h às 16h30.",
  ],
  bolachas: [
    "A Bourached Alimentos distribui bolachas mineiras, os biscoitos caseiros vendidos por peso em empórios e padarias. São mais de 25 tipos: roscas, palmier, bambolê simples e recheado, casadinha, goiabinha, beliscão, beijinho de freira, bolacha areia, ganache de morango, pão de mel e muitas outras.",
    "As bolachas vêm em pacotes de 1,5 kg, 2 kg e 2,5 kg, próprios para quem fraciona e vende a granel em potes ou saquinhos. Elas fazem sucesso em empórios, lojas de produtos a granel, padarias, cafeterias e mercados de bairro, e também são servidas em cafés da manhã de hotéis, escritórios e eventos.",
    "Estamos no Brás, em São Paulo, perto da Zona Cerealista. Monte o pedido no site, escolha as embalagens e envie pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306.",
  ],
  potes: [
    "A Bourached Alimentos vende potes plásticos e conchas para lojas de produtos a granel. Temos potes quadrados de 3,3 e 7,4 litros, redondos de 8,6 e 12 litros e retangulares de 1,5 e 13,8 litros, além de conchas pequenas e médias para servir os produtos.",
    "Os potes servem para expor grãos, castanhas, farinhas, temperos, chás, balas e bolachas no balcão e nas prateleiras, deixando o produto à vista do cliente. São vendidos por unidade ou em caixas e pacotes com 12 unidades, conforme o modelo. Quem está montando um empório ou uma loja a granel pode comprar os potes junto com os produtos, no mesmo pedido.",
    "Somos uma distribuidora no Brás, em São Paulo. Escolha os modelos no site e envie o pedido pelo WhatsApp. A retirada é na loja, na Rua do Lucas, 306, de segunda a sexta, das 6h às 16h30.",
  ],
};

// Páginas de produto (/produto/...): título, descrição e usos por categoria.
// Categorias de produtos embalados não levam "a Granel" no título.
const SEM_GRANEL = new Set(["refris", "oleo", "goma", "potes"]);

export function tituloProduto(nome, categoria) {
  return SEM_GRANEL.has(categoria) ? `${nome} | ${LOCAL}` : `${nome} a Granel | ${LOCAL}`;
}

// embalagens: lista por extenso ("saco de 25 kg", ...)
export function descricaoProduto(nome, embalagens = []) {
  const lista = embalagens.length > 1
    ? `${embalagens.slice(0, -1).join(", ")} e ${embalagens.at(-1)}`
    : embalagens[0];
  return `${nome}${lista ? ` em ${lista}` : ""}. Distribuidora no Brás, São Paulo: monte o pedido no site, envie pelo WhatsApp e retire na loja.`;
}

export const USOS = {
  amendoim: "Para revenda a granel em empórios e lojas de produtos naturais, petiscos de bares e uso em confeitaria, granolas, doces e receitas.",
  arroz: "Para restaurantes, marmitarias e cozinhas industriais, e para revenda por peso em empórios e lojas a granel.",
  sucrilhos: "Para revenda a granel, cafés da manhã de hotéis e cafeterias, coberturas de açaí e sobremesas, e misturas com granola e frutas secas.",
  cha: "Para revenda a granel em lojas de produtos naturais e empórios, casas de chá, cafeterias e preparo de blends próprios.",
  farinhas: "Para padarias, confeitarias e restaurantes, receitas sem glúten e low carb, farofas e revenda por peso em lojas a granel.",
  graos: "Para restaurantes, marmitarias e cozinhas industriais, e para revenda por peso em empórios e lojas a granel.",
  panificacao: "Para padarias, confeitarias, fábricas de pão de queijo e biscoito, lanchonetes e revenda fracionada em empórios.",
  especiarias: "Para restaurantes, açougues e fábricas de alimentos, e para revenda fracionada em potes e saquinhos em empórios e lojas a granel.",
  frutas: "Para revenda a granel em empórios, panetones, bolos e granolas em padarias e confeitarias, e cestas de fim de ano.",
  sementes: "Para revenda a granel em lojas de produtos naturais, pães e biscoitos integrais em padarias e, no caso do alpiste e do painço, casas de ração.",
  produtosnaturais: "Para revenda a granel em lojas de produtos naturais e empórios, academias, cafeterias, padarias e confeitarias.",
  refris: "Para revenda em mercados, bares, lanchonetes, casas do Norte e Nordeste e restaurantes de comida nordestina.",
  oleo: "Para restaurantes de comida baiana e nordestina, acarajé, moquecas, doces e revenda em mercados e casas do Norte.",
  goma: "Para tapiocarias, lanchonetes, padarias, cafeterias e revenda em mercados e empórios.",
  salgadinhos: "Para revenda a granel em empórios, porções em bares e restaurantes e prateleira de mercados, padarias e lanchonetes.",
  doces: "Para revenda a granel em empórios e lojas de doces, bomboniéres, buffets, kits de festa e lembrancinhas.",
  bolachas: "Para revenda a granel em empórios, padarias e cafeterias, e cafés da manhã de hotéis, escritórios e eventos.",
  potes: "Para expor grãos, castanhas, temperos, balas e bolachas no balcão e nas prateleiras de lojas a granel e empórios.",
};

// Perguntas frequentes: as mesmas em todas as categorias.
export const PERGUNTAS = [
  {
    pergunta: "Tem pedido mínimo?",
    resposta: "Não. Não há valor mínimo de pedido: você escolhe os produtos e as embalagens (pacote, saco, caixa ou fardo) e pede a quantidade que precisar.",
  },
  {
    pergunta: "Vocês vendem para CNPJ e para CPF?",
    resposta: "Sim. Vendemos para empresas, como empórios, lojas a granel, mercados, padarias e restaurantes, e também para pessoa física. No pedido, o CNPJ é opcional.",
  },
  {
    pergunta: "Vocês fazem entrega?",
    resposta: "Não. Os pedidos são retirados na nossa loja, na Rua do Lucas, 306, no Brás, em São Paulo, de segunda a sexta, das 6h às 16h30.",
  },
  {
    pergunta: "Quais são as formas de pagamento?",
    resposta: "Pix e dinheiro.",
  },
  {
    pergunta: "Como faço o pedido?",
    resposta: "Escolha os produtos e as embalagens no site, adicione ao carrinho e envie o pedido pelo WhatsApp (11) 96418-1200. Nossa equipe responde por lá para combinar a retirada.",
  },
];

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
