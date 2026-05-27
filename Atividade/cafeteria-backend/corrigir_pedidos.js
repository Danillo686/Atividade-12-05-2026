const pool = require('./db');

async function corrigirPedidos() {
  try {
    console.log('Corrigindo estrutura da tabela pedidos...');
    
    // Adicionar coluna descricao se não existir
    await pool.query('ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS descricao TEXT');
    console.log('Coluna descricao adicionada (se não existia)');
    
    // Adicionar coluna quantidade se não existir
    await pool.query('ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS quantidade INTEGER');
    console.log('Coluna quantidade adicionada (se não existia)');
    
    // Verificar estrutura atualizada
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'pedidos'
      ORDER BY ordinal_position
    `);
    
    console.log('\nEstrutura atualizada da tabela pedidos:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

corrigirPedidos();
