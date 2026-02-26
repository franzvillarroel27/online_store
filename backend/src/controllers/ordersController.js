const prisma = require('../lib/prisma');
const { v4: uuidv4 } = require('uuid');
const inventoryService = require('../services/inventoryService');
const notificationService = require('../services/notificationService');

const createOrder = async (req, res, next) => {
  try {
    const {
      customerName, customerPhone, customerEmail,
      deliveryAddress, city, zone,
      items, paymentMethod, notes, couponCode
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Verificar stock y obtener precios actuales
    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true }
    });

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Producto ${item.productId} no encontrado` });
      }
      if (product.stockStatus === 'out_of_stock' || product.stockQuantity < item.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para: ${product.name}` });
      }
    }

    // Calcular totales
    let subtotal = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      const unitPrice = parseFloat(product.salePrice || product.price);
      subtotal += unitPrice * item.quantity;
      return {
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        unitPrice
      };
    });

    // Costo de envío (por zona)
    const shippingCost = city.toLowerCase() === 'la paz' ? 15 : 25;
    const total = subtotal + shippingCost;

    const orderNumber = `CS-${Date.now()}-${uuidv4().slice(0, 4).toUpperCase()}`;

    // Crear pedido en transacción
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName, customerPhone, customerEmail,
          deliveryAddress, city, zone,
          subtotal, shippingCost, total,
          paymentMethod, notes,
          items: { create: orderItems }
        },
        include: { items: true }
      });

      // Reducir stock
      for (const item of items) {
        await inventoryService.reduceStock(tx, item.productId, item.quantity, newOrder.id);
      }

      return newOrder;
    });

    // Notificar al vendedor (async, no bloquea)
    notificationService.notifyNewOrder(order).catch(err =>
      console.error('Error enviando notificación:', err.message)
    );

    res.status(201).json({ order, message: 'Pedido creado exitosamente' });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, images: true } } }
        },
        payment: true
      }
    });
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const getOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, payment: true }
    });
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getOrderById, getOrderByNumber };
