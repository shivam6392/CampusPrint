const pdf = require('pdf-parse');
const fs = require('fs');

const getPageCount = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.numpages;
  } catch (error) {
    throw new Error('Failed to read PDF: ' + error.message);
  }
};

module.exports = { getPageCount };
