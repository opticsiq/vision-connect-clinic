
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useClinicAuth } from '@/hooks/useClinicAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminDashboard } from '@/components/dashboards/AdminDashboard'
import { ClinicOwnerDashboard } from '@/components/dashboards/ClinicOwnerDashboard'
import { SecretaryDashboard } from '@/components/dashboards/SecretaryDashboard'
import { DoctorDashboard } from '@/components/dashboards/DoctorDashboard'
import { OptometristDashboard } from '@/components/dashboards/OptometristDashboard'
import { ClinicRegistration } from '@/components/auth/ClinicRegistration'
import { AuthTest } from '@/components/AuthTest'

export const RoleBasedLayout: React.FC = () => {
  const { user, signOut } = useAuth()
  const { clinicUser, loading } = useClinicAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Optometry Clinic Management</h1>
            <p className="text-gray-600 mt-2">Professional clinic management system</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">New Clinic Registration</h2>
              <ClinicRegistration />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Existing User Login</h2>
              <AuthTest />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!clinicUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Account Setup Required</CardTitle>
            <CardDescription>
              Your account is not associated with any clinic. Please contact support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={signOut} className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Optometry Clinic Management
              </h1>
              <p className="text-sm text-gray-500">
                {clinicUser.role.charAt(0).toUpperCase() + clinicUser.role.slice(1)} Dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {clinicUser.name}
              </span>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {clinicUser.role === 'admin' && <AdminDashboard />}
        {clinicUser.role === 'owner' && <ClinicOwnerDashboard />}
        {clinicUser.role === 'secretary' && <SecretaryDashboard />}
        {clinicUser.role === 'doctor' && <DoctorDashboard />}
        {clinicUser.role === 'optometrist' && <OptometristDashboard />}
      </main>
    </div>
  )
}
