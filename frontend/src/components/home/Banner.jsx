'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Nuevas Ollas Premium',
    subtitle: 'Colección 2024',
    description: 'Ollas y cacerolas de acero inoxidable 5 capas. Aptas para todo tipo de cocinas.',
    cta: 'Ver Colección',
    href: '/category/1',
    bg: 'from-orange-600 to-red-700',
    emoji: '🥘',
    badge: 'Hasta 20% OFF',
  },
  {
    id: 2,
    title: 'Sartenes Antiadherentes',
    subtitle: 'Recubrimiento Titanio',
    description: 'Sin PFOA, duraderas y fáciles de limpiar. Ideales para cocina saludable.',
    cta: 'Comprar Ahora',
    href: '/category/2',
    bg: 'from-amber-600 to-orange-700',
    emoji: '🍳',
    badge: 'Nuevo',
  },
  {
    id: 3,
    title: 'Ofertas del Día',
    subtitle: 'Solo por 24 horas',
    description: 'Descuentos especiales en electrodomésticos pequeños y sets de cubiertos.',
    cta: 'Ver Ofertas',
    href: '/#ofertas',
    bg: 'from-red-700 to-primary-800',
    emoji: '⚡',
    badge: '¡Oferta!',
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, paused]);

  const slide = slides[current];

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`bg-gradient-to-r ${slide.bg} text-white transition-all duration-500`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-16 flex items-center justify-between gap-8">
          {/* Text content */}
          <div className="flex-1">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              {slide.badge}
            </span>
            <p className="text-sm font-medium opacity-80 mb-1">{slide.subtitle}</p>
            <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight">{slide.title}</h1>
            <p className="text-sm sm:text-base opacity-90 mb-6 max-w-md leading-relaxed">{slide.description}</p>
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl
                         hover:bg-gray-100 transition-colors shadow-lg"
            >
              {slide.cta} →
            </Link>
          </div>

          {/* Emoji illustration */}
          <div className="text-8xl sm:text-9xl select-none hidden sm:block opacity-90 drop-shadow-2xl">
            {slide.emoji}
          </div>
        </div>
      </div>

      {/* Prev/Next buttons */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white
                   p-2 rounded-full transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white
                   p-2 rounded-full transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-6 h-2' : 'bg-white/50 w-2 h-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
