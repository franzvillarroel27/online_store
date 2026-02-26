'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Package, Search } from 'lucide-react';

export default function MiCuentaPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const STATUS_LABELS = {
    pending: 'Pendiente', confirmed: 'Confirmado', preparing: 'En preparación',
    shipped: 'En camino', delivered: 'Entregado', cancelled: 'Cancelado',
  };
  const STATUS_COLORS = {
    pending: 'text-amber-600 bg-amber-50',
    confirmed: 'text-blue-600 bg-blue-50',
    preparing: 'text-purple-600 bg-purple-50',
    shipped: 'text-indigo-600 bg-indigo-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const data = await api.getOrderByNumber(orderNumber.trim());
      setOrder(data);
    } catch {
      setError('Pedido no encontrado. Verifica el número e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mi Cuenta</h1>
      <p className="text-gray-500 text-sm mb-8">Consulta el estado de tu pedido usando tu número de orden.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Package size={20} className="text-primary-600" /> Rastrear Pedido
        </h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            placeholder="Ej. CS-1234567890-ABCD"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
          />
          <button type="submit" disabled={loading}
            className="btn-primary rounded-xl px-5 py-3 flex items-center gap-2 text-sm">
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : <Search size={16} />}
            Buscar
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {order && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <p className="font-mono font-bold text-lg text-primary-700">{order.orderNumber}</p>
              <span className={`badge-stock ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[order.orderStatus] || order.orderStatus}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.createdAt).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Productos</p>
              {order.items?.map(item => (
                <p key={item.id} className="text-gray-800">{item.name} × {item.quantity} — Bs. {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</p>
              ))}
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-3">
              <span>Total</span>
              <span className="text-primary-700">Bs. {parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
