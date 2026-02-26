const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ordersController');

router.post('/', ctrl.createOrder);
router.get('/:id', ctrl.getOrderById);
router.get('/number/:orderNumber', ctrl.getOrderByNumber);

module.exports = router;
