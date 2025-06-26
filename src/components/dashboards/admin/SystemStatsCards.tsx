
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Users, Eye, Calendar, Package } from 'lucide-react'

interface SystemStats {
  totalClinics: number
  totalUsers: number
  totalImages: number
  totalAppointments: number
  totalInventoryItems: number
}

interface SystemStatsCardsProps {
  stats: SystemStats
}

export const SystemStatsCards: React.FC<SystemStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.totalClinics}</div>
              <div className="text-sm text-muted-foreground">Clinics</div>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.totalImages}</div>
              <div className="text-sm text-muted-foreground">AI Analyses</div>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <div className="text-sm text-muted-foreground">Appointments</div>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.totalInventoryItems}</div>
              <div className="text-sm text-muted-foreground">Inventory Items</div>
            </div>
            <Package className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
