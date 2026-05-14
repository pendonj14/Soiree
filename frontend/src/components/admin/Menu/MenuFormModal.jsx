import { useRef } from 'react';

export function MenuFormModal({ isOpen, onClose, onSubmit, form, setForm, isEditing, isSubmitting }) {
  const fileRef = useRef(null);
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl shadow-2xl max-w-2xl w-full p-6 md:p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4ccb6] opacity-[0.02] rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-2xl font-serif text-[#d4ccb6]">
            {isEditing ? 'Edit Menu Item' : 'New Menu Item'}
          </h2>
          <button type="button" onClick={onClose} className="text-[#888] hover:text-[#d4ccb6] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-widest text-[#888] uppercase">Name</label>
              <input 
                type="text" 
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className="w-full bg-[#141414] border border-[#1e1e1e] text-[#d4ccb6] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#d4ccb6]/30 focus:bg-[#1a1a1a] transition-all"
                placeholder="e.g. Truffle Pasta"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-widest text-[#888] uppercase">Category</label>
              <input 
                type="text" 
                value={form.category}
                onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                required
                className="w-full bg-[#141414] border border-[#1e1e1e] text-[#d4ccb6] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#d4ccb6]/30 focus:bg-[#1a1a1a] transition-all"
                placeholder="e.g. Mains"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-widest text-[#888] uppercase">Price (€)</label>
              <input 
                type="number" 
                step="0.01"
                value={form.price}
                onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                required
                className="w-full bg-[#141414] border border-[#1e1e1e] text-[#d4ccb6] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#d4ccb6]/30 focus:bg-[#1a1a1a] transition-all"
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-widest text-[#888] uppercase">Image (Optional)</label>
              <input 
                ref={fileRef}
                type="file" 
                accept="image/*"
                onChange={(e) => setForm(f => ({ ...f, image: e.target.files[0] }))}
                className="w-full bg-[#141414] border border-[#1e1e1e] text-[#d4ccb6] px-4 py-2 rounded-lg focus:outline-none focus:border-[#d4ccb6]/30 focus:bg-[#1a1a1a] transition-all file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#1e1e1e] file:text-[#d4ccb6] hover:file:bg-[#2a2a2a] file:cursor-pointer file:transition-colors"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold tracking-widest text-[#888] uppercase">Description</label>
              <textarea 
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                required
                rows="3"
                className="w-full bg-[#141414] border border-[#1e1e1e] text-[#d4ccb6] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#d4ccb6]/30 focus:bg-[#1a1a1a] transition-all resize-none"
                placeholder="Item description..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[#1e1e1e] mt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold tracking-wider text-[#888] hover:text-[#d4ccb6] hover:bg-[#1a1a1a] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wider transition-colors shadow-[0_0_15px_rgba(212,204,182,0.15)] ${
                isSubmitting 
                  ? 'bg-[#d4ccb6]/50 text-[#0a0a0a]/50 cursor-not-allowed' 
                  : 'bg-[#d4ccb6] text-[#0a0a0a] hover:bg-white'
              }`}
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
