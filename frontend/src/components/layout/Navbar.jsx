'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, ChefHat, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { href: '/',          label: 'Inicio'    },
  { href: '/tiendas',   label: 'Tiendas'   },
  { href: '/servicios', label: 'Servicios' },
];

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [search, setSearch]       = useState('');
  const [focused, setFocused]     = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  return (
    <header className="glass sticky top-0 z-50 shadow-ios">
      {/* Promo strip */}
      <div className="bg-primary-600 text-white text-xs text-center py-1.5 px-4 font-medium tracking-wide">
        🚚 Envío gratis en compras mayores a Bs.&nbsp;350&nbsp;&nbsp;·&nbsp;&nbsp;📞 WhatsApp: +591 700-COCINA
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-[60px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="bg-primary-600 text-white p-[7px] rounded-[10px] shadow-ios
                            group-hover:bg-primary-700 transition-colors duration-200">
              <ChefHat size={20} />
            </div>
            <span className="font-bold text-[18px] text-gray-900 tracking-tight">
              Cocina<span className="text-primary-600">Shop</span>
            </span>
          </Link>

          {/* Search — desktop */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden sm:flex mx-2">
            <div className={`relative w-full transition-all duration-200 ${focused ? 'scale-[1.01]' : ''}`}>
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Buscar ollas, sartenes, cubiertos…"
                className="input-ios pl-9 pr-4 rounded-full"
              />
            </div>
          </form>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1 ml-auto">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="btn-ghost text-[13.5px]">
                {label}
              </Link>
            ))}
            <Link href="/mi-cuenta" className="btn-ghost text-[13.5px] flex items-center gap-1.5">
              <User size={14} /> Mi Cuenta
            </Link>
          </nav>

          {/* Cart button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 bg-primary-600 hover:bg-primary-700
                       active:scale-95 text-white pl-4 pr-5 py-2.5 rounded-full shadow-ios
                       transition-all duration-200 text-sm font-semibold shrink-0"
          >
            <ShoppingCart size={17} />
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px]
                               rounded-full w-[18px] h-[18px] flex items-center justify-center
                               font-bold shadow-sm border-2 border-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-warm-200 transition-colors text-gray-700"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos…"
              className="input-ios pl-9 rounded-full"
            />
          </form>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white/95 backdrop-blur-xl border-t border-warm-200 px-5 py-3 space-y-0.5">
          {[...NAV_LINKS, { href: '/mi-cuenta', label: 'Mi Cuenta' }].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center py-3 text-gray-700 hover:text-primary-600
                         font-medium text-[15px] border-b border-warm-100 last:border-0 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
