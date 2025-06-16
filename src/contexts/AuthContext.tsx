import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

// Importando o tipo User do Supabase para evitar problemas de tipagem
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Usando o tipo do Supabase diretamente
type User = SupabaseUser;

type AuthContextType = {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null, data: any | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Função para fazer login usando a API serverless
const loginViaApi = async (email: string, password: string) => {
  try {
    // Determinar a URL da API com base no ambiente
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isDevelopment 
      ? 'http://localhost:3000/api/auth' // URL local para desenvolvimento
      : '/api/auth'; // URL relativa para produção
    
    console.log(`Usando API de autenticação em: ${apiUrl}`);
    console.log(`Ambiente: ${isDevelopment ? 'Desenvolvimento' : 'Produção'}`);
    
    // Chamada para a API serverless
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        action: 'login'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta da API:', errorData);
      throw new Error(errorData.error || 'Erro ao fazer login');
    }
    
    const data = await response.json();
    console.log('Resposta da API de login:', { 
      success: true, 
      hasUser: !!data.user, 
      hasSession: !!data.session 
    });
    return { data, error: null };
  } catch (error: any) {
    console.error('Erro ao chamar API de login:', error);
    return { data: null, error };
  }
};

// Provedor do contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar sessão existente no localStorage
  const getExistingSession = () => {
    try {
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Verificar se a sessão não expirou
        if (sessionData.expiresAt > currentTime) {
          console.log('Sessão existente encontrada no AuthContext');
          return sessionData.currentSession;
        } else {
          console.log('Sessão existente expirada no AuthContext');
          localStorage.removeItem('supabase.auth.token');
        }
      }
    } catch (error) {
      console.error('Erro ao recuperar sessão no AuthContext:', error);
    }
    return null;
  };

  // Função para fazer login
  const signIn = async (email: string, password: string) => {
    try {
      // Primeiro, tentar login via API serverless
      const { data, error } = await loginViaApi(email, password);
      
      if (error) {
        console.log('Erro na API, tentando diretamente com Supabase:', error);
        
        // Tentativa de login direta com Supabase como fallback
        const supabaseResult = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (supabaseResult.error) {
          return { error: supabaseResult.error, data: null };
        }
        
        // Login bem-sucedido via Supabase
        console.log('Login bem-sucedido via Supabase:', supabaseResult.data);
        setUser(supabaseResult.data.user);
        setSession(supabaseResult.data.session);
        return { data: supabaseResult.data, error: null };
      }
      
      // Login bem-sucedido via API
      console.log('Login bem-sucedido via API:', data);
      
      // Armazenar a sessão completa no localStorage
      if (data?.session) {
        try {
          // Formato personalizado para nossa aplicação
          localStorage.setItem('supabase.auth.token', JSON.stringify({
            currentSession: data.session,
            expiresAt: Math.floor(Date.now() / 1000) + data.session.expires_in
          }));
          
          // Armazenar no formato que o Supabase espera
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.split('//')[1];
          const supabaseAuthKey = `sb-${supabaseUrl}-auth-token`;
          
          const supabaseSession = {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + data.session.expires_in,
            token_type: 'bearer',
            provider_token: null,
            provider_refresh_token: null,
            user: data.user
          };
          
          localStorage.setItem(supabaseAuthKey, JSON.stringify(supabaseSession));
          console.log(`Sessão armazenada em localStorage com chave: ${supabaseAuthKey}`);
          
          // Armazenar um flag indicando que o login foi feito via API
          localStorage.setItem('auth_via_api', 'true');
          
          // Não tentamos mais definir a sessão no cliente Supabase
          // pois sabemos que isso vai falhar com erro 401
          console.log('Login feito via API, não tentando restaurar sessão no Supabase');
        } catch (sessionError) {
          console.error('Erro ao configurar sessão:', sessionError);
        }
        
        // Atualizar estado do contexto
        setUser(data.user);
        setSession(data.session);
      } else {
        console.warn('Login bem-sucedido, mas sem dados de sessão');
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { error, data: null };
    }
  };

  // Função para fazer logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função para verificar e obter sessão do localStorage no formato do Supabase
  const getSupabaseSessionFromLocalStorage = () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.split('//')[1];
      const key = `sb-${supabaseUrl}-auth-token`;
      const storedSession = localStorage.getItem(key);
      
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        if (sessionData.access_token && sessionData.refresh_token) {
          return sessionData;
        }
      }
    } catch (e) {
      console.error('Erro ao obter sessão do Supabase do localStorage:', e);
    }
    return null;
  };

  // Função para obter a sessão do usuário do localStorage
  const getUserSessionFromLocalStorage = () => {
    try {
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        return sessionData;
      }
    } catch (e) {
      console.error('Erro ao obter sessão do usuário do localStorage:', e);
    }
    return null;
  };

  // Função para limpar todos os dados de autenticação
  const clearAllAuthData = () => {
    localStorage.removeItem('supabase.auth.token');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.split('//')[1];
    localStorage.removeItem(`sb-${supabaseUrl}-auth-token`);
    localStorage.removeItem('auth_via_api');
  };

  // Efeito para verificar autenticação ao carregar
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Verificar primeiro se o login foi feito via API
        const isAuthViaApi = localStorage.getItem('auth_via_api') === 'true';
        
        if (isAuthViaApi) {
          console.log('Login via API detectado, não tentando restaurar sessão do Supabase');
          // Usar diretamente os dados do localStorage
          const userSession = getUserSessionFromLocalStorage();
          if (userSession && userSession.currentSession) {
            setUser(userSession.currentSession.user);
            setSession(userSession.currentSession);
          }
        } else {
          // Fluxo normal de restauração de sessão
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            console.log('Sessão existente encontrada no AuthContext');
            setUser(data.session.user);
            setSession(data.session);
          } else {
            console.log('Sessão não encontrada no AuthContext, tentando restaurar');
            const supabaseSession = getSupabaseSessionFromLocalStorage();
            if (supabaseSession) {
              console.log('Sessão existente encontrada no localStorage');
              try {
                await supabase.auth.setSession({
                  access_token: supabaseSession.access_token,
                  refresh_token: supabaseSession.refresh_token
                });
                const { data: refreshedData } = await supabase.auth.getSession();
                if (refreshedData?.session) {
                  console.log('Sessão restaurada com sucesso');
                  setUser(refreshedData.session.user);
                  setSession(refreshedData.session);
                } else {
                  console.log('Não foi possível restaurar a sessão');
                  // Tentar usar os dados do localStorage como fallback
                  const userSession = getUserSessionFromLocalStorage();
                  if (userSession && userSession.currentSession) {
                    setUser(userSession.currentSession.user);
                    setSession(userSession.currentSession);
                  } else {
                    // Limpar localStorage se a sessão não puder ser restaurada
                    clearAllAuthData();
                  }
                }
              } catch (error) {
                console.error('Erro ao restaurar sessão:', error);
                // Tentar usar os dados do localStorage como fallback
                const userSession = getUserSessionFromLocalStorage();
                if (userSession && userSession.currentSession) {
                  setUser(userSession.currentSession.user);
                  setSession(userSession.currentSession);
                } else {
                  // Limpar localStorage se a sessão não puder ser restaurada
                  clearAllAuthData();
                }
              }
            } else {
              // Tentar usar os dados do localStorage como fallback
              const userSession = getUserSessionFromLocalStorage();
              if (userSession && userSession.currentSession) {
                setUser(userSession.currentSession.user);
                setSession(userSession.currentSession);
              }
            }
          } else {
            // Verificar nossa sessão personalizada
            const existingSession = getExistingSession();
            
            if (existingSession) {
              console.log('Usando sessão personalizada');
              setUser(existingSession.currentSession.user);
              setSession(existingSession.currentSession);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    // Inicializar autenticação
    initAuth();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Evento de autenticação:', event);
        
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setSession(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          localStorage.removeItem('supabase.auth.token');
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.split('//')[1];
          localStorage.removeItem(`sb-${supabaseUrl}-auth-token`);
        }
      }
    );

    // Limpar listener ao desmontar
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Valor do contexto
  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    // Consideramos autenticado se tiver um usuário OU uma sessão armazenada no localStorage
    isAuthenticated: !!user || !!getExistingSession()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
