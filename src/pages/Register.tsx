
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Loader2 } from 'lucide-react'

export const RegisterPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    clinicName: ''
  })
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Starting registration process for:', formData.email)

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error(t('auth.errors.passwordMismatch'))
      }

      // Validate password strength
      if (formData.password.length < 6) {
        throw new Error(t('auth.errors.weakPassword'))
      }

      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      console.log('Auth signup result:', { authData, authError })

      if (authError) {
        if (authError.message.includes('User already registered')) {
          throw new Error(t('auth.errors.emailInUse'))
        }
        throw authError
      }

      if (authData.user) {
        console.log('User created successfully, creating clinic...')

        // Create clinic record
        const { data: clinicData, error: clinicError } = await supabase
          .from('clinics')
          .insert({
            name: formData.clinicName,
            email: formData.email,
            subscription_status: 'trial',
            trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .single()

        console.log('Clinic creation result:', { clinicData, clinicError })

        if (clinicError) {
          console.error('Clinic creation error:', clinicError)
          throw new Error('Failed to create clinic')
        }

        // Create clinic owner profile
        const { data: profileData, error: profileError } = await supabase
          .from('clinic_users')
          .insert({
            user_id: authData.user.id,
            clinic_id: clinicData.id,
            name: formData.clinicName + ' Admin',
            email: formData.email,
            role: 'owner',
            is_active: true
          })
          .select()
          .single()

        console.log('Profile creation result:', { profileData, profileError })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          throw new Error('Failed to create user profile')
        }

        toast({
          title: t('auth.accountCreated'),
          description: t('auth.checkEmail'),
        })
        
        navigate('/login')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast({
        title: t('auth.errors.registrationFailed'),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center mb-6">
          <LanguageToggle />
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('auth.createClinicAccount')}
            </CardTitle>
            <CardDescription>
              {t('auth.clinicSignUpDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinicName">{t('auth.clinicName')}</Label>
                <Input
                  id="clinicName"
                  placeholder={t('auth.clinicNamePlaceholder')}
                  value={formData.clinicName}
                  onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.password')}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">{t('auth.passwordRequirement')}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('auth.confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.creatingClinic')}
                  </>
                ) : (
                  t('auth.createClinicAccount')
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.hasAccount')}{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  {t('auth.signIn')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage
