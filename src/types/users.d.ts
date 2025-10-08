export interface UserType {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  rank: number;
  winrate: number;
  callcount: number;
  weekrate: number;
  monthrate: number;
  achievements: any; // JSONB from Supabase; keep flexible to avoid breaking consumers
  created_at: string;
  updated_at: string;
  last_login: string;
  taddress: string;
  xaddress: string;
  saddress: string;
  bio: string;
}

export interface WalletType {
  id: string;
  public_key: string;
  wallet_name: string;
  created_at: string;
  is_active: boolean;
  balance?: number;
}