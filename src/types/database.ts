
export interface Database {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string
          address?: string
          subscription_status: 'trial' | 'active' | 'expired' | 'cancelled'
          subscription_plan: 'monthly' | 'yearly' | null
          trial_end_date?: string
          subscription_end_date?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string
          address?: string
          subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled'
          subscription_plan?: 'monthly' | 'yearly' | null
          trial_end_date?: string
          subscription_end_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled'
          subscription_plan?: 'monthly' | 'yearly' | null
          trial_end_date?: string
          subscription_end_date?: string
          updated_at?: string
        }
      }
      clinic_users: {
        Row: {
          id: string
          clinic_id: string
          user_id: string
          role: 'owner' | 'doctor' | 'secretary' | 'optometrist'
          name: string
          email: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          user_id: string
          role: 'owner' | 'doctor' | 'secretary' | 'optometrist'
          name: string
          email: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          user_id?: string
          role?: 'owner' | 'doctor' | 'secretary' | 'optometrist'
          name?: string
          email?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          clinic_id: string
          name: string
          email?: string
          phone?: string
          date_of_birth?: string
          address?: string
          medical_history?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          name: string
          email?: string
          phone?: string
          date_of_birth?: string
          address?: string
          medical_history?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          name?: string
          email?: string
          phone?: string
          date_of_birth?: string
          address?: string
          medical_history?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          clinic_id: string
          patient_id: string
          doctor_id?: string
          appointment_date: string
          appointment_time: string
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string
          booking_channel: 'website' | 'mobile' | 'whatsapp' | 'phone' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          patient_id: string
          doctor_id?: string
          appointment_date: string
          appointment_time: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string
          booking_channel?: 'website' | 'mobile' | 'whatsapp' | 'phone' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          patient_id?: string
          doctor_id?: string
          appointment_date?: string
          appointment_time?: string
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string
          booking_channel?: 'website' | 'mobile' | 'whatsapp' | 'phone' | 'admin'
          updated_at?: string
        }
      }
      medical_images: {
        Row: {
          id: string
          clinic_id: string
          patient_id: string
          image_url: string
          image_type: 'retinal_scan' | 'eye_photo' | 'other'
          ai_analysis?: string
          urgency_level: 'low' | 'medium' | 'high' | 'critical'
          doctor_notes?: string
          analyzed_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          patient_id: string
          image_url: string
          image_type: 'retinal_scan' | 'eye_photo' | 'other'
          ai_analysis?: string
          urgency_level?: 'low' | 'medium' | 'high' | 'critical'
          doctor_notes?: string
          analyzed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          patient_id?: string
          image_url?: string
          image_type?: 'retinal_scan' | 'eye_photo' | 'other'
          ai_analysis?: string
          urgency_level?: 'low' | 'medium' | 'high' | 'critical'
          doctor_notes?: string
          analyzed_at?: string
          updated_at?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          clinic_id: string
          name: string
          category: 'contact_lenses' | 'eyeglasses' | 'medicines' | 'equipment' | 'other'
          current_stock: number
          minimum_stock: number
          unit_price?: number
          supplier?: string
          last_restocked?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          name: string
          category: 'contact_lenses' | 'eyeglasses' | 'medicines' | 'equipment' | 'other'
          current_stock: number
          minimum_stock: number
          unit_price?: number
          supplier?: string
          last_restocked?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          name?: string
          category?: 'contact_lenses' | 'eyeglasses' | 'medicines' | 'equipment' | 'other'
          current_stock?: number
          minimum_stock?: number
          unit_price?: number
          supplier?: string
          last_restocked?: string
          updated_at?: string
        }
      }
      booking_channels: {
        Row: {
          id: string
          clinic_id: string
          channel_type: 'whatsapp' | 'google_calendar' | 'website' | 'mobile'
          is_active: boolean
          configuration: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          channel_type: 'whatsapp' | 'google_calendar' | 'website' | 'mobile'
          is_active?: boolean
          configuration?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          channel_type?: 'whatsapp' | 'google_calendar' | 'website' | 'mobile'
          is_active?: boolean
          configuration?: any
          updated_at?: string
        }
      }
    }
  }
}

export type UserRole = 'owner' | 'doctor' | 'secretary' | 'optometrist' | 'admin'
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled'
export type SubscriptionPlan = 'monthly' | 'yearly'
export type ImageType = 'retinal_scan' | 'eye_photo' | 'other'
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical'
export type InventoryCategory = 'contact_lenses' | 'eyeglasses' | 'medicines' | 'equipment' | 'other'
export type BookingChannel = 'website' | 'mobile' | 'whatsapp' | 'phone' | 'admin'
