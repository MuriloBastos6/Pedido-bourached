import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext.jsx";
import { pedidosStorage } from "../storage/pedidosStorage.js";
import { acharNoCatalogo, carregarCatalogo } from "../utils/catalogo.js";
import {
  abrirWhatsApp,
  formatarPreco,
  montarMensagemWhatsApp,
} from "../utils/pedido.js";

function formatarData(iso) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MeusPedidosPage() {
  const { adicionar, abrirCarrinho } = useCarrinho();
  const [pedidos, setPedidos] = useState(() => pedidosStorage.listar());
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    document.body.classList.add("produtos-page-body");
    return () => document.body.classList.remove("produtos-page-body");
  }, []);

  async function repetir(pedido) {
    setAviso("");
    try {
      const catalogo = await carregarCatalogo();
      let faltando = 0;
      pedido.itens.forEach((item) => {
        const achado = acharNoCatalogo(catalogo, item);
        if (!achado) {
          faltando += 1;
          return;
        }
        // usa o preço e nome ATUAIS do catálogo, não os do pedido antigo
        adicionar(achado.produto, achado.variacao, item.qtd);
      });
      if (faltando > 0) {
        setAviso(
          faltando === 1
            ? "1 item não está mais disponível na lista e não foi adicionado."
            : `${faltando} itens não estão mais disponíveis na lista e não foram adicionados.`,
        );
      }
      abrirCarrinho();
    } catch {
      setAviso("Não foi possível carregar a lista de produtos agora. Tente novamente.");
    }
  }

  function limparHistorico() {
    if (window.confirm("Apagar todo o histórico de pedidos deste aparelho?")) {
      pedidosStorage.limpar();
      setPedidos([]);
    }
  }

  return (
    <section className="meus-pedidos">
      <div className="meus-pedidos-conteudo">
        <h1 className="meus-pedidos-titulo">Meus pedidos</h1>
        <p className="meus-pedidos-nota">
          Os pedidos ficam salvos neste aparelho. Eles não são apagados ao
          fechar o site.
        </p>
        {aviso && <p className="carrinho-erro">{aviso}</p>}

        {pedidos.length === 0 ? (
          <div className="carrinho-vazio">
            <p>Você ainda não finalizou nenhum pedido por aqui.</p>
            <Link to="/" className="carrinho-link">
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <ul className="pedidos-lista">
              {pedidos.map((pedido) => (
                <li key={pedido.numero} className="pedido-card">
                  <header>
                    <strong>Pedido #{pedido.numero}</strong>
                    <span>{formatarData(pedido.criadoEm)}</span>
                  </header>
                  <ul className="pedido-itens">
                    {pedido.itens.map((item) => (
                      <li key={item.key}>
                        <span>
                          {item.qtd}× {item.descricao}
                        </span>
                        <small>{item.pesoLabel}</small>
                      </li>
                    ))}
                  </ul>
                  <p className="pedido-total">
                    Total aproximado: <strong>{formatarPreco(pedido.total)}</strong>
                  </p>
                  <div className="pedido-acoes">
                    <button
                      type="button"
                      className="btn-finalizar"
                      onClick={() => repetir(pedido)}
                    >
                      Repetir pedido
                    </button>
                    <button
                      type="button"
                      className="carrinho-link"
                      onClick={() => abrirWhatsApp(montarMensagemWhatsApp(pedido))}
                    >
                      Reenviar no WhatsApp
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button type="button" className="carrinho-link" onClick={limparHistorico}>
              Apagar histórico
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default MeusPedidosPage;
