
import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export const ClinicRegistration: React.FC = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    clinicName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Calculate trial end date (7 days from now)
        const trialEndDate = new Date()
        trialEndDate.setDate(trialEndDate.getDate() + 7)

        // Create clinic record
        const { data: clinicData, error: clinicError } = await supabase
          .from('clinics')
          .insert({
            name: formData.clinicName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            subscription_status: 'trial',
            trial_end_date: trialEndDate.toISOString()
          })
          .select()
          .single()

        if (clinicError) throw clinicError

        // Create clinic owner user
        const { error: userError } = await supabase
          .from('clinic_users')
          .insert({
            clinic_id: clinicData.id,
            user_id: authData.user.id,
            role: 'owner',
            name: formData.clinicName + ' Owner',
            email: formData.email,
            is_active: true
          })

        if (userError) throw userError

        toast({
          title: "Clinic registered successfully!",
          description: "Your 7-day free trial has started. Check your email for confirmation.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register Your Clinic</CardTitle>
        <CardDescription>
          Create your clinic account and start your 7-day free trial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input
              id="clinicName"
              placeholder="Eye Care Clinic"
              value={formData.clinicName}
              onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="clinic@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              placeholder="123 Main St, City, State"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Start Free Trial'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
