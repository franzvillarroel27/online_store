const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentsController');

router.post('/confirm', ctrl.confirmPayment);
router.get('/:orderId', ctrl.getPaymentByOrder);

module.exports = router;
