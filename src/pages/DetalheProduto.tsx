import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Produto } from '../types/Produto';

export default function DetalheProduto() {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('ID do produto não fornecido');
        }

        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProduto(data);
          setSelectedImage(data.imagem);
        } else {
          throw new Error('Produto não encontrado');
        }
      } catch (error: any) {
        console.error('Erro ao buscar produto:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="container mx-auto px-4 py-16 pt-24 text-center">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Erro ao carregar o produto</h1>
        <p className="text-gray-600 mb-6">{error || 'Produto não encontrado'}</p>
        <Link to="/produtos" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition duration-300">
          Voltar para produtos
        </Link>
      </div>
    );
  }

  // Imagens do produto (principal e miniaturas)
  // Normalmente teríamos múltiplas imagens, mas por enquanto usamos a mesma para demonstração
  const images = [
    produto.imagem,
    produto.imagem, // Duplicado para demonstração
  ].filter(Boolean) as string[];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Seção principal do produto */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Seção de imagens - Lado esquerdo */}
          <div className="w-full md:w-1/2">
            <div className="bg-pink-50 rounded-lg p-6 mb-4">
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={produto.nome} 
                  className="w-full h-auto object-contain rounded-lg"
                  style={{ maxHeight: '500px' }}
                />
              ) : (
                <div className="w-full h-96 bg-pink-100 flex items-center justify-center rounded-lg">
                  <span className="text-pink-500">Sem imagem</span>
                </div>
              )}
            </div>
            
            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-pink-500' : 'border-transparent'}`}
                  >
                    <img 
                      src={img} 
                      alt={`${produto.nome} - imagem ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Informações do produto - Lado direito */}
          <div className="w-full md:w-1/2">
            <div className="mb-2">
              <Link to="/produtos" className="text-pink-600 hover:text-pink-800 text-sm">
                ← Voltar para produtos
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{produto.nome}</h1>
            
            <div className="flex items-center mb-6">
              {produto.preco_promocional ? (
                <>
                  <span className="text-3xl font-bold text-pink-600 mr-3">
                    R$ {produto.preco_promocional.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-lg line-through text-gray-500 mr-3">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-sm bg-pink-100 text-pink-800 px-2 py-1 rounded">
                    {Math.round(((produto.preco - (produto.preco_promocional || 0)) / produto.preco) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-pink-600">
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
            
            <div className="text-gray-500 text-sm mb-6">
              ou até 12x de R$ {((produto.preco_promocional || produto.preco) / 12).toFixed(2).replace('.', ',')}
            </div>
            
            {produto.descricao && (
              <div className="mb-8">
                <p className="text-gray-600">{produto.descricao}</p>
              </div>
            )}
            
            {/* Botão de compra */}
            <div className="mt-8">
              {produto.ativo !== false ? (
                <a
                  href={produto.link_comprar || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg inline-block transition duration-300"
                >
                  Comprar agora
                </a>
              ) : (
                <button
                  disabled
                  className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg inline-block cursor-not-allowed"
                >
                  Esgotado
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de descrição detalhada - Separada da seção principal */}
      {(produto.secao1_titulo || produto.secao2_titulo || produto.secao3_titulo) && (
        <div className="max-w-6xl mx-auto mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Conheça mais sobre este produto</h2>
          
          {/* Seção 1 - Layout: Título e texto à esquerda, imagem à direita */}
          {produto.secao1_titulo && (
            <div className="mb-16">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2 order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-4 text-pink-600">{produto.secao1_titulo}</h3>
                  <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                    {produto.secao1_subtitulo}
                  </div>
                </div>
                {produto.secao1_imagem && (
                  <div className="w-full md:w-1/2 order-1 md:order-2">
                    <img 
                      src={produto.secao1_imagem} 
                      alt={produto.secao1_titulo} 
                      className="w-full h-auto rounded-lg shadow-lg object-cover" 
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Seção 2 - Layout: Imagem à esquerda, título e texto à direita */}
          {produto.secao2_titulo && (
            <div className="mb-16">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {produto.secao2_imagem && (
                  <div className="w-full md:w-1/2 order-1">
                    <img 
                      src={produto.secao2_imagem} 
                      alt={produto.secao2_titulo} 
                      className="w-full h-auto rounded-lg shadow-lg object-cover" 
                    />
                  </div>
                )}
                <div className="w-full md:w-1/2 order-2">
                  <h3 className="text-2xl font-bold mb-4 text-pink-600">{produto.secao2_titulo}</h3>
                  <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                    {produto.secao2_subtitulo}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Seção 3 - Layout: Título e texto à esquerda, imagem à direita (igual à seção 1) */}
          {produto.secao3_titulo && (
            <div className="mb-16">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2 order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-4 text-pink-600">{produto.secao3_titulo}</h3>
                  <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                    {produto.secao3_subtitulo}
                  </div>
                </div>
                {produto.secao3_imagem && (
                  <div className="w-full md:w-1/2 order-1 md:order-2">
                    <img 
                      src={produto.secao3_imagem} 
                      alt={produto.secao3_titulo} 
                      className="w-full h-auto rounded-lg shadow-lg object-cover" 
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
