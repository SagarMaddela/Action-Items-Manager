const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter
const createTransporter = () => {
    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn('⚠️  SMTP not configured - email sending disabled');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });
};

const transporter = createTransporter();

// Verify connection on startup
if (transporter) {
    transporter.verify((error, success) => {
        if (error) {
            console.error('❌ SMTP connection failed:', error.message);
        } else {
            console.log('✅ SMTP server ready to send emails');
        }
    });
}

module.exports = { transporter };
