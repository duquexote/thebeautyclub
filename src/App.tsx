import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import Blog from "./pages/Blog";
import RegistroProduto from "./pages/RegistroProduto";
import DetalheProduto from "./pages/DetalheProduto";
import AdminProdutos from "./pages/AdminProdutos";
import EditarProduto from "./pages/EditarProduto";
import Produtos from "./pages/Produtos";
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import MinhaConta from './pages/MinhaConta';
import { setupScrollAnimation } from "./utils/animation";

function App() {
  useEffect(() => {
    // Update the document title
    document.title = "The Beauty Club | O maior clube de profissionais da beleza do Brasil";
    
    // Set up scroll animations
    const cleanup = setupScrollAnimation();
    
    return cleanup;
  }, []);

  return (
    <Router>
      <div className="font-sans antialiased">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/:id" element={<DetalheProduto />} />
          <Route path="/admin/registro-produto" element={<RegistroProduto />} />
          <Route path="/admin/produtos" element={<AdminProdutos />} />
          <Route path="/admin/editar-produto/:id" element={<EditarProduto />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/minha-conta" element={<MinhaConta />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;