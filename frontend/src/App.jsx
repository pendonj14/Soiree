import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { LandingPage } from './pages/LandingPage'
import { MenuPage } from './pages/MenuPage'
import { Navbar } from './components/NavBar'
import { AboutPage } from './pages/AboutPage'
import { ReservationPage } from './pages/ReservationPage'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="relative min-h-screen bg-[url('/marble.jpg')] bg-cover bg-center bg-fixed">

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/70"></div>

          {/* Content above overlay */}
          <div className="relative z-10 min-h-screen overflow-x-hidden">
            <Navbar />
            <AnimatedRoutes />
          </div>

        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
