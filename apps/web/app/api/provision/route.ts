import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * Super-Secure Provisioning Route.
 * Visited once to create the master admin user in the Supabase project.
 * @architect-spaceX @security-auditor
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydnRwa3JnanNjc3N5a3llcXJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyNTg1NywiZXhwIjoyMDkxNDAxODU3fQ.79xZQrvRqPly6sPNqLTLmTlpUbJm4GeH0qObpb6_bOU'

  const supabase = createClient(supabaseUrl, supabaseServiceRole)
  
  const email = 'gelson.simoes@verticalparts.com.br'
  const password = 'Papa%@'

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin', name: 'Gelson Simões' }
  })

  if (error) {
    if (error.message.includes('already registered')) {
       return NextResponse.json({ status: 'success', message: 'Seu usuário já está pronto para o combate! Pode fazer o login.' })
    }
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }

  return NextResponse.json({ 
    status: 'success', 
    message: `Usuário ${email} criado com sucesso e confirmado no Banco de Dados!`,
    instruction: 'Agora volte para a tela de login e entre com suas credenciais.'
  })
}
