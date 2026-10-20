import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext.jsx";
import { clienteStorage, pedidosStorage } from "../storage/pedidosStorage.js";
import {
  abrirWhatsApp,
  formatarPreco,
  gerarNumeroPedido,
  montarMensagemWhatsApp,
  totalDoPedido,
} from "../utils/pedido.js";

function CarrinhoDrawer() {
  const { itens, total, aberto, fecharCarrinho, definirQtd, remover, limpar } =
    useCarrinho();
  const [cliente, setCliente] = useState(() => clienteStorage.ler());
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(null);

  useEffect(() => {
    if (!aberto) return;
    function aoApertarTecla(e) {
      if (e.key === "Escape") fecharCarrinho();
    }
    document.addEventListener("keydown", aoApertarTecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoApertarTecla);
      document.body.style.overflow = "";
    };
  }, [aberto, fecharCarrinho]);

  function fechar() {
    setEnviado(null);
    setErro("");
    fecharCarrinho();
  }

  function finalizar(e) {
    e.preventDefault();
    const nome = cliente.nome.trim();
    if (!nome) {
      setErro("Informe seu nome para finalizar o pedido.");
      return;
    }
    if (itens.length === 0) return;

    const clienteLimpo = { nome, telefone: cliente.telefone.trim() };
    const pedido = {
      numero: gerarNumeroPedido(),
      criadoEm: new Date().toISOString(),
      cliente: clienteLimpo,
      observacao: observacao.trim(),
      itens: itens.map((i) => ({ ...i })),
      total: totalDoPedido(itens),
    };

    clienteStorage.gravar(clienteLimpo);
    pedidosStorage.salvar(pedido);
    abrirWhatsApp(montarMensagemWhatsApp(pedido));

    setEnviado(pedido);
    setObservacao("");
    setErro("");
    limpar();
  }

  if (!aberto) return null;

  return (
    <div className="carrinho-overlay" onClick={fechar}>
      <aside
        className="carrinho-painel"
        role="dialog"
        aria-modal="true"
        aria-label="Meu pedido"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="carrinho-topo">
          <h2>{enviado ? "Pedido enviado" : "Meu pedido"}</h2>
          <button
            type="button"
            className="carrinho-fechar"
            onClick={fechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        {enviado ? (
          <div className="carrinho-sucesso">
            <p className="carrinho-sucesso-titulo">
              ✅ Pedido <strong>#{enviado.numero}</strong> montado!
            </p>
            <p>
              O WhatsApp foi aberto com o seu pedido. Basta tocar em{" "}
              <strong>enviar</strong> na conversa para o nosso atendente
              receber.
            </p>
            <button
              type="button"
              className="btn-finalizar"
              onClick={() => abrirWhatsApp(montarMensagemWhatsApp(enviado))}
            >
              Abrir o WhatsApp novamente
            </button>
            <Link to="/meus-pedidos" className="carrinho-link" onClick={fechar}>
              Ver meus pedidos
            </Link>
            <button type="button" className="carrinho-link" onClick={fechar}>
              Continuar comprando
            </button>
          </div>
        ) : itens.length === 0 ? (
          <div className="carrinho-vazio">
            <p>Seu pedido está vazio.</p>
            <p>Toque em “+ Adicionar” nos produtos para montar seu pedido.</p>
            <Link to="/meus-pedidos" className="carrinho-link" onClick={fechar}>
              Ver meus pedidos anteriores
            </Link>
          </div>
        ) : (
          <form className="carrinho-corpo" onSubmit={finalizar}>
            <ul className="carrinho-lista">
              {itens.map((item) => (
                <li key={item.key} className="carrinho-item">
                  <div className="carrinho-item-info">
                    <strong>{item.descricao}</strong>
                    <span>{item.pesoLabel}</span>
                    <span className="carrinho-item-preco">
                      ~{formatarPreco(item.precoVenda * item.qtd)}
                    </span>
                  </div>
                  <div className="carrinho-item-acoes">
                    <div className="qtd-controle" role="group" aria-label="Quantidade">
                      <button
                        type="button"
                        onClick={() => definirQtd(item.key, item.qtd - 1)}
                        aria-label="Diminuir quantidade"
                      >
                        −
                      </button>
                      <span>{item.qtd}</span>
                      <button
                        type="button"
                        onClick={() => definirQtd(item.key, item.qtd + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="carrinho-remover"
                      onClick={() => remover(item.key)}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="carrinho-campos">
              <label>
                Seu nome *
                <input
                  type="text"
                  value={cliente.nome}
                  onChange={(e) =>
                    setCliente({ ...cliente, nome: e.target.value })
                  }
                  autoComplete="name"
                  placeholder="Ex.: Maria da Silva"
                />
              </label>
              <label>
                Telefone / WhatsApp
                <input
                  type="tel"
                  value={cliente.telefone}
                  onChange={(e) =>
                    setCliente({ ...cliente, telefone: e.target.value })
                  }
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                />
              </label>
              <label>
                Observações
                <textarea
                  rows={2}
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex.: retirar na loja, entregar até sexta..."
                />
              </label>
            </div>

            <footer className="carrinho-rodape">
              <div className="carrinho-total">
                <span>Total aproximado</span>
                <strong>{formatarPreco(total)}</strong>
              </div>
              <p className="carrinho-aviso">
                Valores aproximados, sujeitos a confirmação pelo atendente.
              </p>
              {erro && (
                <p className="carrinho-erro" role="alert">
                  {erro}
                </p>
              )}
              <button type="submit" className="btn-finalizar">
                Finalizar pelo WhatsApp
              </button>
              <div className="carrinho-links">
                <Link to="/meus-pedidos" className="carrinho-link" onClick={fechar}>
                  Meus pedidos
                </Link>
                <button type="button" className="carrinho-link" onClick={limpar}>
                  Esvaziar
                </button>
              </div>
            </footer>
          </form>
        )}
      </aside>
    </div>
  );
}

export default CarrinhoDrawer;
