import ProductCard from '@/components/product/ProductCard';
import CategoryGrid from '@/components/home/CategoryGrid';
import { api } from '@/lib/api';
import Link from 'next/link';

async function getData(searchParams) {
  try {
    const [categories, productsData] = await Promise.all([
      api.getCategories(),
      api.getProducts({
        category: searchParams.category || '',
        page: searchParams.page || 1,
        limit: 12,
        sort: searchParams.sort || 'newest',
      }),
    ]);
    return { categories, productsData };
  } catch {
    return { categories: [], productsData: { products: [], pagination: { total: 0, pages: 1 } } };
  }
}

export default async function TiendasPage({ searchParams }) {
  const { categories, productsData } = await getData(searchParams);
  const { products, pagination } = productsData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Todos los Productos</h1>
        <p className="text-gray-500 text-sm mt-1">{pagination.total} productos disponibles</p>
      </div>

      <CategoryGrid categories={categories} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-bold text-lg text-gray-900">Catálogo</h2>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="newest">Más recientes</option>
          <option value="price_asc">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
          <option value="bestseller">Más vendidos</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={`/tiendas?page=${p}`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium
                ${parseInt(searchParams.page || 1) === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 hover:border-primary-600'}`}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
