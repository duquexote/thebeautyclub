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
          
          // Tentar definir a sessão no cliente Supabase
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });
          
          // Verificar se a sessão foi definida corretamente
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            console.log('Sessão definida com sucesso no cliente Supabase');
          } else {
            console.warn('Sessão não foi definida corretamente no cliente Supabase');
          }
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

  // Efeito para verificar autenticação ao carregar
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        // Verificar se há uma sessão ativa no Supabase
        const { data } = await supabase.auth.getSession();
        
        if (data?.session) {
          console.log('Sessão ativa encontrada no Supabase');
          setUser(data.session.user);
          setSession(data.session);
        } else {
          // Tentar obter sessão do localStorage no formato do Supabase
          const supabaseSession = getSupabaseSessionFromLocalStorage();
          
          if (supabaseSession) {
            console.log('Sessão encontrada no localStorage, tentando restaurar');
            
            // Tentar restaurar a sessão
            try {
              await supabase.auth.setSession({
                access_token: supabaseSession.access_token,
                refresh_token: supabaseSession.refresh_token
              });
              
              // Verificar se a sessão foi restaurada
              const { data: refreshedData } = await supabase.auth.getSession();
              
              if (refreshedData?.session) {
                console.log('Sessão restaurada com sucesso');
                setUser(refreshedData.session.user);
                setSession(refreshedData.session);
              } else {
                console.log('Não foi possível restaurar a sessão via Supabase');
                
                // Usar os dados do localStorage diretamente como fallback
                if (supabaseSession.user) {
                  console.log('Usando dados de usuário do localStorage como fallback');
                  setUser(supabaseSession.user);
                  // Criar uma sessão simples para manter a autenticação
                  setSession({
                    access_token: supabaseSession.access_token,
                    refresh_token: supabaseSession.refresh_token,
                    user: supabaseSession.user
                  });
                } else {
                  // Tentar nossa sessão personalizada
                  const customSession = getExistingSession();
                  if (customSession?.currentSession?.user) {
                    console.log('Usando sessão personalizada como fallback');
                    setUser(customSession.currentSession.user);
                    setSession(customSession.currentSession);
                  } else {
                    // Limpar localStorage se não conseguir restaurar
                    console.log('Nenhuma sessão válida encontrada');
                    localStorage.removeItem('supabase.auth.token');
                    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.split('//')[1];
                    localStorage.removeItem(`sb-${supabaseUrl}-auth-token`);
                  }
                }
              }
            } catch (error) {
              console.error('Erro ao restaurar sessão:', error);
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
