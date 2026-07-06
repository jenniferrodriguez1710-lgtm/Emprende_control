const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dbPool = require('./config/db');

// Importar Routers
const productosRouter = require('./routes/productos');
const clientesRouter = require('./routes/clientes');
const ventasRouter = require('./routes/ventas');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Montar Rutas de la API
app.use('/api/productos', productosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/ventas', ventasRouter);

// Ruta de estado del servidor y base de datos
app.get('/api/status', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT 1 + 1 AS result');
    res.json({
      status: 'online',
      message: 'API de EmprendeControl funcionando correctamente.',
      database: rows[0].result === 2 ? 'connected' : 'error',
      endpoints: ['/api/productos', '/api/clientes', '/api/ventas', '/api/ventas/resumen'],
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ status: 'offline_db', message: 'Sin conexión a la BD.', error: error.message });
  }
});

// Arrancar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Express iniciado y escuchando en http://localhost:${PORT}`);
  console.log(`📡 Disponible en la red local en http://<tu-ip-local>:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  /api/status`);
  console.log(`   CRUD /api/productos`);
  console.log(`   CRUD /api/clientes`);
  console.log(`   CRUD /api/ventas`);
  console.log(`   GET  /api/ventas/resumen`);
});
