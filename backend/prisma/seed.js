const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { id: 1, name: 'Ollas y Cacerolas', description: 'Ollas, cacerolas y todo para hervir y cocinar', icon: '🥘', imageUrl: 'https://images.unsplash.com/photo-1584990347449-39e9e6a5f5d1?w=800&q=85', sortOrder: 1 },
  { id: 2, name: 'Sartenes y Woks', description: 'Sartenes, woks y paillas antiadherentes', icon: '🍳', imageUrl: 'https://images.unsplash.com/photo-1588868800467-6c1e7e4ef5f7?w=800&q=85', sortOrder: 2 },
  { id: 3, name: 'Cubiertos y Cucharas', description: 'Juegos de cubiertos, cucharones y espátulas', icon: '🥄', imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=85', sortOrder: 3 },
  { id: 4, name: 'Vasos y Tazas', description: 'Vasos, tazas, jarras y todo para beber', icon: '☕', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=85', sortOrder: 4 },
  { id: 5, name: 'Tablas y Utensilios', description: 'Tablas de cortar, ralladores, peladoras y más', icon: '🔪', imageUrl: 'https://images.unsplash.com/photo-1617906311879-0bfd7a77ea8a?w=800&q=85', sortOrder: 5 },
  { id: 6, name: 'Electrodomésticos Pequeños', description: 'Licuadoras, tostadoras, hervidores y más', icon: '⚡', imageUrl: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=85', sortOrder: 6 },
];

const products = [
  // ── Ollas y Cacerolas (cat 1) ──────────────────────────────────────────────
  { name: 'Olla Antiadherente Acero Inox 24cm', description: 'Olla de acero inoxidable 5 capas con tapa de vidrio. Apta para todo tipo de cocinas incluyendo inducción. Capacidad 4.5 litros.', price: 285, salePrice: 240, categoryId: 1, stockQuantity: 15, lowStockThreshold: 5, sku: 'OLL-001', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'https://images.unsplash.com/photo-1584990347449-39e9e6a5f5d1?w=600'] },
  { name: 'Cacerola Esmaltada Vintage 20cm', description: 'Cacerola esmaltada estilo vintage con mango ergonómico. Perfecta para salsas, sopas y guisos. Capacidad 2 litros.', price: 185, salePrice: null, categoryId: 1, stockQuantity: 8, lowStockThreshold: 3, sku: 'OLL-002', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=600'] },
  { name: 'Set de Ollas 5 Piezas Premium', description: 'Juego completo de 5 ollas en acero inoxidable 18/10. Fondos encapsulados para distribución uniforme del calor.', price: 850, salePrice: 720, categoryId: 1, stockQuantity: 4, lowStockThreshold: 3, sku: 'OLL-003', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1612197527762-8cfb4b634eb2?w=600'] },
  { name: 'Olla de Presión 6 Litros', description: 'Olla a presión de aluminio grueso con válvula de seguridad. Ideal para cocinar frijoles y carnes en la mitad del tiempo.', price: 320, salePrice: null, categoryId: 1, stockQuantity: 0, lowStockThreshold: 3, sku: 'OLL-004', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600'] },
  { name: 'Olla de Cocción Lenta 4.5L', description: 'Olla de cocción lenta con 3 configuraciones de temperatura. Recipiente de cerámica desmontable. Perfecta para guisos.', price: 380, salePrice: 310, categoryId: 1, stockQuantity: 7, lowStockThreshold: 3, sku: 'OLL-005', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600'] },
  { name: 'Olla Tamalera Aluminio 25L', description: 'Olla tamalera de aluminio extra grande con rejilla interna. Perfecta para tamales, vapor y caldo de fiestas.', price: 450, salePrice: null, categoryId: 1, stockQuantity: 3, lowStockThreshold: 3, sku: 'OLL-006', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=600'] },
  { name: 'Cacerola Hierro Esmaltado 24cm', description: 'Cacerola de hierro fundido esmaltado en rojo. Ideal para horno y vitrocerámica. Con tapa incluida. 4 litros.', price: 650, salePrice: 550, categoryId: 1, stockQuantity: 4, lowStockThreshold: 3, sku: 'OLL-007', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600'] },
  { name: 'Olla Lechera Acero 2L', description: 'Olla lechera con pico vertedor y mango. Acero inoxidable. Perfecta para leche, salsas y chocolate caliente.', price: 85, salePrice: null, categoryId: 1, stockQuantity: 30, lowStockThreshold: 10, sku: 'OLL-008', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1584990347449-39e9e6a5f5d1?w=600'] },
  { name: 'Set Ollas Granito 4 Piezas', description: 'Set de 4 ollas con recubrimiento de granito antiadherente. Sin PFOA. Colores modernos. Apta para inducción.', price: 580, salePrice: 490, categoryId: 1, stockQuantity: 6, lowStockThreshold: 3, sku: 'OLL-009', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1612197527762-8cfb4b634eb2?w=600'] },
  { name: 'Olla Paellera Acero 40cm', description: 'Paellera de acero carbono para 8-10 personas. Fondo plano con asas dobles. Ideal para paella y guisos grandes.', price: 195, salePrice: null, categoryId: 1, stockQuantity: 13, lowStockThreshold: 4, sku: 'OLL-010', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600'] },

  // ── Sartenes y Woks (cat 2) ───────────────────────────────────────────────
  { name: 'Sartén Antiadherente Titanio 28cm', description: 'Sartén con recubrimiento de titanio triple capa. Sin PFOA. Mango ergonómico resistente al calor. Apta para horno hasta 200°C.', price: 195, salePrice: 165, categoryId: 2, stockQuantity: 20, lowStockThreshold: 5, sku: 'SAR-001', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=600'] },
  { name: 'Wok Profesional Hierro Fundido 32cm', description: 'Wok de hierro fundido pre-sazonado. Distribución perfecta del calor para salteados al estilo oriental. Con tapa incluida.', price: 420, salePrice: null, categoryId: 2, stockQuantity: 7, lowStockThreshold: 3, sku: 'SAR-002', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=600'] },
  { name: 'Sartén Grill Rayado 28cm', description: 'Sartén rayada de hierro esmaltado para marcas perfectas en carnes y verduras. Resistente y duradera.', price: 230, salePrice: 198, categoryId: 2, stockQuantity: 3, lowStockThreshold: 3, sku: 'SAR-003', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=600'] },
  { name: 'Sartén Cerámica 24cm Blanca', description: 'Sartén de cerámica interior blanco sin metales pesados. Deslizamiento perfecto sin aceite. Apta para inducción.', price: 175, salePrice: null, categoryId: 2, stockQuantity: 16, lowStockThreshold: 5, sku: 'SAR-004', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1588868800467-6c1e7e4ef5f7?w=600'] },
  { name: 'Sartén Set 3 Piezas 20-24-28cm', description: 'Set de 3 sartenes antiadherentes en diferentes tamaños. Recubrimiento cerámico. Aptas para inducción.', price: 420, salePrice: 360, categoryId: 2, stockQuantity: 8, lowStockThreshold: 3, sku: 'SAR-005', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=600'] },
  { name: 'Sartén Hierro Fundido 26cm', description: 'Sartén de hierro fundido pre-sazonado. Apta para horno hasta 260°C. Se mejora con el uso. Mango largo.', price: 310, salePrice: null, categoryId: 2, stockQuantity: 11, lowStockThreshold: 4, sku: 'SAR-006', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1461009683693-342af2f2d6ce?w=600'] },
  { name: 'Wok Antiadherente 30cm Carbono', description: 'Wok de acero carbono con recubrimiento antiadherente. Mango largo de madera. Para salteados rápidos.', price: 285, salePrice: 240, categoryId: 2, stockQuantity: 9, lowStockThreshold: 3, sku: 'SAR-007', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=600'] },
  { name: 'Sartén Mármol 28cm Premium', description: 'Sartén con recubrimiento efecto mármol. Sin PFOA. Interior ultra antiadherente. Con tapa de vidrio.', price: 245, salePrice: 210, categoryId: 2, stockQuantity: 13, lowStockThreshold: 5, sku: 'SAR-008', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=600'] },
  { name: 'Sartén Antiadherente 20cm Mini', description: 'Sartén pequeña 20cm antiadherente. Perfecta para huevos fritos y tortillas individuales. Ligera y compacta.', price: 95, salePrice: 78, categoryId: 2, stockQuantity: 28, lowStockThreshold: 8, sku: 'SAR-009', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1588868800467-6c1e7e4ef5f7?w=600'] },
  { name: 'Sartén Titanio Pro 30cm', description: 'Sartén profesional con recubrimiento de titanio de 5 capas. Máxima durabilidad. Apta para restaurantes.', price: 320, salePrice: 275, categoryId: 2, stockQuantity: 8, lowStockThreshold: 3, sku: 'SAR-010', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=600'] },

  // ── Cubiertos y Cucharas (cat 3) ──────────────────────────────────────────
  { name: 'Juego de Cubiertos 72 Piezas Inox', description: 'Set de 72 piezas en acero inoxidable 18/10 para 12 personas. Incluye: tenedores, cuchillos, cucharas y cucharitas. Con estuche organizador.', price: 380, salePrice: 320, categoryId: 3, stockQuantity: 12, lowStockThreshold: 4, sku: 'CUB-001', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1556909114-4ec5f9d97e82?w=600'] },
  { name: 'Set Utensilios de Cocina 6 Piezas', description: 'Set de 6 utensilios: espátula, cucharón, cuchara, espumadera, pinzas y pelador. Material nylon resistente al calor 200°C.', price: 145, salePrice: null, categoryId: 3, stockQuantity: 18, lowStockThreshold: 5, sku: 'CUB-002', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'] },
  { name: 'Cucharón de Madera Artesanal', description: 'Cucharón tallado en madera de haya natural. Ideal para ollas y sartenes antiadherentes. 35cm de largo.', price: 45, salePrice: null, categoryId: 3, stockQuantity: 30, lowStockThreshold: 10, sku: 'CUB-003', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600'] },
  { name: 'Cuchillo Chef Profesional 20cm', description: 'Cuchillo de chef de acero alemán. Hoja 20cm. Mango ergonómico. Equilibrio perfecto para cortes precisos.', price: 195, salePrice: null, categoryId: 3, stockQuantity: 14, lowStockThreshold: 4, sku: 'CUB-004', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1504672281656-e4981d70414b?w=600'] },
  { name: 'Set Cucharas Medidoras 8 Piezas', description: 'Set de 8 cucharas medidoras de acero inoxidable. Desde 1/8 cucharadita hasta 1 taza. Marcado grabado.', price: 65, salePrice: 55, categoryId: 3, stockQuantity: 30, lowStockThreshold: 8, sku: 'CUB-005', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'] },
  { name: 'Juego Cubiertos Dorados 24 Piezas', description: 'Set de 24 piezas con acabado dorado titanio. Incluye 6 juegos completos. Diseño lujoso y moderno.', price: 320, salePrice: 270, categoryId: 3, stockQuantity: 6, lowStockThreshold: 3, sku: 'CUB-006', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600'] },
  { name: 'Batidor de Globo Acero 30cm', description: 'Batidor de globo de acero inoxidable 12 alambres. Ideal para montar cremas, claras y salsas. Mango cómodo.', price: 45, salePrice: null, categoryId: 3, stockQuantity: 38, lowStockThreshold: 12, sku: 'CUB-007', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'] },
  { name: 'Set Pinzas Cocina 3 Tamaños', description: 'Set de 3 pinzas de acero inoxidable: 20cm, 25cm y 30cm. Con bloqueo y cabeza de silicona antiadherente.', price: 95, salePrice: null, categoryId: 3, stockQuantity: 25, lowStockThreshold: 8, sku: 'CUB-008', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1556909114-4ec5f9d97e82?w=600'] },
  { name: 'Set Cubiertos Acero Negro 48 Piezas', description: 'Juego de 48 piezas con acabado negro mate para 8 personas. Diseño moderno y elegante para mesa.', price: 385, salePrice: 325, categoryId: 3, stockQuantity: 5, lowStockThreshold: 3, sku: 'CUB-009', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600'] },
  { name: 'Set Utensilios Bambú 5 Piezas', description: 'Set de 5 utensilios de bambú orgánico: espátula, cuchara, tenedor, cucharón y pinzas. Ecológicos.', price: 75, salePrice: 62, categoryId: 3, stockQuantity: 28, lowStockThreshold: 9, sku: 'CUB-010', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600'] },

  // ── Vasos y Tazas (cat 4) ─────────────────────────────────────────────────
  { name: 'Set Vasos Vidrio Templado 6 Piezas', description: 'Juego de 6 vasos de vidrio templado 350ml. Resistentes a golpes y temperatura. Aptos para lavavajillas.', price: 125, salePrice: 98, categoryId: 4, stockQuantity: 25, lowStockThreshold: 8, sku: 'VAS-001', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600'] },
  { name: 'Tazas de Cerámica Artesanal Set x4', description: 'Set de 4 tazas de cerámica artesanal con diseños únicos. Capacidad 250ml. Aptas para microondas y lavavajillas.', price: 180, salePrice: null, categoryId: 4, stockQuantity: 14, lowStockThreshold: 5, sku: 'VAS-002', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600'] },
  { name: 'Jarra Vidrio con Tapa 1.5 Litros', description: 'Jarra de vidrio borosilicato con tapa hermética. Ideal para jugos, agua y bebidas frías. 1.5 litros de capacidad.', price: 95, salePrice: 80, categoryId: 4, stockQuantity: 0, lowStockThreshold: 5, sku: 'VAS-003', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600'] },
  { name: 'Set Copas Vino Cristal 6 Piezas', description: 'Juego de 6 copas de cristal sin plomo. 450ml. Forma perfecta para resaltar el aroma del vino tinto.', price: 245, salePrice: 200, categoryId: 4, stockQuantity: 12, lowStockThreshold: 4, sku: 'VAS-004', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1521302080334-4dbe4eae0c91?w=600'] },
  { name: 'Vaso Térmico Acero 500ml', description: 'Vaso térmico de doble pared de acero inoxidable. Mantiene bebidas frías 24h y calientes 12h.', price: 135, salePrice: null, categoryId: 4, stockQuantity: 20, lowStockThreshold: 6, sku: 'VAS-005', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600'] },
  { name: 'Copa Champán Cristal Set x6', description: 'Juego de 6 copas flauta de cristal sin plomo. Para champán y prosecco. 150ml. Tallo largo elegante.', price: 195, salePrice: null, categoryId: 4, stockQuantity: 11, lowStockThreshold: 4, sku: 'VAS-006', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1559519529-0936e4058364?w=600'] },
  { name: 'Taza Térmica con Tapa 350ml', description: 'Taza térmica con tapa de silicona. Mantiene la temperatura 3 horas. Para café y té. Apta para lavavajillas.', price: 85, salePrice: 70, categoryId: 4, stockQuantity: 26, lowStockThreshold: 8, sku: 'VAS-007', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'] },
  { name: 'Taza Espresso Doble Pared 80ml', description: 'Taza de doble pared de vidrio borosilicato para espresso. 80ml. No quema la mano. Diseño minimalista.', price: 65, salePrice: 52, categoryId: 4, stockQuantity: 28, lowStockThreshold: 9, sku: 'VAS-008', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600'] },
  { name: 'Jarra Cerámica para Leche 1L', description: 'Jarra de cerámica esmaltada con pico vertedor. Para leche, jugos y bebidas. 1 litro. Con asa grande.', price: 75, salePrice: null, categoryId: 4, stockQuantity: 22, lowStockThreshold: 7, sku: 'VAS-009', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600'] },
  { name: 'Taza XXL Desayuno 600ml', description: 'Taza extragrande para desayunos abundantes. Cerámica esmaltada. 600ml. Con asa grande y cómoda.', price: 65, salePrice: null, categoryId: 4, stockQuantity: 30, lowStockThreshold: 10, sku: 'VAS-010', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600'] },

  // ── Tablas y Utensilios (cat 5) ───────────────────────────────────────────
  { name: 'Tabla de Cortar Bambú XL 45x30cm', description: 'Tabla de cortar de bambú orgánico XL. Antibacteriana naturalmente. Con hendidura recolectora de jugos y asas laterales.', price: 135, salePrice: 115, categoryId: 5, stockQuantity: 22, lowStockThreshold: 7, sku: 'TAB-001', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1617906311879-0bfd7a77ea8a?w=600'] },
  { name: 'Set Cuchillos Chef 5 Piezas', description: 'Juego de 5 cuchillos profesionales en acero inoxidable alemán. Incluye: chef 20cm, fileteador, deshuesador, pan y pelador. Con bloque de madera.', price: 485, salePrice: 420, categoryId: 5, stockQuantity: 6, lowStockThreshold: 3, sku: 'TAB-002', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600'] },
  { name: 'Rallador 4 Lados Acero Inox', description: 'Rallador cuadrado de 4 lados con diferentes grosores. Base antideslizante y asa ergonómica. Lavable en lavavajillas.', price: 75, salePrice: null, categoryId: 5, stockQuantity: 35, lowStockThreshold: 10, sku: 'TAB-003', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600'] },
  { name: 'Tabla de Cortar Plástico HDPE 40x25cm', description: 'Tabla de polietileno HDPE de alta densidad. Antibacteriana. Doble cara. Lavable en lavavajillas. 4 colores.', price: 85, salePrice: 70, categoryId: 5, stockQuantity: 28, lowStockThreshold: 9, sku: 'TAB-004', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1617906311879-0bfd7a77ea8a?w=600'] },
  { name: 'Mortero y Pilón Granito 16cm', description: 'Mortero de granito natural 16cm. Ideal para especias, guacamole y salsas caseras. Pesado y resistente.', price: 165, salePrice: null, categoryId: 5, stockQuantity: 15, lowStockThreshold: 5, sku: 'TAB-005', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600'] },
  { name: 'Mandolina Regulable 5 Posiciones', description: 'Mandolina de acero inoxidable con 5 grosores de corte ajustables. Base antideslizante. Incluye guante de seguridad.', price: 145, salePrice: 122, categoryId: 5, stockQuantity: 12, lowStockThreshold: 4, sku: 'TAB-006', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600'] },
  { name: 'Cuchillo Chef Damasco 18cm', description: 'Cuchillo de chef en acero damasco de 67 capas. Hoja 18cm. Dureza HRC62. Mango de pakkawood. Edición premium.', price: 650, salePrice: 550, categoryId: 5, stockQuantity: 4, lowStockThreshold: 3, sku: 'TAB-007', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600'] },
  { name: 'Prensapuré Manual Inox', description: 'Prensapuré de acero inoxidable. Disco perforado para puré perfecto sin grumos. Mango cómodo. 25cm.', price: 55, salePrice: null, categoryId: 5, stockQuantity: 38, lowStockThreshold: 12, sku: 'TAB-008', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600'] },
  { name: 'Tabla Mármol para Repostería 40x30cm', description: 'Tabla de mármol natural para trabajar masas. Mantiene temperatura fría ideal para repostería. 40x30cm.', price: 285, salePrice: 240, categoryId: 5, stockQuantity: 6, lowStockThreshold: 3, sku: 'TAB-009', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1617906311879-0bfd7a77ea8a?w=600'] },
  { name: 'Set Cuchillos Cerámica 5 Piezas', description: 'Set de 5 cuchillos de cerámica zirconio. Ultra livianos y afilados. Con fundas protectoras. Sin óxido.', price: 285, salePrice: 240, categoryId: 5, stockQuantity: 6, lowStockThreshold: 3, sku: 'TAB-010', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600'] },

  // ── Electrodomésticos Pequeños (cat 6) ────────────────────────────────────
  { name: 'Licuadora de Vaso 1.5L 600W', description: 'Licuadora potente 600W con vaso de vidrio templado 1.5L. 5 velocidades + función pulso. Cuchillas de acero inoxidable removibles.', price: 380, salePrice: 320, categoryId: 6, stockQuantity: 10, lowStockThreshold: 3, sku: 'ELE-001', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600'] },
  { name: 'Hervidor Eléctrico Acero 1.7L', description: 'Hervidor eléctrico 1800W con apagado automático. Cuerpo de acero inoxidable. Indicador de nivel de agua. Base giratoria 360°.', price: 225, salePrice: 195, categoryId: 6, stockQuantity: 2, lowStockThreshold: 3, sku: 'ELE-002', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600'] },
  { name: 'Tostadora 4 Ranuras 1500W', description: 'Tostadora con 4 ranuras extra anchas para pan de molde. 7 niveles de tostado. Bandeja recoge-migas extraíble. Función calentar y descongelar.', price: 295, salePrice: null, categoryId: 6, stockQuantity: 8, lowStockThreshold: 3, sku: 'ELE-003', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600'] },
  { name: 'Airfryer Freidora de Aire 4L', description: 'Freidora de aire sin aceite 4 litros. 1500W. Temperatura regulable 80-200°C. Timer 60 minutos. Fácil limpieza.', price: 650, salePrice: 550, categoryId: 6, stockQuantity: 6, lowStockThreshold: 3, sku: 'ELE-004', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600'] },
  { name: 'Batidora de Pedestal 1000W', description: 'Batidora de pedestal profesional 1000W. Bowl de 4.5L de acero inoxidable. 10 velocidades + pulso. Con 3 accesorios.', price: 780, salePrice: 660, categoryId: 6, stockQuantity: 4, lowStockThreshold: 3, sku: 'ELE-005', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600'] },
  { name: 'Cafetera Cápsulas Automática', description: 'Cafetera para cápsulas compatibles. 19 bares de presión. Calentamiento en 25 segundos. 3 tamaños de taza.', price: 420, salePrice: 355, categoryId: 6, stockQuantity: 5, lowStockThreshold: 3, sku: 'ELE-006', isNewArrival: false, isBestSeller: true, images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600'] },
  { name: 'Procesadora Alimentos 800W 2L', description: 'Procesadora de alimentos multifunción 800W. 8 accesorios intercambiables. Capacidad 2 litros. Picado, triturado y mezclado.', price: 520, salePrice: 440, categoryId: 6, stockQuantity: 7, lowStockThreshold: 3, sku: 'ELE-007', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600'] },
  { name: 'Sandwichera Grill 750W', description: 'Sandwichera con planchas removibles antiadherentes. 750W. Para sándwiches, paninis y tostados crujientes.', price: 195, salePrice: 165, categoryId: 6, stockQuantity: 12, lowStockThreshold: 4, sku: 'ELE-008', isNewArrival: true, isBestSeller: false, images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600'] },
  { name: 'Extractor Jugos Centrífugo 800W', description: 'Extractor de jugos centrífugo 800W. 2 velocidades. Recipiente 1.5L. Fácil de limpiar. Tubo boca ancha.', price: 320, salePrice: 270, categoryId: 6, stockQuantity: 8, lowStockThreshold: 3, sku: 'ELE-009', isNewArrival: false, isBestSeller: false, images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600'] },
  { name: 'Cafetera Espresso Manual 15 Bar', description: 'Cafetera espresso de 15 bares de presión. Espumador de leche integrado. Depósito 1.5L. Calentamiento rápido.', price: 485, salePrice: 410, categoryId: 6, stockQuantity: 6, lowStockThreshold: 3, sku: 'ELE-010', isNewArrival: true, isBestSeller: true, images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600'] },
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
  const firstProducts = await prisma.product.findMany({ take: 6 });
  const reviews = [
    { customerName: 'María García', rating: 5, comment: 'Excelente calidad, llegó perfecta y bien empaquetada. 100% recomendado.', isApproved: true },
    { customerName: 'Juan Pérez', rating: 4, comment: 'Muy buena compra, justo lo que necesitaba para mi cocina. Buena relación calidad/precio.', isApproved: true },
    { customerName: 'Ana López', rating: 5, comment: 'Me encantó, superó mis expectativas. El material es de primera calidad.', isApproved: true },
    { customerName: 'Carlos Mamani', rating: 4, comment: 'Producto muy bueno, lo recomiendo. Llegó en perfectas condiciones.', isApproved: true },
    { customerName: 'Laura Quispe', rating: 5, comment: 'Increíble producto, exactamente como en las fotos. Muy satisfecha.', isApproved: true },
    { customerName: 'Roberto Flores', rating: 3, comment: 'Buen producto en general, cumple lo que promete. Entrega rápida.', isApproved: true },
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
  console.log(`   - ${products.length} productos (10 por categoría)`);
  console.log(`   - ${coupons.length} cupones`);
  console.log('\n🔗 Abre Prisma Studio: cd backend && npx prisma studio');
}

main()
  .catch(e => { console.error('❌ Error en seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
