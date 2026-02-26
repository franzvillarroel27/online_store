'use client';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={22} className="text-primary-600" />
            <h2 className="font-bold text-lg">Carrito ({totalItems})</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <ShoppingCart size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Tu carrito está vacío</p>
              <p className="text-sm mt-1">Agrega productos para continuar</p>
            </div>
          ) : (
            items.map(item => {
              const price = parseFloat(item.salePrice || item.price);
              return (
                <div key={item.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                  {/* Image */}
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                    {item.images?.[0] && (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-primary-600 font-bold text-sm mt-0.5">Bs. {price.toFixed(2)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center
                                   hover:border-primary-600 hover:text-primary-600 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center
                                   hover:border-primary-600 hover:text-primary-600 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors self-start p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">Bs. {subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 text-center">Envío calculado en el checkout</p>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block text-center btn-primary w-full rounded-lg py-3"
            >
              Ir al Checkout
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-primary-600 hover:underline"
            >
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
