import Banner from '@/components/home/Banner';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductSection from '@/components/home/ProductSection';
import { api } from '@/lib/api';

async function getData() {
  try {
    const [categories, featured] = await Promise.all([
      api.getCategories(),
      api.getFeaturedProducts(),
    ]);
    return { categories, featured };
  } catch {
    return { categories: [], featured: { newArrivals: [], bestSellers: [], onSale: [] } };
  }
}

export default async function HomePage() {
  const { categories, featured } = await getData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Banner rotativo */}
      <Banner />

      {/* Categorías */}
      <CategoryGrid categories={categories} />

      {/* Nuevos productos */}
      <ProductSection
        title="Nuevos Productos"
        subtitle="Lo último en utensilios de cocina"
        products={featured.newArrivals}
        viewAllHref="/tiendas?sort=newest"
        icon="✨"
      />

      {/* Más vendidos */}
      <ProductSection
        title="Más Vendidos"
        subtitle="Los favoritos de nuestros clientes"
        products={featured.bestSellers}
        viewAllHref="/tiendas?sort=bestseller"
        icon="🏆"
      />

      {/* Ofertas del día */}
      {featured.onSale?.length > 0 && (
        <div id="ofertas" className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              ¡HOY!
            </span>
          </div>
          <ProductSection
            title="Ofertas del Día"
            subtitle="Precios especiales solo por tiempo limitado"
            products={featured.onSale}
            viewAllHref="/tiendas?sort=sale"
            icon="🔥"
          />
        </div>
      )}

      {/* Banner informativo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '🚚', title: 'Envío Rápido', desc: 'Entregamos en La Paz el mismo día' },
          { icon: '✅', title: 'Calidad Garantizada', desc: 'Todos nuestros productos son originales' },
          { icon: '💳', title: 'Pago Seguro', desc: 'QR, transferencia o efectivo' },
        ].map(item => (
          <div key={item.title} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <span className="text-3xl">{item.icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
