import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

type UserProfile = {
  nome: string;
  email: string;
  numero?: string;
  cnpj?: string;
  certificado_validado?: boolean;
};

export default function MinhaConta() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Verificar se o usuário está autenticado
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData?.user) {
          navigate('/login', { state: { from: '/minha-conta', message: 'Você precisa estar logado para acessar sua conta.' } });
          return;
        }
        
        // Buscar dados do perfil na tabela socias
        const { data: sociaData, error: sociaError } = await supabase
          .from('socias')
          .select('*')
          .eq('id', userData.user.id)
          .single();
        
        if (sociaError) {
          throw sociaError;
        }
        
        if (sociaData) {
          setProfile({
            nome: sociaData.nome,
            email: sociaData.email,
            numero: sociaData.numero,
            cnpj: sociaData.cnpj,
            certificado_validado: sociaData.certificado_validado
          });
        }
      } catch (error: any) {
        console.error('Erro ao buscar perfil:', error);
        setError(error.message || 'Erro ao buscar dados do perfil');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Minha Conta</h1>
        </div>
        
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : profile ? (
          <div className="p-6">
            <div className="mb-8 flex items-center">
              <div className="bg-pink-100 rounded-full p-4 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{profile.nome}</h2>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Informações da Conta</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{profile.numero || 'Não informado'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">CNPJ</p>
                  <p className="font-medium">{profile.cnpj || 'Não informado'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Status do Certificado</p>
                  <div className="flex items-center mt-1">
                    {profile.certificado_validado ? (
                      <>
                        <span className="h-4 w-4 bg-green-500 rounded-full mr-2"></span>
                        <p className="font-medium text-green-700">Validado</p>
                      </>
                    ) : (
                      <>
                        <span className="h-4 w-4 bg-yellow-500 rounded-full mr-2"></span>
                        <p className="font-medium text-yellow-700">Pendente</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Status da Conta</p>
                  <div className="flex items-center mt-1">
                    <span className="h-4 w-4 bg-green-500 rounded-full mr-2"></span>
                    <p className="font-medium text-green-700">Ativa</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleLogout}
                className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
              >
                Sair da Conta
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <p className="text-gray-500">Nenhum dado de perfil encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
