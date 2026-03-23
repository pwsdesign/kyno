export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string;
          dog_id: string | null;
          id: string;
          notes: string | null;
          price_label: string | null;
          provider_category: string | null;
          provider_name: string;
          scheduled_for: string;
          service_id: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          dog_id?: string | null;
          id?: string;
          notes?: string | null;
          price_label?: string | null;
          provider_category?: string | null;
          provider_name: string;
          scheduled_for: string;
          service_id: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          dog_id?: string | null;
          id?: string;
          notes?: string | null;
          price_label?: string | null;
          provider_category?: string | null;
          provider_name?: string;
          scheduled_for?: string;
          service_id?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      dogs: {
        Row: {
          created_at: string;
          altered_status: string | null;
          breed: string | null;
          care_notes: string | null;
          dob: string | null;
          id: string;
          name: string;
          personality: string | null;
          profile_photo_data: string | null;
          profile_photo_name: string | null;
          sex: string | null;
          user_id: string;
          vaccine_history_name: string | null;
          vaccine_history_note: string | null;
          weight: string | null;
        };
        Insert: {
          altered_status?: string | null;
          breed?: string | null;
          care_notes?: string | null;
          created_at?: string;
          dob?: string | null;
          id?: string;
          name: string;
          personality?: string | null;
          profile_photo_data?: string | null;
          profile_photo_name?: string | null;
          sex?: string | null;
          user_id: string;
          vaccine_history_name?: string | null;
          vaccine_history_note?: string | null;
          weight?: string | null;
        };
        Update: {
          altered_status?: string | null;
          breed?: string | null;
          care_notes?: string | null;
          created_at?: string;
          dob?: string | null;
          id?: string;
          name?: string;
          personality?: string | null;
          profile_photo_data?: string | null;
          profile_photo_name?: string | null;
          sex?: string | null;
          user_id?: string;
          vaccine_history_name?: string | null;
          vaccine_history_note?: string | null;
          weight?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          created_at: string;
          email: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          first_name: string | null;
          id: string;
          membership_plan: 'free' | 'kyno_plus';
          membership_plan_activated_at: string | null;
          last_name: string | null;
          membership_id: string | null;
          phone: string | null;
          updated_at: string;
          wallet_pass_token: string | null;
          wallet_pass_url: string | null;
        };
        Insert: {
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          created_at?: string;
          email?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          first_name?: string | null;
          id: string;
          membership_plan?: 'free' | 'kyno_plus';
          membership_plan_activated_at?: string | null;
          last_name?: string | null;
          membership_id?: string | null;
          phone?: string | null;
          updated_at?: string;
          wallet_pass_token?: string | null;
          wallet_pass_url?: string | null;
        };
        Update: {
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          created_at?: string;
          email?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          first_name?: string | null;
          id?: string;
          membership_plan?: 'free' | 'kyno_plus';
          membership_plan_activated_at?: string | null;
          last_name?: string | null;
          membership_id?: string | null;
          phone?: string | null;
          updated_at?: string;
          wallet_pass_token?: string | null;
          wallet_pass_url?: string | null;
        };
        Relationships: [];
      };
      membership_upgrade_requests: {
        Row: {
          created_at: string;
          id: string;
          note: string | null;
          requested_plan: 'kyno_plus';
          status: 'pending' | 'approved' | 'declined';
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          note?: string | null;
          requested_plan?: 'kyno_plus';
          status?: 'pending' | 'approved' | 'declined';
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          note?: string | null;
          requested_plan?: 'kyno_plus';
          status?: 'pending' | 'approved' | 'declined';
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      community_messages: {
        Row: {
          author_label: string;
          body: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          author_label?: string;
          body: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          author_label?: string;
          body?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
  };
}
