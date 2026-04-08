import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          company_name: string | null;
          role: 'lawyer' | 'individual' | 'law_firm' | 'student';
          jurisdiction: string;
          language_preference: 'en' | 'hi';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          company_name?: string | null;
          role?: 'lawyer' | 'individual' | 'law_firm' | 'student';
          jurisdiction?: string;
          language_preference?: 'en' | 'hi';
        };
        Update: {
          full_name?: string;
          company_name?: string | null;
          role?: 'lawyer' | 'individual' | 'law_firm' | 'student';
          jurisdiction?: string;
          language_preference?: 'en' | 'hi';
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'free' | 'pro' | 'team';
          status: 'active' | 'cancelled' | 'expired' | 'trialing';
          queries_used: number;
          queries_limit: number;
          current_period_start: string;
          current_period_end: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      chat_conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          jurisdiction: string;
          created_at: string;
          updated_at: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          type: 'contract' | 'nda' | 'agreement' | 'notice' | 'petition' | 'analysis' | 'custom';
          file_url: string | null;
          content: string;
          analysis_result: Record<string, unknown>;
          status: 'draft' | 'analyzing' | 'completed' | 'archived';
          created_at: string;
          updated_at: string;
        };
      };
      legal_templates: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          jurisdiction: string;
          content: string;
          variables: string[];
          is_public: boolean;
          usage_count: number;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
