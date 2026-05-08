export const MenuItem = ({ name, description, price, image }) => (
  <div className="group w-full">
    
    {/* MOBILE LAYOUT */}
    <div className="flex md:hidden flex-col items-center w-full gap-3">
      <h3 className="text-[#f4ecd8] font-serif text-xl tracking-wide uppercase text-center">{name}</h3>
      <div className="w-56 h-36 shrink-0 rounded-lg overflow-hidden flex items-center justify-center p-1">
        <img src={image} alt={name} className="object-contain w-full h-full drop-shadow-lg rounded-xl" />
      </div>
      <span className="text-[#f4ecd8] font-serif text-xl">${price}</span>
      <p className="text-white/60 text-sm leading-relaxed text-center font-light w-full px-2">
        {description}
      </p>
    </div>

    {/* DESKTOP LAYOUT */}
    <div className="hidden md:flex gap-6 items-start w-full">
      {/* Thumbnail */}
      <div className="w-38 h-25 shrink-0 rounded-lg overflow-hidden flex items-center justify-center p-1">
        <img src={image} alt={name} className="object-contain w-full h-full drop-shadow-lg rounded-xl" />
      </div>
      
      {/* Details */}
      <div className="flex-1 pt-1">
        <div className="flex items-baseline w-full">
          <h3 className="text-[#f4ecd8] font-serif text-lg tracking-wide uppercase">{name}</h3>
          {/* Dotted Leader Line */}
          <div className="flex-1 mx-4 border-b-[1px] border-dotted border-white/20 relative top-[-6px]"></div>
          <span className="text-[#f4ecd8] font-serif text-lg">${price}</span>
        </div>
        <p className="text-white/50 text-sm mt-2 leading-relaxed max-w-[90%] font-light">
          {description}
        </p>
      </div>
    </div>

  </div>
);