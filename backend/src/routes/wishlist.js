const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/wishlist?sessionId=xxx
router.get('/', async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.json([]);

    const items = await prisma.wishlistItem.findMany({
      where: { sessionId },
      include: {
        product: {
          include: { category: { select: { id: true, name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(items.map(i => i.product));
  } catch (err) {
    next(err);
  }
});

// POST /api/wishlist
router.post('/', async (req, res, next) => {
  try {
    const { sessionId, productId } = req.body;
    if (!sessionId || !productId) {
      return res.status(400).json({ error: 'sessionId y productId son requeridos' });
    }

    await prisma.wishlistItem.upsert({
      where: { sessionId_productId: { sessionId, productId: parseInt(productId) } },
      create: { sessionId, productId: parseInt(productId) },
      update: {}
    });

    res.status(201).json({ message: 'Agregado a favoritos' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/wishlist/:productId?sessionId=xxx
router.delete('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId requerido' });

    await prisma.wishlistItem.deleteMany({
      where: { sessionId, productId: parseInt(productId) }
    });

    res.json({ message: 'Eliminado de favoritos' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
