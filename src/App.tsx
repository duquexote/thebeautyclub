import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import Blog from "./pages/Blog";
import AdminBlog from "./pages/AdminBlog";
import AdminBlogRegistration from "./pages/AdminBlogRegistration";
import AdminDatabaseFix from "./pages/AdminDatabaseFix";
import RegistroProduto from "./pages/RegistroProduto";
import DetalheProduto from "./pages/DetalheProduto";
import AdminProdutos from "./pages/AdminProdutos";
import EditarProduto from "./pages/EditarProduto";
// import Produtos from "./pages/Produtos"; // Temporariamente removido
import MinhaConta from './pages/MinhaConta';
import AdminLogin from './pages/AdminLogin';
import { setupScrollAnimation } from "./utils/animation";
import { AuthProvider } from "./contexts/AuthContext";

import AdminAuth from "./components/AdminAuth";

// Componente para proteger rotas que exigem autenticação
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <AdminAuth redirectTo="/admin-login">{children}</AdminAuth>;
};

function AppContent() {
  useEffect(() => {
    // Update the document title
    document.title = "The Beauty Club | O maior clube de profissionais da beleza do Brasil";
    
    // Set up scroll animations
    const cleanup = setupScrollAnimation();
    
    return cleanup;
  }, []);

  return (
    <div className="font-sans antialiased">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<Blog />} />
        {/* Rota de produtos removida temporariamente */}
        <Route path="/produtos/:id" element={<DetalheProduto />} />
        <Route path="/minha-conta" element={<MinhaConta />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Rotas protegidas que exigem autenticação */}
        <Route path="/admin/produtos" element={
          <ProtectedRoute>
            <AdminProdutos />
          </ProtectedRoute>
        } />
        <Route path="/admin/registro-produto" element={
          <ProtectedRoute>
            <RegistroProduto />
          </ProtectedRoute>
        } />
        <Route path="/admin/editar-produto/:id" element={
          <ProtectedRoute>
            <EditarProduto />
          </ProtectedRoute>
        } />
        <Route path="/admin/blog" element={
          <ProtectedRoute>
            <AdminBlog />
          </ProtectedRoute>
        } />
        <Route path="/admin/blog/novo" element={
          <ProtectedRoute>
            <AdminBlogRegistration />
          </ProtectedRoute>
        } />
        <Route path="/admin/database-fix" element={
          <ProtectedRoute>
            <AdminDatabaseFix />
          </ProtectedRoute>
        } />
        
        {/* Rotas públicas */}
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;