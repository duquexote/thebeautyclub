import React, { useEffect, useRef } from "react";
import { Calendar, Users, ShoppingBag } from "lucide-react";

const Story: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    animatedElements?.forEach((el) => observer.observe(el));

    return () => {
      animatedElements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-white" ref={sectionRef}>
      <div className="container-custom">
        <h2 className="section-title text-center animate-on-scroll translate-y-4">
          O que é a The Beauty Club?
        </h2>
        <p className="section-title text-center animate-on-scroll translate-y-4">
        A história que começou com um “não” e transformou um grupo de 5 em mais de 5 mil.
          </p>
        <div className="mt-16 relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-200 to-purple-300 rounded-full"></div>
          
          {/* Timeline events */}
          <div className="grid grid-cols-1 gap-16">
            {/* First Event */}
            <div className="relative flex flex-col md:flex-row items-center">
              <div className="md:flex-1 w-full md:pr-16 text-center md:text-right order-2 md:order-1 mt-12 md:mt-0">
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
                  <div className="flex items-center justify-center md:justify-end mb-4 text-purple-600">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span className="font-medium">Novembro 2024</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">O início de tudo</h3>
                  <p className="text-gray-700">
                  Um pequeno grupo de profissionais, tentou negociar uma compra direto de uma fábrica 
                    A resposta? <span className="font-semibold">Não</span>. Só vendiam para distribuidores e atacado. Isso deu início ao nosso à nossa história.
                  </p>
                </div>
              </div>
              <div className="absolute md:relative left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 order-1">
                <span className="text-2xl font-bold text-purple-600">5</span>
              </div>
              <div className="md:flex-1 md:pl-16 hidden md:block order-2"></div>
            </div>
            
            {/* Second Event */}
            <div className="relative flex flex-col md:flex-row items-center">
              <div className="md:flex-1 md:pr-16 hidden md:block order-1"></div>
              <div className="absolute md:relative left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0 w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 order-1 md:order-2">
                <span className="text-2xl font-bold text-pink-600">20</span>
              </div>
              <div className="md:flex-1 w-full md:pl-16 text-center md:text-left order-2 md:order-3 mt-12 md:mt-0">
                <div className="bg-pink-50 p-6 rounded-xl border border-pink-100 shadow-sm">
                  <div className="flex items-center justify-center md:justify-start mb-4 text-pink-600">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span className="font-medium">Uma semana depois</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Crescimento rápido</h3>
                  <p className="text-gray-700">
                    Em apenas uma semana, o grupo passou de 5 para 20 pessoas. 
                    A voz começou a se espalhar e mais profissionais se interessaram pela iniciativa. Começaram a surgir as primeiras oportunidades.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Third Event */}
            <div className="relative flex flex-col md:flex-row items-center">
              <div className="md:flex-1 w-full md:pr-16 text-center md:text-right order-2 md:order-1 mt-12 md:mt-0">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
                  <div className="flex items-center justify-center md:justify-end mb-4 text-purple-600">
                    <Users className="mr-2 h-5 w-5" />
                    <span className="font-medium">Hoje</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Um movimento nacional</h3>
                  <p className="text-gray-700">
                    Hoje, somos mais de 5.000 cabeleireiras, manicures e esteticistas conectadas pelo mesmo propósito: 
                    Ter a nossa importância reconhecida e receber os benefícios que merecemos. O The Beauty Club não é só um grupo — é um movimento.
                  </p>
                </div>
              </div>
              <div className="absolute md:relative left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0 -top-14 md:top-auto w-28 h-28 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 order-1">
                <span className="text-2xl font-bold text-white">5.000+</span>
              </div>
              <div className="md:flex-1 md:pl-16 hidden md:block order-2"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center animate-on-scroll translate-y-4">
          <a href="#join" className="btn btn-primary text-lg inline-flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" /> 
            Quero ser sócia do The Beauty Club
          </a>
        </div>
      </div>
    </section>
  );
};

export default Story;