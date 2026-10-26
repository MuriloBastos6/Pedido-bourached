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

// Máscara enquanto digita: "12345678000190" -> "12.345.678/0001-90"
export function formatarCnpj(texto = "") {
  const d = String(texto).replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

// Confere os dois dígitos verificadores do CNPJ.
export function cnpjValido(texto = "") {
  const d = String(texto).replace(/\D/g, "");
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const digito = (base) => {
    const pesos = base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = pesos.reduce((t, p, i) => t + p * Number(base[i]), 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const primeiro = digito(d.slice(0, 12));
  const segundo = digito(d.slice(0, 12) + primeiro);
  return d.endsWith(`${primeiro}${segundo}`);
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
  if (pedido.cliente.cnpj) {
    linhas.push(`CNPJ: ${pedido.cliente.cnpj}`);
  }
  if (pedido.cliente.telefone) {
    linhas.push(`Telefone: ${pedido.cliente.telefone}`);
  }
  linhas.push("");
  linhas.push("*ITENS*");

  // Código ao lado do nome e quantidade logo abaixo, em destaque, para o
  // atendente lançar direto (o /atendente lê este formato e o antigo).
  pedido.itens.forEach((item, i) => {
    linhas.push(`${i + 1}) *CÓD. ${item.codigo} - ${String(item.descricao).toUpperCase()}*`);
    linhas.push(`   *QTD: ${item.qtd}*`);
    linhas.push(`   Peso: ${item.pesoLabel}`);
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
