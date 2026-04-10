import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase Client for Browser interactions.
 * Uses environment variables configured in .env.local
 * @supabase-expert
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
