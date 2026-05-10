import { SideCard } from '../components/SideCard'
import { PageTransition } from '../components/PageTransition'

export const LandingPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen  p-4 font-sans text-white pb-20 md:pb-4">

        {/* Main Grid: 1 column on mobile, 4 columns on large screens */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-2rem)]">

          {/* Left Hero Section (Spans 3 columns on lg) */}
          <div className="flex-1 lg:col-span-3 rounded-4xl relative overflow-hidden flex flex-col justify-end p-6 sm:p-10 lg:p-16 min-h-[50vh] lg:min-h-0">
            {/* Background video */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/menu.webm"
              autoPlay
              loop
              muted
              playsInline
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/30"></div>

            {/* Main Typography */}
            <h1 className="relative z-10 text-6xl md:text-8xl lg:text-[10rem] font-serif leading-[0.9] tracking-tight text-[#f4ecd8] pb-4">
              SUSHI <br /> SENSATION
            </h1>
          </div>

          {/* Right Sidebar: horizontal row on sm/md, vertical column on lg */}
          <div className="lg:col-span-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 lg:flex lg:flex-col gap-3 sm:gap-4 h-40 sm:h-56 lg:h-auto">
            <SideCard linkText="Menu" bgImage="/menu.avif" to="/menu" />
            <SideCard linkText="Reservation" bgImage="/reservation.avif" to="/reservation" />
            <SideCard linkText="Our Restaurant" bgImage="/about.avif" to="/about" className="hidden md:flex" />
          </div>

        </div>
      </div>
    </PageTransition>
  )
}
