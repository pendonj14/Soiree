import { Link } from 'react-router-dom'

export const SideCard = ({ linkText, bgImage, to, className = '' }) => (
  <Link
    to={to}
    className={`relative flex-1 rounded-3xl overflow-hidden bg-cover bg-center group cursor-pointer ${className}`}
    style={{ backgroundImage: `url(${bgImage})` }}
  >
    {/* Dark Overlay for text readability */}
    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
    
    {/* Bottom Right CTA */}
    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-[#f4ecd8] text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] uppercase flex items-center gap-2 sm:gap-3 text-right">
      <span className="leading-tight">{linkText}</span>
      <span className="flex shrink-0 items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/30 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-300">
        →
      </span>
    </div>
  </Link>
);