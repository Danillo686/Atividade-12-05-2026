const pool = require('./db');

async function verificarEstrutura() {
  try {
    console.log('Verificando estrutura da tabela clientes...');
    
    // Verificar se a tabela existe
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'clientes'
      ORDER BY ordinal_position
    `);
    
    console.log('Colunas atuais na tabela clientes:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    // Verificar se a coluna telefone existe
    const telefoneExiste = result.rows.some(row => row.column_name === 'telefone');
    
    if (!telefoneExiste) {
      console.log('\nAdicionando coluna telefone...');
      await pool.query('ALTER TABLE clientes ADD COLUMN telefone VARCHAR(20)');
      console.log('Coluna telefone adicionada com sucesso!');
    } else {
      console.log('\nColuna telefone já existe.');
    }
    
    // Verificar se há dados na tabela
    const countResult = await pool.query('SELECT COUNT(*) as count FROM clientes');
    console.log(`\nTotal de clientes na tabela: ${countResult.rows[0].count}`);
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarEstrutura();
