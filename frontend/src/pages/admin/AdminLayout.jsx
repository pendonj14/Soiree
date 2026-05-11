import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function SidebarBtn({ active, title, onClick, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group relative ${active
        ? 'bg-[#d4ccb6] text-[#0a0a0a] shadow-[0_0_15px_rgba(212,204,182,0.15)] scale-105'
        : 'bg-transparent text-[#666] hover:bg-[#1a1a1a] hover:text-[#d4ccb6]'
        }`}
    >
      {children}
    </button>
  );
}

const CalendarIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
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
    <div className="flex h-screen bg-[#0a0a0a] text-[#d4ccb6] overflow-hidden selection:bg-[#d4ccb6] selection:text-[#0a0a0a]">
      {/* Sidebar */}
      <nav className="w-14 md:w-16 bg-[#0f0f0f] border-r border-[#1e1e1e] flex flex-col items-center py-6 gap-6 relative z-50 shadow-2xl shrink-0">

        {/* Logo/Brand */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-[#0a0a0a] shadow-[0_0_15px_rgba(212,204,182,0.05)] hover:bg-[#1a1a1a] transition-colors cursor-pointer overflow-hidden border border-[#1e1e1e]" title="Upload Logo">
          <img src="/icon.svg" alt="Brand Logo" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-4 w-full items-center">
          <NavLink to="/admin/reservations" className="focus:outline-none">
            {({ isActive }) => (
              <SidebarBtn active={isActive} title="Reservations">
                <CalendarIcon />
              </SidebarBtn>
            )}
          </NavLink>

          <NavLink to="/admin/menu" className="focus:outline-none">
            {({ isActive }) => (
              <SidebarBtn active={isActive} title="Menu">
                <MenuIcon />
              </SidebarBtn>
            )}
          </NavLink>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout */}
        <div className="mt-auto">
          <SidebarBtn title="Log out" onClick={handleLogout}>
            <LogoutIcon />
          </SidebarBtn>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-[#0a0a0a]">
        <Outlet />
      </main>
    </div>
  );
}
