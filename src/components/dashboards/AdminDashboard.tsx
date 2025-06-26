
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AIImageAnalysis } from '@/components/medical/AIImageAnalysis'
import { MultiChannelBooking } from '@/components/booking/MultiChannelBooking'
import { InventoryManagement } from '@/components/inventory/InventoryManagement'
import { SystemStatsCards } from './admin/SystemStatsCards'
import { ClinicManagementTab } from './admin/ClinicManagementTab'
import { useAdminStats } from '@/hooks/useAdminStats'
import { useAdminClinics } from '@/hooks/useAdminClinics'
import { Settings } from 'lucide-react'

export const AdminDashboard: React.FC = () => {
  const { stats } = useAdminStats()
  const { clinics, loading, updateSubscription } = useAdminClinics()

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <SystemStatsCards stats={stats} />

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
          <ClinicManagementTab 
            clinics={clinics} 
            onUpdateSubscription={updateSubscription}
          />
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
