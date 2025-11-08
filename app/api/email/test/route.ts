import { NextRequest, NextResponse } from 'next/server';
import { EmailConfig } from '@/lib/email-config';

export async function POST(request: NextRequest) {
  try {
    const config: EmailConfig = await request.json();
    
    // Dynamic import of nodemailer
    const nodemailer = await import('nodemailer');
    
    // Create transporter
    const transporter = nodemailer.default.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: false,
      auth: {
        user: config.senderEmail,
        pass: config.senderPassword,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });
    
    // Verify connection
    await transporter.verify();
    
    // Send test email
    await transporter.sendMail({
      from: `"${config.senderName}" <${config.senderEmail}>`,
      to: config.adminEmail || config.senderEmail,
      subject: 'Test Email - Nare Travel System',
      text: 'This is a test email from Nare Travel admin system. If you received this, your email configuration is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #f97316;">✅ Email Test Successful</h2>
          <p>This is a test email from Nare Travel admin system.</p>
          <p>If you received this, your email configuration is working correctly!</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            <strong>Configuration Details:</strong><br>
            SMTP Host: ${config.smtpHost}<br>
            SMTP Port: ${config.smtpPort}<br>
            Sender: ${config.senderName} &lt;${config.senderEmail}&gt;
          </p>
        </div>
      `,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully! Check your inbox.'
    });
  } catch (error) {
    console.error('Email test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send test email';
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: error.code || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
