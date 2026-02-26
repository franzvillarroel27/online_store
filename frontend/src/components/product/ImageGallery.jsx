'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ImageGallery({ images = [], name }) {
  const [selected, setSelected] = useState(0);
  const displayImages = images.length > 0 ? images : [''];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {displayImages[selected] ? (
          <Image
            src={displayImages[selected]}
            alt={`${name} - imagen ${selected + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-8xl">🍳</div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors
                          ${i === selected ? 'border-primary-600' : 'border-gray-200 hover:border-gray-400'}`}
            >
              {img ? (
                <Image src={img} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="64px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-2xl bg-gray-100">🍳</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
