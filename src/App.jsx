import Navbar from "./components/Navbar.jsx";
import Main from "./components/Main.jsx";
import Carrosel from "./components/Carrosel.jsx";
import BlocoDados from "./components/BlocoDados.jsx";
import ListaDeProdutos from "./components/ListaDeProdutos.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import Footer from "./components/Footer.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoriaPage from "./pages/CategoriaPage.jsx";
import BuscaPage from "./pages/BuscaPage.jsx";
import MeusPedidosPage from "./pages/MeusPedidosPage.jsx";
import { CarrinhoProvider } from "./context/CarrinhoContext.jsx";
import BotaoCarrinho from "./components/BotaoCarrinho.jsx";
import CarrinhoDrawer from "./components/CarrinhoDrawer.jsx";

function App() {
  return (
    <CarrinhoProvider>
    <Router>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Main />
                  <BlocoDados />
                  <Carrosel />
                  <ListaDeProdutos />
                </div>
              }
            />
            <Route path="/busca" element={<BuscaPage />} />
            <Route path="/meus-pedidos" element={<MeusPedidosPage />} />
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
