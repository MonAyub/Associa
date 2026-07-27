const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for cross-origin requests from frontend
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());

// In-Memory OTP Storage
// Key: normalized user email address
// Value: { otp: string, expiresAt: timestamp }
const otpStore = {};

// Configure Nodemailer Transporter using Gmail SMTP credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim() : '',
        pass: process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.replace(/\s+/g, '') : ''
    }
});

// Periodic cleanup task to remove expired OTP records (runs every 60 seconds)
setInterval(() => {
    const now = Date.now();
    for (const email in otpStore) {
        if (otpStore[email].expiresAt < now) {
            delete otpStore[email];
        }
    }
}, 60000);

/**
 * ENDPOINT 1: POST /send-otp
 * Validates input, generates a 6-digit OTP (valid for 5 minutes), stores it in memory,
 * and emails the OTP code to the user's email address.
 */
app.post('/send-otp', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Input validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields (Name, Email, Subject, Message) are required.' 
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide a valid email address.' 
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Generate random 6-digit OTP code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // Exactly 5 minutes validity

        // Store OTP in memory
        otpStore[normalizedEmail] = {
            otp,
            expiresAt
        };

        console.log(`[OTP GENERATED] Email: ${normalizedEmail} | OTP: ${otp}`);

        // Email containing the OTP sent to user
        const mailOptions = {
            from: `"NDSC Verification" <${process.env.ADMIN_EMAIL}>`,
            to: normalizedEmail,
            subject: `Your Verification Code: ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 550px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b;">
                    <h2 style="color: #0ea5e9; margin-top: 0;">Verification Code</h2>
                    <p>Hello <strong>${name}</strong>,</p>
                    <p>Use the following 6-digit code to complete sending your message on the NDSC website:</p>
                    <div style="background-color: #f0f9ff; border: 1px dashed #0ea5e9; border-radius: 6px; padding: 16px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0284c7;">${otp}</span>
                    </div>
                    <p style="font-size: 14px; color: #64748b;">This code will expire in <strong>5 minutes</strong>. Please do not share it with anyone.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'OTP sent to your email address successfully.'
        });

    } catch (err) {
        console.error('Error in /send-otp endpoint:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to send verification email. Please check server email credentials or try again later.'
        });
    }
});

/**
 * ENDPOINT 2: POST /submit-message
 * Verifies the submitted OTP against memory. If valid, emails the contact form details 
 * to ADMIN_EMAIL with replyTo set to the user's email for direct reply support.
 */
app.post('/submit-message', async (req, res) => {
    try {
        const { name, email, subject, message, otp } = req.body;

        // Input validation
        if (!name || !email || !subject || !message || !otp) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields including the OTP code are required.' 
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const record = otpStore[normalizedEmail];

        // 1. Verify OTP presence
        if (!record) {
            return res.status(400).json({ 
                success: false, 
                error: 'No OTP found for this email address or OTP has expired.' 
            });
        }

        // 2. Verify expiration (5 minutes)
        if (Date.now() > record.expiresAt) {
            delete otpStore[normalizedEmail];
            return res.status(400).json({ 
                success: false, 
                error: 'OTP code has expired. Please request a new code.' 
            });
        }

        // 3. Verify OTP code match
        if (record.otp !== otp.trim()) {
            return res.status(400).json({ 
                success: false, 
                error: 'Incorrect OTP code. Please check your email and try again.' 
            });
        }

        // OTP is valid: Deliver contact email to ADMIN_EMAIL
        const adminMailOptions = {
            from: `"${name}" <${process.env.ADMIN_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            replyTo: normalizedEmail, // Enables direct Reply in Gmail
            subject: `[NDSC Contact] ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 650px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b;">
                    <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 8px; margin-top: 0;">New Contact Form Message</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 15px;">
                        <tr>
                            <td style="padding: 10px; font-weight: bold; width: 100px; color: #475569;">Name:</td>
                            <td style="padding: 10px;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; color: #475569;">Email:</td>
                            <td style="padding: 10px;"><a href="mailto:${normalizedEmail}" style="color: #0ea5e9;">${normalizedEmail}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; color: #475569;">Subject:</td>
                            <td style="padding: 10px;">${subject}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; color: #475569; vertical-align: top;">Message:</td>
                            <td style="padding: 10px; background-color: #f8fafc; border-radius: 6px; white-space: pre-wrap; color: #0f172a;">${message}</td>
                        </tr>
                    </table>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;">
                    <p style="font-size: 13px; color: #64748b; margin: 0;">
                        💡 <em>Clicking "Reply" in your email client will reply directly to <strong>${normalizedEmail}</strong>.</em>
                    </p>
                </div>
            `
        };

        await transporter.sendMail(adminMailOptions);

        // Delete OTP after successful verification
        delete otpStore[normalizedEmail];

        return res.status(200).json({
            success: true,
            message: 'Your message has been verified and sent successfully!'
        });

    } catch (err) {
        console.error('Error in /submit-message endpoint:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to deliver message to administrator. Please try again later.'
        });
    }
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 NDSC Contact OTP Server running on http://localhost:${PORT}`);
    console.log(`==================================================`);
});
