// Camada de armazenamento do cliente.
// HOJE: guarda tudo no próprio aparelho (localStorage), sem custo e sem login.
// DEPOIS: para ter login e histórico em qualquer aparelho, basta trocar o
// miolo destas funções por chamadas ao banco (ex.: Firebase) — o resto do
// site continua igual.
import { MAX_PEDIDOS_SALVOS } from "../config.js";

const CHAVES = {
  carrinho: "bourached:carrinho",
  cliente: "bourached:cliente",
  pedidos: "bourached:pedidos",
};

function ler(chave, padrao) {
  try {
    const bruto = window.localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // armazenamento cheio ou bloqueado (aba anônima): o site segue funcionando
  }
}

export const carrinhoStorage = {
  ler: () => {
    const dados = ler(CHAVES.carrinho, []);
    return Array.isArray(dados) ? dados : [];
  },
  gravar: (itens) => gravar(CHAVES.carrinho, itens),
};

export const clienteStorage = {
  ler: () => ({ nome: "", telefone: "", cnpj: "", ...ler(CHAVES.cliente, {}) }),
  gravar: (cliente) => gravar(CHAVES.cliente, cliente),
};

export const pedidosStorage = {
  listar: () => {
    const dados = ler(CHAVES.pedidos, []);
    return Array.isArray(dados) ? dados : [];
  },
  salvar: (pedido) => {
    const lista = [pedido, ...pedidosStorage.listar()].slice(
      0,
      MAX_PEDIDOS_SALVOS,
    );
    gravar(CHAVES.pedidos, lista);
    return lista;
  },
  limpar: () => gravar(CHAVES.pedidos, []),
};
