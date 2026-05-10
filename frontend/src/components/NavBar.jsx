import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleBookTable = () => {
    if (isAuthenticated) {
      navigate('/reservation');
    } else {
      setShowModal(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="absolute top-8 left-8 md:top-15 md:left-20 z-20 flex items-center gap-2 md:gap-4 bg-black/70 backdrop-blur-md px-2 py-2 md:px-4 rounded-2xl border border-white/10 text-white shadow-xl max-w-[calc(100vw-4rem)] md:max-w-none flex-wrap sm:flex-nowrap">

        {/* Profile icon — always visible */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white/70"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-12 w-48 rounded-xl border border-white/10 bg-[#0c0c0c] py-2 shadow-2xl">
              {isAuthenticated ? (
                <>
                  <div className="border-b border-white/10 px-4 pb-3 pt-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Signed in as</p>
                    <p className="mt-0.5 truncate text-sm text-[#d8d3c5]">{user?.username}</p>
                  </div>
                  <button
                    onClick={() => { setShowDropdown(false); logout(); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowDropdown(false); setShowModal(true); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-1 sm:gap-2">
            <img src="/iconfinal.png" alt="Logo" className="h-7 sm:h-8 w-auto hidden min-[400px]:block" />
            <span className="text-sm min-[400px]:text-base sm:text-xl tracking-widest font-serif pr-2 md:pr-0">SOIRÉE</span>
          </Link>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-3 text-xs tracking-[0.15em] uppercase text-white/70">
          <Link to="/menu" className="hover:text-white transition-colors pl-2">Menu</Link>
          <Link to="/about" className="hover:text-white transition-colors pr-1 whitespace-nowrap">About</Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center">
          <button
            onClick={handleBookTable}
            className="text-xs border border-white/30 rounded-lg px-4 py-2 uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-colors duration-300 whitespace-nowrap"
          >
            Book a Table
          </button>
        </div>

      </nav>

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          redirectTo="/reservation"
        />
      )}
    </>
  );
};
