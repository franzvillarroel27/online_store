import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';

export default function ProductSection({ title, subtitle, products = [], viewAllHref, icon }) {
  if (!products || products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm text-primary-600 font-semibold hover:underline shrink-0">
            Ver todos →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 8).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
