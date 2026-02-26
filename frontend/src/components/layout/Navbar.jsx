'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, ChefHat, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary-600 text-white text-xs text-center py-1.5 px-4">
        🚚 Envío gratis en compras mayores a Bs. 350 | 📞 WhatsApp: +591 700-COCINA
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <ChefHat size={22} />
            </div>
            <span className="font-bold text-xl text-gray-900">
              Cocina<span className="text-primary-600">Shop</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar ollas, sartenes, cubiertos..."
                className="w-full border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm
                           focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/" className="hover:text-primary-600 transition-colors">Inicio</Link>
            <Link href="/tiendas" className="hover:text-primary-600 transition-colors">Tiendas</Link>
            <Link href="/servicios" className="hover:text-primary-600 transition-colors">Servicios</Link>
            <Link href="/mi-cuenta" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <User size={16} /> Mi Cuenta
            </Link>
          </nav>

          {/* Cart button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-lg
                       hover:bg-primary-700 transition-colors text-sm font-medium shrink-0"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full
                               w-5 h-5 flex items-center justify-center font-bold">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm
                         focus:outline-none focus:border-primary-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-3">
          {['/', '/tiendas', '/servicios', '/mi-cuenta'].map((href, i) => {
            const labels = ['Inicio', 'Tiendas', 'Servicios', 'Mi Cuenta'];
            return (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-primary-600 font-medium py-1">
                {labels[i]}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
