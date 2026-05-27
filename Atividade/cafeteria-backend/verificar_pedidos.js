const pool = require('./db');

async function verificarPedidos() {
  try {
    console.log('Verificando estrutura da tabela pedidos...');
    
    // Verificar estrutura da tabela pedidos
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'pedidos'
      ORDER BY ordinal_position
    `);
    
    console.log('Colunas atuais na tabela pedidos:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    // Verificar se há dados na tabela pedidos
    const countResult = await pool.query('SELECT COUNT(*) as count FROM pedidos');
    console.log(`\nTotal de pedidos na tabela: ${countResult.rows[0].count}`);
    
    // Verificar clientes disponíveis
    const clientesResult = await pool.query('SELECT id, nome FROM clientes');
    console.log('\nClientes disponíveis:');
    clientesResult.rows.forEach(cliente => {
      console.log(`- ID: ${cliente.id}, Nome: ${cliente.nome}`);
    });
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarPedidos();
