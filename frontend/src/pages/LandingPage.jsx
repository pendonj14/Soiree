import { SideCard } from '../components/SideCard'
import { PageTransition } from '../components/PageTransition'

export const LandingPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen p-3 font-sans text-white sm:p-4">

        {/* Main Grid: 1 column on mobile, 4 columns on large screens */}
        <div className="grid grid-cols-1 gap-4 lg:min-h-[calc(100vh-2rem)] lg:grid-cols-4">

          {/* Left Hero Section (Spans 3 columns on lg) */}
          <div className="relative flex h-[44svh] min-h-[22rem] flex-col items-center justify-end overflow-hidden rounded-3xl p-6 sm:min-h-[26rem] sm:p-10 lg:col-span-3 lg:h-auto lg:min-h-0 lg:items-start lg:rounded-4xl lg:p-16">
            {/* Background video */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/menu.mp4"
              autoPlay
              loop
              muted
              playsInline
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/30"></div>

            {/* Main Typography */}
            <h1 className="relative z-10 pb-4 text-center font-serif text-5xl leading-[0.9] tracking-tight text-[#f4ecd8] min-[380px]:text-6xl sm:text-7xl md:text-8xl lg:text-left lg:text-[10rem]">
              SUSHI <br /> SENSATION
            </h1>
          </div>

          {/* Right Sidebar: horizontal row on sm/md, vertical column on lg */}
          <div className="grid grid-cols-1 gap-4 lg:col-span-1 lg:flex lg:h-auto lg:flex-col">
            <SideCard linkText="Menu" bgImage="/menu.avif" to="/menu" />
            <SideCard linkText="Reservation" bgImage="/reservation.avif" to="/reservation" />
            <SideCard linkText="Our Restaurant" bgImage="/about.avif" to="/about" />
          </div>

        </div>
      </div>
    </PageTransition>
  )
}
