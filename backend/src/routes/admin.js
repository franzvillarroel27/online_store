const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.use(adminAuth);

router.get('/dashboard', ctrl.getDashboard);
router.get('/low-stock', ctrl.getLowStockProducts);

router.get('/products', ctrl.getProducts);
router.post('/products', ctrl.createProduct);
router.put('/products/:id', ctrl.updateProduct);
router.delete('/products/:id', ctrl.deleteProduct);

router.get('/orders', ctrl.getOrders);
router.put('/orders/:id/status', ctrl.updateOrderStatus);

router.get('/categories', ctrl.getCategories);
router.post('/categories', ctrl.createCategory);
router.put('/categories/:id', ctrl.updateCategory);
router.delete('/categories/:id', ctrl.deleteCategory);

router.get('/reviews/pending', ctrl.getPendingReviews);
router.put('/reviews/:id', ctrl.approveReview);

module.exports = router;
