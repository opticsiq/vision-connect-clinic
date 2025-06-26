
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SystemStats {
  totalClinics: number
  totalUsers: number
  totalImages: number
  totalAppointments: number
  totalInventoryItems: number
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalClinics: 0,
    totalUsers: 0,
    totalImages: 0,
    totalAppointments: 0,
    totalInventoryItems: 0
  })

  const fetchSystemStats = async () => {
    try {
      // Fetch total clinics
      const { count: clinicsCount } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true })

      // Fetch total users
      const { count: usersCount } = await supabase
        .from('clinic_users')
        .select('*', { count: 'exact', head: true })

      // Fetch total medical images
      const { count: imagesCount } = await supabase
        .from('medical_images')
        .select('*', { count: 'exact', head: true })

      // Fetch total appointments
      const { count: appointmentsCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })

      // Fetch total inventory items
      const { count: inventoryCount } = await supabase
        .from('inventory_items')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalClinics: clinicsCount || 0,
        totalUsers: usersCount || 0,
        totalImages: imagesCount || 0,
        totalAppointments: appointmentsCount || 0,
        totalInventoryItems: inventoryCount || 0
      })
    } catch (error) {
      console.error('Error fetching system stats:', error)
    }
  }

  useEffect(() => {
    fetchSystemStats()
  }, [])

  return { stats, fetchSystemStats }
}
