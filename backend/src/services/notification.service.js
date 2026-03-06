/**
 * Stubbed implementation for Nodemailer notification sending.
 * In production, you would configure nodemailer transporter here
 * using the SMTP_HOST, SMTP_PORT, etc. from process.env
 */
export const sendNotification = async ({ to, subject, text, html }) => {
    console.log(`\n--- [Notification Service Stub] ---`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text || html}`);
    console.log(`-----------------------------------\n`);

    // TODO: Implement actual Email sending logic here
    return true;
};
