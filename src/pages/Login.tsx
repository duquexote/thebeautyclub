import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { LoginData } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  
  // Verificar se há uma mensagem de redirecionamento
  useEffect(() => {
    const state = location.state as { from?: string; message?: string } | null;
    if (state?.message) {
      setRedirectMessage(state.message);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Tentando fazer login com:', { email: formData.email });
      
      // Verificar se o cliente Supabase está inicializado corretamente
      if (!supabase || !supabase.auth) {
        throw new Error('Cliente Supabase não inicializado corretamente');
      }
      
      // Tentativa de login com tratamento de erro detalhado
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha
      });

      console.log('Resposta do login:', { data, error });

      if (error) throw error;
      
      // Login bem-sucedido
      console.log('Login bem-sucedido:', data);
      const state = location.state as { from?: string } | null;
      navigate(state?.from || '/produtos');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      // Mensagem de erro mais detalhada
      const errorMessage = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(`${errorMessage} (Código: ${error.code || 'desconhecido'})`);
      
      // Tentativa de recuperação em caso de erro de API key
      if (error.message?.includes('Invalid API key')) {
        console.log('Tentando recuperar de erro de API key inválida...');
        // Poderia implementar uma solução alternativa aqui
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/cadastro" className="font-medium text-pink-600 hover:text-pink-500">
              cadastre-se agora
            </Link>
          </p>
          
          {redirectMessage && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">{redirectMessage}</p>
            </div>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="senha" className="sr-only">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-300"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/cadastro" className="font-medium text-pink-600 hover:text-pink-500">
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
