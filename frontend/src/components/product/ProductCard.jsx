'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';

function getSessionId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem('cs_session_id');
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('cs_session_id', id);
  }
  return id;
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [wished, setWished]   = useState(false);
  const [adding, setAdding]   = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cs_wishlist') || '[]');
    setWished(saved.includes(product.id));
  }, [product.id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    const sessionId = getSessionId();
    if (!sessionId) return;
    const saved = JSON.parse(localStorage.getItem('cs_wishlist') || '[]');
    if (wished) {
      localStorage.setItem('cs_wishlist', JSON.stringify(saved.filter(id => id !== product.id)));
      setWished(false);
      api.removeFromWishlist(sessionId, product.id).catch(() => {});
    } else {
      localStorage.setItem('cs_wishlist', JSON.stringify([...saved, product.id]));
      setWished(true);
      api.addToWishlist(sessionId, product.id).catch(() => {});
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock || adding) return;
    addItem(product, 1);
    setAdding(true);
    setTimeout(() => setAdding(false), 1400);
  };

  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const isLowStock   = product.stockStatus === 'low_stock';
  const hasDiscount  = product.salePrice && parseFloat(product.salePrice) < parseFloat(product.price);
  const discountPct  = hasDiscount
    ? Math.round((1 - parseFloat(product.salePrice) / parseFloat(product.price)) * 100)
    : 0;
  const price = parseFloat(product.salePrice || product.price);

  return (
    <div className="group relative flex flex-col bg-white rounded-ios-lg shadow-ios
                    hover:shadow-ios-md active:scale-[0.985] transition-all duration-200 overflow-hidden">

      {/* Image area */}
      <Link href={`/products/${product.id}`} className="relative aspect-square bg-warm-100 overflow-hidden block">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">🍳</div>
        )}

        {/* Subtle top fade */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/10 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="badge bg-red-500 text-white">-{discountPct}%</span>
          )}
          {product.isNewArrival && !hasDiscount && (
            <span className="badge bg-sage-600 text-white">Nuevo</span>
          )}
          {isOutOfStock && (
            <span className="badge badge-gray">Agotado</span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="badge bg-amber-500 text-white">Últimas uds.</span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-2 right-2 p-1.5 bg-white/75 backdrop-blur-sm rounded-full shadow-ios
                      transition-all duration-200
                      ${wished
                        ? 'opacity-100 text-red-500 scale-110'
                        : 'opacity-0 group-hover:opacity-100 hover:text-red-500'}`}
        >
          <Heart size={14} className={wished ? 'fill-red-500' : ''} />
        </button>
      </Link>

      {/* Product info */}
      <div className="flex flex-col flex-1 p-3.5 gap-1">
        {product.category && (
          <span className="text-[11px] text-warm-500 font-medium uppercase tracking-wide">
            {product.category.name}
          </span>
        )}

        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2
                         hover:text-primary-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-auto pt-1.5">
          <span className="text-base font-black text-gray-900">
            Bs. {price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-warm-400 line-through font-medium">
              Bs. {parseFloat(product.price).toFixed(2)}
            </span>
          )}
        </div>

        {isLowStock && !isOutOfStock && (
          <p className="text-[11px] text-amber-600 font-semibold -mt-0.5">
            Solo {product.stockQuantity} disponibles
          </p>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-2 flex items-center justify-center gap-1.5 py-2.5 rounded-full
                      text-sm font-bold transition-all duration-200 w-full active:scale-95
                      ${isOutOfStock
                        ? 'bg-warm-200 text-warm-400 cursor-not-allowed'
                        : adding
                          ? 'bg-sage-600 text-white scale-[0.98]'
                          : 'bg-primary-600 text-white hover:bg-primary-700'}`}
        >
          <ShoppingCart size={14} />
          {isOutOfStock ? 'Agotado' : adding ? '¡Agregado!' : 'Agregar'}
        </button>
      </div>
    </div>
  );
}
