// Testa o leitor de pedidos com a lista real: node scripts/teste-lancador.mjs
import { readFileSync } from "node:fs";
import { montarIndice, lerTextoLivre, lerMensagemDoSite, ehMensagemDoSite, textoParaFlutt, extrairQtd } from "../src/utils/lancador.js";
import { montarMensagemWhatsApp } from "../src/utils/pedido.js";

const dados = JSON.parse(readFileSync(new URL("../public/produtos.json", import.meta.url)));
const mapa = new Map();
Object.values(dados).forEach((itens) => itens.forEach((p) => p.variacoes.forEach((v) => {
  const k = `${p.id}|${v.codigo}`; if (!mapa.has(k)) mapa.set(k, { produto: p, variacao: v });
})));
const indice = montarIndice(mapa);
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log("  FALHOU:", msg); } };

console.log("1) Mensagem gerada pelo site (ida e volta)");
const pedido = {
  numero: "261026-0545-AB", cliente: { nome: "Maria da Silva", telefone: "(11) 99999-9999" }, observacao: "Retirar na loja",
  itens: [
    { descricao: "BALA JUJUBA", pesoLabel: "10KG - CX", qtd: 3, codigo: "3124", precoVenda: 161 },
    { descricao: "BALA DE GOMA", pesoLabel: "5KG - PC", qtd: 2, codigo: "2674", precoVenda: 60.5 },
  ], total: 604,
};
const msg = montarMensagemWhatsApp(pedido);
ok(ehMensagemDoSite(msg), "deveria reconhecer a mensagem do site");
const r = lerMensagemDoSite("[10:32, 26/10/2026] Maria: " + msg.split("\n")[0] + "\n" + msg.split("\n").slice(1).join("\n"));
ok(r.itens.length === 2, `2 itens, veio ${r.itens.length}`);
ok(r.itens[0].codigo === "3124" && r.itens[0].qtd === 3, "item 1 = 3124 x3");
ok(r.itens[1].codigo === "2674" && r.itens[1].qtd === 2, "item 2 = 2674 x2");
ok(r.cabecalho.cliente === "Maria da Silva" && r.cabecalho.numero === "261026-0545-AB", "cabeçalho");
ok(r.cabecalho.obs === "Retirar na loja", "obs");
console.log(textoParaFlutt(r.itens));

console.log("\n2) Quantidade em frases");
const casos = [
  ["3 cx bala jujuba 10kg", 3], ["3x amendoim caramelizado 5kg", 3], ["bala jujuba 10kg - 3", 3],
  ["bala jujuba 10kg x3", 3], ["2 pc bala de goma 5kg", 2], ["10kg arroz agulha", 1], ["1 canjica amarela 5kg", 1],
  ["- 4 sc arroz agulha br 25kg", 4], ["5kg amendoim ovinho 2", 2],
];
casos.forEach(([t, q]) => { const e = extrairQtd(t); console.log(`  "${t}" -> qtd ${e.qtd} | "${e.texto}"`); ok(e.qtd === q, `qtd de "${t}" deveria ser ${q}`); });

console.log("\n3) Texto livre contra a lista real");
const livres = [
  ["3 cx bala jujuba 10kg", "3124"], ["2 pc bala de goma 5kg", "2674"], ["2x amendoim caramelizado 5kg", "3367"],
  ["1 arroz agulha br 25kg", "85"], ["canjica amarela 5kg - 2", "2471"], ["3 pc bala azedinha cereja 5kg", "3434"],
  ["2 cx bala minhoca acida 10kg", "3130"], ["1 sc milho pipoca zanella 25kg", "3110"], ["2 fd cajuina sao geraldo 1lt", "3402"],
  ["bicarbonato", null],
];
livres.forEach(([t, esperado]) => {
  const [l] = lerTextoLivre(t, indice);
  const e = l.escolhida;
  console.log(`  "${t}" -> ${e ? e.codigo + " " + e.descricao + " " + e.pesoLabel : "—"} [${l.confianca}] qtd ${l.qtd}`);
  if (esperado) ok(e && e.codigo === esperado, `"${t}" deveria dar ${esperado}`);
});
console.log(falhas ? `\n${falhas} falha(s)` : "\nTudo certo");
process.exit(falhas ? 1 : 0);
