'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Phone, MapPin, CreditCard, Clock } from 'lucide-react';
import { api } from '@/lib/api';

const STATUS_LABELS = {
  pending: { label: 'Pedido recibido', color: 'text-amber-600', bg: 'bg-amber-50' },
  confirmed: { label: 'Confirmado', color: 'text-blue-600', bg: 'bg-blue-50' },
  preparing: { label: 'En preparación', color: 'text-purple-600', bg: 'bg-purple-50' },
  shipped: { label: 'En camino', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  delivered: { label: 'Entregado', color: 'text-green-600', bg: 'bg-green-50' },
};

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrder(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loader" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-bold">Pedido no encontrado</h2>
        <Link href="/" className="text-primary-600 hover:underline mt-4 block">Ir al inicio</Link>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[order.orderStatus] || STATUS_LABELS.pending;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">¡Pedido Confirmado!</h1>
        <p className="text-gray-500">Hemos recibido tu pedido y te notificaremos sobre el progreso.</p>
      </div>

      {/* Order number */}
      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 text-center mb-6">
        <p className="text-sm text-gray-600 mb-1">Número de pedido</p>
        <p className="text-2xl font-black text-primary-700 tracking-wide">{order.orderNumber}</p>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusInfo.bg} ${statusInfo.color}`}>
          <Clock size={13} />
          {statusInfo.label}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {/* Items */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
            <Package size={18} className="text-primary-600" /> Productos
          </h3>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                <span className="font-semibold text-gray-900">Bs. {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Envío</span>
              <span>Bs. {parseFloat(order.shippingCost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total pagado</span>
              <span className="text-primary-700">Bs. {parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-primary-600" /> Entrega
          </h3>
          <p className="text-sm text-gray-700">{order.customerName}</p>
          <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
          <p className="text-sm text-gray-600">{order.city}{order.zone ? `, ${order.zone}` : ''}</p>
        </div>

        {/* Contact */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
            <Phone size={18} className="text-primary-600" /> Contacto
          </h3>
          <p className="text-sm text-gray-700">{order.customerPhone}</p>
          {order.customerEmail && <p className="text-sm text-gray-600">{order.customerEmail}</p>}
        </div>

        {/* Payment */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
            <CreditCard size={18} className="text-primary-600" /> Pago
          </h3>
          <p className="text-sm text-gray-700">
            {order.paymentMethod === 'qr_transfer'
              ? '📱 QR / Transferencia bancaria'
              : '💵 Efectivo contraentrega'}
          </p>
          {order.paymentMethod === 'qr_transfer' && (
            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              Te contactaremos por WhatsApp con los datos para realizar tu transferencia.
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Link href="/" className="flex-1 btn-primary rounded-xl py-3 text-center">
          Seguir comprando
        </Link>
        <a
          href={`https://wa.me/591700COCINA?text=${encodeURIComponent(`Hola! Mi pedido es ${order.orderNumber}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 btn-secondary rounded-xl py-3 text-center flex items-center justify-center gap-2"
        >
          📱 Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
