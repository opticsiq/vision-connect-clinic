
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Users, Calendar, FileText, Settings, Bell, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

type UserRole = "ophthalmologist" | "optometrist" | null;
type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
type Patient = {
  id: string;
  name: string;
  age: number;
  phone: string;
  notes?: string;
  createdAt: Date;
};
type Examination = {
  id: string;
  patientId: string;
  date: Date;
  type: string;
  results: {
    visualAcuity?: string;
    iop?: string;
    prescription?: string;
    notes?: string;
  };
  doctorId: string;
};

const Index = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [currentView, setCurrentView] = useState<"dashboard" | "patients" | "examinations">("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Mock authentication
  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as UserRole;

    if (isSignUp) {
      const newUser: User = {
        id: Date.now().toString(),
        name: name || email.split("@")[0],
        email,
        role: role || "optometrist"
      };
      setCurrentUser(newUser);
      toast({
        title: t('auth.accountCreated'),
        description: `${t('auth.welcome')} ${newUser.name}`
      });
    } else {
      const mockUser: User = {
        id: "1",
        name: "Dr. Sarah Johnson",
        email,
        role: "ophthalmologist"
      };
      setCurrentUser(mockUser);
      toast({
        title: t('auth.welcomeBack'),
        description: `${t('auth.signedInAs')} ${mockUser.name}`
      });
    }
  };

  const addPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPatient: Patient = {
      id: Date.now().toString(),
      name: formData.get("patientName") as string,
      age: parseInt(formData.get("patientAge") as string),
      phone: formData.get("patientPhone") as string,
      notes: formData.get("patientNotes") as string,
      createdAt: new Date()
    };
    setPatients([...patients, newPatient]);
    toast({
      title: t('toasts.patientAdded'),
      description: `${newPatient.name} ${t('toasts.patientAddedDesc')}`
    });
    e.currentTarget.reset();
  };

  const addExamination = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const formData = new FormData(e.currentTarget);
    const newExam: Examination = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      date: new Date(),
      type: formData.get("examType") as string,
      results: {
        visualAcuity: formData.get("visualAcuity") as string,
        iop: formData.get("iop") as string,
        prescription: formData.get("prescription") as string,
        notes: formData.get("examNotes") as string
      },
      doctorId: currentUser?.id || ""
    };
    setExaminations([...examinations, newExam]);
    toast({
      title: t('toasts.examRecorded'),
      description: `${t('examinations.examTypes.visualAcuity')} ${t('toasts.examRecordedDesc')} ${selectedPatient.name}.`
    });
    e.currentTarget.reset();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('app.title')}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">{t('app.subtitle')}</p>
          </CardHeader>
          <CardContent>
            <div className={`flex justify-center mb-4 space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <ThemeToggle />
              <LanguageToggle />
            </div>
            <Tabs value={isSignUp ? "signup" : "signin"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" onClick={() => setIsSignUp(false)}>
                  {t('auth.signIn')}
                </TabsTrigger>
                <TabsTrigger value="signup" onClick={() => setIsSignUp(true)}>
                  {t('auth.signUp')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder={t('auth.emailPlaceholder')} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    {t('auth.signIn')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('auth.fullName')}</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder={t('auth.namePlaceholder')} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder={t('auth.emailPlaceholder')} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('auth.role')}</Label>
                    <Select name="role" required>
                      <SelectTrigger>
                        <SelectValue placeholder={t('auth.selectRole')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ophthalmologist">{t('auth.ophthalmologist')}</SelectItem>
                        <SelectItem value="optometrist">{t('auth.optometrist')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    {t('auth.createAccount')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('app.title')}
              </h1>
            </div>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
              <LanguageToggle />
              <ThemeToggle />
              <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                <span className="text-sm text-gray-700 dark:text-gray-300">{currentUser.name}</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                  {currentUser.role === "ophthalmologist" ? "👨‍⚕️" : "🧑‍⚕️"}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentUser(null)} 
                className="border-gray-300 dark:border-gray-600"
              >
                {t('nav.signOut')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-1 mb-8`}>
          {[
            { id: "dashboard", label: t('nav.dashboard'), icon: Calendar },
            { id: "patients", label: t('nav.patients'), icon: Users },
            { id: "examinations", label: t('nav.examinations'), icon: FileText }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={currentView === tab.id ? "default" : "ghost"}
              onClick={() => setCurrentView(tab.id as any)}
              className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Dashboard View */}
        {currentView === "dashboard" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t('dashboard.welcomeBack')} {currentUser.name}!
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentUser.role === "ophthalmologist" ? t('auth.ophthalmologist') : t('auth.optometrist')}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('dashboard.totalPatients')}
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{patients.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('dashboard.examinations')}
                  </CardTitle>
                  <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{examinations.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('dashboard.todaySchedule')}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">8</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t('dashboard.appointments')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{t('dashboard.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentView("patients")} 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">{t('dashboard.addPatient')}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentView("examinations")} 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <FileText className="w-6 h-6" />
                    <span className="text-sm">{t('dashboard.newExam')}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Search className="w-6 h-6" />
                    <span className="text-sm">{t('dashboard.searchRecords')}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Settings className="w-6 h-6" />
                    <span className="text-sm">{t('dashboard.settings')}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Patients View */}
        {currentView === "patients" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t('patients.management')}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('patients.addNew')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addPatient} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">{t('patients.patientName')}</Label>
                      <Input 
                        id="patientName" 
                        name="patientName" 
                        placeholder={t('patients.namePlaceholder')} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientAge">{t('patients.age')}</Label>
                      <Input 
                        id="patientAge" 
                        name="patientAge" 
                        type="number" 
                        placeholder={t('patients.agePlaceholder')} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientPhone">{t('patients.phoneNumber')}</Label>
                      <Input 
                        id="patientPhone" 
                        name="patientPhone" 
                        placeholder={t('patients.phonePlaceholder')} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientNotes">{t('patients.notes')}</Label>
                      <Input 
                        id="patientNotes" 
                        name="patientNotes" 
                        placeholder={t('patients.notesPlaceholder')} 
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      {t('patients.addNew')}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('patients.patientList')} ({patients.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {patients.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{t('patients.noPatients')}</p>
                    ) : (
                      patients.map(patient => (
                        <div
                          key={patient.id}
                          className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">{patient.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{t('patients.age')}: {patient.age}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{patient.phone}</p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {patient.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          {patient.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{patient.notes}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Examinations View */}
        {currentView === "examinations" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('examinations.visionExaminations')}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('examinations.recordNew')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {patients.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">{t('examinations.addPatientsFirst')}</p>
                  ) : (
                    <form onSubmit={addExamination} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient">{t('examinations.selectPatient')}</Label>
                        <Select onValueChange={(value) => {
                          const patient = patients.find(p => p.id === value);
                          setSelectedPatient(patient || null);
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('examinations.choosePatient')} />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map(patient => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name} ({t('patients.age')}: {patient.age})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedPatient && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="examType">{t('examinations.examinationType')}</Label>
                            <Select name="examType">
                              <SelectTrigger>
                                <SelectValue placeholder={t('examinations.selectExamType')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="visual-acuity">{t('examinations.examTypes.visualAcuity')}</SelectItem>
                                <SelectItem value="topography">{t('examinations.examTypes.topography')}</SelectItem>
                                <SelectItem value="oct">{t('examinations.examTypes.oct')}</SelectItem>
                                <SelectItem value="iop">{t('examinations.examTypes.iop')}</SelectItem>
                                <SelectItem value="comprehensive">{t('examinations.examTypes.comprehensive')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="visualAcuity">{t('examinations.visualAcuity')}</Label>
                            <Input 
                              id="visualAcuity" 
                              name="visualAcuity" 
                              placeholder={t('examinations.placeholders.visualAcuity')} 
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="iop">{t('examinations.iop')}</Label>
                            <Input 
                              id="iop" 
                              name="iop" 
                              placeholder={t('examinations.placeholders.iop')} 
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="prescription">{t('examinations.prescription')}</Label>
                            <Input 
                              id="prescription" 
                              name="prescription" 
                              placeholder={t('examinations.placeholders.prescription')} 
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="examNotes">{t('examinations.examNotes')}</Label>
                            <Input 
                              id="examNotes" 
                              name="examNotes" 
                              placeholder={t('examinations.placeholders.notes')} 
                            />
                          </div>

                          <Button type="submit" className="w-full">
                            <FileText className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {t('examinations.recordExamination')}
                          </Button>
                        </>
                      )}
                    </form>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('examinations.recentExaminations')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {examinations.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{t('examinations.noExaminations')}</p>
                    ) : (
                      examinations.map(exam => {
                        const patient = patients.find(p => p.id === exam.patientId);
                        return (
                          <div
                            key={exam.id}
                            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">{patient?.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{exam.type}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {t('examinations.visualAcuity')}: {exam.results.visualAcuity || 'N/A'}
                                </p>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {exam.date.toLocaleDateString()}
                              </span>
                            </div>
                            {exam.results.notes && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{exam.results.notes}</p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
