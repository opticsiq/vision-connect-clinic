
import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useClinicAuth } from '@/hooks/useClinicAuth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminDashboard } from '@/components/dashboards/AdminDashboard'
import { ClinicOwnerDashboard } from '@/components/dashboards/ClinicOwnerDashboard'
import { SecretaryDashboard } from '@/components/dashboards/SecretaryDashboard'
import { DoctorDashboard } from '@/components/dashboards/DoctorDashboard'
import { OptometristDashboard } from '@/components/dashboards/OptometristDashboard'

export const RoleBasedLayout: React.FC = () => {
  const { user, signOut } = useAuth()
  const { clinicUser, loading } = useClinicAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

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
    return null
  }

  if (!clinicUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Account Setup Required</CardTitle>
            <CardDescription>
              Your account is not properly configured. Please contact support or try signing up again.
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
                {clinicUser.role === 'owner' ? 'Clinic Admin' : clinicUser.role.charAt(0).toUpperCase() + clinicUser.role.slice(1)} Dashboard
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
