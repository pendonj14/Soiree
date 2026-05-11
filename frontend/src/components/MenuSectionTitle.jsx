export const MenuSectionTitle = ({ title }) => (
  <div className="flex items-center justify-center gap-6 py-12 w-full">
    <div className="flex-1 h-[1px] bg-[#d8d3c5]/20"></div>
    <div className="w-2 h-2 rotate-45 border border-[#d8d3c5]/40 shrink-0"></div>
    <h2 className="text-[#f4ecd8] font-serif text-3xl tracking-[0.15em] uppercase whitespace-nowrap">{title}</h2>
    <div className="w-2 h-2 rotate-45 border border-[#d8d3c5]/40 shrink-0"></div>
    <div className="flex-1 h-[1px] bg-[#d8d3c5]/20"></div>
  </div>
);
