const cloudinary = require('../config/cloudinary');
const Document = require('../models/Document');
const streamifier = require('streamifier');

exports.calculatePdfCost = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'campusprint'
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });

    const result = await uploadToCloudinary();

    const pdfUrl = result.secure_url;
    const uniqueCode = Date.now().toString();

    await Document.create({
      userId: req.user.id,
      pdfUrl: pdfUrl,
      pages: 1,
      amount: 5,
      paymentId: "temp",
      uniqueCode: uniqueCode,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    res.json({
      success: true,
      pdfUrl: pdfUrl,
      uniqueCode: uniqueCode
    });

  } catch (error) {

    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};
