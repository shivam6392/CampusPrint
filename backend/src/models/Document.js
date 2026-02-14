const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  fileName: {
    type: String,
    required: true
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
    default: 'pending'
  },

  expiresAt: {
    type: Date,
    required: true,
    index: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);