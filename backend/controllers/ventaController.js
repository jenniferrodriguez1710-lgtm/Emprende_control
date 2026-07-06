const pool = require('../config/db');

// GET /api/ventas - Obtener historial de ventas con nombre del cliente
const getAllVentas = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.id, v.fecha_venta, v.total, v.estado,
             c.nombre AS nombre_cliente
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id
      ORDER BY v.fecha_venta DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener ventas.', error: error.message });
  }
};

// GET /api/ventas/:id - Obtener una venta con su detalle
const getVentaById = async (req, res) => {
  try {
    const [venta] = await pool.query(`
      SELECT v.*, c.nombre AS nombre_cliente
      FROM ventas v LEFT JOIN clientes c ON v.id_cliente = c.id
      WHERE v.id = ?
    `, [req.params.id]);
    if (venta.length === 0) return res.status(404).json({ success: false, message: 'Venta no encontrada.' });

    const [detalles] = await pool.query(`
      SELECT dv.*, p.nombre AS nombre_producto
      FROM detalle_ventas dv JOIN productos p ON dv.id_producto = p.id
      WHERE dv.id_venta = ?
    `, [req.params.id]);

    res.json({ success: true, data: { ...venta[0], detalles } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener la venta.', error: error.message });
  }
};

// POST /api/ventas - Registrar una nueva venta (transacción atómica)
const createVenta = async (req, res) => {
  const { id_cliente, detalles } = req.body;

  if (!detalles || detalles.length === 0) {
    return res.status(400).json({ success: false, message: 'La venta debe incluir al menos un producto.' });
  }

  // Calcular total
  const total = detalles.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insertar cabecera de la venta
    const [ventaResult] = await connection.query(
      'INSERT INTO ventas (id_cliente, total, estado) VALUES (?, ?, ?)',
      [id_cliente || null, total.toFixed(2), 'completada']
    );
    const id_venta = ventaResult.insertId;

    // 2. Insertar el detalle y actualizar el stock de cada producto
    for (const item of detalles) {
      const { id_producto, cantidad, precio_unitario } = item;

      // Verificar stock disponible
      const [productoRows] = await connection.query('SELECT stock FROM productos WHERE id = ? FOR UPDATE', [id_producto]);
      if (productoRows.length === 0) throw new Error(`Producto con ID ${id_producto} no encontrado.`);
      if (productoRows[0].stock < cantidad) throw new Error(`Stock insuficiente para el producto ID ${id_producto}.`);

      // Insertar detalle
      await connection.query(
        'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [id_venta, id_producto, cantidad, precio_unitario]
      );

      // Descontar stock
      await connection.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [cantidad, id_producto]);
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Venta registrada exitosamente.', id: id_venta, total: total.toFixed(2) });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: `Error al registrar la venta: ${error.message}` });
  } finally {
    connection.release();
  }
};

// GET /api/ventas/reportes/resumen - Estadísticas del Dashboard
const getResumen = async (req, res) => {
  try {
    const [[{ total_productos }]] = await pool.query('SELECT COUNT(*) AS total_productos FROM productos');
    const [[{ total_clientes }]] = await pool.query('SELECT COUNT(*) AS total_clientes FROM clientes');
    const [[{ ventas_hoy, ingresos_hoy }]] = await pool.query(`
      SELECT COUNT(*) AS ventas_hoy, COALESCE(SUM(total), 0) AS ingresos_hoy
      FROM ventas
      WHERE DATE(fecha_venta) = CURDATE() AND estado = 'completada'
    `);
    const [[{ ingresos_mes }]] = await pool.query(`
      SELECT COALESCE(SUM(total), 0) AS ingresos_mes
      FROM ventas
      WHERE MONTH(fecha_venta) = MONTH(NOW()) AND YEAR(fecha_venta) = YEAR(NOW()) AND estado = 'completada'
    `);
    res.json({ success: true, data: { total_productos, total_clientes, ventas_hoy, ingresos_hoy, ingresos_mes } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el resumen.', error: error.message });
  }
};

module.exports = { getAllVentas, getVentaById, createVenta, getResumen };
