'use client';
import Link from 'next/link';

export default function ProductError({ reset }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">No pudimos cargar este producto</h2>
      <p className="text-gray-500 text-sm mb-6">El producto puede no estar disponible o hubo un error de conexión.</p>
      <div className="flex justify-center gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/tiendas"
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
