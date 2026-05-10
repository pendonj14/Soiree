import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { MenuCard } from '../../components/admin/Menu/MenuCard';
import { MenuFormModal } from '../../components/admin/Menu/MenuFormModal';
import { DeleteConfirmModal } from '../../components/admin/Menu/DeleteConfirmModal';

const emptyForm = { name: '', description: '', price: '', category: '', image: null };

export function MenuManagementPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService.getMenuItems().then(setItems).finally(() => setLoading(false));
  }, []);

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    // slight delay to let modal animate out before clearing form
    setTimeout(() => {
      setForm(emptyForm);
      setEditingId(null);
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('category', form.category);
    if (form.image) fd.append('image', form.image);
    
    try {
      if (editingId) {
        const updated = await adminService.updateMenuItem(editingId, fd);
        setItems((prev) => prev.map((i) => (i._id === editingId ? updated : i)));
      } else {
        const created = await adminService.createMenuItem(fd);
        setItems((prev) => [...prev, created]);
      }
      closeFormModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (item) => {
    setForm({ 
      name: item.name, 
      description: item.description, 
      price: item.price, 
      category: item.category, 
      image: null 
    });
    setEditingId(item._id);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setError(null);
    try {
      await adminService.deleteMenuItem(itemToDelete._id);
      setItems((prev) => prev.filter((i) => i._id !== itemToDelete._id));
      setItemToDelete(null);
    } catch (err) {
      setError(err.message);
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#d4ccb6] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#888] tracking-widest text-sm uppercase">Loading Menu Items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#d4ccb6] overflow-y-auto custom-scrollbar relative">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-8 border-b border-[#1e1e1e] bg-[#0a0a0a] shrink-0 relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4ccb6] opacity-[0.02] rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="mb-4 md:mb-0 relative z-10">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-[#d4ccb6] mb-2 font-serif">
            Menu Management
          </h1>
          <p className="text-[#888] text-sm tracking-wide">
            Add, edit, and curate your restaurant's offerings
          </p>
        </div>
        
        <button 
          onClick={() => setIsFormModalOpen(true)}
          className="relative z-10 bg-[#d4ccb6] text-[#0a0a0a] px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors shadow-[0_0_15px_rgba(212,204,182,0.15)] flex items-center gap-2 w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Item
        </button>
      </div>

      {error && (
        <div className="px-8 py-4 bg-[#2e1a1a] text-[#f44336] text-sm font-medium border-b border-[#f44336]/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
          <button onClick={() => setError(null)} className="opacity-70 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* Grid of Menu Items */}
      <div className="p-8 pb-16">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#444] border border-[#1e1e1e] border-dashed rounded-xl bg-[#0f0f0f]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
            <p className="text-lg font-light tracking-wide text-[#888]">No menu items found</p>
            <p className="text-sm mt-1 mb-6">Start by adding your first dish to the menu.</p>
            <button 
              onClick={() => setIsFormModalOpen(true)}
              className="bg-[#1e1e1e] text-[#d4ccb6] px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#2a2a2a] transition-colors"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <MenuCard 
                key={item._id} 
                item={item} 
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <MenuFormModal 
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        isEditing={!!editingId}
      />

      <DeleteConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name || ''}
      />
    </div>
  );
}
