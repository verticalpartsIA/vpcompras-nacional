import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://crvtpkrgjscssykyeqro.supabase.co'
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydnRwa3JnanNjc3N5a3llcXJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyNTg1NywiZXhwIjoyMDkxNDAxODU3fQ.79xZQrvRqPly6sPNqLTLmTlpUbJm4GeH0qObpb6_bOU'

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Provisioning the master user in the new Supabase project.
 * This script uses the service_role key to bypass email confirmation and create the user directly.
 * @security-auditor @architect-spaceX
 */
async function provisionUser() {
  const email = 'gelson.simoes@verticalparts.com.br'
  const password = 'Papa%@'

  console.log(`🚀 Provisionando usuário: ${email}...`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin', name: 'Gelson Simões' }
  })

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('✅ Usuário já existe no banco de dados.')
    } else {
      console.error('❌ Erro ao criar usuário:', error.message)
    }
  } else {
    console.log('✅ Usuário criado com sucesso e confirmado!')
  }
}

provisionUser()
