
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ylpltdjfntqhgmiwdyav.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscGx0ZGpmbnRxaGdtaXdkeWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTgyNDUsImV4cCI6MjA2NjM3NDI0NX0.nxgnHuXeHgZ_eKoc-UaiZNqNGmU6oFys9ZqF4itD3hs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
