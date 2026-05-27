const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Clientes
app.post('/clientes', async (req, res) => {
  const { nome, email, telefone } = req.body;
  
  try {
    const sql = 'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *';
    const result = await db.query(sql, [nome, email, telefone]);
    res.status(201).json(result.rows[0]);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

app.get('/clientes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clientes ORDER BY nome');
    res.json(result.rows);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

app.get('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('SELECT * FROM clientes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;
  
  try {
    const sql = 'UPDATE clientes SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *';
    const result = await db.query(sql, [nome, email, telefone, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

// Pedidos
app.post('/pedidos', async (req, res) => {
  const { cliente_id, descricao, quantidade, status } = req.body;
  
  try {
    // Verificar se o cliente existe
    const cliente = await db.query('SELECT id FROM clientes WHERE id = $1', [cliente_id]);
    
    if (cliente.rows.length === 0) {
      return res.status(400).json({ error: 'Cliente não encontrado' });
    }
    
    const sql = 'INSERT INTO pedidos (cliente_id, descricao, quantidade, status) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await db.query(sql, [cliente_id, descricao, quantidade, status]);
    res.status(201).json(result.rows[0]);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

app.get('/pedidos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pedidos ORDER BY id DESC');
    res.json(result.rows);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

app.get('/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('SELECT * FROM pedidos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

app.put('/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  const { cliente_id, descricao, quantidade, status } = req.body;
  
  try {
    const sql = 'UPDATE pedidos SET cliente_id = $1, descricao = $2, quantidade = $3, status = $4 WHERE id = $5 RETURNING *';
    const result = await db.query(sql, [cliente_id, descricao, quantidade, status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

app.delete('/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json({ message: 'Pedido removido com sucesso' });
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});