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
      console.log('Iniciando processo de logout');
      // Primeiro limpar a sessão no Supabase
      await supabase.auth.signOut();
      
      // Usar a função clearAllAuthData para limpar todos os dados de autenticação
      clearAllAuthData();
      console.log('Todos os dados de autenticação foram limpos');
      
      // Atualizar o estado do contexto
      setUser(null);
      setSession(null);
      console.log('Logout concluído com sucesso');
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
    // Função para inicializar a autenticação
    const initAuth = async () => {
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
            
            // Mesmo com login via API, vamos tentar configurar a sessão no Supabase
            // para garantir que as requisições subsequentes funcionem
            if (userSession.currentSession.access_token && userSession.currentSession.refresh_token) {
              try {
                await supabase.auth.setSession({
                  access_token: userSession.currentSession.access_token,
                  refresh_token: userSession.currentSession.refresh_token
                });
                console.log('Sessão do Supabase configurada a partir do login via API');
              } catch (error) {
                console.error('Erro ao configurar sessão do Supabase a partir do login via API:', error);
              }
            }
          }
        } else {
          // Fluxo normal de restauração de sessão
          try {
            console.log('Tentando obter sessão atual do Supabase...');
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error('Erro ao obter sessão do Supabase:', error);
            }
            
            if (data?.session) {
              console.log('Sessão existente encontrada no Supabase');
              setUser(data.session.user);
              setSession(data.session);
            } else {
              console.log('Sessão não encontrada no Supabase, tentando restaurar do localStorage');
              
              // Verificar o formato atual do Supabase primeiro
              const storageKey = `sb-${window.location.hostname}-auth-token`;
              const storedSession = localStorage.getItem(storageKey);
              
              if (storedSession) {
                try {
                  const sessionData = JSON.parse(storedSession);
                  if (sessionData && sessionData.session) {
                    console.log('Sessão encontrada no localStorage (formato atual)');
                    
                    try {
                      await supabase.auth.setSession({
                        access_token: sessionData.session.access_token,
                        refresh_token: sessionData.session.refresh_token
                      });
                      
                      const { data: refreshedData } = await supabase.auth.getSession();
                      if (refreshedData?.session) {
                        console.log('Sessão restaurada com sucesso (formato atual)');
                        setUser(refreshedData.session.user);
                        setSession(refreshedData.session);
                      }
                    } catch (sessionError) {
                      console.error('Erro ao restaurar sessão (formato atual):', sessionError);
                    }
                  }
                } catch (parseError) {
                  console.error('Erro ao analisar sessão do localStorage:', parseError);
                }
              } else {
                // Tentar formato antigo
                const supabaseSession = getSupabaseSessionFromLocalStorage();
                if (supabaseSession) {
                  console.log('Sessão existente encontrada no localStorage (formato antigo)');
                  try {
                    await supabase.auth.setSession({
                      access_token: supabaseSession.access_token,
                      refresh_token: supabaseSession.refresh_token
                    });
                    const { data: refreshedData } = await supabase.auth.getSession();
                    if (refreshedData?.session) {
                      console.log('Sessão restaurada com sucesso (formato antigo)');
                      setUser(refreshedData.session.user);
                      setSession(refreshedData.session);
                    }
                  } catch (error) {
                    console.error('Erro ao restaurar sessão (formato antigo):', error);
                  }
                }
              }
              
              // Se ainda não temos sessão, tentar usar os dados do localStorage como fallback
              if (!session) {
                const userSession = getUserSessionFromLocalStorage();
                if (userSession && userSession.currentSession) {
                  console.log('Usando sessão personalizada do localStorage');
                  setUser(userSession.currentSession.user);
                  setSession(userSession.currentSession);
                  
                  // Tentar configurar a sessão no Supabase
                  if (userSession.currentSession.access_token && userSession.currentSession.refresh_token) {
                    try {
                      await supabase.auth.setSession({
                        access_token: userSession.currentSession.access_token,
                        refresh_token: userSession.currentSession.refresh_token
                      });
                      console.log('Sessão do Supabase configurada a partir da sessão personalizada');
                    } catch (error) {
                      console.error('Erro ao configurar sessão do Supabase a partir da sessão personalizada:', error);
                    }
                  }
                } else {
                  // Verificar nossa sessão personalizada como último recurso
                  const existingSession = getExistingSession();
                  if (existingSession) {
                    console.log('Usando sessão personalizada antiga');
                    setUser(existingSession.currentSession.user);
                    setSession(existingSession.currentSession);
                    
                    // Tentar configurar a sessão no Supabase
                    if (existingSession.currentSession.access_token && existingSession.currentSession.refresh_token) {
                      try {
                        await supabase.auth.setSession({
                          access_token: existingSession.currentSession.access_token,
                          refresh_token: existingSession.currentSession.refresh_token
                        });
                        console.log('Sessão do Supabase configurada a partir da sessão personalizada antiga');
                      } catch (error) {
                        console.error('Erro ao configurar sessão do Supabase a partir da sessão personalizada antiga:', error);
                      }
                    }
                  } else {
                    // Limpar localStorage se a sessão não puder ser restaurada
                    clearAllAuthData();
                  }
                }
              }
            }
          } catch (supabaseError) {
            console.error('Erro ao acessar API do Supabase:', supabaseError);
            
            // Tentar usar os dados do localStorage como fallback em caso de erro
            const userSession = getUserSessionFromLocalStorage();
            if (userSession && userSession.currentSession) {
              console.log('Usando sessão do localStorage após erro do Supabase');
              setUser(userSession.currentSession.user);
              setSession(userSession.currentSession);
            } else {
              const existingSession = getExistingSession();
              if (existingSession) {
                console.log('Usando sessão personalizada após erro do Supabase');
                setUser(existingSession.currentSession.user);
                setSession(existingSession.currentSession);
              }
            }
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setLoading(false);
      }
    };
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
