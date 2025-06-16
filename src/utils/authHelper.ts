import { supabase } from './supabaseClient';

// Função para verificar se há uma sessão válida no Supabase
export const checkSupabaseSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Erro ao verificar sessão do Supabase:', error);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Erro ao acessar API do Supabase:', error);
    return null;
  }
};

// Função para tentar restaurar uma sessão do Supabase
export const restoreSupabaseSession = async (accessToken: string, refreshToken: string) => {
  try {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.error('Erro ao restaurar sessão do Supabase:', error);
    return null;
  }
};

// Função para verificar o formato atual da sessão no localStorage
export const getCurrentSessionFromStorage = () => {
  try {
    const storageKey = `sb-${window.location.hostname}-auth-token`;
    const storedSession = localStorage.getItem(storageKey);
    
    if (storedSession) {
      const sessionData = JSON.parse(storedSession);
      if (sessionData && sessionData.session) {
        return sessionData.session;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter sessão do localStorage:', error);
    return null;
  }
};

// Função para verificar o formato antigo da sessão no localStorage
export const getLegacySessionFromStorage = () => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.split('//')[1];
    const storedSession = localStorage.getItem(`sb-${supabaseUrl}-auth-token`);
    
    if (storedSession) {
      const sessionData = JSON.parse(storedSession);
      if (sessionData && sessionData.session) {
        return sessionData.session;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter sessão legada do localStorage:', error);
    return null;
  }
};
export const checkSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const isConfigValid = !!supabaseUrl && !!supabaseAnonKey && supabaseAnonKey.length > 20;
  
  if (!isConfigValid) {
    console.error('Configuração do Supabase inválida ou incompleta!');
    console.log('URL:', supabaseUrl ? 'Definida' : 'Indefinida');
    console.log('Chave anônima:', supabaseAnonKey ? `Definida (${supabaseAnonKey.length} caracteres)` : 'Indefinida');
  }
  
  return isConfigValid;
};

/**
 * Verifica se um token JWT está expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Decodificar o token JWT (formato: header.payload.signature)
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Verificar se o token tem um timestamp de expiração
    if (!payload.exp) return true;
    
    // Comparar com o timestamp atual (em segundos)
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.error('Erro ao verificar expiração do token:', error);
    return true; // Se houver erro, considerar expirado por segurança
  }
};

/**
 * Verifica e restaura a sessão do Supabase a partir do localStorage
 * Tenta diferentes formatos de sessão armazenados
 */
export const checkAndRestoreSession = async () => {
  try {
    console.log('Iniciando verificação e restauração de sessão...');
    
    // 0. Verificar sessão de login via API (prioridade máxima)
    const apiSession = localStorage.getItem('auth_session');
    if (apiSession) {
      console.log('Sessão de login via API encontrada, tentando usar...');
      try {
        const sessionData = JSON.parse(apiSession);
        if (sessionData?.access_token && sessionData?.refresh_token) {
          // Verificar se o token está expirado
          if (isTokenExpired(sessionData.access_token)) {
            console.log('Token da API expirado, removendo sessão inválida');
            localStorage.removeItem('auth_session');
          } else {
            console.log('Token da API válido, configurando sessão Supabase');
            
            // O token será aplicado automaticamente pelo setSession abaixo
            // Não precisamos definir headers manualmente
            
            // Tentar definir a sessão no cliente Supabase
            const { data, error } = await supabase.auth.setSession({
              access_token: sessionData.access_token,
              refresh_token: sessionData.refresh_token
            });
            
            if (error) {
              console.error('Erro ao configurar sessão da API:', error);
              // Tentar usar o token mesmo com erro na configuração
              console.log('Tentando usar token da API diretamente');
              return {
                access_token: sessionData.access_token,
                refresh_token: sessionData.refresh_token,
                user: { id: 'api-user' }, // Usuário mínimo para satisfazer a interface
                expires_at: 0 // Forçar refresh na próxima vez
              };
            } else if (data?.session) {
              console.log('Sessão da API configurada com sucesso no Supabase');
              return data.session;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao processar sessão da API:', error);
      }
    }
    
    // 1. Verificar se há uma sessão ativa no Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Sessão ativa encontrada no Supabase');
      
      // Verificar se o token está expirado
      if (isTokenExpired(session.access_token)) {
        console.log('Token expirado, tentando refresh...');
        
        // Usar o refresh token da sessão atual
        if (session.refresh_token) {
          const { data, error } = await supabase.auth.refreshSession({
            refresh_token: session.refresh_token
          });
          
          if (error) {
            console.error('Erro ao fazer refresh do token:', error);
            return null;
          }
          
          if (data?.session) {
            console.log('Sessão renovada com sucesso');
            return data.session;
          }
        } else {
          console.error('Refresh token não encontrado na sessão');
          return null;
        }
      } else {
        return session;
      }
    }
    
    // 2. Tentar restaurar sessão do localStorage (formato atual)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.split('//')[1];
    const key = `sb-${supabaseUrl}-auth-token`;
    const storedSession = localStorage.getItem(key);
    
    if (storedSession) {
      console.log('Sessão encontrada no localStorage (formato atual)');
      try {
        const sessionData = JSON.parse(storedSession);
        
        if (sessionData && sessionData.access_token && sessionData.refresh_token) {
          // Verificar se o token está expirado
          if (isTokenExpired(sessionData.access_token)) {
            console.log('Token do localStorage expirado, tentando refresh...');
            const { data, error } = await supabase.auth.refreshSession();
            
            if (error) {
              console.error('Erro ao fazer refresh do token do localStorage:', error);
            } else if (data?.session) {
              console.log('Sessão do localStorage renovada com sucesso');
              return data.session;
            }
          } else {
            // O token será aplicado automaticamente pelo setSession abaixo
            // Não precisamos definir headers manualmente
            
            // Tentar definir a sessão no cliente Supabase
            const { data, error } = await supabase.auth.setSession({
              access_token: sessionData.access_token,
              refresh_token: sessionData.refresh_token
            });
            
            if (error) {
              console.error('Erro ao restaurar sessão do localStorage:', error);
            } else if (data?.session) {
              console.log('Sessão restaurada com sucesso (formato atual)');
              return data.session;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao processar sessão do localStorage:', error);
      }
    }
    
    // 3. Tentar restaurar sessão do localStorage (formato antigo)
    const legacySession = localStorage.getItem('supabase.auth.token');
    if (legacySession) {
      console.log('Sessão encontrada no localStorage (formato antigo)');
      try {
        const sessionData = JSON.parse(legacySession);
        if (sessionData?.currentSession?.access_token && sessionData?.currentSession?.refresh_token) {
          // Verificar se o token está expirado
          if (isTokenExpired(sessionData.currentSession.access_token)) {
            console.log('Token legado expirado');
            return null;
          }
          
          // O token será aplicado automaticamente pelo setSession abaixo
          // Não precisamos definir headers manualmente
          
          const { data, error } = await supabase.auth.setSession({
            access_token: sessionData.currentSession.access_token,
            refresh_token: sessionData.currentSession.refresh_token
          });
          
          if (error) {
            console.error('Erro ao restaurar sessão legada:', error);
          } else if (data?.session) {
            console.log('Sessão restaurada com sucesso (formato antigo)');
            return data.session;
          }
        }
      } catch (error) {
        console.error('Erro ao processar sessão legada:', error);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao verificar/restaurar sessão:', error);
    return null;
  }
};
