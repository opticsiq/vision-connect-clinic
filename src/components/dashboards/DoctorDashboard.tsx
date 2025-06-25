
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useClinicAuth } from '@/hooks/useClinicAuth'

export const DoctorDashboard: React.FC = () => {
  const { clinicUser } = useClinicAuth()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Doctor Dashboard</CardTitle>
          <CardDescription>
            Welcome, Dr. {clinicUser?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Full Clinical Access</h3>
            <p className="text-muted-foreground">
              Complete patient management, medical records, and clinical tools will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
