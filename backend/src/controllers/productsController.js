const prisma = require('../lib/prisma');

const getProducts = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 12, sort = 'newest' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isActive: true };
    if (category) where.categoryId = parseInt(category);

    const orderBy = sort === 'price_asc' ? { price: 'asc' }
      : sort === 'price_desc' ? { price: 'desc' }
      : sort === 'bestseller' ? { isBestSeller: 'desc' }
      : { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: { category: { select: { id: true, name: true } } }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const [newArrivals, bestSellers, onSale] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isNewArrival: true },
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { id: true, name: true } } }
      }),
      prisma.product.findMany({
        where: { isActive: true, isBestSeller: true },
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { id: true, name: true } } }
      }),
      prisma.product.findMany({
        where: { isActive: true, salePrice: { not: null } },
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { id: true, name: true } } }
      })
    ]);

    res.json({ newArrivals, bestSellers, onSale });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Productos relacionados (misma categoría)
    const related = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      take: 4,
      include: { category: { select: { id: true, name: true } } }
    });

    res.json({ ...product, related });
  } catch (err) {
    next(err);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    if (!q) return res.json({ products: [], pagination: { total: 0 } });

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, skip, take: parseInt(limit),
        include: { category: { select: { id: true, name: true } } }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getFeaturedProducts, getProductById, searchProducts };
