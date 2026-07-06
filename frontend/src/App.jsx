import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './views/Dashboard';
import Inventario from './views/Inventario';
import Clientes from './views/Clientes';
import Ventas from './views/Ventas';

const NAV_ITEMS = [
  { path: '/',          label: 'Dashboard',  icon: '📊' },
  { path: '/inventario', label: 'Inventario', icon: '📦' },
  { path: '/clientes',   label: 'Clientes',   icon: '👥' },
  { path: '/ventas',     label: 'Ventas',     icon: '🛒' },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentLabel = NAV_ITEMS.find(i => i.path === location.pathname)?.label || 'EmprendeControl';

  return (
    <div className="app-layout">
      {/* === SIDEBAR (Escritorio) === */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-name">⚡ EmprendeControl</div>
          <div className="logo-tagline">Gestión de Negocios</div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          Instituto Superior Tecnológico<br />Alberto Enríquez · 2026
        </div>
      </aside>

      {/* === CONTENIDO PRINCIPAL === */}
      <main className="main-content">
        {/* Header (solo escritorio) */}
        <header className="main-header">
          <h1 className="header-title">{currentLabel}</h1>
        </header>

        {/* Vista Activa */}
        <div className="view-container">
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/clientes"   element={<Clientes />} />
            <Route path="/ventas"     element={<Ventas />} />
          </Routes>
        </div>
      </main>

      {/* === TABBAR (Móvil) === */}
      <nav className="tabbar">
        {NAV_ITEMS.map(item => (
          <button
            key={item.path}
            className={`tabbar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="tab-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
