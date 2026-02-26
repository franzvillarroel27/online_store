'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart();

  const shipping = subtotal >= 350 ? 0 : subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">Agrega productos para continuar con tu compra</p>
        <Link href="/" className="btn-primary rounded-xl inline-flex items-center gap-2">
          <ShoppingCart size={18} /> Seguir comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Carrito de Compras ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 hover:underline">
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const price = parseFloat(item.salePrice || item.price);
            return (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  {item.images?.[0] && (
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="80px" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.id}`}
                    className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2 text-sm leading-snug">
                    {item.name}
                  </Link>
                  <p className="text-primary-600 font-bold mt-1">Bs. {price.toFixed(2)}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 text-sm">
                        Bs. {(price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Resumen del Pedido</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} artículos)</span>
                <span className="font-semibold text-gray-900">Bs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {shipping === 0 ? 'GRATIS' : `Bs. ${shipping.toFixed(2)}`}
                </span>
              </div>
              {subtotal < 350 && subtotal > 0 && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
                  Agrega Bs. {(350 - subtotal).toFixed(2)} más para envío gratis
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary-700">Bs. {total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 flex items-center justify-center gap-2 btn-primary rounded-xl py-3.5 w-full"
            >
              Proceder al Checkout <ArrowRight size={18} />
            </Link>
            <Link href="/" className="block text-center text-sm text-primary-600 hover:underline mt-3">
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
