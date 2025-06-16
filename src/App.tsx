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
  const { isAuthenticated, loading, user, session } = useAuth();
  const location = useLocation();
  
  // Log para diagnóstico
  console.log('ProtectedRoute - Estado de autenticação:', { 
    isAuthenticated, 
    loading, 
    hasUser: !!user,
    hasSession: !!session,
    path: location.pathname 
  });
  
  // Verificar se há uma sessão no localStorage (mesmo que não esteja no contexto ainda)
  const checkLocalStorageSession = () => {
    try {
      // Verificar formato personalizado
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (storedSession) return true;
      
      // Verificar formato do Supabase
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.split('//')[1];
      if (supabaseUrl) {
        const sbSession = localStorage.getItem(`sb-${supabaseUrl}-auth-token`);
        if (sbSession) return true;
      }
    } catch (e) {
      console.error('Erro ao verificar sessão no localStorage:', e);
    }
    return false;
  };
  
  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  
  // Verificar autenticação de todas as formas possíveis
  const hasLocalSession = checkLocalStorageSession();
  
  // Verificar manualmente se há um token válido no localStorage (formato Supabase)
  const checkSupabaseToken = () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.split('//')[1];
      if (supabaseUrl) {
        const key = `sb-${supabaseUrl}-auth-token`;
        const storedData = localStorage.getItem(key);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData && parsedData.user) {
            return true;
          }
        }
      }
    } catch (e) {
      console.error('Erro ao verificar token do Supabase:', e);
    }
    return false;
  };
  
  const hasSupabaseToken = checkSupabaseToken();
  const isUserAuthenticated = isAuthenticated || !!user || !!session || hasLocalSession || hasSupabaseToken;
  
  console.log('Status final de autenticação:', { 
    isUserAuthenticated, 
    hasLocalSession,
    hasSupabaseToken
  });
  
  // Redireciona para login se não estiver autenticado
  if (!isUserAuthenticated) {
    console.log('Redirecionando para login - Usuário não autenticado');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Renderiza o conteúdo se estiver autenticado
  console.log('Usuário autenticado - Renderizando conteúdo protegido');
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