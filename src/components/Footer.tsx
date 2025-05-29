import React from "react";
import { Mail, Instagram, Facebook, Smartphone, MapPin, Lock } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-pink-400" /> The Beauty Club Brasil
            </h3>
            <p className="text-gray-400 mb-6">
              O maior clube de profissionais da beleza do Brasil, conectando mais de 5.000 profissionais com as melhores marcas e oportunidades.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Página Inicial</a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-pink-400 transition-colors">Nossa História</a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-400 hover:text-pink-400 transition-colors">Benefícios</a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-pink-400 transition-colors">Depoimentos</a>
              </li>
              <li>
                <a href="#join" className="text-gray-400 hover:text-pink-400 transition-colors">Seja Sócia</a>
              </li>
              <li>
                <a href="#partners" className="text-gray-400 hover:text-pink-400 transition-colors">Parcerias</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-pink-400 mt-0.5" />
                <a href="mailto:contato@thebeautyclub.com.br" className="text-gray-400 hover:text-pink-400 transition-colors">
                  contato@thebeautyclub.com.br
                </a>
              </li>
              <li className="flex items-start">
                <Smartphone className="mr-2 h-5 w-5 text-pink-400 mt-0.5" />
                <a href="tel:+5511999999999" className="text-gray-400 hover:text-pink-400 transition-colors">
                  (11) 99999-9999
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Redes Sociais</h3>
            <div className="flex gap-4 mb-6">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                aria-label="WhatsApp"
              >
                <Smartphone className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Siga-nos para ficar por dentro das novidades, promoções exclusivas e dicas para profissionais.
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2025 The Beauty Club. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-pink-400 text-sm flex items-center transition-colors">
              <Lock className="mr-1 h-4 w-4" /> Política de privacidade
            </a>
            <a href="#" className="text-gray-500 hover:text-pink-400 text-sm flex items-center transition-colors">
              <Lock className="mr-1 h-4 w-4" /> Termos de uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;