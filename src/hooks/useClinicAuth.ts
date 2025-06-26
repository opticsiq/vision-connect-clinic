
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types/database'

interface ClinicUser {
  id: string
  clinic_id: string
  role: UserRole
  name: string
  email: string
  is_active: boolean
}

export const useClinicAuth = () => {
  const { user } = useAuth()
  const [clinicUser, setClinicUser] = useState<ClinicUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClinicUser = async () => {
      if (!user) {
        setClinicUser(null)
        setLoading(false)
        return
      }

      // Check if user is platform admin
      if (user.email === 'admin@clinic.com') {
        setClinicUser({
          id: user.id,
          clinic_id: 'admin',
          role: 'admin',
          name: 'System Admin',
          email: user.email,
          is_active: true
        })
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('clinic_users')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single()

        if (error) {
          console.error('Error fetching clinic user:', error)
          setClinicUser(null)
        } else {
          setClinicUser(data)
        }
      } catch (error) {
        console.error('Error in fetchClinicUser:', error)
        setClinicUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchClinicUser()
  }, [user])

  return { clinicUser, loading }
}
