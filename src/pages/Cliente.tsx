import React, { useEffect, useRef, useState } from "react";
import { ShoppingBag, CheckCircle, Gift, Percent, Users, ChevronLeft, ChevronRight, Tag, Star, Plus, Minus } from "lucide-react";
import { setupScrollAnimation } from "../utils/animation";
import { testimonials } from "../data/testimonials";

const Cliente: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Set up scroll animations
    const cleanup = setupScrollAnimation();
    
    return cleanup;
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-cover bg-center" 
        style={{ 
          backgroundImage: `url('/images/capa.png')` 
        }}>
        {/* Overlay para garantir a legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-purple-900/80 backdrop-blur-sm"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              <div className="flex justify-center">
                <img 
                  src="/images/logo-tbc.svg" 
                  alt="The Beauty Club" 
                  className="h-16 md:h-20 filter brightness-0 invert opacity-90 drop-shadow-lg" 
                  style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 0.75rem rgba(236, 72, 153, 0.5))' }}
                />
              </div>
            </h1>
            
            <p className="text-xl md:text-2xl text-white mb-6">
              O maior grupo de beleza do Brasil.
            </p>
            
            <p className="text-lg text-white/90 mb-10 max-w-3xl mx-auto">
              Ofertas reais, cupons exclusivos e brindes pra quem ama beleza, moda e cosméticos — tudo em um só lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20entrar%20no%20Beauty%20Club%21" target="_blank" rel="noopener noreferrer" className="btn btn-primary text-lg">
                <ShoppingBag className="mr-2 h-5 w-5" /> 
                QUERO ENTRAR GRÁTIS
              </a>
            </div>
            
            {/* Logos de marcas parceiras */}
            <div className="mt-12">
              <p className="text-white/70 text-sm mb-4">Grandes marcas parceiras</p>
              <div className="bg-white/20 p-6 rounded-lg backdrop-blur-sm w-full max-w-3xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                  <img src="/images/parceira-mercadolivre.webp" alt="Mercado Livre" className="h-12 w-full object-contain" />
                  <img src="/images/parceira-ledebut.jpg" alt="Ledebut" className="h-12 w-full object-contain" />
                  <img src="/images/parceira-bravie.jpg" alt="Bravie" className="h-12 w-full object-contain" />
                  <img src="/images/parceira-kerastase.svg" alt="Kerastase" className="h-12 w-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-pink-300 rounded-full opacity-10 -z-10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-300 rounded-full opacity-10 -z-10 blur-3xl"></div>
      </section>

      {/* Destaques Rápidos */}
      <section className="py-16 bg-white" ref={sectionRef}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 animate-on-scroll translate-y-4">
              Destaques rápidos
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Destaque 1 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4">
              <div className="mb-4 p-3 rounded-full inline-flex bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 group-hover:from-pink-100 group-hover:to-purple-100 transition-all duration-300">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Descontos de até 80% em grandes marcas
              </h3>
            </div>
            
            {/* Destaque 2 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '100ms' }}>
              <div className="mb-4 p-3 rounded-full inline-flex bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 group-hover:from-pink-100 group-hover:to-purple-100 transition-all duration-300">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Cupons exclusivos todo mês
              </h3>
            </div>
            
            {/* Destaque 3 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '200ms' }}>
              <div className="mb-4 p-3 rounded-full inline-flex bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 group-hover:from-pink-100 group-hover:to-purple-100 transition-all duration-300">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Garimpo das melhores ofertas nos marketplaces
              </h3>
            </div>
            
            {/* Destaque 4 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '300ms' }}>
              <div className="mb-4 p-3 rounded-full inline-flex bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 group-hover:from-pink-100 group-hover:to-purple-100 transition-all duration-300">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Brindes e kits surpresa nas campanhas
              </h3>
            </div>
            
            {/* Destaque 5 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '400ms' }}>
              <div className="mb-4 p-3 rounded-full inline-flex bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 group-hover:from-pink-100 group-hover:to-purple-100 transition-all duration-300">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Convites para eventos e ativações
              </h3>
            </div>
          </div>
          
          {/* Selos de desconto */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <div className="bg-pink-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg">
              30% OFF
            </div>
            <div className="bg-pink-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg">
              45% OFF
            </div>
            <div className="bg-pink-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg">
              78% OFF
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20entrar%20no%20Beauty%20Club%21" target="_blank" rel="noopener noreferrer" className="btn btn-primary text-lg inline-flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" /> 
              QUERO ENTRAR GRÁTIS
            </a>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title animate-on-scroll translate-y-4">
              Como funciona
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Passo 1 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <div className="hidden lg:block absolute top-8 left-full w-full border-t-2 border-dashed border-pink-200"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Entre no grupo
              </h3>
              <p className="text-gray-600">
                É 100% gratuito.
              </p>
            </div>
            
            {/* Passo 2 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '100ms' }}>
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
                <div className="hidden lg:block absolute top-8 left-full w-full border-t-2 border-dashed border-pink-200"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Receba as ofertas
              </h3>
              <p className="text-gray-600">
                Curadoria diária direto no seu WhatsApp.
              </p>
            </div>
            
            {/* Passo 3 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '200ms' }}>
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  3
                </div>
                <div className="hidden lg:block absolute top-8 left-full w-full border-t-2 border-dashed border-pink-200"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Aplique o cupom e compre
              </h3>
              <p className="text-gray-600">
                Onde for mais vantajoso (loja parceira, marketplace ou direto da fábrica).
              </p>
            </div>
            
            {/* Passo 4 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '300ms' }}>
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  4
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Ganhe brindes e convites
              </h3>
              <p className="text-gray-600">
                Quando rolar ação especial.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center animate-on-scroll translate-y-4">
            <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20entrar%20no%20Beauty%20Club%21" target="_blank" rel="noopener noreferrer" id="join" className="btn btn-primary text-lg inline-flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" /> 
              ENTRAR GRÁTIS AGORA
            </a>
          </div>
        </div>
      </section>

      {/* Por que entrar? */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title animate-on-scroll translate-y-4">
              Por que entrar?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefício 1 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4">
              <div className="mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-pink-500 mr-2" />
                <h3 className="text-xl font-semibold">
                  Compra direto de diversas fábricas
                </h3>
              </div>
              <p className="text-gray-600">
                Com preço de atacado.
              </p>
            </div>
            
            {/* Benefício 2 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '100ms' }}>
              <div className="mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-pink-500 mr-2" />
                <h3 className="text-xl font-semibold">
                  Preço de oportunidade
                </h3>
              </div>
              <p className="text-gray-600">
                Achamos as quedas de preço e liberamos cupons antes de viralizar.
              </p>
            </div>
            
            {/* Benefício 3 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '200ms' }}>
              <div className="mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-pink-500 mr-2" />
                <h3 className="text-xl font-semibold">
                  Marcas que você já ama
                </h3>
              </div>
              <p className="text-gray-600">
                Nada de cilada, só oferta boa e oficial.
              </p>
            </div>
            
            {/* Benefício 4 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '300ms' }}>
              <div className="mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-pink-500 mr-2" />
                <h3 className="text-xl font-semibold">
                  Foco no que importa
                </h3>
              </div>
              <p className="text-gray-600">
                Cabelo, skin, body, perfumaria, gadgets de beleza e moda.
              </p>
            </div>
            
            {/* Benefício 5 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '400ms' }}>
              <div className="mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-pink-500 mr-2" />
                <h3 className="text-xl font-semibold">
                  Zero mensalidade
                </h3>
              </div>
              <p className="text-gray-600">
                Clube aberto, benefícios reais.
              </p>
            </div>
            
            {/* Benefício 6 */}
            <div className="card hover:border-pink-200 group animate-on-scroll translate-y-4" style={{ transitionDelay: '500ms' }}>
              <div className="mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-pink-500 mr-2" />
                <h3 className="text-xl font-semibold">
                  Sem SPAM
                </h3>
              </div>
              <p className="text-gray-600">
                Conteúdo leve, ofertas objetivas e links confiáveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vitrine do dia (carrossel) */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title animate-on-scroll translate-y-4">
              Vitrine do dia
            </h2>
            <p className="section-subtitle animate-on-scroll translate-y-4">
              Confira as ofertas exclusivas para membros do Beauty Club
            </p>
          </div>
          
          <div className="relative max-w-6xl mx-auto animate-on-scroll translate-y-4">
            <ProductCarousel />
            
            <div className="mt-16 text-center">
              <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20entrar%20no%20Beauty%20Club%21" target="_blank" rel="noopener noreferrer" className="btn btn-primary text-lg inline-flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" /> 
                QUERO ENTRAR GRÁTIS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção PRO para profissionais */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 animate-on-scroll translate-y-4">
              <div className="relative">
                <img 
                  src="/images/estoque.png" 
                  alt="Profissional de beleza com produtos" 
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-pink-500 text-white p-4 rounded-xl shadow-lg">
                  <span className="text-3xl font-bold">PRO</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 animate-on-scroll translate-y-4" style={{ transitionDelay: '100ms' }}>
              <h2 className="section-title text-white mb-6">
                Você é profissional de beleza?
              </h2>
              
              <p className="text-lg text-pink-100 mb-8">
                Acesse condições especiais para profissionais e revendedores. Tenha acesso a:
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-pink-300 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-lg">Preços de atacado com descontos exclusivos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-pink-300 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-lg">Kits profissionais com economia de até 50%</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-pink-300 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-lg">Frete grátis para compras acima de R$300</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-pink-300 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-lg">Suporte dedicado para profissionais</span>
                </li>
              </ul>
              
              <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20ser%20PRO%20no%20Beauty%20Club%21" target="_blank" rel="noopener noreferrer" className="btn btn-light text-lg inline-flex items-center">
                <Users className="mr-2 h-5 w-5" />
                QUERO SER PRO
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Depoimentos */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title animate-on-scroll translate-y-4">
              O que dizem nossos membros
            </h2>
            <p className="section-subtitle animate-on-scroll translate-y-4">
              Histórias reais de quem já economiza com o Beauty Club
            </p>
          </div>
          
          <div className="relative max-w-6xl mx-auto animate-on-scroll translate-y-4">
            <TestimonialsCarousel />
          </div>
        </div>
      </section>

      {/* Seção de Perguntas Frequentes (FAQ) */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title animate-on-scroll translate-y-4">
              Perguntas Frequentes
            </h2>
            <p className="section-subtitle animate-on-scroll translate-y-4">
              Tudo o que você precisa saber sobre o Beauty Club
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto animate-on-scroll translate-y-4">
            <FAQ />
            
            <div className="mt-16 text-center">
              <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20entrar%20no%20Beauty%20Club%21" target="_blank" rel="noopener noreferrer" className="btn btn-primary text-lg inline-flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" /> 
                QUERO ENTRAR AGORA
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Footer removido pois já existe um footer global no App.tsx */}
    </main>
  );
};

// Componente do carrossel de produtos
const ProductCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalProducts = products.length;
  
  const nextProduct = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalProducts);
  };
  
  const prevProduct = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalProducts) % totalProducts);
  };
  
  useEffect(() => {
    const interval = setInterval(nextProduct, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${activeIndex * 100 / 3}%)` }}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="w-full md:w-1/3 flex-shrink-0 px-4"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all duration-300 h-full">
                <div className="relative mb-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-3 left-3 bg-pink-600 text-white font-bold px-3 py-1 rounded-lg shadow-md">
                    {product.discount}% OFF
                  </div>
                  {product.hasCoupon && (
                    <div className="absolute top-3 right-3 bg-purple-600 text-white text-sm px-3 py-1 rounded-lg shadow-md flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      Cupom BeautyClub
                    </div>
                  )}
                  {product.hasGift && (
                    <div className="absolute bottom-3 left-3 bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-lg shadow-md flex items-center">
                      <Gift className="w-4 h-4 mr-1" />
                      Brinde
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {product.name}
                </h3>
                {/* Preços removidos conforme solicitado */}
                <div className="mb-3"></div>
                <a 
                  href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20oferta%20do%20produto%3A%20" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-secondary w-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.127 17.114c-.301.42-.638.79-1.01 1.095-1.854 1.515-4.063 1.803-4.394 1.84-.142.016-.284.025-.428.025-1.199 0-2.367-.327-3.429-.948l-3.911 1.008 1.033-3.766c-.672-1.097-1.026-2.36-1.026-3.661 0-3.89 3.164-7.054 7.054-7.054s7.054 3.164 7.054 7.054c0 1.293-.347 2.55-1.008 3.652l1.01 3.687-3.945-1.018z" />
                  </svg>
                  Ver oferta
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <button 
        onClick={prevProduct}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 z-10"
        aria-label="Previous product"
      >
        <ChevronLeft className="w-6 h-6 text-purple-600" />
      </button>
      
      <button 
        onClick={nextProduct}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 z-10"
        aria-label="Next product"
      >
        <ChevronRight className="w-6 h-6 text-purple-600" />
      </button>
      
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: Math.ceil(totalProducts / 3) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index * 3)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              Math.floor(activeIndex / 3) === index ? "bg-pink-500 w-6" : "bg-gray-300 hover:bg-pink-300"
            }`}
            aria-label={`Go to product group ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};

// Dados de exemplo para os produtos
const products = [
  {
    id: 1,
    name: "Kit Shampoo e Condicionador Profissional 1L",
    imageUrl: "/images/produto1.jpg",
    originalPrice: 189.90,
    discountPrice: 99.90,
    discount: 45,
    hasCoupon: true,
    hasGift: true
  },
  {
    id: 2,
    name: "Sérum Facial Anti-idade com Vitamina C",
    imageUrl: "/images/produto2.jpg",
    originalPrice: 129.90,
    discountPrice: 79.90,
    discount: 30,
    hasCoupon: true,
    hasGift: false
  },
  {
    id: 3,
    name: "Máscara Capilar Hidratação Profunda 500g",
    imageUrl: "/images/produto3.jpg",
    originalPrice: 89.90,
    discountPrice: 59.90,
    discount: 30,
    hasCoupon: false,
    hasGift: false
  },
  {
    id: 4,
    name: "Kit Maquiagem Profissional Completo",
    imageUrl: "/images/produto4.jpg",
    originalPrice: 299.90,
    discountPrice: 149.90,
    discount: 50,
    hasCoupon: true,
    hasGift: true
  },
  {
    id: 5,
    name: "Perfume Importado Feminino 100ml",
    imageUrl: "/images/produto5.jpg",
    originalPrice: 399.90,
    discountPrice: 199.90,
    discount: 50,
    hasCoupon: false,
    hasGift: true
  },
  {
    id: 6,
    name: "Escova Secadora Profissional 1200W",
    imageUrl: "/images/produto6.jpg",
    originalPrice: 249.90,
    discountPrice: 149.90,
    discount: 40,
    hasCoupon: true,
    hasGift: false
  }
];

// Componente do carrossel de depoimentos
const TestimonialsCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalTestimonials = testimonials.length;
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalTestimonials);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalTestimonials) % totalTestimonials);
  };
  
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="w-full flex-shrink-0 px-4"
            >
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-sm border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/3">
                    <div className="relative w-48 h-48 mx-auto">
                      <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-pink-200">
                        <img 
                          src={testimonial.imageUrl} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white p-2 rounded-full shadow-lg">
                        <Star className="h-5 w-5 fill-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 text-center md:text-left">
                    <div className="mb-4">
                      <svg className="h-8 w-8 text-pink-400 mb-4 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-xl font-medium mb-4">"{testimonial.quote}"</p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.position} • {testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <button 
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 z-10"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-6 h-6 text-purple-600" />
      </button>
      
      <button 
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 z-10"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-6 h-6 text-purple-600" />
      </button>
      
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === index ? "bg-pink-500 w-6" : "bg-gray-300 hover:bg-pink-300"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};

// Componente de FAQ com itens colapsáveis
const FAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(0);
  
  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };
  
  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => (
        <div 
          key={index} 
          className={`border rounded-xl overflow-hidden transition-all duration-300 ${openItem === index ? 'border-pink-300 shadow-md' : 'border-gray-200'}`}
        >
          <button 
            className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-pink-50 transition-colors duration-300"
            onClick={() => toggleItem(index)}
            aria-expanded={openItem === index}
            aria-controls={`faq-content-${index}`}
          >
            <h3 className="font-semibold text-lg">{item.question}</h3>
            <span className="text-pink-500">
              {openItem === index ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </span>
          </button>
          
          <div 
            id={`faq-content-${index}`}
            className={`overflow-hidden transition-all duration-300 ${openItem === index ? 'max-h-96' : 'max-h-0'}`}
          >
            <div className="p-5 bg-white border-t border-gray-100">
              <p className="text-gray-600">{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Dados das perguntas frequentes
const faqItems = [
  {
    question: "O que é o Beauty Club?",
    answer: "O Beauty Club é um clube de benefícios para amantes de beleza e profissionais do setor. Oferecemos acesso a preços especiais, cupons exclusivos e ofertas direto das fábricas e marcas parceiras."
  },
  {
    question: "Quanto custa para participar?",
    answer: "O Beauty Club é totalmente gratuito! Não cobramos nenhuma mensalidade ou taxa de adesão. Você só paga pelos produtos que decidir comprar."
  },
  {
    question: "Como funcionam os cupons e descontos?",
    answer: "Negociamos diretamente com as marcas e fábricas para conseguir preços especiais. Os cupons são exclusivos para membros e podem ser utilizados nas lojas parceiras ou diretamente em nosso marketplace."
  },
  {
    question: "Quais marcas fazem parte do clube?",
    answer: "Trabalhamos com diversas marcas nacionais e importadas nos segmentos de cabelo, pele, maquiagem, perfumaria e acessórios. Entre as parceiras estão marcas reconhecidas e também marcas emergentes de alta qualidade."
  },
  {
    question: "Como funciona para profissionais de beleza?",
    answer: "Profissionais de beleza têm acesso a benefícios exclusivos como preços de atacado, kits profissionais com grandes descontos e frete grátis para compras acima de R$300. Basta se cadastrar como profissional e enviar sua documentação."
  },
  {
    question: "Como recebo as ofertas?",
    answer: "As ofertas são enviadas por e-mail, notificações no aplicativo e também ficam disponíveis na sua área de membro no site. Você pode personalizar a frequência e os tipos de ofertas que deseja receber."
  }
];

export default Cliente;
