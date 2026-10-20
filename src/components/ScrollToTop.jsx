import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Ao trocar de página (ex.: pelas setas no fim da lista), volta ao topo.
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

export default ScrollToTop;
