
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

interface ClinicManagementTabProps {
  clinics: Clinic[]
  onUpdateSubscription: (clinicId: string, status: SubscriptionStatus, plan?: SubscriptionPlan) => void
}

export const ClinicManagementTab: React.FC<ClinicManagementTabProps> = ({ 
  clinics, 
  onUpdateSubscription 
}) => {
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

  return (
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
                        onUpdateSubscription(
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
  )
}
