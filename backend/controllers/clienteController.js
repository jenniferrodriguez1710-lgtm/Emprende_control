const pool = require('../config/db');

// GET /api/clientes - Obtener todos los clientes
const getAllClientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes ORDER BY nombre ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener clientes.', error: error.message });
  }
};

// GET /api/clientes/:id - Obtener un cliente por ID
const getClienteById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el cliente.', error: error.message });
  }
};

// POST /api/clientes - Crear nuevo cliente
const createCliente = async (req, res) => {
  try {
    const { nombre, telefono, direccion } = req.body;
    if (!nombre) return res.status(400).json({ success: false, message: 'El nombre del cliente es requerido.' });
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, telefono, direccion) VALUES (?, ?, ?)',
      [nombre, telefono || null, direccion || null]
    );
    res.status(201).json({ success: true, message: 'Cliente creado exitosamente.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear el cliente.', error: error.message });
  }
};

// PUT /api/clientes/:id - Actualizar un cliente
const updateCliente = async (req, res) => {
  try {
    const { nombre, telefono, direccion } = req.body;
    const [result] = await pool.query(
      'UPDATE clientes SET nombre = ?, telefono = ?, direccion = ? WHERE id = ?',
      [nombre, telefono || null, direccion || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
    res.json({ success: true, message: 'Cliente actualizado exitosamente.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar el cliente.', error: error.message });
  }
};

// DELETE /api/clientes/:id - Eliminar un cliente
const deleteCliente = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
    res.json({ success: true, message: 'Cliente eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar el cliente.', error: error.message });
  }
};

module.exports = { getAllClientes, getClienteById, createCliente, updateCliente, deleteCliente };
