import ProductCard from '@/components/product/ProductCard';
import { api } from '@/lib/api';
import Link from 'next/link';

async function getData(id, searchParams) {
  try {
    const page = searchParams.page || 1;
    const sort = searchParams.sort || 'newest';
    const [categoryData, productsData] = await Promise.all([
      api.getCategories(),
      api.getProducts({ category: id, page, limit: 12, sort }),
    ]);
    const category = categoryData.find(c => c.id === parseInt(id));
    return { category, productsData };
  } catch {
    return { category: null, productsData: { products: [], pagination: { total: 0 } } };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const { category, productsData } = await getData(params.id, searchParams);
  const { products, pagination } = productsData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Inicio</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{category?.name || 'Categoría'}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category?.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} productos encontrados</p>
        </div>
        <select
          defaultValue={searchParams.sort || 'newest'}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
        >
          <option value="newest">Más recientes</option>
          <option value="price_asc">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
          <option value="bestseller">Más vendidos</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🍳</p>
          <p className="text-lg font-medium">No hay productos en esta categoría</p>
          <Link href="/" className="mt-4 inline-block text-primary-600 hover:underline">Volver al inicio</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
            <Link
              key={p}
              href={`/category/${params.id}?page=${p}`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                ${parseInt(searchParams.page || 1) === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-600'}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
