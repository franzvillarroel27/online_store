import ProductCard from '@/components/product/ProductCard';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Search } from 'lucide-react';

async function getData(q, page) {
  try {
    return await api.searchProducts(q, page);
  } catch {
    return { products: [], pagination: { total: 0 } };
  }
}

export default async function SearchPage({ searchParams }) {
  const q = searchParams.q || '';
  const page = searchParams.page || 1;
  const data = await getData(q, page);
  const { products, pagination } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Inicio</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Búsqueda</span>
      </nav>

      <div className="flex items-center gap-3 mb-6">
        <Search size={24} className="text-gray-400" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {q ? `Resultados para "${q}"` : 'Buscar productos'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total} resultados encontrados</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Search size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No encontramos resultados para "{q}"</p>
          <p className="text-sm text-gray-400 mb-6">Intenta con otros términos o revisa la ortografía</p>
          <Link href="/" className="btn-primary rounded-xl inline-block px-6 py-3">
            Ver todos los productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
