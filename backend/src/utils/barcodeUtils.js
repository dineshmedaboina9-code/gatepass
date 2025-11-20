const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const generatePassCode = () => {
  return `GATE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const generateQRCode = async (data) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(data));
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
};

const generateBarcode = async (data) => {
  // For barcode, we can use the same QR code data
  return generateQRCode(data);
};

module.exports = {
  generatePassCode,
  generateQRCode,
  generateBarcode
};
