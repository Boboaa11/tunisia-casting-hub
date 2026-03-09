export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          availability: string | null
          casting_id: number
          cover_message: string
          experience: string | null
          id: string
          photo_files: string[] | null
          portfolio_file: string | null
          role_id: string
          status: string | null
          submitted_at: string
          user_id: string
          video_showreel: string | null
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          availability?: string | null
          casting_id: number
          cover_message: string
          experience?: string | null
          id?: string
          photo_files?: string[] | null
          portfolio_file?: string | null
          role_id: string
          status?: string | null
          submitted_at?: string
          user_id: string
          video_showreel?: string | null
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          availability?: string | null
          casting_id?: number
          cover_message?: string
          experience?: string | null
          id?: string
          photo_files?: string[] | null
          portfolio_file?: string | null
          role_id?: string
          status?: string | null
          submitted_at?: string
          user_id?: string
          video_showreel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_casting_id_fkey"
            columns: ["casting_id"]
            isOneToOne: false
            referencedRelation: "castings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "casting_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      casting_roles: {
        Row: {
          age_range: string | null
          appearance: string | null
          casting_id: number
          created_at: string
          description: string | null
          ethnicity: string | null
          experience_level: string | null
          gender: string | null
          id: string
          languages: string[] | null
          name: string
          role_compensation: string | null
          role_location: string | null
          shooting_dates: string | null
          skills: string[] | null
          special_talents: string[] | null
          talents_needed: number | null
        }
        Insert: {
          age_range?: string | null
          appearance?: string | null
          casting_id: number
          created_at?: string
          description?: string | null
          ethnicity?: string | null
          experience_level?: string | null
          gender?: string | null
          id?: string
          languages?: string[] | null
          name: string
          role_compensation?: string | null
          role_location?: string | null
          shooting_dates?: string | null
          skills?: string[] | null
          special_talents?: string[] | null
          talents_needed?: number | null
        }
        Update: {
          age_range?: string | null
          appearance?: string | null
          casting_id?: number
          created_at?: string
          description?: string | null
          ethnicity?: string | null
          experience_level?: string | null
          gender?: string | null
          id?: string
          languages?: string[] | null
          name?: string
          role_compensation?: string | null
          role_location?: string | null
          shooting_dates?: string | null
          skills?: string[] | null
          special_talents?: string[] | null
          talents_needed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "casting_roles_casting_id_fkey"
            columns: ["casting_id"]
            isOneToOne: false
            referencedRelation: "castings"
            referencedColumns: ["id"]
          },
        ]
      }
      castings: {
        Row: {
          additional_requirements: string[] | null
          applications_count: number | null
          category: string
          compensation: string
          compensation_details: string | null
          contact_email: string | null
          created_at: string
          created_by: string | null
          deadline: string
          description: string
          id: number
          is_paid: boolean | null
          location: string
          production: string
          production_dates: string | null
          requirements: string[] | null
          shooting_locations: string[] | null
          status: string | null
          synopsis: string | null
          title: string
          type: string
          updated_at: string
          views: number | null
        }
        Insert: {
          additional_requirements?: string[] | null
          applications_count?: number | null
          category: string
          compensation: string
          compensation_details?: string | null
          contact_email?: string | null
          created_at?: string
          created_by?: string | null
          deadline: string
          description: string
          id?: number
          is_paid?: boolean | null
          location: string
          production: string
          production_dates?: string | null
          requirements?: string[] | null
          shooting_locations?: string[] | null
          status?: string | null
          synopsis?: string | null
          title: string
          type: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          additional_requirements?: string[] | null
          applications_count?: number | null
          category?: string
          compensation?: string
          compensation_details?: string | null
          contact_email?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string
          description?: string
          id?: number
          is_paid?: boolean | null
          location?: string
          production?: string
          production_dates?: string | null
          requirements?: string[] | null
          shooting_locations?: string[] | null
          status?: string | null
          synopsis?: string | null
          title?: string
          type?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      producer_requests: {
        Row: {
          company_name: string | null
          created_at: string
          description: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          production_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          description?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          production_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          description?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          production_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          plan_type: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          plan_type: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          plan_type?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      talent_profiles: {
        Row: {
          bio: string | null
          book_url: string | null
          city: string | null
          created_at: string
          eye_color: string | null
          first_name: string | null
          hair_color: string | null
          height: string | null
          id: string
          languages: string[] | null
          last_name: string | null
          photo_url: string | null
          profile_completion_percentage: number | null
          skills: string[] | null
          talent_type: string | null
          updated_at: string
          user_id: string
          weight: string | null
        }
        Insert: {
          bio?: string | null
          book_url?: string | null
          city?: string | null
          created_at?: string
          eye_color?: string | null
          first_name?: string | null
          hair_color?: string | null
          height?: string | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          photo_url?: string | null
          profile_completion_percentage?: number | null
          skills?: string[] | null
          talent_type?: string | null
          updated_at?: string
          user_id: string
          weight?: string | null
        }
        Update: {
          bio?: string | null
          book_url?: string | null
          city?: string | null
          created_at?: string
          eye_color?: string | null
          first_name?: string | null
          hair_color?: string | null
          height?: string | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          photo_url?: string | null
          profile_completion_percentage?: number | null
          skills?: string[] | null
          talent_type?: string | null
          updated_at?: string
          user_id?: string
          weight?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
