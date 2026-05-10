const FILTERS = ['pending', 'accepted', 'rejected', 'done', 'all'];

export function ReservationFilters({ filter, setFilter, onDeleteAllDone }) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6 border-b border-[#1a1a1a] bg-[#0a0a0a]">
      {FILTERS.map((f) => (
        <button 
          key={f} 
          onClick={() => setFilter(f)}
          className={`px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all duration-300 ${
            filter === f 
              ? 'bg-[#d4ccb6] text-[#0a0a0a] font-bold shadow-[0_0_15px_rgba(212,204,182,0.15)]' 
              : 'bg-[#1e1e1e] text-[#888] hover:bg-[#2a2a2a] hover:text-[#d4ccb6]'
          }`}
        >
          {f}
        </button>
      ))}
      
      {filter === 'done' && (
        <button 
          onClick={onDeleteAllDone} 
          className="ml-auto bg-[#2e1a1a] text-[#f44336] px-5 py-2 rounded-lg border border-[#f44336]/20 text-xs font-bold uppercase tracking-wider hover:bg-[#422525] transition-colors"
        >
          Delete All
        </button>
      )}
    </div>
  );
}
