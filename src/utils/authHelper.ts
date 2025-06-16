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
    console.log('Verificando e tentando restaurar sessão...');
    
    // Primeiro, verificar se já existe uma sessão ativa no Supabase
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      console.log('Sessão ativa encontrada no Supabase');
      
      // Verificar se o token não está expirado
      if (!isTokenExpired(sessionData.session.access_token)) {
        return { session: sessionData.session, source: 'supabase' };
      } else {
        console.log('Sessão encontrada, mas token expirado. Tentando refresh...');
      }
    }
    
    // Se não houver sessão ativa, tentar restaurar do localStorage
    console.log('Tentando restaurar sessão do localStorage...');
    
    // Verificar formato atual do Supabase
    const currentSession = getCurrentSessionFromStorage();
    if (currentSession?.access_token && currentSession?.refresh_token) {
      console.log('Sessão encontrada no localStorage (formato atual)');
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token
        });
        
        if (error) {
          console.error('Erro ao restaurar sessão do localStorage:', error);
          return { session: null, source: null, error };
        }
        
        if (data?.session) {
          console.log('Sessão restaurada com sucesso do localStorage');
          return { session: data.session, source: 'localStorage' };
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão do localStorage:', error);
      }
    }
    
    // Verificar formato antigo
    const legacySession = getLegacySessionFromStorage();
    if (legacySession?.access_token && legacySession?.refresh_token) {
      console.log('Sessão encontrada no localStorage (formato antigo)');
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: legacySession.access_token,
          refresh_token: legacySession.refresh_token
        });
        
        if (error) {
          console.error('Erro ao restaurar sessão antiga do localStorage:', error);
          return { session: null, source: null, error };
        }
        
        if (data?.session) {
          console.log('Sessão antiga restaurada com sucesso do localStorage');
          return { session: data.session, source: 'legacyStorage' };
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão antiga do localStorage:', error);
      }
    }
    
    // Se chegamos aqui, não foi possível restaurar a sessão
    console.log('Não foi possível restaurar a sessão');
    return { session: null, source: null };
  } catch (error) {
    console.error('Erro ao verificar e restaurar sessão:', error);
    return { session: null, source: null, error };
  }
};
