// Categorias da loja (ordem do menu) e a página de promoções.
export const categorias = [
  { titulo: "Amendoins & castanhas", capa: "/amendoim.jpeg", slug: "amendoim" },
  { titulo: "Arroz", capa: "/arroz.jpeg", slug: "arroz" },
  { titulo: "Sucrilhos", capa: "/sucrilhos.jpeg", slug: "sucrilhos" },
  { titulo: "Chás", capa: "/cha.jpeg", slug: "cha" },
  { titulo: "Farinhas", capa: "/farinhas.jpeg", slug: "farinhas" },
  { titulo: "Grãos", capa: "/graos.jpeg", slug: "graos" },
  { titulo: "Panificação", capa: "/panificacoes.jpeg", slug: "panificacao" },
  { titulo: "Especiarias", capa: "/especiarias.jpeg", slug: "especiarias" },
  { titulo: "Frutas", capa: "/frutas.jpeg", slug: "frutas" },
  { titulo: "Sementes", capa: "/sementes.jpeg", slug: "sementes" },
  { titulo: "Produtos naturais", capa: "/produtosnaturais.jpeg", slug: "produtosnaturais" },
  { titulo: "Refrigerantes & sucos", capa: "/refris.jpeg", slug: "refris" },
  { titulo: "Óleo vegetal", capa: "/oleo.jpeg", slug: "oleo" },
  { titulo: "Goma pronta", capa: "/Goma.png", slug: "goma" },
  { titulo: "Salgadinhos & snacks", capa: "/salgadinho.jpeg", slug: "salgadinhos" },
  { titulo: "Doces", capa: "/doces.jpeg", slug: "doces" },
  { titulo: "Bolachas Mineiras", capa: "/bolachas.jpeg", slug: "bolachas" },
  { titulo: "Potes", capa: "/pote.jpeg", slug: "potes" },
];

export const promocoes = { titulo: "Promoções", capa: "/graos.jpeg", slug: "promocoes" };

export function buscarCategoria(slug) {
  if (slug === promocoes.slug) return promocoes;
  return categorias.find((cat) => cat.slug === slug);
}
