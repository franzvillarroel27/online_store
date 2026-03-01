const prisma = require('../lib/prisma');

const getDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayOrders,
      pendingOrders,
      lowStockProducts,
      totalRevenue,
      recentOrders
    ] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.order.count({ where: { orderStatus: 'pending' } }),
      prisma.product.count({ where: { isActive: true, stockStatus: { in: ['low_stock', 'out_of_stock'] } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: today, lt: tomorrow }, orderStatus: { not: 'cancelled' } }
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      })
    ]);

    res.json({
      stats: {
        todayOrders,
        pendingOrders,
        lowStockProducts,
        todayRevenue: todayRevenue._sum.total || 0
      },
      recentOrders
    });
  } catch (err) {
    next(err);
  }
};

// Renaming internal variable to avoid conflict
const getDashboardRevenue = getDashboard;

const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { stockStatus: 'low_stock' },
          { stockStatus: 'out_of_stock' }
        ]
      },
      include: { category: { select: { name: true } } },
      orderBy: { stockQuantity: 'asc' }
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (category) where.categoryId = parseInt(category);
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, skip, take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { id: true, name: true } } }
      }),
      prisma.product.count({ where })
    ]);

    res.json({ products, pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, price, salePrice, categoryId,
      images, stockQuantity, lowStockThreshold, sku,
      weight, dimensions, isNewArrival, isBestSeller
    } = req.body;

    const stockStatus = stockQuantity <= 0 ? 'out_of_stock'
      : stockQuantity <= (lowStockThreshold || 5) ? 'low_stock'
      : 'available';

    const product = await prisma.product.create({
      data: {
        name, description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        categoryId: parseInt(categoryId),
        images: images || [],
        stockQuantity: parseInt(stockQuantity) || 0,
        stockStatus,
        lowStockThreshold: parseInt(lowStockThreshold) || 5,
        sku, weight: weight ? parseFloat(weight) : null,
        dimensions,
        isNewArrival: !!isNewArrival,
        isBestSeller: !!isBestSeller
      }
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.price) data.price = parseFloat(data.price);
    if (data.salePrice) data.salePrice = parseFloat(data.salePrice);
    if (data.categoryId) data.categoryId = parseInt(data.categoryId);

    if (data.stockQuantity !== undefined) {
      data.stockQuantity = parseInt(data.stockQuantity);
      const threshold = data.lowStockThreshold ? parseInt(data.lowStockThreshold) : 5;
      data.stockStatus = data.stockQuantity <= 0 ? 'out_of_stock'
        : data.stockQuantity <= threshold ? 'low_stock'
        : 'available';
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });
    res.json({ message: 'Producto desactivado' });
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (status) where.orderStatus = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip, take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { items: true, payment: true }
      }),
      prisma.order.count({ where })
    ]);

    res.json({ orders, pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    const data = {};
    if (orderStatus) data.orderStatus = orderStatus;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data,
      include: { items: true }
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } }
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, imageUrl, icon, parentId, sortOrder } = req.body;
    if (!name) return res.status(400).json({ error: 'Nombre requerido' });

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        icon: icon?.trim() || null,
        parentId: parentId ? parseInt(parentId) : null,
        sortOrder: parseInt(sortOrder) || 0
      }
    });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, icon, parentId, sortOrder, isActive } = req.body;

    const data = {};
    if (name !== undefined) data.name = name.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (imageUrl !== undefined) data.imageUrl = imageUrl?.trim() || null;
    if (icon !== undefined) data.icon = icon?.trim() || null;
    if (parentId !== undefined) data.parentId = parentId ? parseInt(parentId) : null;
    if (sortOrder !== undefined) data.sortOrder = parseInt(sortOrder);
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.category.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });
    res.json({ message: 'Categoría desactivada' });
  } catch (err) {
    next(err);
  }
};

const getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: false },
      include: { product: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const approveReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    if (approved === false) {
      await prisma.review.delete({ where: { id: parseInt(id) } });
      return res.json({ message: 'Reseña rechazada y eliminada' });
    }
    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { isApproved: true }
    });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard, getLowStockProducts,
  getProducts, createProduct, updateProduct, deleteProduct,
  getOrders, updateOrderStatus,
  getCategories, createCategory, updateCategory, deleteCategory,
  getPendingReviews, approveReview
};
