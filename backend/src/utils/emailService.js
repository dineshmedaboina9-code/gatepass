const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

const sendGatePassEmail = async (email, studentName, passCode, qrCode) => {
  const subject = 'Your Gate Pass Has Been Generated';
  const htmlContent = `
    <h2>Gate Pass Generated</h2>
    <p>Dear ${studentName},</p>
    <p>Your gate pass has been successfully generated and is ready to use.</p>
    <p><strong>Pass Code:</strong> ${passCode}</p>
    <p>Your QR Code:</p>
    <img src="cid:qrcode" alt="QR Code" width="200" height="200">
    <p>Please present this QR code at the gate for verification.</p>
    <br>
    <p>Best regards,<br>Gate Pass Management System</p>
  `;

  return sendEmail(email, subject, htmlContent);
};

const sendApprovalNotification = async (email, studentName, status) => {
  const subject = status === 'approved' 
    ? 'Gate Pass Request Approved' 
    : 'Gate Pass Request Rejected';
  
  const htmlContent = `
    <h2>Gate Pass Request ${status.toUpperCase()}</h2>
    <p>Dear ${studentName},</p>
    <p>Your gate pass request has been ${status}.</p>
    ${status === 'approved' 
      ? '<p>You will receive your gate pass shortly.</p>' 
      : '<p>Please contact your department head for more details.</p>'}
    <br>
    <p>Best regards,<br>Gate Pass Management System</p>
  `;

  return sendEmail(email, subject, htmlContent);
};

module.exports = {
  sendEmail,
  sendGatePassEmail,
  sendApprovalNotification
};
