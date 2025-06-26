
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

      console.log('Fetching clinic user for:', user.email)

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
        // First, check if the user has a clinic_users record
        const { data: clinicUserData, error: clinicUserError } = await supabase
          .from('clinic_users')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .maybeSingle()

        console.log('Clinic user query result:', { clinicUserData, clinicUserError })

        if (clinicUserError && clinicUserError.code !== 'PGRST116') {
          console.error('Error fetching clinic user:', clinicUserError)
          throw clinicUserError
        }

        if (clinicUserData) {
          setClinicUser(clinicUserData)
        } else {
          // If no clinic_users record exists, check if they own a clinic
          const { data: clinicData, error: clinicError } = await supabase
            .from('clinics')
            .select('*')
            .eq('email', user.email)
            .maybeSingle()

          console.log('Clinic owner query result:', { clinicData, clinicError })

          if (clinicError && clinicError.code !== 'PGRST116') {
            console.error('Error fetching clinic:', clinicError)
            throw clinicError
          }

          if (clinicData) {
            // Create clinic_users record for the clinic owner
            const { data: newClinicUser, error: insertError } = await supabase
              .from('clinic_users')
              .insert({
                user_id: user.id,
                clinic_id: clinicData.id,
                name: clinicData.name + ' Admin',
                email: user.email,
                role: 'owner',
                is_active: true
              })
              .select()
              .single()

            console.log('Created clinic user:', { newClinicUser, insertError })

            if (insertError) {
              console.error('Error creating clinic user:', insertError)
              throw insertError
            }

            setClinicUser(newClinicUser)
          } else {
            console.log('No clinic or clinic_users record found for user')
            setClinicUser(null)
          }
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
