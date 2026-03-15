import Link from 'next/link';
import Image from 'next/image';

// High-quality fallback photos per category
const FALLBACK = [
  { id: 1, name: 'Ollas y Cacerolas',         icon: '🥘', image: 'https://images.unsplash.com/photo-1584990347449-39e9e6a5f5d1?w=600&q=85' },
  { id: 2, name: 'Sartenes y Woks',            icon: '🍳', image: 'https://images.unsplash.com/photo-1588868800467-6c1e7e4ef5f7?w=600&q=85' },
  { id: 3, name: 'Cubiertos y Cucharas',       icon: '🥄', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=85' },
  { id: 4, name: 'Vasos y Tazas',              icon: '☕', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=85' },
  { id: 5, name: 'Tablas y Utensilios',        icon: '🔪', image: 'https://images.unsplash.com/photo-1617906311879-0bfd7a77ea8a?w=600&q=85' },
  { id: 6, name: 'Electrodomésticos Pequeños', icon: '⚡', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=85' },
];

export default function CategoryGrid({ categories = [] }) {
  const items = categories.length > 0
    ? categories.map((cat, i) => ({
        ...cat,
        image: cat.imageUrl || FALLBACK[i]?.image || FALLBACK[0].image,
      }))
    : FALLBACK;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="section-title">Categorías</h2>
          <p className="section-subtitle">Encuentra todo lo que necesitas</p>
        </div>
        <Link href="/tiendas"
          className="text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors">
          Ver todas →
        </Link>
      </div>

      {/* iOS photo-card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className="group relative rounded-ios-lg overflow-hidden aspect-[4/5] shadow-ios
                       hover:shadow-ios-md active:scale-[0.97] transition-all duration-200"
          >
            {/* Photo */}
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                            group-hover:from-black/70 transition-all duration-300" />

            {/* Icon pill */}
            <div className="absolute top-2.5 left-2.5 bg-white/20 backdrop-blur-sm
                            rounded-[8px] px-1.5 py-1 text-lg leading-none shadow-sm">
              {cat.icon}
            </div>

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white font-bold text-xs sm:text-[13px] leading-tight line-clamp-2">
                {cat.name}
              </p>
              {cat._count?.products !== undefined && (
                <p className="text-white/55 text-[10px] mt-0.5">{cat._count.products} productos</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
