// Utilitaire pour créer le client Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les données
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'generation';
  description: string | null;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  prompt: string;
  count: number;
  credits_used: number;
  created_at: string;
}
