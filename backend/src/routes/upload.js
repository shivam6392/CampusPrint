const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const { calculatePdfCost } = require('../controllers/uploadController');

router.post(
  '/',
  authenticate,
  (req, res, next) => {
    uploadSingle(req, res, (err) => {
      handleUploadError(err, req, res, next);
    });
  },
  calculatePdfCost
);

module.exports = router;
