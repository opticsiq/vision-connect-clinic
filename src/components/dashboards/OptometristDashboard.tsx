
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useClinicAuth } from '@/hooks/useClinicAuth'

export const OptometristDashboard: React.FC = () => {
  const { clinicUser } = useClinicAuth()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Optometrist Dashboard</CardTitle>
          <CardDescription>
            Welcome, {clinicUser?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Vision Care Specialist</h3>
            <p className="text-muted-foreground">
              Eye examination tools, prescription management, and vision therapy features will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
