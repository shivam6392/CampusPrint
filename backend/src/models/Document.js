const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true,
    min: 1
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentId: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  razorpayOrderId: {
    type: String
  },
  uniqueCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'expired', 'printed'],
    default: 'paid'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Index for finding active codes
documentSchema.index({ uniqueCode: 1, status: 1, expiresAt: 1 });

module.exports = mongoose.model('Document', documentSchema);
