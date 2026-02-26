import Link from 'next/link';

export default function ServiciosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuestros Servicios</h1>
      <p className="text-gray-500 mb-10">En CocinaShop te ofrecemos más que productos.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { icon: '🚚', title: 'Envío a domicilio', desc: 'Entregamos en La Paz el mismo día para pedidos antes de las 2pm. Otras ciudades en 1-3 días hábiles.' },
          { icon: '✅', title: 'Garantía de calidad', desc: 'Todos nuestros productos son originales. Si no estás satisfecho, te devolvemos tu dinero en 7 días.' },
          { icon: '🎁', title: 'Empaque especial', desc: 'Servicio de empaque para regalo disponible en todos los productos. Agrega una tarjeta personalizada.' },
          { icon: '📞', title: 'Atención personalizada', desc: 'Nuestro equipo está disponible por WhatsApp de lunes a sábado de 9am a 6pm.' },
          { icon: '💳', title: 'Múltiples métodos de pago', desc: 'Aceptamos QR (Tigo Money, bancos), transferencia bancaria y efectivo contraentrega.' },
          { icon: '🔧', title: 'Asesoría en cocina', desc: 'Te ayudamos a elegir los utensilios adecuados según tus necesidades y tipo de cocina.' },
        ].map(service => (
          <div key={service.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">{service.icon}</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/" className="btn-primary rounded-xl inline-block px-8 py-3">
          Ver productos →
        </Link>
      </div>
    </div>
  );
}
