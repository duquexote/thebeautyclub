import { createClient } from '@supabase/supabase-js';

// Usando as variáveis de ambiente do arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY as string;

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Variáveis de ambiente do Supabase não estão definidas corretamente no arquivo .env');
}

// Usando a chave de serviço para todas as operações
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Função auxiliar para criar usuários com email confirmado
export const createUserWithConfirmedEmail = async (email: string, password: string, userData: any) => {
  try {
    console.log('Criando usuário com email confirmado:', { email, userData });
    
    // Usando a API Admin do Supabase com a chave de serviço do arquivo .env
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          nome: userData.nome || ''
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta:', errorData);
      throw new Error(errorData.message || 'Erro ao criar usuário');
    }
    
    const data = await response.json();
    console.log('Usuário criado com sucesso:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return { data: null, error };
  }
};
