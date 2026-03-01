const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productsController');

router.get('/featured', ctrl.getFeaturedProducts);
router.get('/search', ctrl.searchProducts);
router.get('/', ctrl.getProducts);
router.get('/:id', ctrl.getProductById);
router.post('/:id/reviews', ctrl.submitReview);

module.exports = router;
