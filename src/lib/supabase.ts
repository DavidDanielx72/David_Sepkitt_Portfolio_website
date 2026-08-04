import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Project = {
  id: string
  title: string
  tag: string | null
  icon: string | null
  stack: string[] | null
  description: string
  link: string
  demo: string | null
  sort_order: number
}

export type Certificate = {
  id: string
  title: string
  issuer: string | null
  file_path: string | null
  file_url: string | null
  sort_order: number
}
