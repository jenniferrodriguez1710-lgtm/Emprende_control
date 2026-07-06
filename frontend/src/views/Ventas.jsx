import { useEffect, useState } from 'react';
import { getProductos, getClientes, createVenta, getVentas } from '../services/api';

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [tab, setTab] = useState('nueva'); // 'nueva' | 'historial'

  const loadData = () => {
    Promise.all([getProductos(), getClientes(), getVentas()])
      .then(([pRes, cRes, vRes]) => {
        setProductos(pRes.data.data.filter(p => p.stock > 0));
        setClientes(cRes.data.data);
        setHistorial(vRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) {
        if (existe.cantidad >= producto.stock) return prev;
        return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito(prev => prev
      .map(i => i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } : i)
      .filter(i => i.cantidad > 0)
    );
  };

  const quitarDelCarrito = (id) => setCarrito(prev => prev.filter(i => i.id !== id));

  const total = carrito.reduce((sum, i) => sum + (i.precio_venta * i.cantidad), 0);

  const registrarVenta = async () => {
    if (carrito.length === 0) return;
    setGuardando(true); setMensaje(null);
    try {
      await createVenta({
        id_cliente: clienteId || null,
        detalles: carrito.map(i => ({ id_producto: i.id, cantidad: i.cantidad, precio_unitario: i.precio_venta }))
      });
      setMensaje({ tipo: 'success', texto: `✅ Venta de $${total.toFixed(2)} registrada exitosamente.` });
      setCarrito([]);
      setClienteId('');
      loadData();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: `❌ ${err.response?.data?.message || 'Error al registrar la venta.'}` });
    } finally { setGuardando(false); }
  };

  if (loading) return <div className="loading">⏳ Cargando módulo de ventas...</div>;

  return (
    <div>
      <div className="view-header">
        <div>
          <h2 className="view-title">🛒 Ventas</h2>
          <p className="view-subtitle">Registra y revisa las transacciones de tu negocio</p>
        </div>
        <div className="flex gap-1">
          <button className={`btn ${tab === 'nueva' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('nueva')}>Nueva Venta</button>
          <button className={`btn ${tab === 'historial' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('historial')}>Historial</button>
        </div>
      </div>

      {mensaje && (
        <div className="card" style={{ marginBottom: '16px', padding: '14px', borderColor: mensaje.tipo === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)', color: mensaje.tipo === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
          {mensaje.texto}
        </div>
      )}

      {tab === 'nueva' ? (
        <div className="ventas-layout">
          {/* Panel de productos */}
          <div>
            <h3 style={{ marginBottom: '16px', fontWeight: 700, fontSize: '1rem' }}>Seleccionar Productos</h3>
            <div className="productos-grid">
              {productos.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📦</div><p>Sin productos con stock disponible.</p></div>
              ) : productos.map(p => (
                <div key={p.id} className="card producto-item" onClick={() => agregarAlCarrito(p)}>
                  <div className="producto-nombre">{p.nombre}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>${Number(p.precio_venta).toFixed(2)}</span>
                    <span className={`badge ${p.stock > 10 ? 'badge-success' : 'badge-warning'}`}>{p.stock} uds.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel carrito */}
          <div className="carrito-panel card">
            <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>🧾 Carrito</h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Cliente (opcional)</label>
              <select value={clienteId} onChange={e => setClienteId(e.target.value)} className="form-control">
                <option value="">— Venta sin cliente —</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            {carrito.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛒</div>
                <p style={{ fontSize: '0.875rem' }}>Toca un producto para agregarlo</p>
              </div>
            ) : (
              <div className="carrito-items">
                {carrito.map(item => (
                  <div key={item.id} className="carrito-item">
                    <div className="carrito-nombre">{item.nombre}</div>
                    <div className="carrito-controles">
                      <button className="qty-btn" onClick={() => cambiarCantidad(item.id, -1)}>−</button>
                      <span className="qty-num">{item.cantidad}</span>
                      <button className="qty-btn" onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                      <span style={{ fontWeight: 700, color: 'var(--accent-success)', minWidth: '60px', textAlign: 'right' }}>
                        ${(item.precio_venta * item.cantidad).toFixed(2)}
                      </span>
                      <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => quitarDelCarrito(item.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="carrito-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-success w-full"
              style={{ marginTop: '12px', justifyContent: 'center' }}
              onClick={registrarVenta}
              disabled={carrito.length === 0 || guardando}
            >
              {guardando ? 'Registrando...' : '✅ Confirmar Venta'}
            </button>
          </div>
        </div>
      ) : (
        /* Historial de ventas */
        historial.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🛒</div><p>No hay ventas registradas aún.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {historial.map(v => (
                  <tr key={v.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{v.id}</td>
                    <td>{new Date(v.fecha_venta).toLocaleString('es-EC')}</td>
                    <td>{v.nombre_cliente || <span className="text-muted">Sin cliente</span>}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-success)' }}>${Number(v.total).toFixed(2)}</td>
                    <td><span className={`badge ${v.estado === 'completada' ? 'badge-success' : 'badge-danger'}`}>{v.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <style>{`
        .ventas-layout { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 900px) { .ventas-layout { grid-template-columns: 1fr 360px; } }
        .productos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
        .producto-item { cursor: pointer; padding: 16px; user-select: none; }
        .producto-item:hover { background: var(--bg-hover); border-color: var(--accent-primary); transform: translateY(-2px); }
        .producto-nombre { font-weight: 600; font-size: 0.9rem; }
        .carrito-panel { display: flex; flex-direction: column; }
        .carrito-items { display: flex; flex-direction: column; gap: 10px; flex: 1; max-height: 300px; overflow-y: auto; margin-bottom: 12px; }
        .carrito-item { display: flex; flex-direction: column; gap: 8px; padding: 10px 0; border-bottom: 1px solid var(--border-color); }
        .carrito-nombre { font-weight: 600; font-size: 0.875rem; }
        .carrito-controles { display: flex; align-items: center; gap: 8px; }
        .qty-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-hover); color: var(--text-primary); cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
        .qty-btn:hover { background: var(--accent-primary); border-color: var(--accent-primary); color: #fff; }
        .qty-num { width: 28px; text-align: center; font-weight: 700; }
        .carrito-total { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 8px; font-size: 1.25rem; font-weight: 800; }
      `}</style>
    </div>
  );
}
