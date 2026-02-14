const Document = require('../models/Document');

const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    res.json({
      success: true,
      documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

const getDocumentByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const document = await Document.findOne({
      uniqueCode: code,
      status: 'paid',
      expiresAt: { $gt: new Date() }
    }).lean();

    if (!document) {
      return res.status(404).json({ error: 'Invalid or expired code' });
    }

    res.json({
      success: true,
      document: {
        pdfUrl: document.pdfUrl,
        pages: document.pages,
        status: document.status
      }
    });
  } catch (error) {
    console.error('Get document by code error:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
};

module.exports = {
  getUserDocuments,
  getDocumentByCode
};
