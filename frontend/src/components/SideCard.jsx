export const SideCard = ({ linkText, bgImage }) => (
  <div
    className="relative flex-1 rounded-3xl overflow-hidden bg-cover bg-center group cursor-pointer"
    style={{ backgroundImage: `url(${bgImage})` }}
  >
    {/* Dark Overlay for text readability */}
    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
    
    {/* Bottom Right CTA */}
    <div className="absolute bottom-6 right-6 text-[#f4ecd8] text-xs tracking-[0.2em] uppercase flex items-center gap-3">
      {linkText} 
      <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/30 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-300">
        →
      </span>
    </div>
  </div>
);