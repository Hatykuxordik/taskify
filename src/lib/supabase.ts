import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: "pending" | "in-progress" | "completed";
          category: string | null;
          due_date: string | null;
          priority: "low" | "medium" | "high" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: "pending" | "in-progress" | "completed";
          category?: string | null;
          due_date?: string | null;
          priority?: "low" | "medium" | "high" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: "pending" | "in-progress" | "completed";
          category?: string | null;
          due_date?: string | null;
          priority?: "low" | "medium" | "high" | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          tags: string[] | null;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          tags?: string[] | null;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          tags?: string[] | null;
          is_pinned?: boolean;
        };
      };
    };
  };
};
