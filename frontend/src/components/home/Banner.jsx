'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Ollas Premium\nAcero Inoxidable',
    subtitle: 'Colección 2024',
    description: 'Aptas para inducción · 5 capas encapsuladas · Tapa de vidrio templado',
    cta: 'Ver Colección',
    href: '/category/1',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=90',
    badge: 'Hasta 20% OFF',
    badgeClass: 'bg-gold-400 text-white',
  },
  {
    id: 2,
    title: 'Sartenes de\nHierro Fundido',
    subtitle: 'Alta Gastronomía',
    description: 'Recubrimiento titanio triple capa · Sin PFOA · Para todo tipo de cocinas',
    cta: 'Comprar Ahora',
    href: '/category/2',
    image: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=1400&q=90',
    badge: 'Nuevo',
    badgeClass: 'bg-sage-600 text-white',
  },
  {
    id: 3,
    title: 'Equipá tu\nCocina Soñada',
    subtitle: 'Envío a toda Bolivia',
    description: 'Más de 120 productos · Calidad garantizada · Entrega en 1-3 días hábiles',
    cta: 'Ver Catálogo',
    href: '/tiendas',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=1400&q=90',
    badge: '¡Oferta!',
    badgeClass: 'bg-red-500 text-white',
  },
];

export default function Banner() {
  const [current, setCurrent]         = useState(0);
  const [paused, setPaused]           = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(index);
    setTimeout(() => setTransitioning(false), 350);
  }, [transitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next, paused]);

  const slide = slides[current];

  return (
    <div
      className="relative rounded-ios-xl overflow-hidden shadow-ios-lg"
      style={{ height: 'clamp(300px, 46vw, 500px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background photo */}
      <div className={`absolute inset-0 transition-opacity duration-400 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1280px"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/44 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Text content */}
      <div className={`relative z-10 h-full flex flex-col justify-center px-7 sm:px-12
                       transition-all duration-350 ${transitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-lg">
          <span className={`inline-block ${slide.badgeClass} text-[11px] font-bold px-3 py-1 rounded-full mb-3 shadow-sm uppercase tracking-wide`}>
            {slide.badge}
          </span>
          <p className="text-white/65 text-xs font-semibold mb-1.5 uppercase tracking-widest">
            {slide.subtitle}
          </p>
          <h1
            className="text-white font-black leading-tight mb-3"
            style={{ fontSize: 'clamp(1.55rem, 4vw, 2.55rem)', whiteSpace: 'pre-line' }}
          >
            {slide.title}
          </h1>
          <p className="text-white/75 text-sm sm:text-base mb-6 leading-relaxed max-w-[340px]">
            {slide.description}
          </p>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold
                       px-6 py-3 rounded-full shadow-ios-md hover:bg-warm-100
                       active:scale-95 transition-all duration-200 text-sm"
          >
            {slide.cta}
            <span className="text-primary-600 font-black">→</span>
          </Link>
        </div>
      </div>

      {/* Prev / Next controls */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 glass-dark text-white
                   p-2.5 rounded-full hover:bg-black/50 active:scale-90 transition-all z-20"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 glass-dark text-white
                   p-2.5 rounded-full hover:bg-black/50 active:scale-90 transition-all z-20"
      >
        <ChevronRight size={18} />
      </button>

      {/* Pill dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-[5px] rounded-full transition-all duration-300 bg-white
                        ${i === current ? 'w-5 opacity-100' : 'w-[5px] opacity-45'}`}
          />
        ))}
      </div>
    </div>
  );
}
