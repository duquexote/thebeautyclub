import React, { useRef, useEffect } from "react";
import { ShoppingBag, Handshake } from "lucide-react";

const CallToAction: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <div ref={sectionRef}>
      {/* CTA for Beauty Professionals */}
      <section id="join" className="py-20 bg-gradient-to-br from-pink-500 to-purple-600 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll translate-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              📲 É profissional da beleza? Junte-se ao clube que transforma vidas.
            </h2>
            <p className="text-xl mb-10 text-white/90">
              Se você tem CNPJ e certificação, pode entrar agora mesmo — e mudar seu negócio para sempre.
            </p>
            <a 
              href="#" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Quero ser sócia do The Beauty Club
            </a>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full opacity-20 -z-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300 rounded-full opacity-20 -z-10 blur-3xl"></div>
      </section>
      
      {/* CTA for Partnerships */}
      <section id="partners" className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 animate-on-scroll translate-y-4">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="md:w-1/2">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                    🤝 Tem uma marca, curso ou evento?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    O The Beauty Club conecta empresas visionárias a milhares de profissionais da beleza com alto potencial de compra e influência.
                  </p>
                  <p className="text-gray-600 mb-8">
                    Seja um parceiro e coloque sua marca nos holofotes.
                  </p>
                  <a 
                    href="#" 
                    className="btn btn-primary inline-flex items-center"
                  >
                    <Handshake className="mr-2 h-5 w-5" />
                    Quero ser parceiro do The Beauty Club
                  </a>
                </div>
                <div className="md:w-1/2">
                  <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                    <img 
                      src="https://images.pexels.com/photos/7697349/pexels-photo-7697349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Beauty professionals networking" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CallToAction;