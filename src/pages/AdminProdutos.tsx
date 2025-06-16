import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Produto } from '../types/Produto';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (isAuthenticated === false) {
      navigate('/login', { state: { from: '/admin/produtos', message: 'Você precisa estar logado como administrador para acessar esta página.' } });
    } else if (isAuthenticated === true) {
      fetchProdutos();
    }
    // isAuthenticated pode ser null inicialmente, nesse caso não fazemos nada até que o valor seja determinado
  }, [isAuthenticated, navigate]);

  async function fetchProdutos() {
    try {
      setLoading(true);
      console.log('Iniciando busca de produtos...');
      
      // Verificar se o usuário está autenticado usando o contexto
      console.log('Status da autenticação:', { 
        isAuthenticated: isAuthenticated,
        userId: user?.id
      });
      
      // Buscar produtos com log detalhado
      console.log('Executando query na tabela produtos...');
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro retornado pelo Supabase:', error);
        throw error;
      }

      console.log('Dados retornados:', { count: data?.length, firstItem: data?.[0] });
      
      if (data) {
        setProdutos(data);
      }
    } catch (error: any) {
      console.error('Erro ao buscar produtos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      setLoading(true);
      
      // Primeiro verificar se o produto tem imagem para excluir
      const { data: produto } = await supabase
        .from('produtos')
        .select('imagem')
        .eq('id', id)
        .single();
      
      // Excluir o produto
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Se o produto tinha uma imagem no Storage, tentar excluí-la
      if (produto && produto.imagem) {
        try {
          // Extrair o nome do arquivo da URL
          const url = new URL(produto.imagem);
          const pathname = url.pathname;
          const fileName = pathname.split('/').pop();
          
          if (fileName) {
            await supabase.storage
              .from('produtos')
              .remove([fileName]);
          }
        } catch (imageError) {
          console.error('Erro ao excluir imagem:', imageError);
          // Não interromper o fluxo se a exclusão da imagem falhar
        }
      }

      // Atualizar a lista de produtos
      setProdutos(produtos.filter(p => p.id !== id));
      setMessage({ text: 'Produto excluído com sucesso!', type: 'success' });
      
      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error);
      setMessage({ text: `Erro ao excluir produto: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleAtivo(id: string, ativoAtual: boolean | undefined) {
    try {
      const novoStatus = !ativoAtual;
      
      const { error } = await supabase
        .from('produtos')
        .update({ ativo: novoStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Atualizar a lista de produtos
      setProdutos(produtos.map(p => 
        p.id === id ? { ...p, ativo: novoStatus } : p
      ));
      
      setMessage({ 
        text: `Produto ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`, 
        type: 'success' 
      });
      
      // Limpar a mensagem após 3 segundos
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      
    } catch (error: any) {
      console.error('Erro ao alterar status do produto:', error);
      setMessage({ text: `Erro ao alterar status: ${error.message}`, type: 'error' });
    }
  }

  function handleEdit(id: string) {
    navigate(`/admin/editar-produto/${id}`);
  }

  function formatarPreco(preco: number | null | undefined) {
    if (preco === null || preco === undefined) return 'N/A';
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
  }

  if (loading && produtos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>Erro ao carregar produtos: {error}</p>
          <button 
            onClick={() => fetchProdutos()}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600">Administração de Produtos</h1>
        <Link 
          to="/admin/registro-produto"
          className="flex items-center bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          <PlusCircle size={20} className="mr-2" />
          Cadastrar Produto
        </Link>
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {produtos.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">Nenhum produto cadastrado.</p>
          <Link 
            to="/admin/registro-produto"
            className="mt-4 inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Cadastrar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {produto.imagem ? (
                      <img 
                        src={produto.imagem} 
                        alt={produto.nome} 
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Sem imagem</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatarPreco(produto.preco)}</div>
                    {produto.preco_promocional && (
                      <div className="text-xs text-pink-600">{formatarPreco(produto.preco_promocional)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleAtivo(produto.id!, produto.ativo)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        produto.ativo !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {produto.ativo !== false ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(produto.id!)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(produto.id!)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
