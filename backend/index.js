const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar la base de datos para forzar la prueba de conexión al arrancar el servidor
const dbPool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de Middlewares
app.use(cors()); // Permitir peticiones desde cualquier origen (necesario para Capacitor)
app.use(express.json()); // Habilitar parseo de JSON

// Ruta de estado inicial
app.get('/api/status', async (req, res) => {
  try {
    // Intentar una consulta simple para verificar la salud de la BD
    const [rows] = await dbPool.query('SELECT 1 + 1 AS result');
    res.json({
      status: 'online',
      message: 'API de EmprendeControl funcionando correctamente.',
      database: rows[0].result === 2 ? 'connected' : 'error',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: 'offline_db',
      message: 'El servidor Express está en línea pero no se pudo conectar con la base de datos MySQL.',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Arrancar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Express iniciado y escuchando en http://localhost:${PORT}`);
  console.log(`📡 Disponible en la red local en http://<tu-ip-local>:${PORT}`);
});
