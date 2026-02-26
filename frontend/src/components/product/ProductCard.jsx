'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const isLowStock = product.stockStatus === 'low_stock';
  const hasDiscount = product.salePrice && parseFloat(product.salePrice) < parseFloat(product.price);
  const discountPct = hasDiscount
    ? Math.round((1 - parseFloat(product.salePrice) / parseFloat(product.price)) * 100)
    : 0;

  return (
    <div className="card group flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Link href={`/products/${product.id}`}>
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl">🍳</div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discountPct}%
            </span>
          )}
          {product.isNewArrival && !hasDiscount && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Nuevo
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Agotado
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Últimas unidades
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full shadow-sm
                           hover:bg-white hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
          <Heart size={15} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        {product.category && (
          <span className="text-xs text-gray-400">{product.category.name}</span>
        )}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-primary-600 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-lg font-bold text-gray-900">
            Bs. {parseFloat(product.salePrice || product.price).toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              Bs. {parseFloat(product.price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock info */}
        {isLowStock && !isOutOfStock && (
          <p className="text-xs text-amber-600 font-medium">
            Solo {product.stockQuantity} disponibles
          </p>
        )}

        {/* Add to cart */}
        <button
          onClick={() => !isOutOfStock && addItem(product, 1)}
          disabled={isOutOfStock}
          className={`mt-2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold
                      transition-colors duration-200 w-full
                      ${isOutOfStock
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'}`}
        >
          <ShoppingCart size={15} />
          {isOutOfStock ? 'Agotado' : 'Agregar'}
        </button>
      </div>
    </div>
  );
}
