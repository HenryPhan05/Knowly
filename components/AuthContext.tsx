import { supabase } from '@/lib/database';
import type { Session, User } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await getSession();
      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setSession(null);
          return;
        }

        const { data: userData, error } = await supabase.auth.getUser();

        if (error || !userData?.user) {
          await supabase.auth.signOut();
          setSession(null);
        } else {
          setSession(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      setSession(null);
      return;
    }

    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData?.user) {
      await supabase.auth.signOut();
      setSession(null);
    } else {
      setSession(data.session);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error("Invalid email or password");
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }


    if (!data.user) {
      throw new Error("User already exists or cannot sign up");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};