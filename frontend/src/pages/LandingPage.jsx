import { Navbar } from '../components/NavBar'
import { SideCard } from '../components/SideCard'

export const LandingPage = () => {
  return (
    // Outer wrapper ensuring full screen height and dark background
    <div className="h-screen bg-[#111] p-4 font-sans text-white">
      
      {/* Main Grid: 1 column on mobile, 4 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-2rem)] min-h-[800px]">

        {/* Left Hero Section (Spans 3 columns) */}
        <div
          className="lg:col-span-3 rounded-[2rem] relative overflow-hidden flex flex-col justify-end p-12 lg:p-16"
        >
          {/* Background video */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/menu.mp4"
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Gradient overlay to ensure text pops against the background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30"></div>
          
          
          {/* Main Typography */}
          <h1 className="relative z-10 text-6xl md:text-8xl lg:text-[10rem] font-serif leading-[0.9] tracking-tight text-[#f4ecd8] pb-4">
            SUSHI <br /> SENSATION
          </h1>
        </div>

        {/* Right Sidebar Section (Spans 1 column, elements stack vertically) */}
        <div className="lg:col-span-1 flex flex-col gap-4 h-full">
          <SideCard
            linkText="Menu"
            bgImage="/menu.avif"
            to="/menu"
          />
          <SideCard
            linkText="Reservation"
            bgImage="/reservation.avif"
            to="/reservation"
          />
          <SideCard
            linkText="Our Restaurant"
            bgImage="/about.avif"
            to="/about"
          />
        </div>

      </div>
    </div>
  );
}