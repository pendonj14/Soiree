export const MenuSectionTitle = ({ title }) => (
  <div className="flex items-center justify-center gap-3 py-8 sm:gap-4 sm:py-12">
    <div className="w-2 h-2 rotate-45 border border-white/30"></div>
    <h2 className="text-center font-serif text-2xl uppercase tracking-[0.15em] text-[#f4ecd8] sm:text-3xl">{title}</h2>
    <div className="w-2 h-2 rotate-45 border border-white/30"></div>
  </div>
);
