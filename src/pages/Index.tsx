import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Eye, 
  Users, 
  FileText, 
  Settings, 
  Plus, 
  Search, 
  Bell,
  User,
  Calendar,
  Activity,
  TrendingUp,
  Shield,
  Phone,
  Mail,
  Camera,
  Upload,
  Download,
  Send,
  UserPlus,
  Eye as EyeIcon,
  Heart,
  Brain,
  Zap,
  Target,
  Award
} from 'lucide-react';

const Index = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientNotes, setNewPatientNotes] = useState('');
  const [examTopography, setExamTopography] = useState('');
  const [examOCT, setExamOCT] = useState('');
  const [examVisualAcuity, setExamVisualAcuity] = useState('');
  const [examPrescription, setExamPrescription] = useState('');
  const [examIOP, setExamIOP] = useState('');
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard' | 'patients' | 'exams'>('login');
  const [userRole, setUserRole] = useState<'ophthalmologist' | 'optometrist'>('optometrist');
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentView('dashboard');
    e.currentTarget.reset();
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const role = formData.get('role') as 'ophthalmologist' | 'optometrist';
    setUserRole(role);
    setCurrentView('dashboard');
    e.currentTarget.reset();
  };

  const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPatient = {
      id: Date.now(),
      name: formData.get('name'),
      age: formData.get('age'),
      phone: formData.get('phone'),
      notes: formData.get('notes')
    };
    setPatients([...patients, newPatient]);
    e.currentTarget.reset();
  };

  const handleAddExam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExam = {
      id: Date.now(),
      patientId: selectedPatient?.id,
      patientName: selectedPatient?.name,
      date: new Date().toLocaleDateString(),
      topography: formData.get('topography'),
      oct: formData.get('oct'),
      visualAcuity: formData.get('visualAcuity'),
      prescription: formData.get('prescription'),
      iop: formData.get('iop')
    };
    setExams([...exams, newExam]);
    e.currentTarget.reset();
  };

  if (currentView === 'login') {
    return (
      <div className="min-h-screen medical-gradient flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="w-full max-w-md shadow-medical glass-effect border-0">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                OptiCare
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Professional Vision Management
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="doctor@opticare.com"
                  className="h-11 rounded-xl border-2 focus:border-blue-500 transition-colors"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-2 focus:border-blue-500 transition-colors"
                  required 
                />
              </div>
              <Button type="submit" className="w-full h-11 rounded-xl text-lg font-semibold gradient-bg hover:opacity-90 transition-all duration-200 shadow-lg">
                Sign In
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">or</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('register')}
              className="w-full h-11 rounded-xl border-2 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            >
              Create New Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <div className="min-h-screen medical-gradient flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="w-full max-w-md shadow-medical glass-effect border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Join OptiCare</CardTitle>
            <CardDescription>Create your professional account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" className="rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" className="rounded-xl" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="doctor@opticare.com" className="rounded-xl" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" className="rounded-xl" required />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Professional Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-3 p-4 rounded-xl border-2 hover:border-blue-500 cursor-pointer transition-colors">
                    <input type="radio" name="role" value="optometrist" defaultChecked className="text-blue-600" />
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">Optometrist</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-4 rounded-xl border-2 hover:border-blue-500 cursor-pointer transition-colors">
                    <input type="radio" name="role" value="ophthalmologist" className="text-blue-600" />
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-teal-600" />
                      <span className="text-sm font-medium">Ophthalmologist</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-11 rounded-xl gradient-bg hover:opacity-90 transition-all duration-200 shadow-lg">
                Create Account
              </Button>
            </form>
            
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('login')}
              className="w-full rounded-xl"
            >
              ← Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">OptiCare</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userRole === 'ophthalmologist' ? 'Ophthalmologist' : 'Optometrist'} Dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="rounded-xl">
                  <Bell className="h-5 w-5" />
                </Button>
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentView('login')}
                  className="rounded-xl"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, Dr. Smith
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    You have {patients.length} patients and {exams.length} recent exams to review.
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
                    <div className="text-sm text-gray-500">Patients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">{exams.length}</div>
                    <div className="text-sm text-gray-500">Exams</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer rounded-2xl border-0 shadow-medical" onClick={() => setCurrentView('patients')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Manage Patients</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Add and view patient records</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer rounded-2xl border-0 shadow-medical" onClick={() => setCurrentView('exams')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Visual Exams</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Conduct and review examinations</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer rounded-2xl border-0 shadow-medical">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Schedule</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">View appointments and calendar</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer rounded-2xl border-0 shadow-medical">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Reports</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Generate and export reports</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="rounded-2xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exams.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent exams</p>
                  ) : (
                    exams.slice(-3).map((exam) => (
                      <div key={exam.id} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Eye className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{exam.patientName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Visual exam on {exam.date}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-teal-600" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Monthly Exams</span>
                      <span className="font-medium">{exams.length}/30</span>
                    </div>
                    <Progress value={(exams.length / 30) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Patient Satisfaction</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Report Completion</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'patients') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="rounded-xl">
                  ← Dashboard
                </Button>
                <h1 className="text-xl font-bold">Patient Management</h1>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="rounded-2xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  <span>Add New Patient</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" className="rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" name="age" type="number" placeholder="35" className="rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" className="rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Medical Notes</Label>
                    <Input id="notes" name="notes" placeholder="Any relevant medical history..." className="rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full rounded-xl gradient-bg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  <span>Patient List ({patients.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No patients added yet</p>
                  ) : (
                    patients.map((patient) => (
                      <div 
                        key={patient.id} 
                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setCurrentView('exams');
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{patient.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Age: {patient.age} • <Phone className="inline h-3 w-3" /> {patient.phone}
                            </p>
                          </div>
                        </div>
                        {patient.notes && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{patient.notes}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'exams') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => setCurrentView('patients')} className="rounded-xl">
                  ← Patients
                </Button>
                <div>
                  <h1 className="text-xl font-bold">Visual Examinations</h1>
                  {selectedPatient && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Patient: {selectedPatient.name}</p>
                  )}
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="rounded-2xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>New Examination</span>
                </CardTitle>
                <CardDescription>
                  {selectedPatient ? `Recording exam for ${selectedPatient.name}` : 'Select a patient first'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPatient ? (
                  <form onSubmit={handleAddExam} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="topography">Topography</Label>
                        <Input id="topography" name="topography" placeholder="Normal" className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="oct">OCT Results</Label>
                        <Input id="oct" name="oct" placeholder="No abnormalities" className="rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visualAcuity">Visual Acuity</Label>
                      <Input id="visualAcuity" name="visualAcuity" placeholder="20/20 OD, 20/25 OS" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prescription">Prescription</Label>
                      <Input id="prescription" name="prescription" placeholder="OD: -1.25, OS: -1.50" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="iop">Intraocular Pressure</Label>
                      <Input id="iop" name="iop" placeholder="16 mmHg OD, 15 mmHg OS" className="rounded-xl" />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline" className="flex-1 rounded-xl">
                        <Camera className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                      <Button type="button" variant="outline" className="flex-1 rounded-xl">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                    </div>
                    <Button type="submit" className="w-full rounded-xl gradient-bg">
                      <Plus className="h-4 w-4 mr-2" />
                      Save Examination
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Select a patient to begin examination</p>
                    <Button 
                      onClick={() => setCurrentView('patients')} 
                      className="mt-4 rounded-xl"
                      variant="outline"
                    >
                      Choose Patient
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                  <span>Examination History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exams.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No examinations recorded</p>
                  ) : (
                    exams.map((exam) => (
                      <div key={exam.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900 dark:text-white">{exam.patientName}</h3>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="rounded-lg">
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-lg">
                              <Send className="h-3 w-3 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p><span className="text-gray-600 dark:text-gray-300">Date:</span> {exam.date}</p>
                          <p><span className="text-gray-600 dark:text-gray-300">VA:</span> {exam.visualAcuity}</p>
                          <p><span className="text-gray-600 dark:text-gray-300">IOP:</span> {exam.iop}</p>
                          <p><span className="text-gray-600 dark:text-gray-300">Rx:</span> {exam.prescription}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
