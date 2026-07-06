const pool = require('../config/db');

// GET /api/productos - Obtener todos los productos
const getAllProductos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos ORDER BY nombre ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener productos.', error: error.message });
  }
};

// GET /api/productos/:id - Obtener un producto por ID
const getProductoById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el producto.', error: error.message });
  }
};

// POST /api/productos - Crear nuevo producto
const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio_venta, stock, imagen_url } = req.body;
    if (!nombre || precio_venta === undefined || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Nombre, precio_venta y stock son requeridos.' });
    }
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio_venta, stock, imagen_url) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion || null, precio_venta, stock, imagen_url || null]
    );
    res.status(201).json({ success: true, message: 'Producto creado exitosamente.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear el producto.', error: error.message });
  }
};

// PUT /api/productos/:id - Actualizar un producto
const updateProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio_venta, stock, imagen_url } = req.body;
    const [result] = await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio_venta = ?, stock = ?, imagen_url = ? WHERE id = ?',
      [nombre, descripcion || null, precio_venta, stock, imagen_url || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    res.json({ success: true, message: 'Producto actualizado exitosamente.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar el producto.', error: error.message });
  }
};

// DELETE /api/productos/:id - Eliminar un producto
const deleteProducto = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    res.json({ success: true, message: 'Producto eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar el producto.', error: error.message });
  }
};

module.exports = { getAllProductos, getProductoById, createProducto, updateProducto, deleteProducto };
