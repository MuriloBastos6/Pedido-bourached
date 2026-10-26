import { useEffect, useState } from "react";
import { carregarDados } from "../utils/catalogo.js";

// Dados do produtos.json para os componentes: { dados, carregando, erro }
export function useDados() {
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: "" });

  useEffect(() => {
    let cancelado = false;
    carregarDados()
      .then((dados) => {
        if (!cancelado) setEstado({ dados, carregando: false, erro: "" });
      })
      .catch(() => {
        if (!cancelado) {
          setEstado({
            dados: null,
            carregando: false,
            erro: "Não foi possível carregar os produtos.",
          });
        }
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return estado;
}
