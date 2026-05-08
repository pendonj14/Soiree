import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function SidebarBtn({ active, title, onClick, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 36, height: 36, borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? '#d4ccb6' : 'transparent',
        border: 'none', cursor: 'pointer', padding: 0,
      }}
    >
      {children}
    </button>
  );
}

const CalendarIcon = ({ active }) => (
  <svg width="16" height="16" fill="none" stroke={active ? '#0a0a0a' : '#666'} strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MenuIcon = ({ active }) => (
  <svg width="16" height="16" fill="none" stroke={active ? '#0a0a0a' : '#666'} strokeWidth="2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a' }}>
      <nav style={{
        width: 56, background: '#111', borderRight: '1px solid #1e1e1e',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '14px 0', gap: 6,
      }}>
        <div style={{
          width: 32, height: 32, border: '1px solid #d4ccb6', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <span style={{ color: '#d4ccb6', fontSize: 10, fontWeight: 700 }}>S</span>
        </div>

        <NavLink to="/admin/reservations" style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <SidebarBtn active={isActive} title="Reservations">
              <CalendarIcon active={isActive} />
            </SidebarBtn>
          )}
        </NavLink>

        <NavLink to="/admin/menu" style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <SidebarBtn active={isActive} title="Menu">
              <MenuIcon active={isActive} />
            </SidebarBtn>
          )}
        </NavLink>

        <div style={{ flex: 1 }} />

        <SidebarBtn title="Log out" onClick={handleLogout}>
          <LogoutIcon />
        </SidebarBtn>
      </nav>

      <main style={{ flex: 1, overflow: 'auto', color: '#d4ccb6' }}>
        <Outlet />
      </main>
    </div>
  );
}
