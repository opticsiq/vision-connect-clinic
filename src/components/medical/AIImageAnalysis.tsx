
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { useClinicAuth } from '@/hooks/useClinicAuth'
import { Upload, Eye, AlertTriangle, CheckCircle } from 'lucide-react'
import type { ImageType, UrgencyLevel } from '@/types/database'

interface AIAnalysisResult {
  analysis: string
  urgency: UrgencyLevel
  confidence: number
  recommendations: string[]
}

export const AIImageAnalysis: React.FC = () => {
  const { clinicUser } = useClinicAuth()
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageType, setImageType] = useState<ImageType>('retinal_scan')
  const [patientId, setPatientId] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setAnalysisResult(null)
    }
  }

  const analyzeImage = async () => {
    if (!selectedFile || !patientId || !clinicUser?.clinic_id) return

    setIsAnalyzing(true)
    
    try {
      // Upload image to Supabase storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${clinicUser.clinic_id}/medical-images/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-images')
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('medical-images')
        .getPublicUrl(filePath)

      // Simulate AI analysis (in production, this would call an actual AI service)
      const mockAnalysis = await simulateAIAnalysis(selectedFile, imageType)
      
      // Save to database
      const { error: dbError } = await supabase
        .from('medical_images')
        .insert({
          clinic_id: clinicUser.clinic_id,
          patient_id: patientId,
          image_url: publicUrl,
          image_type: imageType,
          ai_analysis: mockAnalysis.analysis,
          urgency_level: mockAnalysis.urgency,
          analyzed_at: new Date().toISOString()
        })

      if (dbError) throw dbError

      setAnalysisResult(mockAnalysis)
      
      toast({
        title: "Analysis Complete",
        description: "Medical image has been analyzed successfully.",
      })

    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const simulateAIAnalysis = async (file: File, type: ImageType): Promise<AIAnalysisResult> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock AI analysis results based on image type
    const mockResults = {
      retinal_scan: {
        analysis: "Retinal scan shows normal optic disc appearance with clear cup-to-disc ratio. No signs of diabetic retinopathy or macular degeneration detected.",
        urgency: 'low' as UrgencyLevel,
        confidence: 0.92,
        recommendations: [
          "Regular annual screening recommended",
          "Monitor for any vision changes",
          "Maintain good blood sugar control if diabetic"
        ]
      },
      eye_photo: {
        analysis: "External eye examination shows mild conjunctival irritation. No acute pathology detected.",
        urgency: 'medium' as UrgencyLevel,
        confidence: 0.87,
        recommendations: [
          "Consider artificial tears for dry eye symptoms",
          "Follow up in 2 weeks if symptoms persist",
          "Avoid eye rubbing"
        ]
      },
      other: {
        analysis: "Image quality sufficient for analysis. No immediate concerns identified.",
        urgency: 'low' as UrgencyLevel,
        confidence: 0.78,
        recommendations: [
          "Continue routine eye care",
          "Return if symptoms worsen"
        ]
      }
    }

    return mockResults[type] || mockResults.other
  }

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[urgency]
  }

  const getUrgencyIcon = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'low':
        return <CheckCircle className="h-4 w-4" />
      case 'medium':
        return <Eye className="h-4 w-4" />
      case 'high':
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            AI Medical Image Analysis
          </CardTitle>
          <CardDescription>
            Upload medical images for AI-powered analysis and diagnostic assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-id">Patient ID</Label>
            <Input
              id="patient-id"
              placeholder="Enter patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-type">Image Type</Label>
            <Select value={imageType} onValueChange={(value) => setImageType(value as ImageType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retinal_scan">Retinal Scan</SelectItem>
                <SelectItem value="eye_photo">Eye Photograph</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-upload">Medical Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="flex-1"
              />
              <Button
                onClick={analyzeImage}
                disabled={!selectedFile || !patientId || isAnalyzing}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Analysis Results
              <Badge className={`${getUrgencyColor(analysisResult.urgency)} flex items-center gap-1`}>
                {getUrgencyIcon(analysisResult.urgency)}
                {analysisResult.urgency.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">AI Analysis</h4>
              <p className="text-gray-700">{analysisResult.analysis}</p>
              <p className="text-sm text-gray-500 mt-1">
                Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>

            {analysisResult.urgency === 'critical' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Critical findings detected. Immediate medical attention may be required.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
