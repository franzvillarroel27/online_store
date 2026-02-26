import Link from 'next/link';

const CATEGORIES = [
  { id: 1, name: 'Ollas y Cacerolas',          icon: '🥘', color: 'from-orange-400 to-orange-600' },
  { id: 2, name: 'Sartenes y Woks',             icon: '🍳', color: 'from-amber-400 to-amber-600' },
  { id: 3, name: 'Cubiertos y Cucharas',        icon: '🥄', color: 'from-yellow-400 to-yellow-600' },
  { id: 4, name: 'Vasos y Tazas',               icon: '☕', color: 'from-brown-400 to-red-600' },
  { id: 5, name: 'Tablas y Utensilios',         icon: '🔪', color: 'from-gray-400 to-gray-600' },
  { id: 6, name: 'Electrodomésticos Pequeños',  icon: '⚡', color: 'from-blue-400 to-blue-600' },
];

export default function CategoryGrid({ categories = [] }) {
  const displayCategories = categories.length > 0 ? categories : CATEGORIES;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Categorías</h2>
          <p className="text-sm text-gray-500 mt-0.5">Encuentra todo lo que necesitas</p>
        </div>
        <Link href="/tiendas" className="text-sm text-primary-600 font-semibold hover:underline">
          Ver todas →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {displayCategories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className="group flex flex-col items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100
                       hover:shadow-md hover:border-primary-200 transition-all duration-200 text-center"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color || 'from-primary-400 to-primary-600'}
                             flex items-center justify-center text-2xl mb-2 shadow-sm
                             group-hover:scale-110 transition-transform duration-200`}>
              {cat.icon}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-primary-700 leading-snug">
              {cat.name}
            </span>
            {cat._count?.products !== undefined && (
              <span className="text-xs text-gray-400 mt-0.5">{cat._count.products} productos</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
