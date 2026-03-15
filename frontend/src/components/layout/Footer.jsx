import Link from 'next/link';
import { ChefHat, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'Ollas y Cacerolas'    },
  { id: 2, name: 'Sartenes y Woks'      },
  { id: 3, name: 'Cubiertos y Cucharas' },
  { id: 4, name: 'Vasos y Tazas'        },
  { id: 5, name: 'Tablas y Utensilios'  },
  { id: 6, name: 'Electrodomésticos'    },
];

export default function Footer() {
  return (
    <footer className="bg-warm-200 border-t border-warm-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 text-white p-[7px] rounded-[10px] shadow-ios">
                <ChefHat size={18} />
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">
                Cocina<span className="text-primary-600">Shop</span>
              </span>
            </div>
            <p className="text-sm text-warm-500 leading-relaxed mb-5">
              Tu tienda de confianza para todos los utensilios de cocina. Calidad garantizada y entrega a toda Bolivia.
            </p>
            <div className="flex gap-2.5">
              {[Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-full bg-white shadow-ios flex items-center justify-center
                             text-warm-500 hover:text-primary-600 hover:shadow-ios-md transition-all duration-200">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-xs uppercase tracking-widest">Categorías</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.id}`}
                    className="text-sm text-warm-500 hover:text-primary-600 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-xs uppercase tracking-widest">Información</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/',          label: 'Inicio'      },
                { href: '/tiendas',   label: 'Catálogo'    },
                { href: '/servicios', label: 'Servicios'   },
                { href: '/mi-cuenta', label: 'Mi Cuenta'   },
                { href: '/admin',     label: 'Panel Admin' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-sm text-warm-500 hover:text-primary-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-bold mb-4 text-xs uppercase tracking-widest">Contacto</h3>
            <ul className="space-y-3.5">
              {[
                { Icon: Phone,  text: '+591 700-COCINA'           },
                { Icon: Mail,   text: 'hola@cocinashop.bo'        },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white shadow-ios flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-warm-500">{text}</span>
                </li>
              ))}
              <li className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white shadow-ios flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={13} className="text-primary-600" />
                </div>
                <span className="text-sm text-warm-500 leading-relaxed">
                  La Paz, Bolivia<br />
                  Lun–Sáb 9:00–18:00
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-warm-300 py-4 text-center">
        <p className="text-xs text-warm-400">
          © 2024 CocinaShop · Todos los derechos reservados · Bolivia
        </p>
      </div>
    </footer>
  );
}
