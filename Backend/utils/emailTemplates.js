// Template 1: OTP send template for forgot password
export const getOTPTemplate = (username, otp) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #2c3e50;">Password Reset Request</h2>
        <p>Hello ${username},</p>
        <p>You requested to reset your password. Use the 6-digit code below to proceed:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3498db; border-radius: 8px;">
            ${otp}
        </div>
        <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        <p>Best Regards,<br/>The Support Team</p>
    </div>
`;

// Template 2: Concierge submission confirmation (sent to user)
export const getConciergeSubmitTemplate = (senderName, subject, requestId) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 24px; border-radius: 12px;">
        <h2 style="color: #00C4CC;">We've received your request 🎧</h2>
        <p>Hi ${senderName},</p>
        <p>Thanks for reaching out! Your concierge request has been submitted successfully.</p>
        <div style="background: #f9f9f9; border-left: 4px solid #00C4CC; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 6px 0 0;"><strong>Request ID:</strong> ${requestId}</p>
        </div>
        <p>Our team will review your request and get back to you within <strong>24 hours</strong>.</p>
        <p>Best Regards,<br/>EasyFind Concierge Team</p>
    </div>
`;

// Template 3: Admin reply / status update (sent to user)
export const getConciergeUpdateTemplate = (senderName, subject, newStatus, adminNote) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 24px; border-radius: 12px;">
        <h2 style="color: #00C4CC;">Update on your concierge request</h2>
        <p>Hi ${senderName},</p>
        <p>There's been an update on your request: <strong>${subject}</strong></p>
        <div style="background: #f9f9f9; border-left: 4px solid #00C4CC; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 0;"><strong>New Status:</strong> ${newStatus.replace('_', ' ').toUpperCase()}</p>
            ${adminNote ? `<p style="margin: 10px 0 0;"><strong>Message from our team:</strong><br/>${adminNote}</p>` : ''}
        </div>
        <p>If you have further questions, feel free to contact us again.</p>
        <p>Best Regards,<br/>EasyFind Concierge Team</p>
    </div>
`;