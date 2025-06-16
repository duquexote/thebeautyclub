import { createClient } from '@supabase/supabase-js';

// Usando variáveis de ambiente para maior segurança e flexibilidade
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não estão definidas corretamente!');
}

// Verificar se estamos em ambiente de desenvolvimento ou produção
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

console.log(`Inicializando Supabase em ambiente de ${isDevelopment ? 'desenvolvimento' : 'produção'}`);
console.log('URL Supabase:', supabaseUrl);

// Função para verificar se há uma sessão existente no localStorage
const getExistingSession = () => {
  try {
    const storedSession = localStorage.getItem('supabase.auth.token');
    if (storedSession) {
      const sessionData = JSON.parse(storedSession);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Verificar se a sessão não expirou
      if (sessionData.expiresAt > currentTime) {
        console.log('Sessão existente encontrada no localStorage');
        return sessionData.currentSession;
      } else {
        console.log('Sessão existente expirada');
        localStorage.removeItem('supabase.auth.token');
      }
    }
  } catch (error) {
    console.error('Erro ao recuperar sessão:', error);
  }
  return null;
};

// Cliente Supabase com chave anônima
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'thebeautyclub@1.0.0'
    }
  }
});

// Tentar restaurar a sessão se existir
const existingSession = getExistingSession();
if (existingSession) {
  supabase.auth.setSession({
    access_token: existingSession.access_token,
    refresh_token: existingSession.refresh_token
  }).then(() => {
    console.log('Sessão restaurada com sucesso');
  }).catch(error => {
    console.error('Erro ao restaurar sessão:', error);
  });
}

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
