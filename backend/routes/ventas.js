const express = require('express');
const router = express.Router();
const { getAllVentas, getVentaById, createVenta, getResumen } = require('../controllers/ventaController');

router.get('/resumen', getResumen);
router.get('/', getAllVentas);
router.get('/:id', getVentaById);
router.post('/', createVenta);

module.exports = router;
