import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { restoreSession } from '../utils/supabaseClient';

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

        // Tentar restaurar a sessão do localStorage
        console.log('AdminAuth - Tentando restaurar sessão...');
        const restoredSession = await restoreSession();
        
        if (restoredSession) {
          console.log('AdminAuth - Sessão restaurada com sucesso');
          // A sessão foi restaurada, podemos continuar
          setLoading(false);
          return;
        }

        // Se chegamos aqui, não foi possível autenticar o usuário
        console.log('AdminAuth - Não foi possível autenticar, redirecionando...');
        navigate(redirectTo, { 
          state: { 
            from: window.location.pathname,
            message: 'Você precisa estar logado para acessar esta página.'
          } 
        });
      } catch (err: any) {
        console.error('AdminAuth - Erro ao verificar autenticação:', err);
        setError(err.message || 'Erro ao verificar autenticação');
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
