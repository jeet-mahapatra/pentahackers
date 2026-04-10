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