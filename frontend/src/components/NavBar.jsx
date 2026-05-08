import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';

const MotionDiv = motion.div;
const MotionButton = motion.button;
const MotionLink = motion.create(Link);

const NAV_LINKS = [
  { label: 'Menu', to: '/menu' },
  { label: 'About', to: '/about' },
];

const MOBILE_MENU_LINKS = [
  { label: 'Menu', to: '/menu' },
  { label: 'Reservation', action: 'book' },
  { label: 'About', to: '/about' },
];

const mobileMenuBackdrop = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
};

const mobileMenuPanel = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren',
      staggerChildren: 0.07,
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
      when: 'afterChildren',
      staggerChildren: 0.035,
      staggerDirection: -1,
    },
  },
};

const mobileMenuContent = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.99,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
};

const MenuIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    className="h-5 w-5"
  >
    {open ? (
      <>
        <path
          className="origin-center transition-transform duration-300 ease-out group-hover/menu:rotate-90"
          d="M6 6l12 12"
        />
        <path
          className="origin-center transition-transform duration-300 ease-out group-hover/menu:rotate-90"
          d="M18 6L6 18"
        />
      </>
    ) : (
      <>
        <path
          className="origin-center transition-transform duration-300 ease-out group-hover/menu:-translate-y-0.5"
          d="M6 8h12"
        />
        <path
          className="origin-center transition-transform duration-300 ease-out group-hover/menu:scale-x-75"
          d="M6 12h12"
        />
        <path
          className="origin-center transition-transform duration-300 ease-out group-hover/menu:translate-y-0.5"
          d="M6 16h12"
        />
      </>
    )}
  </svg>
);

const ProfileIcon = () => (
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
);

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleBookTable = () => {
    setShowMobileMenu(false);
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

  useEffect(() => {
    if (!showMobileMenu) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowMobileMenu(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMobileMenu]);

  return (
    <>
      <nav className="fixed left-1/2 top-8 z-20 flex w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-black/75 px-2.5 py-2 text-white shadow-xl backdrop-blur-md min-[380px]:w-[calc(100%-4rem)] md:absolute md:top-15 md:left-20 md:w-auto md:translate-x-0 md:justify-start md:gap-2 md:bg-black/70 md:px-3">

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setShowMobileMenu((v) => !v)}
          aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
          className="group/menu flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[#d8d3c5] transition-all duration-300 ease-out hover:border-[#d8d3c5]/40 hover:bg-white/10 hover:shadow-[0_0_22px_rgba(244,236,216,0.16)] active:scale-95 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#d8d3c5]/60 md:hidden"
        >
          <MenuIcon open={showMobileMenu} />
        </button>

        {/* Profile icon */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ProfileIcon />
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
        <div className="flex items-center">
          <Link
            to="/"
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center"
          >
            <img src="/iconfinal.png" alt="Logo" className="h-8 w-auto md:h-8" />
            <span className="text-lg tracking-widest font-serif md:text-xl">SOIRÉE</span>
          </Link>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex gap-3 text-xs tracking-[0.15em] uppercase text-white/70">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-white transition-colors first:pl-2 last:pr-1"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBookTable}
            className="rounded-xl border border-white/20 px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-[#d8d3c5] transition-colors duration-300 hover:bg-white hover:text-black sm:px-4 md:rounded-lg md:border-white/30 md:px-4 md:text-xs md:text-white"
          >
            <span className="hidden min-[360px]:inline">Book a Table</span>
            <span className="min-[360px]:hidden">Book</span>
          </button>
        </div>

      </nav>

      <AnimatePresence>
        {showMobileMenu && (
          <MotionDiv
            className="fixed inset-0 z-40 flex min-h-svh items-center justify-center bg-black/55 p-3 md:hidden"
            variants={mobileMenuBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <MotionDiv
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="relative flex h-[calc(100svh-1.5rem)] w-full max-w-md items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0b0b]/95 px-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl min-[380px]:h-[calc(100svh-2rem)]"
              variants={mobileMenuPanel}
            >
              <MotionButton
                type="button"
                onClick={() => setShowMobileMenu(false)}
                aria-label="Close menu"
                className="group/menu absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.02] text-[#d8d3c5] transition-all duration-300 ease-out hover:border-[#d8d3c5]/40 hover:bg-white/10 hover:shadow-[0_0_22px_rgba(244,236,216,0.16)] active:scale-95 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#d8d3c5]/60"
                variants={mobileMenuContent}
              >
                <MenuIcon open />
              </MotionButton>

              <div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
                <MotionDiv
                  className="flex items-center gap-3 opacity-35"
                  aria-hidden="true"
                  variants={mobileMenuContent}
                >
                  <span className="h-2 w-2 rotate-45 border border-[#d8d3c5]/40"></span>
                  <span className="h-px w-8 bg-[#d8d3c5]/25"></span>
                  <span className="h-2 w-2 rotate-45 border border-[#d8d3c5]/40"></span>
                </MotionDiv>

                <div className="flex flex-col items-center gap-3">
                  {MOBILE_MENU_LINKS.map((link) => (
                    link.action === 'book' ? (
                      <MotionButton
                        key={link.label}
                        type="button"
                        onClick={handleBookTable}
                        className="font-serif text-3xl uppercase leading-none tracking-[0.11em] text-[#f4ecd8] transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_18px_rgba(244,236,216,0.28)]"
                        variants={mobileMenuContent}
                      >
                        {link.label}
                      </MotionButton>
                    ) : (
                      <MotionLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setShowMobileMenu(false)}
                        className="font-serif text-3xl uppercase leading-none tracking-[0.11em] text-[#f4ecd8] transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_18px_rgba(244,236,216,0.28)]"
                        variants={mobileMenuContent}
                      >
                        {link.label}
                      </MotionLink>
                    )
                  ))}
                </div>

                <MotionDiv
                  className="flex items-center gap-3 opacity-35"
                  aria-hidden="true"
                  variants={mobileMenuContent}
                >
                  <span className="h-2 w-2 rotate-45 border border-[#d8d3c5]/40"></span>
                  <span className="h-px w-8 bg-[#d8d3c5]/25"></span>
                  <span className="h-2 w-2 rotate-45 border border-[#d8d3c5]/40"></span>
                </MotionDiv>

                <MotionButton
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    if (isAuthenticated) {
                      logout();
                    } else {
                      setShowModal(true);
                    }
                  }}
                  className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/35 transition-colors hover:text-[#d8d3c5]"
                  variants={mobileMenuContent}
                >
                  {isAuthenticated ? `Sign Out ${user?.username ?? ''}` : 'Login'}
                </MotionButton>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          redirectTo="/reservation"
        />
      )}
    </>
  );
};
