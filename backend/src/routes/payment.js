const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

router.post('/create-order', authenticate, createOrder);
router.post('/verify-payment', authenticate, verifyPayment);

module.exports = router;
