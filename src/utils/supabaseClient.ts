import { createClient } from '@supabase/supabase-js';

// Usando as variáveis de ambiente do arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não estão definidas corretamente');
}

// Cliente Supabase usando a chave anônima para operações do frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função auxiliar para criar usuários com email confirmado
export const createUserWithConfirmedEmail = async (email: string, password: string, userData: any) => {
  try {
    console.log('Criando usuário com email confirmado:', { email, userData });
    
    // Usando o cliente Supabase padrão para cadastro
    // Nota: Esta abordagem não confirma automaticamente o email
    // Para confirmação automática, seria necessário uma API serverless
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: userData.nome || ''
        }
      }
    });
    
    if (error) throw error;
    
    // Retorna os dados do usuário criado
    return { data, error: null };
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    return { data: null, error };
  }
};
