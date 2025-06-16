import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabaseClient";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Usar o contexto de autenticação
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Buscar o nome do usuário quando ele estiver autenticado
  useEffect(() => {
    const fetchUserName = async () => {
      if (user?.id) {
        try {
          // Primeiro, verificar se temos o nome do usuário no localStorage
          const cachedUserName = localStorage.getItem(`user_name_${user.id}`);
          if (cachedUserName) {
            setUserName(cachedUserName);
            return;
          }
          
          // Verificar se o login foi feito via API - neste caso, não tentamos buscar do Supabase
          const isAuthViaApi = localStorage.getItem('auth_via_api') === 'true';
          
          if (isAuthViaApi && user.email) {
            console.log('Login via API detectado, usando email como nome de usuário');
            const emailName = user.email.split('@')[0];
            setUserName(emailName);
            localStorage.setItem(`user_name_${user.id}`, emailName);
            return;
          }
          
          // Se não foi login via API, tentar buscar do Supabase
          const { data: sociaData, error } = await supabase
            .from('socias')
            .select('nome')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            // Usar o email como fallback se não conseguir buscar o nome
            if (user.email) {
              const emailName = user.email.split('@')[0];
              setUserName(emailName);
              // Armazenar no localStorage para uso futuro
              localStorage.setItem(`user_name_${user.id}`, emailName);
            }
            return;
          }
          
          if (sociaData?.nome) {
            // Extrair o primeiro nome
            const primeiroNome = sociaData.nome.split(' ')[0];
            setUserName(primeiroNome);
            // Armazenar no localStorage para uso futuro
            localStorage.setItem(`user_name_${user.id}`, primeiroNome);
          } else if (user.email) {
            // Fallback para o email se não tiver nome
            const emailName = user.email.split('@')[0];
            setUserName(emailName);
            localStorage.setItem(`user_name_${user.id}`, emailName);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          // Usar o email como fallback
          if (user.email) {
            const emailName = user.email.split('@')[0];
            setUserName(emailName);
          }
        }
      } else {
        setUserName('');
      }
    };

    fetchUserName();
  }, [user]);
  
  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Verificar se estamos na página inicial ou em outras páginas
  const isHomePage = location.pathname === '/';
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage
          ? "bg-white shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <img 
            src="../images/logo-tbc.svg" 
            alt="The Beauty Club Logo" 
            className={`h-10 ${scrolled || !isHomePage ? 'filter-none' : 'brightness-0 invert'}`} 
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {isHomePage ? (
            <>
              <a href="#about" className={`${scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'}`}>
                Nossa História
              </a>
              <a href="#benefits" className={`${scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'}`}>
                Benefícios
              </a>
              <a href="#testimonials" className={`${scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white/90 hover:text-white'}`}>
                Depoimentos
              </a>
            </>
          ) : null}
          <Link to="/blog" className={`${scrolled || !isHomePage ? 'text-gray-700 hover:text-pink-600' : 'text-white/90 hover:text-white'}`}>
            Blog
          </Link>
          <Link to="/classificados" className={`${scrolled || !isHomePage ? 'text-gray-700 hover:text-pink-600' : 'text-white/90 hover:text-white'}`}>
            Classificados
          </Link>
          <Link to="/produtos" className={`${scrolled || !isHomePage ? 'text-gray-700 hover:text-pink-600' : 'text-white/90 hover:text-white'}`}>
            Produtos
          </Link>
          
          {user ? (
            <>
              <div className="flex items-center gap-2 cursor-pointer group relative">
                <User size={18} className={`${scrolled || !isHomePage ? 'text-gray-700 group-hover:text-pink-600' : 'text-white/90 group-hover:text-white'}`} />
                <span className={`${scrolled || !isHomePage ? 'text-gray-700 group-hover:text-pink-600' : 'text-white/90 group-hover:text-white'}`}>
                  {userName || 'Usuário'}
                </span>
                
                {/* Menu dropdown */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  <Link to="/minha-conta" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Minha Conta
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`${scrolled || !isHomePage ? 'text-gray-700 hover:text-pink-600' : 'text-white/90 hover:text-white'}`}>
                Login
              </Link>
              <Link to="/cadastro" className="btn btn-primary">
                Quero ser sócia
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className={`md:hidden ${scrolled || !isHomePage ? 'text-gray-700' : 'text-white'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-4 absolute top-full left-0 right-0">
          <div className="flex flex-col gap-4">
            {location.pathname === '/' && (
              <>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-pink-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Nossa História
                </a>
                <a
                  href="#benefits"
                  className="text-gray-700 hover:text-pink-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Benefícios
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-pink-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Depoimentos
                </a>
              </>
            )}
            <Link
              to="/blog"
              className="text-gray-700 hover:text-pink-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/classificados"
              className="text-gray-700 hover:text-pink-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Classificados
            </Link>
            <Link
              to="/produtos"
              className="text-gray-700 hover:text-pink-600 py-2"
              onClick={() => setIsOpen(false)}
            >
              Produtos
            </Link>
            
            {user ? (
              <>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="flex items-center gap-2 py-2">
                    <User size={18} className="text-gray-700" />
                    <span className="text-gray-700 font-medium">
                      {userName || 'Usuário'}
                    </span>
                  </div>
                  <Link
                    to="/minha-conta"
                    className="text-gray-700 hover:text-pink-600 py-2 pl-6 block"
                    onClick={() => setIsOpen(false)}
                  >
                    Minha Conta
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-gray-700 hover:text-pink-600 py-2 pl-6 flex items-center gap-2 w-full text-left"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-pink-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/cadastro"
                  className="bg-pink-600 text-white py-2 px-4 rounded-md text-center hover:bg-pink-700"
                  onClick={() => setIsOpen(false)}
                >
                  Quero ser sócia
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;