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
console.log('Chave anônima disponível:', supabaseAnonKey ? 'Sim (primeiros 5 caracteres: ' + supabaseAnonKey.substring(0, 5) + '...)' : 'Não');

// Em ambiente de produção, verificar se as variáveis de ambiente estão disponíveis
if (!isDevelopment) {
  console.log('Verificando variáveis de ambiente em produção:');
  console.log('import.meta.env disponível:', !!import.meta.env);
  console.log('Todas as variáveis de ambiente disponíveis:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
}

// Função para verificar se há uma sessão existente no localStorage
const getExistingSession = () => {
  try {
    // Verificar primeiro a sessão no formato atual do Supabase
    const storedSession = localStorage.getItem('sb-' + supabaseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') + '-auth-token');
    if (storedSession) {
      const sessionData = JSON.parse(storedSession);
      if (sessionData) {
        console.log('Sessão existente encontrada no formato atual do Supabase');
        return sessionData;
      }
    }
    
    // Verificar o formato antigo como fallback
    const oldStoredSession = localStorage.getItem('supabase.auth.token');
    if (oldStoredSession) {
      const sessionData = JSON.parse(oldStoredSession);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Verificar se a sessão não expirou
      if (sessionData.expiresAt > currentTime) {
        console.log('Sessão existente encontrada no formato antigo');
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

// Criar o cliente Supabase
export const createSupabaseClient = () => {
  // Verificar variáveis de ambiente
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variáveis de ambiente do Supabase não definidas');
    console.log('URL:', supabaseUrl || 'indefinida');
    console.log('Chave anônima:', supabaseAnonKey ? `definida (${supabaseAnonKey.substring(0, 5)}...)` : 'indefinida');
    
    // Retornar um cliente mock para evitar erros
    return createClient(
      'https://example.com',
      'example-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            'X-Client-Info': 'thebeautyclub@1.0.0'
          }
        }
      }
    );
  }

  // Criar o cliente com as variáveis de ambiente
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Não definimos storageKey para usar o padrão do Supabase v2
      // que é 'sb-{supabaseUrl}-auth-token'
    },
    global: {
      headers: {
        'X-Client-Info': 'thebeautyclub-app'
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
};

// Cliente Supabase com chave anônima
export const supabase = createSupabaseClient();

// Adicionar um listener para mudanças na sessão
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Evento de autenticação:', event);
  
  // Verificar se temos uma sessão válida
  if (session) {
    console.log('Sessão válida detectada no evento de autenticação');
    
    // Armazenar a sessão no localStorage no formato que o Supabase espera
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.split('//')[1];
      const supabaseAuthKey = `sb-${supabaseUrl}-auth-token`;
      
      // Verificar se já existe uma sessão armazenada
      const existingSession = localStorage.getItem(supabaseAuthKey);
      if (!existingSession) {
        console.log('Armazenando nova sessão no localStorage');
        
        const sessionData = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: Math.floor(Date.now() / 1000) + (session.expires_in || 3600),
          user: session.user
        };
        
        localStorage.setItem(supabaseAuthKey, JSON.stringify(sessionData));
      }
    } catch (error) {
      console.error('Erro ao armazenar sessão no localStorage:', error);
    }
  }
});

// Verificar se a chave de API está sendo usada corretamente
supabase.auth.getSession().then(({ data }) => {
  if (data?.session) {
    console.log('Sessão verificada com sucesso, API key válida');
  } else {
    console.log('Sessão não encontrada, verificando configuração da API key');
    // Verificar se a chave anônima está correta
    if (supabaseAnonKey.length < 10) {
      console.error('AVISO: A chave anônima do Supabase parece estar incompleta ou inválida');
    }
  }
}).catch(error => {
  console.error('Erro ao verificar sessão:', error);
});

// Verificar se estamos em produção e se a chave de API está correta
if (!isDevelopment) {
  console.log('Verificando configuração em ambiente de produção:');
  console.log('Chave anônima completa:', supabaseAnonKey.length > 20 ? 'Sim' : 'Não');
  
  // Verificar se a chave está sendo truncada ou mal formada
  if (supabaseAnonKey.indexOf('.') === -1) {
    console.error('ERRO: A chave anônima não parece ser um JWT válido (faltam pontos)');
  }
  
  // Verificar se a chave tem o formato correto (deve ter 3 partes separadas por pontos)
  const parts = supabaseAnonKey.split('.');
  if (parts.length !== 3) {
    console.error('ERRO: A chave anônima não tem o formato JWT esperado (header.payload.signature)');
  }
}

export const checkApiKey = () => {
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseAnonKey) {
    console.error('Chave anônima do Supabase não definida');
    return false;
  }
  
  // Verificar formato básico da chave anônima (deve ser um JWT)
  if (!supabaseAnonKey.includes('.')) {
    console.error('VITE_SUPABASE_ANON_KEY não parece ser um JWT válido');
    return false;
  }
  
  return true;
};

// Função para tentar restaurar a sessão do localStorage
export const restoreSession = async () => {
  try {
    console.log('Iniciando processo de restauração de sessão...');
    
    // 1. Verificar se há uma sessão no formato atual do Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.split('//')[1];
    const key = `sb-${supabaseUrl}-auth-token`;
    const storedSession = localStorage.getItem(key);
    
    if (storedSession) {
      console.log('Encontrada sessão no formato atual do Supabase no localStorage');
      try {
        const sessionData = JSON.parse(storedSession);
        
        if (sessionData && sessionData.access_token && sessionData.refresh_token) {
          console.log('Sessão válida encontrada, tentando restaurar...');
          
          // Verificar se o token já expirou
          try {
            const payload = JSON.parse(atob(sessionData.access_token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            
            if (payload.exp && payload.exp < now) {
              console.log('Token expirado, tentando refresh...');
            }
          } catch (e) {
            console.log('Não foi possível verificar expiração do token');
          }
          
          // Tentar definir a sessão no cliente Supabase
          const { data, error } = await supabase.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token
          });
          
          if (error) {
            console.error('Erro ao restaurar sessão do localStorage:', error);
            // Tentar refresh token se for erro de token expirado
            if (error.message.includes('expired')) {
              console.log('Tentando refresh token...');
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
              
              if (refreshError) {
                console.error('Erro ao fazer refresh do token:', refreshError);
              } else if (refreshData?.session) {
                console.log('Sessão renovada com sucesso via refresh token');
                return refreshData.session;
              }
            }
          } else if (data?.session) {
            console.log('Sessão restaurada com sucesso do localStorage');
            return data.session;
          }
        }
      } catch (error) {
        console.error('Erro ao processar sessão do localStorage:', error);
      }
    }
    
    // 2. Verificar formato legado (apenas para compatibilidade)
    const legacySession = localStorage.getItem('supabase.auth.token');
    if (legacySession) {
      console.log('Encontrada sessão no formato legado, tentando migrar...');
      try {
        const sessionData = JSON.parse(legacySession);
        if (sessionData?.currentSession?.access_token && sessionData?.currentSession?.refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token: sessionData.currentSession.access_token,
            refresh_token: sessionData.currentSession.refresh_token
          });
          
          if (error) {
            console.error('Erro ao restaurar sessão legada:', error);
          } else if (data?.session) {
            console.log('Sessão legada migrada com sucesso');
            return data.session;
          }
        }
      } catch (error) {
        console.error('Erro ao processar sessão legada:', error);
      }
    }
    
    // 3. Verificar formato customizado usado pelo login via API
    const apiSession = localStorage.getItem('auth_session');
    if (apiSession) {
      console.log('Encontrada sessão de login via API, tentando restaurar...');
      try {
        const sessionData = JSON.parse(apiSession);
        if (sessionData?.access_token && sessionData?.refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token
          });
          
          if (error) {
            console.error('Erro ao restaurar sessão da API:', error);
          } else if (data?.session) {
            console.log('Sessão da API restaurada com sucesso');
            return data.session;
          }
        }
      } catch (error) {
        console.error('Erro ao processar sessão da API:', error);
      }
    }
    
    console.log('Não foi possível restaurar nenhuma sessão');
    return null;
  } catch (error) {
    console.error('Erro ao tentar restaurar sessão:', error);
    return null;
  }
};

// Tentar restaurar a sessão se existir
const existingSession = getExistingSession();
if (existingSession) {
  try {
    // Verificar o formato da sessão retornada
    if (existingSession.session) {
      // Formato atual do Supabase
      supabase.auth.setSession({
        access_token: existingSession.session.access_token,
        refresh_token: existingSession.session.refresh_token
      }).then(() => {
        console.log('Sessão restaurada com sucesso (formato atual)');
      }).catch(error => {
        console.error('Erro ao restaurar sessão (formato atual):', error);
      });
    } else {
      // Formato antigo ou personalizado
      supabase.auth.setSession({
        access_token: existingSession.access_token,
        refresh_token: existingSession.refresh_token
      }).then(() => {
        console.log('Sessão restaurada com sucesso (formato antigo)');
      }).catch(error => {
        console.error('Erro ao restaurar sessão (formato antigo):', error);
      });
    }
  } catch (error) {
    console.error('Erro ao processar sessão existente:', error);
  }
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
