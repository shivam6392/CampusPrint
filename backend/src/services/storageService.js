const path = require('path');
const fs = require('fs');
const { getStorage } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const uploadToFirebase = async (localFilePath, originalFilename, userId) => {
  const bucket = getStorage().bucket();
  const ext = path.extname(originalFilename) || '.pdf';
  const fileName = `documents/${userId}/${uuidv4()}${ext}`;

  await bucket.upload(localFilePath, {
    destination: fileName,
    metadata: {
      contentType: 'application/pdf',
      metadata: {
        userId,
        originalName: originalFilename
      }
    }
  });

  const file = bucket.file(fileName);
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return url;
};

const uploadFile = async (localFilePath, originalFilename, userId) => {
  const storageType = process.env.STORAGE_TYPE || 'firebase';

  if (storageType === 'firebase') {
    return await uploadToFirebase(localFilePath, originalFilename, userId);
  }

  // Add S3 upload logic here if needed
  throw new Error('Only Firebase storage is supported. Set STORAGE_TYPE=firebase');
};

const cleanupLocalFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Error cleaning up file:', err);
  }
};

module.exports = {
  uploadFile,
  cleanupLocalFile
};
