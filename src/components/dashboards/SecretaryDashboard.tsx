
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useClinicAuth } from '@/hooks/useClinicAuth'
import { Calendar, Users, Clock, UserPlus } from 'lucide-react'

interface Patient {
  id: string
  name: string
  email?: string
  phone?: string
  created_at: string
}

interface Appointment {
  id: string
  patient_id: string
  appointment_date: string
  appointment_time: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  patients: { name: string }
}

export const SecretaryDashboard: React.FC = () => {
  const { clinicUser } = useClinicAuth()
  const { toast } = useToast()
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [newAppointment, setNewAppointment] = useState({
    patient_id: '',
    appointment_date: '',
    appointment_time: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (clinicUser?.clinic_id) {
      fetchPatients()
      fetchTodayAppointments()
    }
  }, [clinicUser])

  const fetchPatients = async () => {
    if (!clinicUser?.clinic_id) return

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', clinicUser.clinic_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPatients(data || [])
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTodayAppointments = async () => {
    if (!clinicUser?.clinic_id) return

    const today = new Date().toISOString().split('T')[0]

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (name)
        `)
        .eq('clinic_id', clinicUser.clinic_id)
        .eq('appointment_date', today)
        .order('appointment_time', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const addPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clinicUser?.clinic_id) return

    try {
      const { error } = await supabase
        .from('patients')
        .insert({
          clinic_id: clinicUser.clinic_id,
          name: newPatient.name,
          email: newPatient.email || null,
          phone: newPatient.phone || null
        })

      if (error) throw error

      toast({
        title: "Patient added successfully",
        description: "New patient has been registered.",
      })

      setNewPatient({ name: '', email: '', phone: '' })
      fetchPatients()
    } catch (error: any) {
      toast({
        title: "Failed to add patient",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const scheduleAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clinicUser?.clinic_id) return

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          clinic_id: clinicUser.clinic_id,
          patient_id: newAppointment.patient_id,
          appointment_date: newAppointment.appointment_date,
          appointment_time: newAppointment.appointment_time,
          status: 'scheduled'
        })

      if (error) throw error

      toast({
        title: "Appointment scheduled",
        description: "New appointment has been created.",
      })

      setNewAppointment({ patient_id: '', appointment_date: '', appointment_time: '' })
      fetchTodayAppointments()
    } catch (error: any) {
      toast({
        title: "Failed to schedule appointment",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)

      if (error) throw error

      toast({
        title: "Appointment updated",
        description: "Appointment status has been updated.",
      })

      fetchTodayAppointments()
    } catch (error: any) {
      toast({
        title: "Failed to update appointment",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
      no_show: 'outline'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>
  }

  const todayStats = {
    total: appointments.length,
    completed: appointments.filter(a => a.status === 'completed').length,
    noShows: appointments.filter(a => a.status === 'no_show').length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length
  }

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{todayStats.total}</div>
                <div className="text-sm text-muted-foreground">Today's Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{todayStats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{todayStats.scheduled}</div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{todayStats.noShows}</div>
                <div className="text-sm text-muted-foreground">No Shows</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>Manage today's schedule</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Schedule Appointment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Appointment</DialogTitle>
                  <DialogDescription>Create a new appointment</DialogDescription>
                </DialogHeader>
                <form onSubmit={scheduleAppointment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newAppointment.patient_id}
                      onChange={(e) => setNewAppointment({...newAppointment, patient_id: e.target.value})}
                      required
                    >
                      <option value="">Select Patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>{patient.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAppointment.appointment_date}
                      onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newAppointment.appointment_time}
                      onChange={(e) => setNewAppointment({...newAppointment, appointment_time: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Schedule</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.appointment_time}</TableCell>
                  <TableCell>{appointment.patients.name}</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {appointment.status === 'scheduled' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'no_show')}
                          >
                            No Show
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patients Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Patients</CardTitle>
              <CardDescription>Manage patient information</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                  <DialogDescription>Register a new patient</DialogDescription>
                </DialogHeader>
                <form onSubmit={addPatient} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Patient</Button>
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
                <TableHead>Phone</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.email || '-'}</TableCell>
                  <TableCell>{patient.phone || '-'}</TableCell>
                  <TableCell>{new Date(patient.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
