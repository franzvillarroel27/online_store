'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-5xl mb-4">⚠️</p>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-md">
        Ocurrió un error inesperado. Por favor intenta de nuevo o vuelve al inicio.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
