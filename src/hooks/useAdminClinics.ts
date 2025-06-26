
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import type { SubscriptionStatus, SubscriptionPlan } from '@/types/database'

interface Clinic {
  id: string
  name: string
  email: string
  subscription_status: SubscriptionStatus
  subscription_plan: SubscriptionPlan | null
  trial_end_date?: string
  subscription_end_date?: string
  created_at: string
}

export const useAdminClinics = () => {
  const { toast } = useToast()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClinics = async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClinics(data || [])
    } catch (error) {
      console.error('Error fetching clinics:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSubscription = async (clinicId: string, status: SubscriptionStatus, plan?: SubscriptionPlan) => {
    try {
      const updateData: any = { 
        subscription_status: status,
        updated_at: new Date().toISOString()
      }

      if (plan) {
        updateData.subscription_plan = plan
        
        // Set subscription end date based on plan
        const endDate = new Date()
        if (plan === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1)
        } else {
          endDate.setFullYear(endDate.getFullYear() + 1)
        }
        updateData.subscription_end_date = endDate.toISOString()
      }

      const { error } = await supabase
        .from('clinics')
        .update(updateData)
        .eq('id', clinicId)

      if (error) throw error

      toast({
        title: "Subscription updated",
        description: "Clinic subscription has been updated successfully.",
      })

      fetchClinics()
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchClinics()
  }, [])

  return { clinics, loading, fetchClinics, updateSubscription }
}
