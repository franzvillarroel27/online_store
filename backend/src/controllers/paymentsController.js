const prisma = require('../lib/prisma');

const confirmPayment = async (req, res, next) => {
  try {
    const { orderId, referenceNumber, method } = req.body;

    const order = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

    const payment = await prisma.payment.upsert({
      where: { orderId: parseInt(orderId) },
      update: { referenceNumber, status: 'pending' },
      create: {
        orderId: parseInt(orderId),
        amount: order.total,
        method: method || order.paymentMethod,
        referenceNumber,
        status: 'pending'
      }
    });

    // Actualizar estado de pago del pedido
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { paymentStatus: 'pending_verification' }
    });

    res.json({ payment, message: 'Comprobante de pago enviado. En verificación.' });
  } catch (err) {
    next(err);
  }
};

const getPaymentByOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { orderId: parseInt(orderId) }
    });
    if (!payment) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

module.exports = { confirmPayment, getPaymentByOrder };
