import { useEffect, useMemo, useState } from "react";
import { carregarCatalogo } from "../utils/catalogo.js";
import { usePagina } from "../hooks/usePagina.js";
import { formatarPreco } from "../utils/pedido.js";
import {
  ehMensagemDoSite,
  lerMensagemDoSite,
  lerTextoLivre,
  montarIndice,
  normalizar,
  sugerir,
  textoParaFlutt,
} from "../utils/lancador.js";
import "./atendente.css";

const CHAVE = "bourached:atendente";
// Escolhas corrigidas pelo atendente: { "frase normalizada" -> codigo }.
// Ficam neste aparelho e são usadas nas próximas leituras.
const CHAVE_APRENDIDO = "bourached:atendente-aprendido";

function lerAprendido() {
  try {
    return JSON.parse(window.localStorage.getItem(CHAVE_APRENDIDO) || "{}") || {};
  } catch {
    return {};
  }
}

function gravarAprendido(aprendido) {
  try {
    window.localStorage.setItem(CHAVE_APRENDIDO, JSON.stringify(aprendido));
  } catch {
    // sem armazenamento: só não lembra
  }
}

function carregarSalvo() {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

let contador = 0;
const novoId = () => `l${Date.now()}-${contador++}`;

function linhaDeItem(item, extra = {}) {
  return {
    id: novoId(),
    codigo: item.codigo,
    produtoId: item.produtoId,
    descricao: item.descricao,
    pesoLabel: item.pesoLabel,
    precoVenda: item.precoVenda,
    qtd: 1,
    lancado: false,
    ...extra,
  };
}

async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = texto;
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  }
}

function AtendentePage() {
  const salvo = useMemo(() => carregarSalvo(), []);
  const [texto, setTexto] = useState(salvo?.texto || "");
  const [linhas, setLinhas] = useState(salvo?.linhas || []);
  const [cabecalho, setCabecalho] = useState(salvo?.cabecalho || null);
  const [indice, setIndice] = useState([]);
  const [erroCatalogo, setErroCatalogo] = useState("");
  const [busca, setBusca] = useState("");
  const [aviso, setAviso] = useState("");
  const [aprendido, setAprendido] = useState(() => lerAprendido());

  // página interna: não aparece em buscadores
  usePagina({ titulo: "Lançador de pedidos | Bourached", caminho: "/atendente", indexar: false });

  useEffect(() => {
    document.body.classList.add("produtos-page-body");
    return () => document.body.classList.remove("produtos-page-body");
  }, []);

  useEffect(() => {
    carregarCatalogo()
      .then((mapa) => setIndice(montarIndice(mapa)))
      .catch(() => setErroCatalogo("Não foi possível carregar a lista de produtos."));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify({ texto, linhas, cabecalho }));
    } catch {
      // sem armazenamento: segue funcionando
    }
  }, [texto, linhas, cabecalho]);

  const porCodigo = useMemo(() => {
    const m = new Map();
    indice.forEach((i) => {
      if (!m.has(i.codigo)) m.set(i.codigo, []);
      m.get(i.codigo).push(i);
    });
    return m;
  }, [indice]);

  function mostrarAviso(msg) {
    setAviso(msg);
    window.setTimeout(() => setAviso(""), 2500);
  }

  function lerPedido() {
    if (!texto.trim() || indice.length === 0) return;

    if (ehMensagemDoSite(texto)) {
      const { cabecalho: cab, itens } = lerMensagemDoSite(texto);
      const novas = itens.map((it) => {
        const candidatos = porCodigo.get(it.codigo) || [];
        if (candidatos.length === 0) {
          return {
            id: novoId(),
            codigo: it.codigo,
            produtoId: "",
            descricao: it.descricao,
            pesoLabel: it.pesoLabel,
            precoVenda: 0,
            qtd: it.qtd,
            lancado: false,
            confianca: "baixa",
            nota: "Código não encontrado na lista atual",
            original: it.descricao,
            sugestoes: [],
          };
        }
        const alvo = normalizar(it.descricao);
        const achado =
          candidatos.find((c) => normalizar(c.descricao) === alvo) || candidatos[0];
        const repetido = candidatos.length > 1 && !candidatos.some((c) => normalizar(c.descricao) === alvo);
        return {
          ...linhaDeItem(achado, { qtd: it.qtd }),
          confianca: repetido ? "revisar" : "alta",
          nota: repetido ? "Código usado em mais de um produto — confira" : "",
          original: it.descricao,
          sugestoes: [],
        };
      });
      setCabecalho(cab);
      setLinhas(novas);
      return;
    }

    const lidas = lerTextoLivre(texto, indice, aprendido);
    setCabecalho(null);
    setLinhas(
      lidas.map((l) => ({
        ...(l.escolhida
          ? linhaDeItem(l.escolhida, { qtd: l.qtd })
          : {
              id: novoId(),
              codigo: "",
              produtoId: "",
              descricao: "(não identificado)",
              pesoLabel: "",
              precoVenda: 0,
              qtd: l.qtd,
              lancado: false,
            }),
        confianca: l.confianca,
        nota: l.nota,
        chave: l.chave,
        original: l.original,
        sugestoes: l.sugestoes.map((s) => ({
          chave: `${s.item.produtoId}|${s.item.codigo}`,
          item: s.item,
        })),
      })),
    );
  }

  function atualizar(id, mudanca) {
    setLinhas((ls) => ls.map((l) => (l.id === id ? { ...l, ...mudanca } : l)));
  }

  function trocarSugestao(id, chave) {
    const linha = linhas.find((l) => l.id === id);
    const alvo = linha?.sugestoes.find((s) => s.chave === chave);
    if (!alvo) return;
    // lembra a correção para a próxima vez que a mesma frase aparecer
    if (linha.chave) {
      const novo = { ...aprendido, [linha.chave]: alvo.item.codigo };
      setAprendido(novo);
      gravarAprendido(novo);
    }
    atualizar(id, {
      codigo: alvo.item.codigo,
      produtoId: alvo.item.produtoId,
      descricao: alvo.item.descricao,
      pesoLabel: alvo.item.pesoLabel,
      precoVenda: alvo.item.precoVenda,
      confianca: "alta",
      nota: linha.chave ? "Escolha lembrada para as próximas vezes" : "",
    });
  }

  function esquecerEscolhas() {
    if (!window.confirm("Apagar as escolhas que o leitor aprendeu neste aparelho?")) return;
    setAprendido({});
    gravarAprendido({});
    mostrarAviso("Escolhas apagadas");
  }

  function remover(id) {
    setLinhas((ls) => ls.filter((l) => l.id !== id));
  }

  function adicionarItem(item) {
    setLinhas((ls) => [
      ...ls,
      { ...linhaDeItem(item), confianca: "alta", nota: "", original: "(adicionado)", sugestoes: [] },
    ]);
    setBusca("");
  }

  async function copiarFlutt() {
    const txt = textoParaFlutt(linhas.filter((l) => !l.lancado));
    if (!txt) return mostrarAviso("Nada para copiar.");
    mostrarAviso((await copiar(txt)) ? "Copiado: código ⇥ quantidade" : "Não consegui copiar.");
  }

  async function copiarResumo() {
    const txt = linhas
      .map((l) => `${l.codigo}  ${l.descricao}  ${l.pesoLabel}  x${l.qtd}`)
      .join("\n");
    mostrarAviso((await copiar(txt)) ? "Resumo copiado" : "Não consegui copiar.");
  }

  function limpar() {
    setTexto("");
    setLinhas([]);
    setCabecalho(null);
  }

  const resultadosBusca = useMemo(
    () => (busca.trim().length >= 3 ? sugerir(busca, indice, 6) : []),
    [busca, indice],
  );
  const lancados = linhas.filter((l) => l.lancado).length;
  const revisar = linhas.filter((l) => !l.lancado && l.confianca && l.confianca !== "alta").length;
  const total = linhas.reduce((s, l) => s + Number(l.precoVenda || 0) * l.qtd, 0);

  return (
    <section className="atendente">
      <div className="atendente-conteudo">
        <h1>Lançador de pedidos</h1>
        <p className="atendente-nota">
          Cole o pedido do WhatsApp (da loja virtual ou escrito pelo cliente). A tela
          separa código e quantidade para você lançar no Flutt.
        </p>

        {erroCatalogo && <p className="carrinho-erro">{erroCatalogo}</p>}

        <textarea
          className="atendente-texto"
          rows={7}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={"Cole aqui a mensagem do cliente.\nEx.: 3 cx bala jujuba 10kg\n2 pc bala de goma 5kg"}
        />
        <div className="atendente-botoes">
          <button type="button" className="btn-finalizar" onClick={lerPedido} disabled={indice.length === 0}>
            Ler pedido
          </button>
          <button type="button" className="carrinho-link claro" onClick={limpar}>
            Limpar tudo
          </button>
          {Object.keys(aprendido).length > 0 && (
            <button type="button" className="carrinho-link claro" onClick={esquecerEscolhas}>
              Esquecer {Object.keys(aprendido).length} escolha(s) aprendida(s)
            </button>
          )}
        </div>

        {cabecalho && (
          <div className="atendente-cab">
            <strong>Pedido #{cabecalho.numero}</strong>
            <span>Cliente: {cabecalho.cliente}</span>
            {cabecalho.cnpj && <span>CNPJ: {cabecalho.cnpj}</span>}
            {cabecalho.telefone && <span>Tel.: {cabecalho.telefone}</span>}
            {cabecalho.obs && <span>Obs.: {cabecalho.obs}</span>}
          </div>
        )}

        {linhas.length > 0 && (
          <>
            <div className="atendente-resumo">
              <span>
                <strong>{lancados}</strong> de {linhas.length} lançados
              </span>
              {revisar > 0 && <span className="aviso-revisar">⚠ {revisar} para conferir</span>}
              <span>Total aprox.: <strong>{formatarPreco(total)}</strong></span>
            </div>

            <ul className="atendente-lista">
              {linhas.map((l) => (
                <li
                  key={l.id}
                  className={`atendente-linha ${l.lancado ? "feito" : ""} conf-${l.confianca || "alta"}`}
                >
                  <label className="atendente-check">
                    <input
                      type="checkbox"
                      checked={l.lancado}
                      onChange={(e) => atualizar(l.id, { lancado: e.target.checked })}
                    />
                    <span>lançado</span>
                  </label>

                  <div className="atendente-info">
                    <div className="atendente-codigo">{l.codigo || "—"}</div>
                    <div>
                      <strong>{l.descricao}</strong>
                      <small>{l.pesoLabel}</small>
                      {l.original && l.original !== l.descricao && (
                        <small className="original">cliente escreveu: “{l.original}”</small>
                      )}
                      {l.nota && <small className="nota">⚠ {l.nota}</small>}
                    </div>
                  </div>

                  {l.sugestoes?.length > 1 && (
                    <select
                      className="atendente-select"
                      value={`${l.produtoId}|${l.codigo}`}
                      onChange={(e) => trocarSugestao(l.id, e.target.value)}
                      aria-label="Trocar produto"
                    >
                      {l.sugestoes.map((s) => (
                        <option key={s.chave} value={s.chave}>
                          {s.item.codigo} · {s.item.descricao} · {s.item.pesoLabel}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="atendente-qtd">
                    <div className="qtd-controle" role="group" aria-label="Quantidade">
                      <button type="button" onClick={() => atualizar(l.id, { qtd: Math.max(1, l.qtd - 1) })} aria-label="Diminuir">−</button>
                      <span>{l.qtd}</span>
                      <button type="button" onClick={() => atualizar(l.id, { qtd: Math.min(999, l.qtd + 1) })} aria-label="Aumentar">+</button>
                    </div>
                    <button type="button" className="carrinho-remover" onClick={() => remover(l.id)}>
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="atendente-busca">
              <label>
                Adicionar item que ficou de fora
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Digite o nome ou o peso (ex.: castanha 11kg)"
                />
              </label>
              {resultadosBusca.length > 0 && (
                <ul className="atendente-resultados">
                  {resultadosBusca.map(({ item }) => (
                    <li key={`${item.produtoId}|${item.codigo}`}>
                      <button type="button" onClick={() => adicionarItem(item)}>
                        <b>{item.codigo}</b> {item.descricao} <small>{item.pesoLabel}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="atendente-acoes">
              <button type="button" className="btn-finalizar" onClick={copiarFlutt}>
                Copiar código ⇥ quantidade
              </button>
              <button type="button" className="carrinho-link claro" onClick={copiarResumo}>
                Copiar resumo
              </button>
            </div>
          </>
        )}

        {aviso && <div className="atendente-toast" role="status">{aviso}</div>}
      </div>
    </section>
  );
}

export default AtendentePage;
