import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { checkAndRestoreSession } from '../utils/authHelper';

interface AdminAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente para proteger rotas administrativas
 * Verifica autenticação e tenta restaurar a sessão se necessário
 */
const AdminAuth: React.FC<AdminAuthProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user, session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('AdminAuth - Verificando autenticação...');
        console.log('AdminAuth - Estado atual:', { 
          isAuthenticated, 
          hasUser: !!user, 
          hasSession: !!session 
        });

        // Se já estiver autenticado, não precisamos fazer nada
        if (isAuthenticated && user) {
          console.log('AdminAuth - Usuário já autenticado');
          setLoading(false);
          return;
        }

        // Tentar restaurar a sessão usando a função melhorada
        console.log('AdminAuth - Tentando restaurar sessão...');
        const restoredSession = await checkAndRestoreSession();
        
        if (restoredSession) {
          console.log('AdminAuth - Sessão restaurada com sucesso');
          
          // Verificar se a sessão está realmente válida fazendo uma requisição de teste
          const { error: testError } = await supabase.from('produtos').select('count').limit(1);
          
          if (testError) {
            console.error('AdminAuth - Sessão restaurada, mas acesso negado:', testError);
            if (testError.code === '401') {
              console.log('AdminAuth - Tentando refresh da sessão...');
              
              // Obter a sessão atual
              const { data: sessionData } = await supabase.auth.getSession();
              const currentSession = sessionData?.session;
              
              if (currentSession?.refresh_token) {
                console.log('AdminAuth - Refresh token encontrado, tentando renovar sessão');
                const { data, error } = await supabase.auth.refreshSession({
                  refresh_token: currentSession.refresh_token
                });
                
                if (error) {
                  console.error('AdminAuth - Erro ao fazer refresh da sessão:', error);
                  throw new Error('Sessão expirada. Por favor, faça login novamente.');
                }
                
                if (data?.session) {
                  console.log('AdminAuth - Sessão renovada com sucesso');
                  setLoading(false);
                  return;
                }
              } else {
                console.error('AdminAuth - Refresh token não encontrado');
                throw new Error('Sessão inválida. Por favor, faça login novamente.');
              }
            } else {
              throw new Error(`Erro ao acessar dados: ${testError.message}`);
            }
          } else {
            // A sessão foi restaurada e está válida
            console.log('AdminAuth - Sessão válida confirmada');
            setLoading(false);
            return;
          }
        }

        // Se chegamos aqui, não foi possível autenticar o usuário
        console.log('AdminAuth - Não foi possível autenticar o usuário');
        // Redirecionar para a página de login
        navigate('/admin/login');
      } catch (error: any) { 
        console.error('AdminAuth - Erro ao verificar autenticação:', error);
        setError(error.message || 'Erro ao verificar autenticação');
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, session, navigate, redirectTo]);

  // Verificar se temos permissão para acessar a tabela produtos
  useEffect(() => {
    const checkDatabaseAccess = async () => {
      if (!loading && !error && isAuthenticated) {
        try {
          console.log('AdminAuth - Verificando acesso ao banco de dados...');
          
          // Tentar fazer uma consulta simples para verificar o acesso
          const { error } = await supabase
            .from('produtos')
            .select('id')
            .limit(1);
            
          if (error) {
            console.error('AdminAuth - Erro ao acessar banco de dados:', error);
            setError(`Erro ao acessar banco de dados: ${error.message}`);
          } else {
            console.log('AdminAuth - Acesso ao banco de dados confirmado');
          }
        } catch (err: any) {
          console.error('AdminAuth - Erro ao verificar acesso ao banco:', err);
          setError(err.message || 'Erro ao verificar acesso ao banco de dados');
        }
      }
    };
    
    checkDatabaseAccess();
  }, [loading, error, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <h2 className="font-bold mb-2">Erro de autenticação</h2>
          <p>{error}</p>
          <button 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => navigate(redirectTo)}
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  // Se chegamos aqui, o usuário está autenticado
  return <>{children}</>;
};

export default AdminAuth;
