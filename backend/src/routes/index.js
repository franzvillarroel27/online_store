const express = require('express');
const router = express.Router();

router.use('/categories', require('./categories'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));
router.use('/payments', require('./payments'));
router.use('/coupons', require('./coupons'));
router.use('/wishlist', require('./wishlist'));
router.use('/admin', require('./admin'));

module.exports = router;
