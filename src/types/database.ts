
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
          updated_at?: string
        }
      }
    }
  }
}

export type UserRole = 'owner' | 'doctor' | 'secretary' | 'optometrist' | 'admin'
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled'
export type SubscriptionPlan = 'monthly' | 'yearly'
