export const Navbar = () => (
  <nav className="absolute top-8 left-8 z-20 flex items-center gap-10 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white shadow-xl">
    {/* Logo Area */}
    <div className="flex items-center gap-4">
      {/* Hamburger Icon Graphic */}
      <div className="w-5 flex flex-col gap-[3px]">
         <div className="w-full h-[2px] bg-white"></div>
         <div className="w-full h-[2px] bg-white"></div>
         <div className="w-full h-[2px] bg-white"></div>
      </div>
      <div className="flex items-center">
        <img src="/iconfinal.png" alt="Logo" className="h-10 w-auto" />
        <span className="text-xl tracking-widest font-serif">SOIRÉE</span>
      </div>
    </div>

    {/* Desktop Links */}
    <div className="hidden md:flex gap-8 text-xs tracking-[0.15em] uppercase text-white/70">
      <a href="#menu" className="hover:text-white transition-colors">Menu</a>
      <a href="#about" className="hover:text-white transition-colors">About</a>
    </div>

    {/* CTA Button */}
    <button className="hidden md:block text-xs border border-white/30 rounded-lg px-5 py-2.5 uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-colors duration-300">
      Book a Table
    </button>
  </nav>
);
