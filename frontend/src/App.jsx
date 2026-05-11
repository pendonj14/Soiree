import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './pages/admin/AdminLayout';
import { ReservationsPage } from './pages/admin/ReservationsPage';
import { MenuManagementPage } from './pages/admin/MenuManagementPage';
import { LandingPage } from './pages/LandingPage';
import { MenuPage } from './pages/MenuPage';
import { Navbar } from './components/NavBar';
import { BottomNav } from './components/BottomNav';
import { AboutPage } from './pages/AboutPage';
import { ReservationPage } from './pages/ReservationPage';
import { Toaster } from "@/components/ui/sonner"


function UserApp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/reservations', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen bg-[url('/marble.avif')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 min-h-screen overflow-x-hidden">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/reservations" replace />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="menu" element={<MenuManagementPage />} />
        </Route>
      </Route>
      <Route path="/*" element={<UserApp />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
