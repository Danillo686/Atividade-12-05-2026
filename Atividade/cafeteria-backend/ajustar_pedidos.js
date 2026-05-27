const pool = require('./db');

async function ajustarPedidos() {
  try {
    console.log('Ajustando restrições da tabela pedidos...');
    
    // Verificar se a coluna produto pode ser nula
    const constraintsResult = await pool.query(`
      SELECT column_name, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'pedidos' AND column_name = 'produto'
    `);
    
    console.log('Restrição da coluna produto:', constraintsResult.rows[0]);
    
    // Tornar a coluna produto opcional
    await pool.query('ALTER TABLE pedidos ALTER COLUMN produto DROP NOT NULL');
    console.log('Coluna produto agora pode ser nula');
    
    // Tornar a coluna valor opcional também
    await pool.query('ALTER TABLE pedidos ALTER COLUMN valor DROP NOT NULL');
    console.log('Coluna valor agora pode ser nula');
    
    // Verificar novamente
    const updatedResult = await pool.query(`
      SELECT column_name, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'pedidos' AND column_name IN ('produto', 'valor')
    `);
    
    console.log('\nRestrições atualizadas:');
    updatedResult.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.is_nullable === 'YES' ? 'Pode ser nulo' : 'Não pode ser nulo'}`);
    });
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

ajustarPedidos();
