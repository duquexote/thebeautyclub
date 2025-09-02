import React from "react";

const Cliente: React.FC = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            {/* Ícone */}
            <div className="flex justify-center mb-4">
              <img src="/images/beauty-icone.png" alt="Beauty Club" className="w-24 h-24 rounded-full" />
            </div>
            
            {/* Logo/Título */}
            <h1 className="text-4xl font-bold mb-6 text-pink-600">The Beauty Club</h1>
            
            {/* Texto principal */}
            <p className="text-gray-700 mb-6">
              <strong>Entre no Grupo de Promoções no WhatsApp</strong>, das melhores <strong>marcas de Beleza do mundo</strong>.
            </p>
            {/* Botão CTA */}
            <a 
              href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20entrar%20no%20Beauty%20Club%21" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-300 mb-2"
            >
              Clique aqui e entre no grupo. <br></br>(+ 50mil membros)
            </a>
            <p className="text-gray-700 mb-6 mt-6">
              Receba as melhores promoções e descontos. Economize em tudo que for comprar!
            </p>
            
            {/* Destaque 100% grátis */}
            <div className="bg-pink-100 text-pink-800 font-bold px-4 py-2 rounded-full inline-block mb-2">
              100% GRÁTIS
            </div>
            
            {/* Imagens das parceiras */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center justify-center">
                <img src="/images/parceira-brae.webp" alt="Parceira Brae" className="h-16 object-contain" />
              </div>
              <div className="flex items-center justify-center">
                <img src="/images/parceira-kerastase.webp" alt="Parceira Kerastase" className="h-16 object-contain" />
              </div>
              <div className="flex items-center justify-center col-span-2">
                <img src="/images/parceira-ledebut.webp" alt="Parceira Le Debut" className="h-16 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cliente;
