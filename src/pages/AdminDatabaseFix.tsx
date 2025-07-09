import { useState } from 'react';
import { fixBlogArticlesTable } from '../utils/supabaseClient';
import AdminAuth from '../components/AdminAuth';

const AdminDatabaseFix = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const handleFixTable = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      addLog('Iniciando correção da tabela blog_articles...');
      
      const result = await fixBlogArticlesTable();
      
      if (result.success) {
        setSuccess('Tabela corrigida com sucesso!');
        addLog('✅ Tabela corrigida com sucesso!');
      } else {
        setError(`Erro ao corrigir tabela: ${result.error}`);
        addLog(`❌ Erro ao corrigir tabela: ${JSON.stringify(result.error)}`);
      }
    } catch (err) {
      console.error('Erro ao corrigir tabela:', err);
      setError(`Erro ao corrigir tabela: ${err}`);
      addLog(`❌ Erro inesperado: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuth>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Correção do Banco de Dados</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Corrigir Tabela de Artigos</h2>
          <p className="mb-4">
            Esta ferramenta tentará corrigir a estrutura da tabela <code>blog_articles</code> para resolver o problema
            de violação de chave estrangeira no campo <code>author_id</code>.
          </p>
          <p className="mb-4">
            A ferramenta tentará:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Remover a restrição de chave estrangeira <code>blog_articles_author_id_fkey</code></li>
            <li>Tornar a coluna <code>author_id</code> opcional (aceitar NULL)</li>
          </ul>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              <p>{success}</p>
            </div>
          )}
          
          <button
            onClick={handleFixTable}
            disabled={loading}
            className={`px-4 py-2 rounded ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Corrigindo...' : 'Corrigir Tabela'}
          </button>
        </div>
        
        {logs.length > 0 && (
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Logs:</h3>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminAuth>
  );
};

export default AdminDatabaseFix;
