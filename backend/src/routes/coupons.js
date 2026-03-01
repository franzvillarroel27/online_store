const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// POST /api/coupons/validate
router.post('/validate', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ error: 'Código de cupón requerido' });

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() }
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ error: 'Cupón inválido o no existe' });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({ error: 'Este cupón ha expirado' });
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Este cupón ha alcanzado su límite de usos' });
    }

    const orderSubtotal = parseFloat(subtotal) || 0;
    if (coupon.minOrderAmount && orderSubtotal < parseFloat(coupon.minOrderAmount)) {
      return res.status(400).json({
        error: `Monto mínimo de pedido para este cupón: Bs. ${parseFloat(coupon.minOrderAmount).toFixed(2)}`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderSubtotal * parseFloat(coupon.discountValue)) / 100;
    } else {
      discount = Math.min(parseFloat(coupon.discountValue), orderSubtotal);
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: parseFloat(coupon.discountValue),
        discount: parseFloat(discount.toFixed(2))
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
