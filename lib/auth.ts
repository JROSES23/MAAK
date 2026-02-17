import { supabase } from '@/lib/supabase';

export const authClient = {
  signIn: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
  signUp: (email: string, password: string) => supabase.auth.signUp({ email, password }),
  resetPassword: (email: string) => supabase.auth.resetPasswordForEmail(email),
  signOut: () => supabase.auth.signOut(),
  getUser: () => supabase.auth.getUser()
};
