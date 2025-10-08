import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Keypair } from "@solana/web3.js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { UserType, WalletType } from "types/users";

export interface AuthContextType {
  isLogin: boolean;
  session: Session | null;
  user: UserType | null;
  wallet: WalletType | null;
}

const AuthContext = createContext<AuthContextType>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [walletCreating, setWalletCreating] = useState<Set<string>>(new Set());
  const [walletProcessed, setWalletProcessed] = useState<Set<string>>(new Set());
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const isLogin = useMemo<boolean>(
    () => !!(session?.user.email && session?.user.confirmed_at),
    [session]
  );
  // Create wallet for user if not exists
  const createWalletForUser = async (userId: string): Promise<void> => {
    // Prevent multiple simultaneous calls for the same user
    if (walletCreating.has(userId)) {
      return;
    }

    setWalletCreating(prev => new Set(prev).add(userId));
    
    try {
      const { data } = await axios.post('/api/wallet/signup', { userId }, { headers: { 'Content-Type': 'application/json' } });

      if (!data?.success) {
        console.error('Failed to create wallet:', data?.error);
      } else {
        // After successful creation, fetch fresh wallet info with balance
        try {
          const res = await axios.get(`/api/wallet/user/${userId}?includeBalance=true`);
          if (res.data?.success) {
            setWallet(res.data.wallet || null);
          }
        } catch (e) {
          // no-op, will be fetched on next init
        }
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
    } finally {
      setWalletCreating(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const checkUser = useCallback(
    async (_session: Session) => {
      if (!_session?.user.id) {
        setUser(null);
        setWalletProcessed(new Set());
        setWallet(null);
        return;
      }
      if (user?.id == _session?.user.id) return;
      
      // First, check if user exists
      const { data: dataUser, error: errorUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", _session.user.id)
        .single();
      
      if (errorUser) {
        console.error("Error fetching user:", errorUser);
        return;
      }
      
      setUser(dataUser);
      // Fetch wallet info for this user
      try {
        const { data } = await axios.get(`/api/wallet/user/${_session.user.id}?includeBalance=true`);
        if (data?.success) {
          setWallet(data.wallet || null);
        } else {
          setWallet(null);
        }
      } catch (e) {
        setWallet(null);
      }
      
      // Create wallet only on first login (not on every session change)
      if (!walletProcessed.has(_session.user.id) && !walletCreating.has(_session.user.id)) {
        await createWalletForUser(_session.user.id);
        setWalletProcessed(prev => new Set(prev).add(_session.user.id));
      }
    },
    [user, walletCreating, walletProcessed]
  );

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
    <AuthContext.Provider value={{ session, isLogin, user, wallet }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
