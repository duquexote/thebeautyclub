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
      
      // Usar a chave anônima correta obtida diretamente do Supabase
      // Esta é apenas uma solução temporária para diagnosticar o problema
      const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWVieWx0bXRvZWxqdmtua2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NTYzNDQsImV4cCI6MjA2NTQzMjM0NH0.PkF7Kp_EiAF6QbhlKamOtKSG_Z03HZwQ_pUbxXoLOwo';
      
      console.log('Tentando acessar com chave fixa');
      
      try {
        // Adiciona um timestamp para evitar cache
        const timestamp = new Date().getTime();
        const url = `${supabaseUrl}/rest/v1/produtos?select=*&order=created_at.desc&_t=${timestamp}`;
        
        console.log('URL completa da requisição:', url);
        console.log('Headers da requisição:', {
          'apikey': ANON_KEY.substring(0, 10) + '...',
          'Authorization': `Bearer ${ANON_KEY.substring(0, 10)}...`,
          'Content-Type': 'application/json'
        });
        
        const response = await fetch(
          url,
          {
            method: 'GET',
            headers: {
              'apikey': ANON_KEY,
              'Authorization': `Bearer ${ANON_KEY}`,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store'
            }
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Erro na resposta da API:', errorData);
          throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Dados obtidos com sucesso usando chave fixa:', data.length, 'produtos');
        setProdutos(data);
        return;
      } catch (fetchError: any) {
        console.error('Erro na requisição com chave fixa:', fetchError);
        setError(`Falha ao acessar API: ${fetchError.message || 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }

      // Não precisamos mais deste bloco, pois já tratamos os dados no bloco try/catch acima
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
