'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, Package, Search } from 'lucide-react';
import { api } from '@/lib/api';

const EMPTY_FORM = {
  name: '', description: '', price: '', salePrice: '',
  categoryId: '', stockQuantity: '', lowStockThreshold: '5',
  sku: '', isNewArrival: false, isBestSeller: false, isActive: true,
  images: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const [prods, cats] = await Promise.all([
        api.adminFetch(`/products?search=${search}&limit=50`),
        api.getCategories(),
      ]);
      setProducts(prods.products || []);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      salePrice: product.salePrice || '',
      categoryId: product.categoryId || '',
      stockQuantity: product.stockQuantity || '',
      lowStockThreshold: product.lowStockThreshold || '5',
      sku: product.sku || '',
      isNewArrival: product.isNewArrival || false,
      isBestSeller: product.isBestSeller || false,
      isActive: product.isActive !== false,
      images: (product.images || []).join(', '),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editProduct) {
        await api.adminFetch(`/products/${editProduct.id}`, {
          method: 'PUT', body: JSON.stringify(data),
        });
      } else {
        await api.adminFetch('/products', {
          method: 'POST', body: JSON.stringify(data),
        });
      }
      setShowForm(false);
      setEditProduct(null);
      setForm(EMPTY_FORM);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Desactivar este producto?')) return;
    try {
      await api.adminFetch(`/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const STOCK_COLORS = {
    available: 'bg-green-100 text-green-700',
    low_stock: 'bg-amber-100 text-amber-700',
    out_of_stock: 'bg-red-100 text-red-700',
  };
  const STOCK_LABELS = { available: 'Disponible', low_stock: 'Stock bajo', out_of_stock: 'Agotado' };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} productos</p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setForm(EMPTY_FORM); setShowForm(true); }}
          className="flex items-center gap-2 btn-primary rounded-xl py-2.5 px-4 text-sm"
        >
          <Plus size={16} /> Agregar Producto
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchProducts()}
            placeholder="Buscar productos..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Producto</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Categoría</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Precio</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10"><div className="loader mx-auto" /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">
                  <Package size={40} className="mx-auto mb-2 text-gray-300" />
                  No hay productos
                </td></tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className={`hover:bg-gray-50 ${!product.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg shrink-0">
                          {product.images?.[0] ? '🖼️' : '🍳'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.sku || 'Sin SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{product.category?.name || '—'}</td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-gray-900">Bs. {parseFloat(product.price).toFixed(2)}</p>
                      {product.salePrice && (
                        <p className="text-xs text-red-500">Oferta: Bs. {parseFloat(product.salePrice).toFixed(2)}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{product.stockQuantity}</span>
                        {product.stockStatus === 'low_stock' && (
                          <AlertTriangle size={14} className="text-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge-stock ${STOCK_COLORS[product.stockStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {STOCK_LABELS[product.stockStatus] || product.stockStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(product)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg">{editProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                    rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (Bs.) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Oferta (Bs.)</label>
                  <input type="number" step="0.01" value={form.salePrice} onChange={e => setForm(f => ({...f, salePrice: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <select value={form.categoryId} onChange={e => setForm(f => ({...f, categoryId: e.target.value}))} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500">
                    <option value="">Seleccionar...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input value={form.sku} onChange={e => setForm(f => ({...f, sku: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input type="number" value={form.stockQuantity} onChange={e => setForm(f => ({...f, stockQuantity: e.target.value}))} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alerta de stock bajo</label>
                  <input type="number" value={form.lowStockThreshold} onChange={e => setForm(f => ({...f, lowStockThreshold: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URLs de imágenes (separadas por comas)</label>
                  <textarea value={form.images} onChange={e => setForm(f => ({...f, images: e.target.value}))}
                    rows={2} placeholder="https://..., https://..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 resize-none" />
                </div>
                <div className="sm:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.isNewArrival} onChange={e => setForm(f => ({...f, isNewArrival: e.target.checked}))}
                      className="w-4 h-4 text-primary-600 rounded" />
                    <span>Nuevo producto</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.isBestSeller} onChange={e => setForm(f => ({...f, isBestSeller: e.target.checked}))}
                      className="w-4 h-4 text-primary-600 rounded" />
                    <span>Más vendido</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({...f, isActive: e.target.checked}))}
                      className="w-4 h-4 text-primary-600 rounded" />
                    <span>Activo</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 btn-primary rounded-xl py-2.5 flex items-center justify-center gap-2">
                  {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editProduct ? 'Guardar cambios' : 'Crear producto'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 btn-secondary rounded-xl py-2.5">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
