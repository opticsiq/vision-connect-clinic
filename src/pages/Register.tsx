
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    fullName: '',
    role: ''
  })
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error(t('auth.errors.passwordMismatch'))
      }

      // Validate password strength
      if (formData.password.length < 6) {
        throw new Error(t('auth.errors.weakPassword'))
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        if (authError.message.includes('User already registered')) {
          throw new Error(t('auth.errors.emailInUse'))
        }
        throw authError
      }

      if (authData.user) {
        // Insert user profile data
        const { error: profileError } = await supabase
          .from('clinic_users')
          .insert({
            user_id: authData.user.id,
            name: formData.fullName,
            email: formData.email,
            role: formData.role,
            language: i18n.language,
            is_active: true
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        toast({
          title: t('auth.accountCreated'),
          description: t('auth.checkEmail'),
        })
        
        navigate('/login')
      }
    } catch (error: any) {
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
              {t('auth.signUp')}
            </CardTitle>
            <CardDescription>
              {t('auth.signUpDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                <Input
                  id="fullName"
                  placeholder={t('auth.namePlaceholder')}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
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
                <Label htmlFor="role">{t('auth.role')}</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({...formData, role: value})}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('auth.selectRole')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">{t('auth.doctor')}</SelectItem>
                    <SelectItem value="optometrist">{t('auth.optometrist')}</SelectItem>
                    <SelectItem value="secretary">{t('auth.secretary')}</SelectItem>
                  </SelectContent>
                </Select>
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
              
              <Button type="submit" className="w-full" disabled={loading || !formData.role}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.creatingAccount')}
                  </>
                ) : (
                  t('auth.createAccount')
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
