const path = require('path');
const { getPageCount } = require('../utils/pdfParser');
const { calculateAmount } = require('../utils/codeGenerator');
const { uploadFile, cleanupLocalFile } = require('../services/storageService');

const uploadPdf = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    filePath = req.file.path;
    const pages = await getPageCount(filePath);
    const amount = calculateAmount(pages);

    // Upload to cloud storage
    const pdfUrl = await uploadFile(
      filePath,
      req.file.originalname,
      req.user.id
    );

    // Cleanup local file
    cleanupLocalFile(filePath);

    res.json({
      success: true,
      pdfUrl,
      pages,
      amount,
      localPath: req.file.path // For create-order flow - we need to pass pdfUrl
    });
  } catch (error) {
    if (filePath) {
      cleanupLocalFile(filePath);
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
};

// Alternative: Upload only, return pages/amount without cloud upload (for two-step flow)
const calculatePdfCost = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    filePath = req.file.path;
    const pages = await getPageCount(filePath);
    const amount = calculateAmount(pages);

    // Upload to cloud storage
    const pdfUrl = await uploadFile(
      filePath,
      req.file.originalname,
      req.user.id
    );

    cleanupLocalFile(filePath);

    res.json({
      success: true,
      pdfUrl,
      pages,
      amount
    });
  } catch (error) {
    if (filePath) {
      cleanupLocalFile(filePath);
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
};

module.exports = {
  uploadPdf,
  calculatePdfCost
};
