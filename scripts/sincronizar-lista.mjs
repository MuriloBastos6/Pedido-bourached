// Copia a lista de produtos (e imagens novas) do projeto do site de produtos
// para este projeto, sem alterar o original.
// Uso: npm run lista:sincronizar -- ../Lista-de-Produtos-Bourached
import { cpSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const origem = process.argv[2];
if (!origem) {
  console.error("Informe a pasta do projeto original.\nEx.: npm run lista:sincronizar -- ../Lista-de-Produtos-Bourached");
  process.exit(1);
}
const base = resolve(origem, "public");
if (!existsSync(join(base, "produtos.json"))) {
  console.error(`produtos.json não encontrado em ${base}`);
  process.exit(1);
}
cpSync(join(base, "produtos.json"), resolve("public", "produtos.json"));
if (existsSync(join(base, "images"))) {
  cpSync(join(base, "images"), resolve("public", "images"), { recursive: true });
}
console.log("Lista de produtos e imagens atualizadas.");
