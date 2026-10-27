import { useEffect } from "react";
import { HOME, urlCompleta } from "../seo.js";

function meta(atributo, chave) {
  let el = document.head.querySelector(`meta[${atributo}="${chave}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(atributo, chave);
    document.head.appendChild(el);
  }
  return el;
}

function linkCanonico() {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  return el;
}

// Título, descrição e endereço canônico da página atual (o que o Google lê).
// indexar=false para páginas que não devem aparecer na busca
// (busca interna, meus pedidos, atendente).
export function usePagina({ titulo = HOME.titulo, descricao = HOME.descricao, caminho = "/", indexar = true } = {}) {
  useEffect(() => {
    document.title = titulo;
    meta("name", "description").setAttribute("content", descricao);
    meta("property", "og:title").setAttribute("content", titulo);
    meta("property", "og:description").setAttribute("content", descricao);
    meta("property", "og:url").setAttribute("content", urlCompleta(caminho));
    meta("name", "robots").setAttribute("content", indexar ? "index, follow" : "noindex, follow");
    linkCanonico().setAttribute("href", urlCompleta(caminho));
  }, [titulo, descricao, caminho, indexar]);
}
