import nodemailer from 'nodemailer';

/**
 * Sends an email notification using Nodemailer.
 * Ensure you have configured SMTP variables in your .env file.
 */
export const sendNotification = async ({ to, subject, text, html }) => {
    try {
        // If SMTP isn't configured, just act as a stub and return
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
            console.log(`\n--- [Notification Stub (SMTP Not Configured)] ---`);
            console.log(`To: ${to}\nSubject: ${subject}\nBody: ${text || html}`);
            console.log(`-------------------------------------------------\n`);
            return true;
        }

        // Configure the transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Send the email
        const info = await transporter.sendMail({
            from: `"GramAlert System" <${process.env.SMTP_USER}>`, // sender address
            to,       // list of receivers
            subject,  // Subject line
            text,     // plain text body
            html,     // html body
        });

        console.log(`[Notification Service] Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('[Notification Service] Failed to send email:', error);
        return false;
    }
};
