import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import Blog from "./pages/Blog";
import DetalheProduto from "./pages/DetalheProduto";
import MinhaConta from './pages/MinhaConta';
import Cliente from './pages/Cliente';
import { setupScrollAnimation } from "./utils/animation";
import { AuthProvider } from "./contexts/AuthContext";


function AppContent() {
  const location = useLocation();
  const isClientePage = location.pathname === '/cliente';
  
  useEffect(() => {
    // Update the document title
    document.title = "The Beauty Club | O maior clube de profissionais da beleza do Brasil";
    
    // Set up scroll animations
    const cleanup = setupScrollAnimation();
    
    return cleanup;
  }, []);

  return (
    <div className="font-sans antialiased">
      {!isClientePage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/produtos/:id" element={<DetalheProduto />} />
        <Route path="/minha-conta" element={<MinhaConta />} />
        <Route path="/cliente" element={<Cliente />} />
      </Routes>
      {!isClientePage && <Footer />}
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