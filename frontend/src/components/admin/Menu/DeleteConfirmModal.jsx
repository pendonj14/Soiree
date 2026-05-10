export function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl shadow-2xl max-w-sm w-full p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <h3 className="text-xl font-serif text-[#d4ccb6] mb-2 relative z-10">Delete Item</h3>
        <p className="text-[#888] text-sm mb-6 relative z-10">
          Are you sure you want to delete <span className="text-[#d4ccb6] font-semibold">"{itemName}"</span>? This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-3 relative z-10">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold tracking-wider text-[#888] hover:text-[#d4ccb6] hover:bg-[#1a1a1a] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold tracking-wider bg-[#2e1a1a] text-[#f44336] hover:bg-[#422525] border border-red-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
