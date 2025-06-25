
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { useClinicAuth } from '@/hooks/useClinicAuth'
import { Smartphone, Globe, MessageCircle, Phone, Calendar, Settings } from 'lucide-react'

interface BookingChannel {
  id: string
  channel_type: 'whatsapp' | 'google_calendar' | 'website' | 'mobile'
  is_active: boolean
  configuration: any
}

export const MultiChannelBooking: React.FC = () => {
  const { clinicUser } = useClinicAuth()
  const { toast } = useToast()
  const [channels, setChannels] = useState<BookingChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [whatsappConfig, setWhatsappConfig] = useState({
    phone_number: '',
    api_token: '',
    welcome_message: 'Welcome! How can we help you book an appointment?'
  })
  const [googleCalendarConfig, setGoogleCalendarConfig] = useState({
    calendar_id: '',
    client_id: '',
    client_secret: ''
  })

  useEffect(() => {
    fetchBookingChannels()
  }, [clinicUser])

  const fetchBookingChannels = async () => {
    if (!clinicUser?.clinic_id) return

    try {
      const { data, error } = await supabase
        .from('booking_channels')
        .select('*')
        .eq('clinic_id', clinicUser.clinic_id)

      if (error) throw error
      setChannels(data || [])
    } catch (error) {
      console.error('Error fetching booking channels:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleChannel = async (channelType: string, isActive: boolean) => {
    if (!clinicUser?.clinic_id) return

    try {
      const existingChannel = channels.find(c => c.channel_type === channelType)
      
      if (existingChannel) {
        const { error } = await supabase
          .from('booking_channels')
          .update({ is_active: isActive })
          .eq('id', existingChannel.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('booking_channels')
          .insert({
            clinic_id: clinicUser.clinic_id,
            channel_type: channelType as any,
            is_active: isActive,
            configuration: {}
          })
        
        if (error) throw error
      }

      await fetchBookingChannels()
      
      toast({
        title: "Channel Updated",
        description: `${channelType} booking has been ${isActive ? 'enabled' : 'disabled'}.`,
      })
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const saveWhatsAppConfig = async () => {
    if (!clinicUser?.clinic_id) return

    try {
      const existingChannel = channels.find(c => c.channel_type === 'whatsapp')
      
      if (existingChannel) {
        const { error } = await supabase
          .from('booking_channels')
          .update({ configuration: whatsappConfig })
          .eq('id', existingChannel.id)
        
        if (error) throw error
      }

      toast({
        title: "WhatsApp Configuration Saved",
        description: "Your WhatsApp booking settings have been updated.",
      })
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const saveGoogleCalendarConfig = async () => {
    if (!clinicUser?.clinic_id) return

    try {
      const existingChannel = channels.find(c => c.channel_type === 'google_calendar')
      
      if (existingChannel) {
        const { error } = await supabase
          .from('booking_channels')
          .update({ configuration: googleCalendarConfig })
          .eq('id', existingChannel.id)
        
        if (error) throw error
      }

      toast({
        title: "Google Calendar Configuration Saved",
        description: "Your calendar integration settings have been updated.",
      })
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />
      case 'google_calendar': return <Calendar className="h-4 w-4" />
      case 'website': return <Globe className="h-4 w-4" />
      case 'mobile': return <Smartphone className="h-4 w-4" />
      default: return <Phone className="h-4 w-4" />
    }
  }

  const isChannelActive = (type: string) => {
    return channels.find(c => c.channel_type === type)?.is_active || false
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Multi-Channel Booking System
          </CardTitle>
          <CardDescription>
            Manage appointment booking across multiple channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'website', label: 'Website', description: 'Online booking form' },
              { type: 'mobile', label: 'Mobile App', description: 'Mobile application' },
              { type: 'whatsapp', label: 'WhatsApp', description: 'WhatsApp messaging' },
              { type: 'google_calendar', label: 'Google Calendar', description: 'Calendar integration' }
            ].map((channel) => (
              <Card key={channel.type} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(channel.type)}
                    <span className="font-medium">{channel.label}</span>
                  </div>
                  <Switch
                    checked={isChannelActive(channel.type)}
                    onCheckedChange={(checked) => toggleChannel(channel.type, checked)}
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
                <Badge variant={isChannelActive(channel.type) ? 'default' : 'secondary'}>
                  {isChannelActive(channel.type) ? 'Active' : 'Inactive'}
                </Badge>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="whatsapp">WhatsApp Setup</TabsTrigger>
          <TabsTrigger value="calendar">Google Calendar Setup</TabsTrigger>
        </TabsList>
        
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Business Integration</CardTitle>
              <CardDescription>
                Configure WhatsApp Business API for automated appointment booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-phone">Business Phone Number</Label>
                <Input
                  id="whatsapp-phone"
                  placeholder="+1234567890"
                  value={whatsappConfig.phone_number}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, phone_number: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp-token">API Token</Label>
                <Input
                  id="whatsapp-token"
                  type="password"
                  placeholder="Your WhatsApp Business API token"
                  value={whatsappConfig.api_token}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, api_token: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Input
                  id="welcome-message"
                  placeholder="Welcome message for patients"
                  value={whatsappConfig.welcome_message}
                  onChange={(e) => setWhatsappConfig({...whatsappConfig, welcome_message: e.target.value})}
                />
              </div>
              <Button onClick={saveWhatsAppConfig} className="w-full">
                Save WhatsApp Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Google Calendar Integration</CardTitle>
              <CardDescription>
                Sync appointments with Google Calendar to prevent conflicts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calendar-id">Calendar ID</Label>
                <Input
                  id="calendar-id"
                  placeholder="your-calendar@gmail.com"
                  value={googleCalendarConfig.calendar_id}
                  onChange={(e) => setGoogleCalendarConfig({...googleCalendarConfig, calendar_id: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input
                  id="client-id"
                  placeholder="Google OAuth Client ID"
                  value={googleCalendarConfig.client_id}
                  onChange={(e) => setGoogleCalendarConfig({...googleCalendarConfig, client_id: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input
                  id="client-secret"
                  type="password"
                  placeholder="Google OAuth Client Secret"
                  value={googleCalendarConfig.client_secret}
                  onChange={(e) => setGoogleCalendarConfig({...googleCalendarConfig, client_secret: e.target.value})}
                />
              </div>
              <Button onClick={saveGoogleCalendarConfig} className="w-full">
                Save Calendar Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
