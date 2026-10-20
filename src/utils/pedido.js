import { WHATSAPP_NUMBER } from "../config.js";

export function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Ex.: { pesoValor: 5, pesoUnidade: "KG", unidade: "PC" } -> "5KG - PC"
export function formatarPeso(variacao = {}) {
  return `${variacao.pesoValor}${variacao.pesoUnidade} - ${variacao.unidade}`;
}

export function chaveItem(produtoId, codigo) {
  return `${produtoId}|${codigo}`;
}

export function totalDoPedido(itens = []) {
  return itens.reduce(
    (soma, item) => soma + Number(item.precoVenda || 0) * item.qtd,
    0,
  );
}

export function gerarNumeroPedido(data = new Date()) {
  const dois = (n) => String(n).padStart(2, "0");
  const dia = `${String(data.getFullYear()).slice(2)}${dois(data.getMonth() + 1)}${dois(data.getDate())}`;
  const hora = `${dois(data.getHours())}${dois(data.getMinutes())}`;
  const sufixo = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `${dia}-${hora}-${sufixo}`;
}

export function montarMensagemWhatsApp(pedido) {
  const linhas = [];
  linhas.push("🛒 *PEDIDO MONTADO*");
  linhas.push(`Pedido: *#${pedido.numero}*`);
  linhas.push(`Cliente: *${pedido.cliente.nome}*`);
  if (pedido.cliente.telefone) {
    linhas.push(`Telefone: ${pedido.cliente.telefone}`);
  }
  linhas.push("");
  linhas.push("*ITENS*");

  pedido.itens.forEach((item, i) => {
    linhas.push(`${i + 1}) *${item.descricao}*`);
    linhas.push(`   Peso: ${item.pesoLabel}`);
    linhas.push(`   Qtd: ${item.qtd}`);
    linhas.push(`   Cód.: ${item.codigo}`);
    linhas.push(`   ~${formatarPreco(item.precoVenda * item.qtd)}`);
    linhas.push("");
  });

  linhas.push(`*Total aproximado: ${formatarPreco(pedido.total)}*`);
  linhas.push("_Valores aproximados, sujeitos a confirmação._");

  if (pedido.observacao) {
    linhas.push("");
    linhas.push(`Obs: ${pedido.observacao}`);
  }

  return linhas.join("\n");
}

export function linkWhatsApp(mensagem) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

// Abre o WhatsApp. Se o navegador bloquear a nova aba, navega na própria aba.
export function abrirWhatsApp(mensagem) {
  const url = linkWhatsApp(mensagem);
  const janela = window.open(url, "_blank");
  if (janela) {
    janela.opener = null;
  } else {
    window.location.href = url;
  }
}
