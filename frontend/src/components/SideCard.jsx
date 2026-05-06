import { Link } from 'react-router-dom'

export const SideCard = ({ linkText, bgImage, to }) => (
  <Link
    to={to}
    className="group relative min-h-[22rem] cursor-pointer overflow-hidden rounded-3xl bg-[#111] sm:min-h-[24rem] lg:min-h-0 lg:flex-1"
    aria-label={linkText}
  >
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
      style={{ backgroundImage: `url(${bgImage})` }}
      aria-hidden="true"
    ></div>

    {/* Dark Overlay for text readability */}
    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/20 transition-colors duration-500 group-hover:from-black/65 lg:bg-none lg:bg-black/40 lg:group-hover:bg-black/20"></div>
    
    {/* Bottom Right CTA */}
    <div className="absolute bottom-5 right-5 flex items-center gap-3 rounded-full border border-white/10 bg-black/65 py-1.5 pl-5 pr-1.5 text-xs uppercase tracking-[0.2em] text-[#f4ecd8] backdrop-blur-md sm:bottom-6 sm:right-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
      {linkText} 
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-all duration-300 group-hover:bg-white group-hover:text-black lg:backdrop-blur-sm">
        →
      </span>
    </div>
  </Link>
);
