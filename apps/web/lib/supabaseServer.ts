import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Service Role Client for Server-Side Operations.
 * Used for administrative tasks and bypassing RLS when necessary (use with caution).
 * @security-auditor @architect-spaceX
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Must be in .env.local
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
