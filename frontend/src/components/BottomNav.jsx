import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AuthModal } from './AuthModal'

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
)

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

const AboutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)

export const BottomNav = () => {
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  const handleBook = () => {
    if (isAuthenticated) {
      navigate('/reservation')
    } else {
      setShowModal(true)
    }
  }

  const itemClass = (path) =>
    `flex flex-col items-center gap-1 text-[9px] tracking-widest uppercase transition-colors duration-200 ${
      pathname === path ? 'text-[#d4ccb6]' : 'text-white/40'
    }`

  const bookActive = pathname === '/reservation'

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-t border-white/10 flex justify-around items-center px-2 py-3">
        <Link to="/" className={itemClass('/')}>
          <HomeIcon />
          Home
        </Link>
        <Link to="/menu" className={itemClass('/menu')}>
          <MenuIcon />
          Menu
        </Link>
        <button
          onClick={handleBook}
          className={`flex flex-col items-center gap-1 text-[9px] tracking-widest uppercase transition-colors duration-200 ${
            bookActive ? 'text-[#d4ccb6]' : 'text-white/40'
          }`}
        >
          <BookIcon />
          Book
        </button>
        <Link to="/about" className={itemClass('/about')}>
          <AboutIcon />
          About
        </Link>
      </nav>

      {showModal && (
        <AuthModal onClose={() => setShowModal(false)} redirectTo="/reservation" />
      )}
    </>
  )
}
