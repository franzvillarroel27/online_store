'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Bell, Star, Minus, Plus, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ImageGallery from '@/components/product/ImageGallery';
import StockIndicator from '@/components/product/StockIndicator';
import RelatedProducts from '@/components/product/RelatedProducts';
import { api } from '@/lib/api';

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ customerName: '', rating: 5, comment: '' });
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewLoading(true);
    try {
      await api.submitReview(id, reviewForm);
      setReviewSent(true);
      setReviewForm({ customerName: '', rating: 5, comment: '' });
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    api.getProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stockStatus === 'out_of_stock') return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loader" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
        <Link href="/" className="text-primary-600 hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const hasDiscount = product.salePrice && parseFloat(product.salePrice) < parseFloat(product.price);
  const discountPct = hasDiscount
    ? Math.round((1 - parseFloat(product.salePrice) / parseFloat(product.price)) * 100)
    : 0;
  const currentPrice = parseFloat(product.salePrice || product.price);
  const avgRating = product.reviews?.length > 0
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary-600">Inicio</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/category/${product.category.id}`} className="hover:text-primary-600">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <ImageGallery images={product.images} name={product.name} />

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          {product.category && (
            <Link href={`/category/${product.category.id}`}
              className="text-sm text-primary-600 font-semibold hover:underline w-fit">
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16}
                    className={s <= Math.round(parseFloat(avgRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-600">{avgRating} ({product.reviews.length} reseñas)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-gray-900">
              Bs. {currentPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  Bs. {parseFloat(product.price).toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">
                  -{discountPct}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock indicator */}
          <StockIndicator product={product} />

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {product.description}
            </p>
          )}

          {/* Details */}
          {(product.sku || product.weight || product.dimensions) && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
              {product.sku && <p><span className="font-medium text-gray-700">SKU:</span> <span className="text-gray-500">{product.sku}</span></p>}
              {product.weight && <p><span className="font-medium text-gray-700">Peso:</span> <span className="text-gray-500">{product.weight} kg</span></p>}
              {product.dimensions && <p><span className="font-medium text-gray-700">Dimensiones:</span> <span className="text-gray-500">{product.dimensions}</span></p>}
            </div>
          )}

          {/* Quantity + Add to cart */}
          {!isOutOfStock && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-semibold text-sm min-w-[2.5rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                  className="px-3 py-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm
                            transition-all duration-200 shadow-sm
                            ${added
                              ? 'bg-green-500 text-white'
                              : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'}`}
              >
                <ShoppingCart size={18} />
                {added ? '¡Agregado!' : 'Agregar al carrito'}
              </button>
            </div>
          )}

          {/* Out of stock CTA */}
          {isOutOfStock && (
            <div className="flex flex-col gap-3">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-700 font-semibold">Este producto está agotado</p>
                <p className="text-sm text-red-500 mt-1">Te avisamos cuando vuelva a estar disponible</p>
              </div>
              <button className="flex items-center justify-center gap-2 btn-secondary rounded-xl py-3 w-full">
                <Bell size={18} />
                Avisarme cuando esté disponible
              </button>
            </div>
          )}

          {/* Shipping info */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm">
            <p className="font-semibold text-orange-800 mb-1">🚚 Información de envío</p>
            <p className="text-orange-700">Envío en La Paz: Bs. 15 | Otras ciudades: Bs. 25</p>
            <p className="text-orange-600 text-xs mt-1">Entrega en 1-3 días hábiles</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Reseñas de Clientes ({product.reviews.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map(review => (
              <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {review.customerName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.customerName}</p>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12}
                          className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                </div>
                {review.comment && <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Review form */}
      <section className="mt-12 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Escribir una Reseña</h2>
        {reviewSent ? (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
            <Send size={18} />
            <p className="font-medium">¡Gracias por tu reseña! Será publicada después de revisión.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre *</label>
                <input
                  required
                  value={reviewForm.customerName}
                  onChange={e => setReviewForm(f => ({ ...f, customerName: e.target.value }))}
                  placeholder="Juan Pérez"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calificación *</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                      className="focus:outline-none"
                    >
                      <Star
                        size={28}
                        className={s <= reviewForm.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comentario (opcional)</label>
              <textarea
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                rows={3}
                placeholder="¿Qué te pareció este producto?"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>
            {reviewError && (
              <p className="text-sm text-red-600">{reviewError}</p>
            )}
            <button
              type="submit"
              disabled={reviewLoading}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
            >
              <Send size={15} />
              {reviewLoading ? 'Enviando...' : 'Enviar Reseña'}
            </button>
          </form>
        )}
      </section>

      {/* Related products */}
      <RelatedProducts products={product.related || []} />
    </div>
  );
}
