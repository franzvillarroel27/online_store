'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

const EMPTY_FORM = { name: '', description: '', icon: '', imageUrl: '', sortOrder: 0 };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await api.adminFetch('/categories');
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || '',
      imageUrl: cat.imageUrl || '',
      sortOrder: cat.sortOrder
    });
    setShowForm(true);
    setError('');
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        sortOrder: parseInt(form.sortOrder) || 0
      };
      if (editingId) {
        const updated = await api.adminFetch(`/categories/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...updated } : c));
      } else {
        const created = await api.adminFetch('/categories', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setCategories(prev => [...prev, { ...created, _count: { products: 0 } }]);
      }
      handleCancel();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Desactivar esta categoría? Los productos existentes no serán afectados.')) return;
    try {
      await api.adminFetch(`/categories/${id}`, { method: 'DELETE' });
      setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: false } : c));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    try {
      const updated = await api.adminFetch(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: true })
      });
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categorías en total</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                required name="name" value={form.name} onChange={handleChange}
                placeholder="Ej. Ollas y Cacerolas"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ícono (emoji)</label>
              <input
                name="icon" value={form.icon} onChange={handleChange}
                placeholder="🥘"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
              <input
                name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange}
                min="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                name="description" value={form.description} onChange={handleChange}
                placeholder="Descripción breve de la categoría"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
              <input
                name="imageUrl" value={form.imageUrl} onChange={handleChange}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit" disabled={saving}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
            >
              <Check size={15} />
              {saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}
            </button>
            <button
              type="button" onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <X size={15} /> Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Categoría</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Productos</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Orden</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Estado</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${!cat.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {cat.icon && <span className="text-xl">{cat.icon}</span>}
                      <div>
                        <p className="font-semibold text-gray-900">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-gray-400 line-clamp-1">{cat.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{cat._count?.products ?? 0}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{cat.sortOrder}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      {cat.isActive ? (
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Desactivar"
                        >
                          <Trash2 size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(cat.id)}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Reactivar"
                        >
                          <Check size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-400">No hay categorías registradas</div>
          )}
        </div>
      )}
    </div>
  );
}
