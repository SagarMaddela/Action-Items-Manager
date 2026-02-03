const { transporter } = require('../config/email');

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content (optional)
 */
const sendEmail = async ({ to, subject, text, html }) => {
    if (!transporter) {
        console.warn('⚠️  Email sending skipped - SMTP not configured');
        return { success: false, message: 'SMTP not configured' };
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.SMTP_USER,
            to,
            subject,
            text,
            html: html || text
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        throw error;
    }
};

/**
 * Send action reminder email
 */
const sendReminderEmail = async (userEmail, action) => {
    const subject = `Reminder: ${action.title}`;
    const text = `
Hello,

This is a reminder for your action item:

Title: ${action.title}
${action.description ? `Description: ${action.description}` : ''}
Priority: ${action.priority}
Due: ${action.due_at ? new Date(action.due_at).toLocaleString() : 'Not set'}

Best regards,
Apogee Action Items
  `.trim();

    return await sendEmail({ to: userEmail, subject, text });
};

/**
 * Send custom email from action metadata
 */
const sendActionEmail = async (action, metadata) => {
    const to = metadata.email_to || metadata.recipient;
    const subject = metadata.email_subject || action.title;
    const body = metadata.email_body || action.description || '';

    if (!to) {
        throw new Error('Email recipient not specified in metadata');
    }

    return await sendEmail({ to, subject, text: body });
};

module.exports = {
    sendEmail,
    sendReminderEmail,
    sendActionEmail
};
