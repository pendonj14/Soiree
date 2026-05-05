export const MenuItem = ({ name, description, price, image }) => (
  <div className="group flex items-start gap-4 sm:gap-6">
    {/* Thumbnail */}
    <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg p-1 sm:h-25 sm:w-38">
      <img src={image} alt={name} className="object-contain w-full h-full drop-shadow-lg rounded-xl" />
    </div>
    
    {/* Details */}
    <div className="min-w-0 flex-1 pt-1">
      <div className="flex items-baseline w-full">
        <h3 className="text-[#f4ecd8] font-serif text-base uppercase tracking-wide sm:text-lg">{name}</h3>
        {/* Dotted Leader Line */}
        <div className="relative top-[-6px] mx-4 hidden flex-1 border-b-[1px] border-dotted border-white/20 sm:block"></div>
        <span className="ml-3 shrink-0 font-serif text-base text-[#f4ecd8] sm:ml-0 sm:text-lg">${price}</span>
      </div>
      <p className="mt-2 max-w-none text-sm font-light leading-relaxed text-white/50 sm:max-w-[90%]">
        {description}
      </p>
    </div>
  </div>
);
