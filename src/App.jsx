import Navbar from "./components/Navbar.jsx";
import ListaDeProdutos from "./components/ListaDeProdutos.jsx";
import SetasCategorias from "./components/SetasCategorias.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import Footer from "./components/Footer.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoriaPage from "./pages/CategoriaPage.jsx";
import BuscaPage from "./pages/BuscaPage.jsx";
import MeusPedidosPage from "./pages/MeusPedidosPage.jsx";
import AtendentePage from "./pages/AtendentePage.jsx";
import { CarrinhoProvider } from "./context/CarrinhoContext.jsx";
import BotaoCarrinho from "./components/BotaoCarrinho.jsx";
import CarrinhoDrawer from "./components/CarrinhoDrawer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import "./mobile.css";

function App() {
  return (
    <CarrinhoProvider>
    <Router>
      <div>
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <ListaDeProdutos />
                  <SetasCategorias atual={null} />
                </div>
              }
            />
            <Route path="/busca" element={<BuscaPage />} />
            <Route path="/meus-pedidos" element={<MeusPedidosPage />} />
            <Route path="/atendente" element={<AtendentePage />} />
            <Route path="/:slug" element={<CategoriaPage />} />
          </Routes>
        </main>
        <Footer />
        <BotaoCarrinho />
        <WhatsAppButton />
        <CarrinhoDrawer />
      </div>
    </Router>
    </CarrinhoProvider>
  );
}

export default App;
