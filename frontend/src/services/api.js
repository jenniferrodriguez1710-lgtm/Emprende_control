import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- PRODUCTOS (Inventario) ---
export const getProductos = () => api.get('/productos');
export const getProducto = (id) => api.get(`/productos/${id}`);
export const createProducto = (data) => api.post('/productos', data);
export const updateProducto = (id, data) => api.put(`/productos/${id}`, data);
export const deleteProducto = (id) => api.delete(`/productos/${id}`);

// --- CLIENTES ---
export const getClientes = () => api.get('/clientes');
export const getCliente = (id) => api.get(`/clientes/${id}`);
export const createCliente = (data) => api.post('/clientes', data);
export const updateCliente = (id, data) => api.put(`/clientes/${id}`, data);
export const deleteCliente = (id) => api.delete(`/clientes/${id}`);

// --- VENTAS ---
export const getVentas = () => api.get('/ventas');
export const createVenta = (data) => api.post('/ventas', data);

// --- DASHBOARD ---
export const getResumen = () => api.get('/ventas/resumen');

export default api;
