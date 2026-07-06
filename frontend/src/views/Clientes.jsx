import { useEffect, useState } from 'react';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/api';

const EMPTY_FORM = { nombre: '', telefono: '', direccion: '' };

function ClienteModal({ cliente, onClose, onSaved }) {
  const [form, setForm] = useState(cliente || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!cliente?.id;

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isEdit) await updateCliente(cliente.id, form);
      else await createCliente(form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error al guardar.');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3 className="modal-title">{isEdit ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} className="form-control" placeholder="Ej: Juan Pérez" required />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} className="form-control" placeholder="Ej: 0999999999" />
          </div>
          <div className="form-group">
            <label className="form-label">Dirección</label>
            <input name="direccion" value={form.direccion} onChange={handleChange} className="form-control" placeholder="Av. Principal 123" />
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

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = () => {
    setLoading(true);
    getClientes()
      .then(res => setClientes(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar al cliente "${nombre}"?`)) return;
    try { await deleteCliente(id); load(); }
    catch { alert('No se pudo eliminar el cliente.'); }
  };

  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono || '').includes(search)
  );

  const getInitials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const getColor = name => {
    const colors = ['#6c63ff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2 className="view-title">👥 Clientes</h2>
          <p className="view-subtitle">{clientes.length} cliente{clientes.length !== 1 ? 's' : ''} registrado{clientes.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>+ Nuevo Cliente</button>
      </div>

      <div className="card" style={{ marginBottom: '20px', padding: '14px' }}>
        <div className="search-wrapper" style={{ maxWidth: '100%' }}>
          <span className="search-icon">🔍</span>
          <input className="form-control search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o teléfono..." />
        </div>
      </div>

      {loading ? <div className="loading">⏳ Cargando clientes...</div> : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">👥</div><p>No se encontraron clientes.</p></div>
      ) : (
        <div className="clientes-grid">
          {filtered.map(c => (
            <div key={c.id} className="card cliente-card">
              <div className="cliente-avatar" style={{ background: `${getColor(c.nombre)}25`, color: getColor(c.nombre) }}>
                {getInitials(c.nombre)}
              </div>
              <div className="cliente-info">
                <div className="cliente-nombre">{c.nombre}</div>
                {c.telefono && <div className="text-muted">📞 {c.telefono}</div>}
                {c.direccion && <div className="text-muted">📍 {c.direccion}</div>}
              </div>
              <div className="td-actions" style={{ marginTop: '12px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(c)}>✏️ Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id, c.nombre)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ClienteModal
          cliente={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}

      <style>{`
        .clientes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
        .cliente-card { display: flex; flex-direction: column; }
        .cliente-avatar { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 800; margin-bottom: 12px; flex-shrink: 0; }
        .cliente-nombre { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
        .cliente-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
      `}</style>
    </div>
  );
}
