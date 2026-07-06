import { useEffect, useState } from 'react';
import { getResumen } from '../services/api';

const StatCard = ({ icon, title, value, subtitle, color }) => (
  <div className="card stat-card">
    <div className="stat-icon" style={{ background: `${color}20`, color }}>{icon}</div>
    <div className="stat-info">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getResumen()
      .then(res => setData(res.data.data))
      .catch(() => setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="animate-pulse">⏳</div> Cargando datos...</div>;

  return (
    <div>
      <div className="view-header">
        <div>
          <h2 className="view-title">Dashboard</h2>
          <p className="view-subtitle">Resumen general de tu negocio</p>
        </div>
        <div className="badge badge-success">🟢 En línea</div>
      </div>

      {error ? (
        <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</div>
          <p style={{ color: 'var(--accent-danger)', marginBottom: '8px', fontWeight: 600 }}>Sin conexión al servidor</p>
          <p className="text-muted">{error}</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard icon="📦" title="Productos en stock" value={data?.total_productos ?? 0} subtitle="Total de productos registrados" color="var(--accent-primary)" />
            <StatCard icon="👥" title="Clientes" value={data?.total_clientes ?? 0} subtitle="Clientes registrados" color="var(--accent-info)" />
            <StatCard icon="🛒" title="Ventas hoy" value={data?.ventas_hoy ?? 0} subtitle="Transacciones del día" color="var(--accent-success)" />
            <StatCard icon="💰" title="Ingresos del mes" value={`$${Number(data?.ingresos_mes ?? 0).toFixed(2)}`} subtitle="Total de ventas este mes" color="var(--accent-warning)" />
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>🚀 Inicio rápido</h3>
            <div className="quick-links">
              <a href="/inventario" className="quick-link-item">
                <span style={{ fontSize: '1.5rem' }}>📦</span>
                <span>Agregar producto</span>
              </a>
              <a href="/clientes" className="quick-link-item">
                <span style={{ fontSize: '1.5rem' }}>👥</span>
                <span>Nuevo cliente</span>
              </a>
              <a href="/ventas" className="quick-link-item">
                <span style={{ fontSize: '1.5rem' }}>🛒</span>
                <span>Registrar venta</span>
              </a>
            </div>
          </div>
        </>
      )}

      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (min-width: 900px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
        .stat-card { display: flex; align-items: center; gap: 16px; }
        .stat-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
        .stat-title { font-size: 0.75rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-value { font-size: 1.6rem; font-weight: 800; line-height: 1.2; margin: 2px 0; }
        .stat-subtitle { font-size: 0.72rem; color: var(--text-muted); }
        .quick-links { display: flex; gap: 12px; flex-wrap: wrap; }
        .quick-link-item { display: flex; align-items: center; gap: 10px; padding: 12px 20px; background: var(--bg-hover); border-radius: var(--border-radius-sm); color: var(--text-primary); text-decoration: none; font-weight: 500; font-size: 0.875rem; transition: var(--transition); }
        .quick-link-item:hover { background: rgba(108,99,255,0.15); color: var(--accent-primary); }
      `}</style>
    </div>
  );
}
