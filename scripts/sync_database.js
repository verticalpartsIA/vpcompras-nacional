/**
 * Sincronizador Inteligente de Migrations - VerticalParts
 * Rodar com: node scripts/sync_database.js
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// CONEXÃO VERIFICADA VIA PAINEL (Gelson S. - 10/04/2026)
const connectionString = 'postgresql://postgres.crvtpkrgjscssykyeqro:7Ywt87jXihh1qq9p@aws-1-sa-east-1.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  
  try {
    console.log('🔗 Conectando ao Banco de Dados...');
    await client.connect();
    
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Garante a ordem correta

    console.log(`📦 Encontradas ${files.length} migrations para processar.\n`);

    for (const file of files) {
      console.log(`🚀 Rodando: ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      try {
        await client.query(sql);
        console.log(`✅ ${file} aplicada com sucesso.`);
      } catch (sqlErr) {
        console.error(`❌ Erro em ${file}:`, sqlErr.message);
        // Se o erro for "already exists", podemos ignorar e seguir
        if (!sqlErr.message.includes('already exists')) {
            throw sqlErr;
        }
      }
    }

    console.log('\n🏆 TODAS AS MIGRATIONS FORAM APLICADAS!');
    console.log('O ecossistema VerticalParts está online no banco de dados.');

  } catch (err) {
    console.error('\n🔴 FALHA CRÍTICA NA SINCRONIZAÇÃO:', err.message);
  } finally {
    await client.end();
  }
}

run();
