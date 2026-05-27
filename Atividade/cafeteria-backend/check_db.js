const db = require('./db');

async function checkDatabase() {
  try {
    console.log('Verificando banco de dados...');
    
    // Clientes
    const clientes = await db.query('SELECT COUNT(*) as total FROM clientes');
    console.log(`Clientes cadastrados: ${clientes.rows[0].total}`);
    
    // Pedidos
    const pedidos = await db.query('SELECT COUNT(*) as total FROM pedidos');
    console.log(`Pedidos cadastrados: ${pedidos.rows[0].total}`);
    
    // Estrutura das tabelas
    console.log('\n--- Estrutura da tabela clientes ---');
    const clientesCols = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'clientes'
      ORDER BY ordinal_position
    `);
    
    clientesCols.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });
    
    console.log('\n--- Estrutura da tabela pedidos ---');
    const pedidosCols = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'pedidos'
      ORDER BY ordinal_position
    `);
    
    pedidosCols.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });
    
  } catch (erro) {
    console.error('Erro ao verificar banco:', erro.message);
  } finally {
    await db.end();
  }
}

checkDatabase();
