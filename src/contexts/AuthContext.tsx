import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export interface UserType {
  id: string,
  avatar: string | null;
  name: string;
  email: string;
  taddress: string;
  xaddress: string;
  saddress: string;
  bio: string;
  rank: number;
  xp: number;
  winrate: number;
  callcount: number;
  achievements: string[];
  created_at: string;
}

export interface AuthContextType {
  session: Session | null;
  user: UserType | null;
  isLogin: boolean;
}


const AuthContext = createContext<AuthContextType>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const isLogin = useMemo<boolean>(() => !!(session?.user.email && session?.user.confirmed_at), [session]);
  const checkUser = useCallback(async (_session: Session) => {
    if (!_session?.user.id) {
      setUser(null);
      return;
    }
    if (user?.id == _session?.user.id) return;
    const { data: dataUser, error: errorUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", _session.user.id)
      .single();
    if (errorUser) {
      console.error("Error fetching user:", errorUser);
    } else {
      setUser(dataUser);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log(data);
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setSession(data.session);
        checkUser(data.session);
      }
      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, _session: Session | null) => {
        setSession(_session);
        checkUser(_session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  
  return (
    <AuthContext.Provider value={{session, isLogin, user}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);