const crypto = require('crypto');
const Document = require('../models/Document');
const { generateUniqueCode, getExpiryDate, calculateAmount } = require('../utils/codeGenerator');

// TEST MODE - No Razorpay required

const createOrder = async (req, res) => {
  try {
    const { amount, pdfUrl, pages } = req.body;

    if (!amount || !pdfUrl || !pages) {
      return res.status(400).json({ error: 'Amount, pdfUrl, and pages are required' });
    }

    const expectedAmount = calculateAmount(pages);

    if (amount !== expectedAmount) {
      return res.status(400).json({ error: 'Amount mismatch' });
    }

    // Fake order creation
    const fakeOrderId = "test_order_" + Date.now();

    res.json({
      success: true,
      orderId: fakeOrderId,
      amount: amount * 100,
      currency: "INR",
      keyId: "test_key"
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
};


const verifyPayment = async (req, res) => {
  try {

    const { pdfUrl, pages, amount } = req.body;

    if (!pdfUrl || !pages || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fake payment id
    const fakePaymentId = "pay_" + Date.now();

    // Check duplicate
    const existingDoc = await Document.findOne({ paymentId: fakePaymentId });

    if (existingDoc) {
      return res.json({
        success: true,
        uniqueCode: existingDoc.uniqueCode,
        expiresAt: existingDoc.expiresAt
      });
    }

    const uniqueCode = await generateUniqueCode();
    const expiresAt = getExpiryDate();

    const document = await Document.create({
      userId: req.user.id,
      pdfUrl,
      pages: parseInt(pages),
      amount: parseFloat(amount),
      paymentId: fakePaymentId,
      razorpayOrderId: "test_order",
      uniqueCode,
      status: "paid",
      expiresAt
    });

    res.json({
      success: true,
      uniqueCode,
      expiresAt,
      documentId: document._id,
      message: "TEST MODE PAYMENT SUCCESS"
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createOrder,
  verifyPayment
};
