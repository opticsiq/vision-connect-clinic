import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useClinicAuth } from '@/hooks/useClinicAuth'
import { AIImageAnalysis } from '@/components/medical/AIImageAnalysis'
import { MultiChannelBooking } from '@/components/booking/MultiChannelBooking'
import { InventoryManagement } from '@/components/inventory/InventoryManagement'
import { Building2, Users, UserPlus, Eye, Calendar, Package } from 'lucide-react'
import type { UserRole } from '@/types/database'

interface ClinicInfo {
  id: string
  name: string
  subscription_status: string
  subscription_plan: string | null
  trial_end_date?: string
  subscription_end_date?: string
}

interface ClinicUser {
  id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export const ClinicOwnerDashboard: React.FC = () => {
  const { clinicUser } = useClinicAuth()
  const { toast } = useToast()
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(null)
  const [clinicUsers, setClinicUsers] = useState<ClinicUser[]>([])
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '' as UserRole
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (clinicUser?.clinic_id) {
      fetchClinicInfo()
      fetchClinicUsers()
    }
  }, [clinicUser])

  const fetchClinicInfo = async () => {
    if (!clinicUser?.clinic_id) return

    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', clinicUser.clinic_id)
        .single()

      if (error) throw error
      setClinicInfo(data)
    } catch (error) {
      console.error('Error fetching clinic info:', error)
    }
  }

  const fetchClinicUsers = async () => {
    if (!clinicUser?.clinic_id) return

    try {
      const { data, error } = await supabase
        .from('clinic_users')
        .select('*')
        .eq('clinic_id', clinicUser.clinic_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClinicUsers(data || [])
    } catch (error) {
      console.error('Error fetching clinic users:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clinicUser?.clinic_id) return

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserForm.email,
        password: newUserForm.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create clinic user
        const { error: userError } = await supabase
          .from('clinic_users')
          .insert({
            clinic_id: clinicUser.clinic_id,
            user_id: authData.user.id,
            role: newUserForm.role,
            name: newUserForm.name,
            email: newUserForm.email,
            is_active: true
          })

        if (userError) throw userError

        toast({
          title: "User created successfully",
          description: `${newUserForm.role} has been added to your clinic.`,
        })

        setNewUserForm({ name: '', email: '', password: '', role: '' as UserRole })
        fetchClinicUsers()
      }
    } catch (error: any) {
      toast({
        title: "Failed to create user",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('clinic_users')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "User status updated",
        description: `User has been ${!currentStatus ? 'activated' : 'deactivated'}.`,
      })

      fetchClinicUsers()
    } catch (error: any) {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Clinic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Clinic Information
          </CardTitle>
          <CardDescription>Your clinic's subscription and status</CardDescription>
        </CardHeader>
        <CardContent>
          {clinicInfo && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Clinic Name</Label>
                <div className="font-medium">{clinicInfo.name}</div>
              </div>
              <div>
                <Label>Subscription Status</Label>
                <div>
                  <Badge variant={clinicInfo.subscription_status === 'active' ? 'default' : 'secondary'}>
                    {clinicInfo.subscription_status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Plan</Label>
                <div>{clinicInfo.subscription_plan || 'Trial'}</div>
              </div>
              <div>
                <Label>End Date</Label>
                <div>
                  {clinicInfo.trial_end_date || clinicInfo.subscription_end_date 
                    ? new Date(clinicInfo.trial_end_date || clinicInfo.subscription_end_date!).toLocaleDateString()
                    : 'N/A'
                  }
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Features Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="booking">Booking System</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Clinic Users
                  </CardTitle>
                  <CardDescription>Manage users and their roles</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account for your clinic
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createNewUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUserForm.password}
                          onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm({...newUserForm, role: value as UserRole})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="doctor">Doctor</SelectItem>
                            <SelectItem value="secretary">Secretary</SelectItem>
                            <SelectItem value="optometrist">Optometrist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full">Create User</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clinicUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.role !== 'owner' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                        )}
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

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Reports</CardTitle>
              <CardDescription>
                Generate and view clinic performance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Analytics & Reports</h3>
                <p className="text-muted-foreground">
                  Comprehensive reporting system will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
