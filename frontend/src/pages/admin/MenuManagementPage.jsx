import { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';

const emptyForm = { name: '', description: '', price: '', category: '', image: null };

export function MenuManagementPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    adminService.getMenuItems().then(setItems).finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
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
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, image: null });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    setError(null);
    try {
      await adminService.deleteMenuItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.title}>Menu</div>
          <div style={s.subtitle}>Manage restaurant menu items</div>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={s.addBtn}>+ Add Item</button>
        )}
      </div>

      {error && (
        <div style={{ padding: '8px 20px', background: '#2e1a1a', color: '#f44336', fontSize: 10 }}>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.formTitle}>{editingId ? 'Edit Item' : 'New Item'}</div>
          <div style={s.grid2}>
            {[['name', 'Name'], ['category', 'Category'], ['price', 'Price'], ['description', 'Description']].map(([k, label]) => (
              <div key={k}>
                <label style={s.label}>{label}</label>
                <input style={s.input} value={form[k]}
                  onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} required />
              </div>
            ))}
            <div>
              <label style={s.label}>Image</label>
              <input ref={fileRef} type="file" accept="image/*" style={s.input}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.files[0] }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" style={s.submitBtn}>{editingId ? 'Save' : 'Create'}</button>
            <button type="button" onClick={resetForm} style={s.cancelBtn}>Cancel</button>
          </div>
        </form>
      )}

      <div style={s.cardGrid}>
        {items.map((item) => (
          <div key={item._id} style={s.card}>
            {item.image && <img src={item.image} alt={item.name} style={s.cardImg} />}
            <div style={s.cardBody}>
              <div style={s.cardName}>{item.name}</div>
              <div style={s.cardCategory}>{item.category}</div>
              <div style={s.cardPrice}>€{item.price}</div>
              <div style={s.cardDesc}>{item.description}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <button onClick={() => handleEdit(item)} style={s.editBtn}>Edit</button>
                <button onClick={() => handleDelete(item._id)} style={s.deleteBtn}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page:       { display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' },
  header:     { padding: '16px 20px 12px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  title:      { color: '#d4ccb6', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 },
  subtitle:   { color: '#555', fontSize: 10, marginTop: 2 },
  addBtn:     { background: '#d4ccb6', color: '#0a0a0a', fontSize: 10, padding: '5px 12px', borderRadius: 4, border: 'none', cursor: 'pointer', fontWeight: 600 },
  form:       { padding: '16px 20px', borderBottom: '1px solid #1e1e1e', background: '#111' },
  formTitle:  { color: '#d4ccb6', fontSize: 11, fontWeight: 600, marginBottom: 12 },
  grid2:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  label:      { display: 'block', color: '#666', fontSize: 9, letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' },
  input:      { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#d4ccb6', padding: '6px 8px', borderRadius: 3, fontSize: 11, boxSizing: 'border-box' },
  submitBtn:  { background: '#d4ccb6', color: '#0a0a0a', fontSize: 10, padding: '5px 16px', borderRadius: 3, border: 'none', cursor: 'pointer', fontWeight: 600 },
  cancelBtn:  { background: 'transparent', color: '#666', fontSize: 10, padding: '5px 12px', borderRadius: 3, border: '1px solid #333', cursor: 'pointer' },
  cardGrid:   { padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 },
  card:       { background: '#111', border: '1px solid #1e1e1e', borderRadius: 6, overflow: 'hidden' },
  cardImg:    { width: '100%', height: 120, objectFit: 'cover' },
  cardBody:   { padding: 12 },
  cardName:   { color: '#d4ccb6', fontSize: 12, fontWeight: 600 },
  cardCategory: { color: '#666', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  cardPrice:  { color: '#d4ccb6', fontSize: 11, marginTop: 4 },
  cardDesc:   { color: '#555', fontSize: 10, marginTop: 4, lineHeight: 1.4 },
  editBtn:    { background: '#1e2a1e', color: '#4caf50', fontSize: 9, padding: '2px 8px', borderRadius: 3, border: 'none', cursor: 'pointer' },
  deleteBtn:  { background: '#2e1a1a', color: '#f44336', fontSize: 9, padding: '2px 8px', borderRadius: 3, border: 'none', cursor: 'pointer' },
  center:     { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555' },
};
