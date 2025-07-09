import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Componente para proteger rotas administrativas
 * Verifica se o usuário está autenticado com as credenciais fixas
 */
const AdminAuth: React.FC<AdminAuthProps> = ({ 
  children, 
  redirectTo = '/admin/login' 
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    
    if (!isAuthenticated) {
      // Se não estiver autenticado, redirecionar para a página de login
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);

  // Se chegamos aqui, o usuário está autenticado ou está sendo redirecionado
  return <>{children}</>;
};

export default AdminAuth;
