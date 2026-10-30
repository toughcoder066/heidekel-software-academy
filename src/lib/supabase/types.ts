/**
 * Supabase Database Types
 * 
 * These types match the database schema defined in supabase/migrations/
 * They provide TypeScript type safety for all database operations.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'student' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: 'student' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'student' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          description: string;
          cover_image_url: string | null;
          price_amount: number;
          currency: string;
          prerequisites: string[];
          learning_outcomes: string[];
          certificate_requirements: string[];
          curriculum: Json;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_description: string;
          description: string;
          cover_image_url?: string | null;
          price_amount: number;
          currency?: string;
          prerequisites?: string[];
          learning_outcomes?: string[];
          certificate_requirements?: string[];
          curriculum?: Json;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          short_description?: string;
          description?: string;
          cover_image_url?: string | null;
          price_amount?: number;
          currency?: string;
          prerequisites?: string[];
          learning_outcomes?: string[];
          certificate_requirements?: string[];
          curriculum?: Json;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cohorts: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          start_date: string;
          end_date: string;
          enrollment_deadline: string;
          capacity: number;
          status: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          name: string;
          start_date: string;
          end_date: string;
          enrollment_deadline: string;
          capacity: number;
          status?: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          enrollment_deadline?: string;
          capacity?: number;
          status?: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      cohort_sessions: {
        Row: {
          id: string;
          cohort_id: string;
          title: string;
          description: string | null;
          starts_at: string;
          ends_at: string;
          meeting_url: string | null;
          recording_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cohort_id: string;
          title: string;
          description?: string | null;
          starts_at: string;
          ends_at: string;
          meeting_url?: string | null;
          recording_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cohort_id?: string;
          title?: string;
          description?: string | null;
          starts_at?: string;
          ends_at?: string;
          meeting_url?: string | null;
          recording_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          cohort_id: string;
          order_id: string;
          status: 'active' | 'completed' | 'cancelled';
          enrolled_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          cohort_id: string;
          order_id: string;
          status?: 'active' | 'completed' | 'cancelled';
          enrolled_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          cohort_id?: string;
          order_id?: string;
          status?: 'active' | 'completed' | 'cancelled';
          enrolled_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          student_id: string;
          cohort_id: string;
          amount: number;
          currency: string;
          status: 'pending' | 'paid' | 'failed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          cohort_id: string;
          amount: number;
          currency?: string;
          status?: 'pending' | 'paid' | 'failed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          cohort_id?: string;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'paid' | 'failed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          provider: string;
          provider_reference: string;
          amount: number;
          currency: string;
          status: 'pending' | 'success' | 'failed';
          paid_at: string | null;
          provider_metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          provider: string;
          provider_reference: string;
          amount: number;
          currency?: string;
          status?: 'pending' | 'success' | 'failed';
          paid_at?: string | null;
          provider_metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          provider?: string;
          provider_reference?: string;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'success' | 'failed';
          paid_at?: string | null;
          provider_metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          cohort_id: string;
          title: string;
          description: string;
          instructions: string;
          due_at: string;
          status: 'active' | 'closed' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cohort_id: string;
          title: string;
          description: string;
          instructions: string;
          due_at: string;
          status?: 'active' | 'closed' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cohort_id?: string;
          title?: string;
          description?: string;
          instructions?: string;
          due_at?: string;
          status?: 'active' | 'closed' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      project_submissions: {
        Row: {
          id: string;
          project_id: string;
          student_id: string;
          submission_text: string | null;
          submission_url: string | null;
          storage_path: string | null;
          status: 'not_started' | 'in_progress' | 'submitted' | 'changes_requested' | 'reviewed';
          feedback: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          student_id: string;
          submission_text?: string | null;
          submission_url?: string | null;
          storage_path?: string | null;
          status?: 'not_started' | 'in_progress' | 'submitted' | 'changes_requested' | 'reviewed';
          feedback?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          student_id?: string;
          submission_text?: string | null;
          submission_url?: string | null;
          storage_path?: string | null;
          status?: 'not_started' | 'in_progress' | 'submitted' | 'changes_requested' | 'reviewed';
          feedback?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          author_id: string;
          cohort_id: string | null;
          title: string;
          body: string;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          cohort_id?: string | null;
          title: string;
          body: string;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          cohort_id?: string | null;
          title?: string;
          body?: string;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          session_id: string;
          student_id: string;
          status: 'present' | 'absent' | 'excused' | 'late';
          recorded_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          student_id: string;
          status: 'present' | 'absent' | 'excused' | 'late';
          recorded_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          student_id?: string;
          status?: 'present' | 'absent' | 'excused' | 'late';
          recorded_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          details: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          resource_type: string;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          resource_type?: string;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
