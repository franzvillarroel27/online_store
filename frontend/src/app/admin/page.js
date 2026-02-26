'use client';
import { useState, useEffect } from 'react';
import { ShoppingBag, Package, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

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

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminFetch('/dashboard')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loader" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen del día - {new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pedidos hoy', value: stats.todayOrders ?? 0, icon: ShoppingBag, color: 'bg-blue-500', href: '/admin/orders' },
          { label: 'Ingresos hoy', value: `Bs. ${parseFloat(stats.todayRevenue || 0).toFixed(2)}`, icon: TrendingUp, color: 'bg-green-500' },
          { label: 'Pedidos pendientes', value: stats.pendingOrders ?? 0, icon: Clock, color: 'bg-amber-500', href: '/admin/orders?status=pending' },
          { label: 'Stock bajo', value: stats.lowStockProducts ?? 0, icon: AlertTriangle, color: 'bg-red-500', href: '/admin/products?filter=low_stock' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            {stat.href && (
              <Link href={stat.href} className="text-xs text-primary-600 hover:underline mt-1 block">Ver detalle →</Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Pedidos Recientes</h2>
          <Link href="/admin/orders" className="text-sm text-primary-600 hover:underline">Ver todos →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pedido</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No hay pedidos aún</td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders?id=${order.id}`} className="font-mono text-primary-600 hover:underline text-xs">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-900">{order.customerName}</td>
                    <td className="px-5 py-3 font-bold text-gray-900">Bs. {parseFloat(order.total).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`badge-stock ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('es-BO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
