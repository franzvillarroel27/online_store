'use client';
import { useState, useEffect } from 'react';
import { Eye, Package, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmados' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'shipped', label: 'Enviados' },
  { value: 'delivered', label: 'Entregados' },
  { value: 'cancelled', label: 'Cancelados' },
];

const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
const STATUS_LABELS = {
  pending: 'Pendiente', confirmed: 'Confirmado', preparing: 'Preparando',
  shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}&limit=50` : '?limit=50';
      const data = await api.adminFetch(`/orders${params}`);
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleUpdateStatus = async (orderId, orderStatus) => {
    setUpdating(true);
    try {
      const updated = await api.adminFetch(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, orderStatus });
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} pedidos</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                        ${filter === opt.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-600'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Pedido</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Pago</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10"><div className="loader mx-auto" /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">
                  <Package size={40} className="mx-auto mb-2 text-gray-300" />
                  No hay pedidos
                </td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-mono text-xs font-medium text-primary-600">{order.orderNumber}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerPhone}</p>
                    </td>
                    <td className="px-5 py-3 font-bold text-gray-900">Bs. {parseFloat(order.total).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs">{order.paymentMethod === 'qr_transfer' ? '📱 QR' : '💵 Efectivo'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={e => handleUpdateStatus(order.id, e.target.value)}
                        disabled={updating}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer ${STATUS_COLORS[order.orderStatus] || ''}`}
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('es-BO', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors float-right"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="font-bold text-lg">{selectedOrder.orderNumber}</h2>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[selectedOrder.orderStatus]}`}>
                  {STATUS_LABELS[selectedOrder.orderStatus]}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Cliente</h3>
                <p className="text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-gray-600">{selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && <p className="text-gray-600">{selectedOrder.customerEmail}</p>}
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Dirección</h3>
                <p className="text-gray-900">{selectedOrder.deliveryAddress}</p>
                <p className="text-gray-600">{selectedOrder.city}{selectedOrder.zone ? `, ${selectedOrder.zone}` : ''}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Productos</h3>
                {(selectedOrder.items || []).map(item => (
                  <div key={item.id} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                    <span className="text-gray-700">{item.name} × {item.quantity}</span>
                    <span className="font-semibold">Bs. {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span>Bs. {parseFloat(selectedOrder.shippingCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary-700">Bs. {parseFloat(selectedOrder.total).toFixed(2)}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Cambiar Estado</h3>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                      disabled={updating || selectedOrder.orderStatus === s}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                                  ${selectedOrder.orderStatus === s
                                    ? STATUS_COLORS[s] + ' opacity-100 ring-2 ring-offset-1 ring-current'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
