const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getUserDocuments, getDocumentByCode } = require('../controllers/documentController');

router.get('/user-documents', authenticate, getUserDocuments);
router.get('/code/:code', getDocumentByCode); // Public - for printing point verification

module.exports = router;
