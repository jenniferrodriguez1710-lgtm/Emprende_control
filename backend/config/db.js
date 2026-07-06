const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear el pool de conexiones a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_emprendecontrol',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para probar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos MySQL en XAMPP establecida correctamente.');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos MySQL:', error.message);
    console.error('Asegúrate de que XAMPP esté corriendo y que la base de datos "db_emprendecontrol" esté creada.');
  }
}

testConnection();

module.exports = pool;
