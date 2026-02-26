const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { id: 1, name: 'Ollas y Cacerolas', description: 'Ollas, cacerolas y todo para hervir y cocinar', icon: '🥘', imageUrl: 'https://images.unsplash.com/photo-1584990347449-39e9e6a5f5d1?w=400', sortOrder: 1 },
  { id: 2, name: 'Sartenes y Woks', description: 'Sartenes, woks y paillas antiadherentes', icon: '🍳', imageUrl: 'https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=400', sortOrder: 2 },
  { id: 3, name: 'Cubiertos y Cucharas', description: 'Juegos de cubiertos, cucharones y espátulas', icon: '🥄', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', sortOrder: 3 },
  { id: 4, name: 'Vasos y Tazas', description: 'Vasos, tazas, jarras y todo para beber', icon: '☕', imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400', sortOrder: 4 },
  { id: 5, name: 'Tablas y Utensilios', description: 'Tablas de cortar, ralladores, peladoras y más', icon: '🔪', imageUrl: 'https://images.unsplash.com/photo-1617906311879-0bfd7a77ea8a?w=400', sortOrder: 5 },
  { id: 6, name: 'Electrodomésticos Pequeños', description: 'Licuadoras, tostadoras, hervidores y más', icon: '⚡', imageUrl: 'https://images.unsplash.com/photo-1556909114-a4bc3e5e4a20?w=400', sortOrder: 6 },
];

const products = [
  // Ollas y Cacerolas (cat 1)
  { name: 'Olla Antiadherente Acero Inox 24cm', description: 'Olla de acero inoxidable 5 capas con tapa de vidrio. Apta para todo tipo de cocinas incluyendo inducción. Capacidad 4.5 litros.', price: 285, salePrice: 240, categoryId: 1, stockQuantity: 15, lowStockThreshold: 5, sku: 'OLL-001', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'https://images.unsplash.com/photo-1584990347449-39e9e6a5f5d1?w=600'] },
  { name: 'Cacerola Esmaltada Vintage 20cm', description: 'Cacerola esmaltada estilo vintage con mango ergonómico. Perfecta para salsas, sopas y guisos. Capacidad 2 litros.', price: 185, salePrice: null, categoryId: 1, stockQuantity: 8, lowStockThreshold: 3, sku: 'OLL-002', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=600'] },
  { name: 'Set de Ollas 5 Piezas Premium', description: 'Juego completo de 5 ollas en acero inoxidable 18/10. Incluye: 14cm, 16cm, 18cm, 20cm y 24cm. Fondos encapsulados para distribución uniforme del calor.', price: 850, salePrice: 720, categoryId: 1, stockQuantity: 4, lowStockThreshold: 3, sku: 'OLL-003', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1612197527762-8cfb4b634eb2?w=600'] },
  { name: 'Olla de Presión 6 Litros', description: 'Olla a presión de aluminio grueso con válvula de seguridad. Ideal para cocinar frijoles, carnes y más en la mitad del tiempo.', price: 320, salePrice: null, categoryId: 1, stockQuantity: 0, lowStockThreshold: 3, sku: 'OLL-004', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600'] },

  // Sartenes y Woks (cat 2)
  { name: 'Sartén Antiadherente Titanio 28cm', description: 'Sartén con recubrimiento de titanio triple capa. Sin PFOA. Mango ergonómico resistente al calor. Apta para horno hasta 200°C.', price: 195, salePrice: 165, categoryId: 2, stockQuantity: 20, lowStockThreshold: 5, sku: 'SAR-001', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=600'] },
  { name: 'Wok Profesional Hierro Fundido 32cm', description: 'Wok de hierro fundido pre-sazonado. Distribución perfecta del calor para salteados al estilo oriental. Con tapa incluida.', price: 420, salePrice: null, categoryId: 2, stockQuantity: 7, lowStockThreshold: 3, sku: 'SAR-002', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=600'] },
  { name: 'Sartén Grill Rayado 28cm', description: 'Sartén rayada de hierro esmaltado para marcas perfectas en carnes y verduras. Resistente y duradera.', price: 230, salePrice: 198, categoryId: 2, stockQuantity: 3, lowStockThreshold: 3, sku: 'SAR-003', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=600'] },

  // Cubiertos y Cucharas (cat 3)
  { name: 'Juego de Cubiertos 72 Piezas Inox', description: 'Set de 72 piezas en acero inoxidable 18/10 para 12 personas. Incluye: tenedores, cuchillos, cucharas y cucharitas. Con estuche organizador.', price: 380, salePrice: 320, categoryId: 3, stockQuantity: 12, lowStockThreshold: 4, sku: 'CUB-001', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1556909114-4ec5f9d97e82?w=600'] },
  { name: 'Set Utensilios de Cocina 6 Piezas', description: 'Set de 6 utensilios: espátula, cucharón, cuchara, espumadera, pinzas y pelador. Material nylon resistente al calor 200°C.', price: 145, salePrice: null, categoryId: 3, stockQuantity: 18, lowStockThreshold: 5, sku: 'CUB-002', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'] },
  { name: 'Cucharón de Madera Artesanal', description: 'Cucharón tallado en madera de haya natural. Ideal para ollas y sartenes antiadherentes. 35cm de largo.', price: 45, salePrice: null, categoryId: 3, stockQuantity: 30, lowStockThreshold: 10, sku: 'CUB-003', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600'] },

  // Vasos y Tazas (cat 4)
  { name: 'Set Vasos Vidrio Templado 6 Piezas', description: 'Juego de 6 vasos de vidrio templado 350ml. Resistentes a golpes y temperatura. Aptos para lavavajillas.', price: 125, salePrice: 98, categoryId: 4, stockQuantity: 25, lowStockThreshold: 8, sku: 'VAS-001', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600'] },
  { name: 'Tazas de Cerámica Artesanal Set x4', description: 'Set de 4 tazas de cerámica artesanal con diseños únicos. Capacidad 250ml. Aptas para microondas y lavavajillas.', price: 180, salePrice: null, categoryId: 4, stockQuantity: 14, lowStockThreshold: 5, sku: 'VAS-002', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600'] },
  { name: 'Jarra Vidrio con Tapa 1.5 Litros', description: 'Jarra de vidrio borosilicato con tapa hermética. Ideal para jugos, agua y bebidas frías. 1.5 litros de capacidad.', price: 95, salePrice: 80, categoryId: 4, stockQuantity: 0, lowStockThreshold: 5, sku: 'VAS-003', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600'] },

  // Tablas y Utensilios (cat 5)
  { name: 'Tabla de Cortar Bambú XL 45x30cm', description: 'Tabla de cortar de bambú orgánico XL. Antibacteriana naturalmente. Con hendidura recolectora de jugos y asas laterales.', price: 135, salePrice: 115, categoryId: 5, stockQuantity: 22, lowStockThreshold: 7, sku: 'TAB-001', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1617906311879-0bfd7a77ea8a?w=600'] },
  { name: 'Set Cuchillos Chef 5 Piezas', description: 'Juego de 5 cuchillos profesionales en acero inoxidable alemán. Incluye: chef 20cm, fileteador, deshuesador, pan y pelador. Con bloque de madera.', price: 485, salePrice: 420, categoryId: 5, stockQuantity: 6, lowStockThreshold: 3, sku: 'TAB-002', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600'] },
  { name: 'Rallador 4 Lados Acero Inox', description: 'Rallador cuadrado de 4 lados con diferentes grosos. Base antideslizante y asa ergonómica. Lavable en lavavajillas.', price: 75, salePrice: null, categoryId: 5, stockQuantity: 35, lowStockThreshold: 10, sku: 'TAB-003', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600'] },

  // Electrodomésticos (cat 6)
  { name: 'Licuadora de Vaso 1.5L 600W', description: 'Licuadora potente 600W con vaso de vidrio templado 1.5L. 5 velocidades + función pulso. Cuchillas de acero inoxidable removibles.', price: 380, salePrice: 320, categoryId: 6, stockQuantity: 10, lowStockThreshold: 3, sku: 'ELE-001', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600'] },
  { name: 'Hervidor Eléctrico Acero 1.7L', description: 'Hervidor eléctrico 1800W con apagado automático. Cuerpo de acero inoxidable. Indicador de nivel de agua. Base giratoria 360°.', price: 225, salePrice: 195, categoryId: 6, stockQuantity: 2, lowStockThreshold: 3, sku: 'ELE-002', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600'] },
  { name: 'Tostadora 4 Ranuras 1500W', description: 'Tostadora con 4 ranuras extra anchas para pan de molde. 7 niveles de tostado. Bandeja recoge-migas extraíble. Función calentar y descongelar.', price: 295, salePrice: null, categoryId: 6, stockQuantity: 8, lowStockThreshold: 3, sku: 'ELE-003', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600'] },
];

const coupons = [
  { code: 'BIENVENIDO10', discountType: 'percentage', discountValue: 10, minOrderAmount: 100, usageLimit: 100 },
  { code: 'COCINA20', discountType: 'percentage', discountValue: 20, minOrderAmount: 300, usageLimit: 50 },
  { code: 'ENVIOGRATIS', discountType: 'fixed', discountValue: 15, minOrderAmount: 200 },
];

async function main() {
  console.log('🌱 Iniciando seed de CocinaShop...');

  // Limpiar datos existentes en orden
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();

  console.log('🗑️  Datos anteriores eliminados');

  // Crear categorías
  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }
  console.log(`✅ ${categories.length} categorías creadas`);

  // Crear productos
  for (const prod of products) {
    const stockStatus = prod.stockQuantity <= 0 ? 'out_of_stock'
      : prod.stockQuantity <= prod.lowStockThreshold ? 'low_stock'
      : 'available';
    await prisma.product.create({ data: { ...prod, stockStatus } });
  }
  console.log(`✅ ${products.length} productos creados`);

  // Crear cupones
  for (const coupon of coupons) {
    await prisma.coupon.create({ data: coupon });
  }
  console.log(`✅ ${coupons.length} cupones creados`);

  // Agregar reseñas de muestra
  const firstProducts = await prisma.product.findMany({ take: 5 });
  const reviews = [
    { customerName: 'María García', rating: 5, comment: 'Excelente calidad, llegó perfecta y bien empaquetada. 100% recomendado.', isApproved: true },
    { customerName: 'Juan Pérez', rating: 4, comment: 'Muy buena compra, justo lo que necesitaba para mi cocina. Buena relación calidad/precio.', isApproved: true },
    { customerName: 'Ana López', rating: 5, comment: 'Me encantó, superó mis expectativas. El material es de primera.', isApproved: true },
  ];

  for (let i = 0; i < firstProducts.length; i++) {
    await prisma.review.create({
      data: { ...reviews[i % reviews.length], productId: firstProducts[i].id }
    });
  }
  console.log('✅ Reseñas de ejemplo creadas');

  console.log('\n🎉 ¡Seed completado exitosamente!');
  console.log('📊 Resumen:');
  console.log(`   - ${categories.length} categorías`);
  console.log(`   - ${products.length} productos`);
  console.log(`   - ${coupons.length} cupones`);
  console.log('\n🔗 Abre Prisma Studio: cd backend && npx prisma studio');
}

main()
  .catch(e => { console.error('❌ Error en seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
