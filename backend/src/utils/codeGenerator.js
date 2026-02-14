const Document = require('../models/Document');

const PRICE_PER_PAGE = 1; // ₹1 per page
const CODE_VALIDITY_HOURS = 24;

const calculateAmount = (pages) => {
  return pages * PRICE_PER_PAGE;
};

const generateUniqueCode = async () => {
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Check if code exists and is still active
    const existingDoc = await Document.findOne({
      uniqueCode: code,
      status: 'paid',
      expiresAt: { $gt: new Date() }
    });

    if (!existingDoc) {
      return code;
    }

    attempts++;
  }

  throw new Error('Failed to generate unique code. Please try again.');
};

const getExpiryDate = () => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + CODE_VALIDITY_HOURS);
  return expiry;
};

module.exports = {
  calculateAmount,
  generateUniqueCode,
  getExpiryDate,
  PRICE_PER_PAGE,
  CODE_VALIDITY_HOURS
};
