import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Componente para proteger rotas que exigem autenticação
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  
  // Redireciona para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Renderiza o conteúdo se estiver autenticado
  return <>{children}</>;
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
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/:id" element={<DetalheProduto />} />
        
        {/* Rotas protegidas que exigem autenticação */}
        <Route path="/admin/registro-produto" element={
          <ProtectedRoute>
            <RegistroProduto />
          </ProtectedRoute>
        } />
        <Route path="/admin/produtos" element={
          <ProtectedRoute>
            <AdminProdutos />
          </ProtectedRoute>
        } />
        <Route path="/admin/editar-produto/:id" element={
          <ProtectedRoute>
            <EditarProduto />
          </ProtectedRoute>
        } />
        <Route path="/minha-conta" element={
          <ProtectedRoute>
            <MinhaConta />
          </ProtectedRoute>
        } />
        
        {/* Rotas públicas */}
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
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