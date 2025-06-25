
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { AIImageAnalysis } from '@/components/medical/AIImageAnalysis'
import { MultiChannelBooking } from '@/components/booking/MultiChannelBooking'
import { InventoryManagement } from '@/components/inventory/InventoryManagement'
import { Building2, Users, Eye, Calendar, Package, Settings } from 'lucide-react'
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

interface SystemStats {
  totalClinics: number
  totalUsers: number
  totalImages: number
  totalAppointments: number
  totalInventoryItems: number
}

export const AdminDashboard: React.FC = () => {
  const { toast } = useToast()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [stats, setStats] = useState<SystemStats>({
    totalClinics: 0,
    totalUsers: 0,
    totalImages: 0,
    totalAppointments: 0,
    totalInventoryItems: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClinics()
    fetchSystemStats()
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
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalClinics}</div>
                <div className="text-sm text-muted-foreground">Clinics</div>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalImages}</div>
                <div className="text-sm text-muted-foreground">AI Analyses</div>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                <div className="text-sm text-muted-foreground">Appointments</div>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalInventoryItems}</div>
                <div className="text-sm text-muted-foreground">Inventory Items</div>
              </div>
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Features Tabs */}
      <Tabs defaultValue="clinics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="clinics">Clinic Management</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="booking">Booking System</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="clinics">
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
        </TabsContent>

        <TabsContent value="ai-analysis">
          <AIImageAnalysis />
        </TabsContent>

        <TabsContent value="booking">
          <MultiChannelBooking />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure global system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">System Configuration</h3>
                <p className="text-muted-foreground">
                  Advanced system settings and global configurations will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
