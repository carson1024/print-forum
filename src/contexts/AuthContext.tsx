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

export interface UserType {
  id: string;
  avatar: string | null;
  wallet_paddress: string;
  wallet_saddress: string;
  balance: number;
  allocate_balance: number;
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
  favos: string[];
  created_at: string;
}

export interface AuthContextType {
  isLogin: boolean;
  session: Session | null;
  user: UserType | null;
}

const AuthContext = createContext<AuthContextType>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const isLogin = useMemo<boolean>(
    () => !!(session?.user.email && session?.user.confirmed_at),
    [session]
  );
  const [balance, setBalance] = useState<number | null>(null);
  const getBalance = async (publicKeyStr: string) => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed"); // or 'mainnet-beta'
    const publicKey = new PublicKey(publicKeyStr);

    try {
      const balance = await connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  };
  const checkUser = useCallback(
    async (_session: Session) => {
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
    },
    [user]
  );

  async function handleUserLogin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user logged in");
      return;
    }

    // Check if the user already has a wallet address
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id) // assuming 'id' is the PK from auth.users
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return;
    }

    // If the wallet_address is missing, generate a new one
    if (!data.wallet_paddress || !data.wallet_saddress) {
      const keypair = Keypair.generate(); // Generate a new Solana wallet
      const walletPaddress = keypair.publicKey.toBase58(); // Get the public address
      const walletSaddress = keypair.secretKey; // Get the securite address
      // Save the wallet address in the database (only once)
      const { error: updateError } = await supabase
        .from("users")
        .update({
          wallet_paddress: walletPaddress,
          wallet_saddress: walletSaddress,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating wallet address:", updateError);
      } else {
        console.log("Wallet address generated and saved successfully");
        const balance = await getBalance(walletPaddress);
        setBalance(Number(balance));
        const { error: balanceError } = await supabase
          .from("users")
          .update({ balance: balance })
          .eq("id", user.id);
        if (balanceError) {
          console.error("Error updating balance error", balanceError);
        }
      }
    } else if (data.wallet_paddress) {
      const balance = await getBalance(data.wallet_paddress);
      setBalance(Number(balance));
      const { error: balanceError } = await supabase
        .from("users")
        .update({ balance: balance })
        .eq("id", user.id);
      if (balanceError) {
        console.error("Error updating balance error", balanceError);
      }
    }
  }

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

    const checkAndCreateWallet = async () => {
      await handleUserLogin();
    };

    checkAndCreateWallet();

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
    <AuthContext.Provider value={{ session, isLogin, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
