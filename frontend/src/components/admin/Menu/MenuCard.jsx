export function MenuCard({ item, onEdit, onDelete }) {
  return (
    <div className="group bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#d4ccb6]/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#d4ccb6]/5 flex flex-col h-full">
      {/* Image container with fixed height and fallback */}
      <div className="h-48 w-full bg-[#141414] relative overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#333]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wider text-[#d4ccb6] border border-white/10">
          €{Number(item.price).toFixed(2)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#888] uppercase bg-[#1a1a1a] px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
        <h3 className="text-lg font-bold font-serif text-[#d4ccb6] mb-2">{item.name}</h3>
        <p className="text-[#666] text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-[#1e1e1e] mt-auto">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 py-2 text-xs font-semibold tracking-wider bg-[#1e2a1e] text-[#4caf50] hover:bg-[#254225] rounded transition-colors"
          >
            EDIT
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex-1 py-2 text-xs font-semibold tracking-wider bg-[#2e1a1a] text-[#f44336] hover:bg-[#422525] rounded transition-colors"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}
