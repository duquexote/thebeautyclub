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
          // Se não houver sessão no Supabase, verificar no localStorage
          const existingSession = getExistingSession();
          
          if (existingSession) {
            // Tentar restaurar a sessão
            try {
              await supabase.auth.setSession({
                access_token: existingSession.access_token,
                refresh_token: existingSession.refresh_token
              });
              
              // Verificar se a sessão foi restaurada
              const { data: refreshedData } = await supabase.auth.getSession();
              
              if (refreshedData?.session) {
                console.log('Sessão restaurada com sucesso');
                setUser(refreshedData.session.user);
                setSession(refreshedData.session);
              } else {
                console.log('Não foi possível restaurar a sessão');
                localStorage.removeItem('supabase.auth.token');
              }
            } catch (error) {
              console.error('Erro ao restaurar sessão:', error);
              localStorage.removeItem('supabase.auth.token');
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
