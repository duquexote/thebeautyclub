import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

// Importando o tipo User do Supabase para evitar problemas de tipagem
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Usando o tipo do Supabase diretamente
type User = SupabaseUser;

type AuthContextType = {
  user: User | null;
  session: Session | null;
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

// Provedor do contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para fazer login
  const signIn = async (email: string, password: string) => {
    try {
      // Tentativa de login direto com o Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro ao fazer login com Supabase:', error);
        return { error, data: null };
      }

      if (data?.session) {
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        return { error: null, data };
      }

      return { error: { message: 'Falha na autenticação' }, data: null };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { error, data: null };
    }
  };

  // Função para fazer logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      // Limpar localStorage
      localStorage.removeItem('supabase.auth.token');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL.split('//')[1];
      localStorage.removeItem(`sb-${supabaseUrl}-auth-token`);
      localStorage.removeItem('auth_via_api');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Efeito para verificar autenticação ao carregar
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        // Verificar sessão atual no Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão do Supabase:', error);
        }
        
        if (data?.session) {
          console.log('Sessão existente encontrada no Supabase');
          setUser(data.session.user);
          setSession(data.session);
          setIsAuthenticated(true);
        } else {
          console.log('Sessão não encontrada no Supabase');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setIsAuthenticated(false);
      } finally {
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
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
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
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
