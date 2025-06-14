import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Produto } from '../types/Produto';

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        setIsAuthenticated(false);
        navigate('/login', { state: { from: '/produtos', message: 'Você precisa estar logado para acessar os produtos.' } });
      } else {
        setIsAuthenticated(true);
        fetchProdutos();
      }
    };
    
    checkAuth();
    
    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login', { state: { from: '/produtos', message: 'Você precisa estar logado para acessar os produtos.' } });
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);
  
  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setProdutos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar conteúdo apenas se o usuário estiver autenticado
  if (isAuthenticated === false) {
    return null; // Não renderiza nada se não estiver autenticado (será redirecionado)
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">Nossos Produtos</h1>
      
      {/* Indicador de usuário logado */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-3 flex items-center justify-center">
        <p className="text-green-700 text-sm">✓ Você está logado e tem acesso a todos os produtos exclusivos para sócias</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : produtos.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {produtos.map((produto) => (
            <div key={produto.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <Link to={`/produtos/${produto.id}`} className="block">
                <div className="bg-pink-100 p-4">
                  {produto.imagem ? (
                    <img 
                      src={produto.imagem} 
                      alt={produto.nome} 
                      className="w-full h-64 object-contain"
                    />
                  ) : (
                    <div className="w-full h-64 bg-pink-200 flex items-center justify-center">
                      <span className="text-pink-500">Sem imagem</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{produto.nome}</h2>
                  
                  <div className="flex items-center mb-4">
                    {produto.preco_promocional ? (
                      <>
                        <span className="text-xl font-bold text-pink-600">
                          R$ {produto.preco_promocional.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="ml-2 text-sm line-through text-gray-500">
                          R$ {produto.preco.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                          {Math.round(((produto.preco - (produto.preco_promocional || 0)) / produto.preco) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-pink-600">
                        R$ {produto.preco.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  
                  {produto.descricao && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{produto.descricao}</p>
                  )}
                </div>
              </Link>
              
              <div className="px-6 pb-6">
                {produto.ativo !== false ? (
                  <a 
                    href={produto.link_comprar || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded text-center transition duration-300"
                  >
                    Comprar agora
                  </a>
                ) : (
                  <button 
                    disabled
                    className="block w-full bg-gray-400 text-white font-bold py-3 px-4 rounded text-center cursor-not-allowed"
                  >
                    Esgotado
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
