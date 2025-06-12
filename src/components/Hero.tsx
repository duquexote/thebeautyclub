import React, { useEffect, useState } from "react";
import { ShoppingBag, Handshake } from "lucide-react";

const Hero: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Função para verificar se é dispositivo móvel
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar inicialmente
    checkIfMobile();
    
    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  return (
    <section className="pt-32 pb-20 relative overflow-hidden bg-cover bg-center" 
      style={{ 
        backgroundImage: `url('${isMobile ? '/images/hero-background-mobile.png' : '/images/hero-background-web.png'}')` 
      }}>
      {/* Overlay para garantir a legibilidade do texto */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-purple-900/80 backdrop-blur-sm"></div>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6 inline-block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-pink-800 backdrop-blur-sm">
              <span className="mr-1">✨</span> 
              100% Gratuito e EXCLUSIVO para profissionais da beleza
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Bem-vindos ao <br></br><span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-200">The Beauty Club</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-6">
            O maior clube de profissionais da beleza do Brasil
          </p>
          
          <p className="text-lg text-white/90 mb-10 max-w-3xl mx-auto">
            Somos mais de 5.000 cabelereiros, manicures, esteticistas e outros profissionais da área, com acesso direto às fábricas de cosméticos, a cursos e aos maiores eventos do Brasil.
          </p>
          <div className="mb-6 mr-2 inline-block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-pink-800 backdrop-blur-sm">
              <span className="mr-1">✨</span> 
              Produtos Grátis
            </span>
          </div>
          <div className="mb-6 mr-2 inline-block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-pink-800 backdrop-blur-sm">
              <span className="mr-1">✨</span> 
              Descontos
            </span>
          </div>
          <div className="mb-6 mr-2 inline-block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-pink-800 backdrop-blur-sm">
              <span className="mr-1">✨</span> 
              Brindes
            </span>
          </div>
          <div className="mb-6 inline-block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-pink-800 backdrop-blur-sm">
              <span className="mr-1">✨</span> 
              Benefícios
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#join" className="btn btn-primary text-lg">
              <ShoppingBag className="mr-2 h-5 w-5" /> 
              Quero ser sócia do The Beauty Club
            </a>
            <a href="#partners" className="btn btn-secondary">
              <Handshake className="mr-2 h-5 w-5" /> 
              Sou empresa e quero ser parceira
            </a>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-pink-300 rounded-full opacity-10 -z-10 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-300 rounded-full opacity-10 -z-10 blur-3xl"></div>
    </section>
  );
};

export default Hero;