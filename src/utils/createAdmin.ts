
import { supabase } from '@/lib/supabase'

export const createAdminAccount = async () => {
  try {
    console.log('Creating admin account...')
    
    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@clinic.com',
      password: 'admin123456',
    })

    if (authError && !authError.message.includes('User already registered')) {
      console.error('Auth error:', authError)
      return { success: false, error: authError.message }
    }

    console.log('Admin account setup complete!')
    return { success: true, message: 'Admin account created successfully' }
    
  } catch (error: any) {
    console.error('Failed to create admin account:', error)
    return { success: false, error: error.message }
  }
}
