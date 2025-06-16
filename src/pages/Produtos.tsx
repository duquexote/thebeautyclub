import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Produto } from '../types/Produto';

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carregar produtos assim que o componente for montado
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Criar uma nova instância do cliente Supabase para garantir que estamos usando a chave correta
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Variáveis de ambiente do Supabase não configuradas');
      }

      console.log('Buscando produtos com URL:', supabaseUrl);
      console.log('Chave anônima disponível:', supabaseAnonKey ? 'Sim' : 'Não');
      console.log('Chave completa para debug:', supabaseAnonKey);

      // Abordagem alternativa: fazer uma requisição fetch direta para a API REST do Supabase
      // Isso evita problemas com o cliente Supabase e garante que usamos a chave correta
      const response = await fetch(
        `${supabaseUrl}/rest/v1/produtos?select=*&ativo=eq.true&order=created_at.desc`,
        {
          method: 'GET',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta da API:', errorData);
        throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
      }
      
      const data = await response.json();

      // Não precisamos mais verificar error do Supabase, pois estamos usando fetch diretamente
      console.log(`${data.length} produtos carregados com sucesso`);

      if (data) {
        console.log(`${data.length} produtos carregados com sucesso`);
        setProdutos(data);
      } else {
        setProdutos([]);
      }
    } catch (err: any) {
      console.error('Erro ao buscar produtos:', err);
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">Nossos Produtos</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-3 flex items-center justify-center">
          <p className="text-red-700 text-sm">⚠️ {error}</p>
        </div>
      )}

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
