const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cafeteria',
  password: 'senai', // Change this to your PostgreSQL password
  port: 5433,
});

module.exports = pool;