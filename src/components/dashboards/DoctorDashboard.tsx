
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useClinicAuth } from '@/hooks/useClinicAuth'
import { AIImageAnalysis } from '@/components/medical/AIImageAnalysis'
import { Stethoscope, Eye, Users, Calendar } from 'lucide-react'

export const DoctorDashboard: React.FC = () => {
  const { clinicUser } = useClinicAuth()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Doctor Dashboard
          </CardTitle>
          <CardDescription>
            Welcome, Dr. {clinicUser?.name}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="ai-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-analysis">
          <AIImageAnalysis />
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Patient Management
              </CardTitle>
              <CardDescription>
                Manage patient records and medical history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Patient Records</h3>
                <p className="text-muted-foreground">
                  Complete patient management system will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment Schedule
              </CardTitle>
              <CardDescription>
                View and manage your appointment schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Today's Schedule</h3>
                <p className="text-muted-foreground">
                  Appointment scheduling system will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Medical Reports</CardTitle>
              <CardDescription>
                Generate and review medical reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Report Generation</h3>
                <p className="text-muted-foreground">
                  Medical reporting tools will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
