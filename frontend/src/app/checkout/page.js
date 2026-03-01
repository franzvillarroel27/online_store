'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, CreditCard, Truck, CheckCircle, AlertCircle, Tag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';

const PAYMENT_METHODS = [
  {
    id: 'qr_transfer',
    label: 'QR / Transferencia',
    icon: '📱',
    desc: 'Tigo Money, BNB, Banco Unión u otro banco. Envías comprobante.',
  },
  {
    id: 'cash_on_delivery',
    label: 'Efectivo contraentrega',
    icon: '💵',
    desc: 'Paga en efectivo cuando recibas tu pedido.',
  },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    city: 'La Paz',
    zone: '',
    paymentMethod: 'qr_transfer',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState(null); // { code, discountType, discountValue, discount }
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const shipping = form.city.toLowerCase() === 'la paz' ? 15 : 25;
  const discount = coupon?.discount || 0;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError('');
    setCouponLoading(true);
    try {
      const res = await api.validateCoupon(couponInput, subtotal);
      setCoupon(res.coupon);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Tu carrito está vacío');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(i => ({
        productId: i.id,
        quantity: i.quantity,
      }));

      const { order } = await api.createOrder({
        ...form,
        items: orderItems,
        couponCode: coupon?.code || null,
      });

      clearCart();
      router.push(`/order-success/${order.id}`);
    } catch (err) {
      setError(err.message || 'Error al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <Link href="/" className="btn-primary rounded-xl inline-block px-6 py-3 mt-2">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                <Truck size={20} className="text-primary-600" /> Datos de Contacto
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input
                    name="customerName" value={form.customerName} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    name="customerPhone" value={form.customerPhone} onChange={handleChange} required
                    type="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                    placeholder="+591 7XXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (opcional)</label>
                  <input
                    name="customerEmail" value={form.customerEmail} onChange={handleChange}
                    type="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                <Truck size={20} className="text-primary-600" /> Dirección de Entrega
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input
                    name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                    placeholder="Calle, número, edificio, referencia..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                    <select
                      name="city" value={form.city} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                    >
                      {['La Paz', 'El Alto', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Sucre', 'Trinidad', 'Cobija'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zona / Barrio</label>
                    <input
                      name="zone" value={form.zone} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                      placeholder="Ej. Miraflores, Sopocachi"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas para el repartidor</label>
                  <textarea
                    name="notes" value={form.notes} onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 resize-none"
                    placeholder="Indicaciones adicionales para la entrega..."
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-primary-600" /> Método de Pago
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(method => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors
                                ${form.paymentMethod === method.id
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input
                      type="radio" name="paymentMethod" value={method.id}
                      checked={form.paymentMethod === method.id}
                      onChange={handleChange}
                      className="text-primary-600"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{method.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {form.paymentMethod === 'qr_transfer' && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-blue-800 mb-1">📱 Instrucciones de pago por QR</p>
                  <p className="text-blue-700">Una vez confirmado tu pedido, te enviaremos los datos de cuenta para realizar la transferencia. Deberás enviar el comprobante por WhatsApp.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Tu Pedido</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map(item => {
                  const price = parseFloat(item.salePrice || item.price);
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {item.images?.[0] && (
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="48px" />
                        )}
                        <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-primary-600 font-bold">Bs. {(price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div className="border-t border-gray-100 pt-4">
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm">
                    <div className="flex items-center gap-2 text-green-700">
                      <Tag size={14} />
                      <span className="font-semibold">{coupon.code}</span>
                      <span>-Bs. {coupon.discount.toFixed(2)}</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                        placeholder="Código de cupón"
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                      >
                        {couponLoading ? '...' : 'Aplicar'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600 mt-1">{couponError}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Prueba: BIENVENIDO10, COCINA20, ENVIOGRATIS</p>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">Bs. {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({coupon.code})</span>
                    <span className="font-semibold">-Bs. {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Envío a {form.city}</span>
                  <span className="font-semibold text-gray-900">Bs. {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-primary-700 text-lg">Bs. {total.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 btn-primary rounded-xl py-3.5 w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle size={18} />
                )}
                {loading ? 'Procesando...' : 'Confirmar Pedido'}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Al confirmar aceptas nuestros términos de servicio
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
