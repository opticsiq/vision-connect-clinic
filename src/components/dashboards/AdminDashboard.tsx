
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

export const AdminDashboard: React.FC = () => {
  const { toast } = useToast()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClinics()
  }, [])

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

  const getStatusBadge = (status: SubscriptionStatus) => {
    const variants = {
      trial: 'secondary',
      active: 'default',
      expired: 'destructive',
      cancelled: 'outline'
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clinic Management Dashboard</CardTitle>
          <CardDescription>
            Manage all registered clinics and their subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{clinics.length}</div>
                <div className="text-sm text-muted-foreground">Total Clinics</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {clinics.filter(c => c.subscription_status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {clinics.filter(c => c.subscription_status === 'trial').length}
                </div>
                <div className="text-sm text-muted-foreground">Trial</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">
                  {clinics.filter(c => c.subscription_status === 'expired').length}
                </div>
                <div className="text-sm text-muted-foreground">Expired</div>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clinic Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinics.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell className="font-medium">{clinic.name}</TableCell>
                  <TableCell>{clinic.email}</TableCell>
                  <TableCell>{getStatusBadge(clinic.subscription_status)}</TableCell>
                  <TableCell>
                    {clinic.subscription_plan ? (
                      <Badge variant="outline">
                        {clinic.subscription_plan.charAt(0).toUpperCase() + clinic.subscription_plan.slice(1)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) => {
                          const [status, plan] = value.split('-')
                          updateSubscription(
                            clinic.id, 
                            status as SubscriptionStatus, 
                            plan as SubscriptionPlan
                          )
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Actions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active-monthly">Activate Monthly</SelectItem>
                          <SelectItem value="active-yearly">Activate Yearly</SelectItem>
                          <SelectItem value="cancelled-">Cancel</SelectItem>
                          <SelectItem value="expired-">Mark Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
