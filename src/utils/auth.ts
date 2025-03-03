import { supabase } from "lib/supabase";

export const login = async (provider: string, email?: string): Promise<boolean> => {
  switch (provider) {
    case 'twitter':
    case 'google':
    {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
      });
      if (error) {
        console.error(error);
        return false;
      }
      return true;
    }
    case 'email': {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: true },
      });
      if (error) {
        console.error(error); 
        return false;
      }else {
        return true;
      }
    }
  }
  return false;
}

export const logout = async () => {
  await supabase.auth.signOut();
}