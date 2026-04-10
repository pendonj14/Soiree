import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { MenuPage } from './pages/MenuPage'
import { Navbar } from './components/NavBar'
import {AboutPage} from './pages/AboutPage'


function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/about" element={<AboutPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
