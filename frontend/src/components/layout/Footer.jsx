import Link from 'next/link';
import { ChefHat, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <ChefHat size={20} />
              </div>
              <span className="font-bold text-xl text-white">
                Cocina<span className="text-primary-400">Shop</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tu tienda de confianza para todos los utensilios de cocina. Calidad garantizada.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              {['Ollas y Cacerolas', 'Sartenes y Woks', 'Cubiertos y Cucharas', 'Vasos y Tazas', 'Tablas y Utensilios', 'Electrodomésticos'].map(cat => (
                <li key={cat}>
                  <Link href="/tiendas" className="hover:text-white hover:text-primary-400 transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Información</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/tiendas" className="hover:text-white transition-colors">Todas las tiendas</Link></li>
              <li><Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link></li>
              <li><Link href="/mi-cuenta" className="hover:text-white transition-colors">Mi Cuenta</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Panel Admin</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary-400 shrink-0" />
                <span>+591 700-COCINA</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary-400 shrink-0" />
                <span>hola@cocinashop.bo</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-primary-400 shrink-0 mt-0.5" />
                <span>La Paz, Bolivia<br />Lunes-Sábado 9am-6pm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2024 CocinaShop. Todos los derechos reservados. | Bolivia
      </div>
    </footer>
  );
}
