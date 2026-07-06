import { useEffect, useState } from 'react';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/api';

const EMPTY_FORM = { nombre: '', descripcion: '', precio_venta: '', stock: '', imagen_url: '' };

function ProductoModal({ producto, onClose, onSaved }) {
  const [form, setForm] = useState(producto || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!producto?.id;

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isEdit) await updateProducto(producto.id, form);
      else await createProducto(form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error al guardar.');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3 className="modal-title">{isEdit ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} className="form-control" placeholder="Ej: Camiseta talla M" required />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input name="descripcion" value={form.descripcion} onChange={handleChange} className="form-control" placeholder="Descripción opcional" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Precio ($) *</label>
              <input name="precio_venta" type="number" step="0.01" min="0" value={form.precio_venta} onChange={handleChange} className="form-control" placeholder="0.00" required />
            </div>
            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="form-control" placeholder="0" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL de imagen</label>
            <input name="imagen_url" value={form.imagen_url} onChange={handleChange} className="form-control" placeholder="https://..." />
          </div>
          {error && <p style={{ color: 'var(--accent-danger)', fontSize: '0.85rem' }}>⚠️ {error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'new' | {producto}

  const load = () => {
    setLoading(true);
    getProductos()
      .then(res => setProductos(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar el producto "${nombre}"?`)) return;
    try { await deleteProducto(id); load(); }
    catch { alert('No se pudo eliminar el producto.'); }
  };

  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="view-header">
        <div>
          <h2 className="view-title">📦 Inventario</h2>
          <p className="view-subtitle">{productos.length} producto{productos.length !== 1 ? 's' : ''} registrado{productos.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>+ Nuevo Producto</button>
      </div>

      <div className="card" style={{ marginBottom: '20px', padding: '14px' }}>
        <div className="search-wrapper" style={{ maxWidth: '100%' }}>
          <span className="search-icon">🔍</span>
          <input className="form-control search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." />
        </div>
      </div>

      {loading ? <div className="loading">⏳ Cargando inventario...</div> : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📦</div><p>No se encontraron productos.</p></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Producto</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{p.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.nombre}</div>
                    {p.descripcion && <div className="text-muted">{p.descripcion}</div>}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-success)' }}>${Number(p.precio_venta).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                      {p.stock} uds.
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {p.stock > 0 ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal(p)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.nombre)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ProductoModal
          producto={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}
