import { createClient } from '@supabase/supabase-js';

// Valores fixos para garantir que o cliente Supabase funcione em produção
const SUPABASE_URL = 'https://xpyebyltmtoeljvknkfd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWVieWx0bXRvZWxqdmtua2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NTYzNDQsImV4cCI6MjA2NTQzMjM0NH0.1Uu4v6JHM8F-hxS7_7RIUZUBvHRQMlRO9xZL-lqU-Zw';

// Tentativa de usar variáveis de ambiente, com fallback para valores fixos
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || SUPABASE_URL;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || SUPABASE_ANON_KEY;

console.log('Inicializando Supabase com URL:', supabaseUrl);

// Garantir que as chaves não sejam undefined ou strings vazias
const finalUrl = supabaseUrl || SUPABASE_URL;
const finalKey = supabaseAnonKey || SUPABASE_ANON_KEY;

// Cliente Supabase usando a chave anônima para operações do frontend
export const supabase = createClient(finalUrl, finalKey);

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
