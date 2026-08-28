import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://ruobdbqkhhvuomctbijf.supabase.co"
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})
