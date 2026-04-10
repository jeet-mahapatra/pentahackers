import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendNotificationEmail = async (email, subject, htmlContent) => {
    try {
        const info = await transporter.sendMail({
            from: `"EasyFind Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html: htmlContent
        });

        console.log('Preview URL: ', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};