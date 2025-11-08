import { NextRequest, NextResponse } from 'next/server';
import { EmailConfig } from '@/lib/email-config';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text, config } = await request.json() as {
      to: string;
      subject: string;
      html: string;
      text: string;
      config: EmailConfig;
    };
    
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Dynamic import of nodemailer
    const nodemailer = await import('nodemailer');
    
    // Create transporter
    const transporter = nodemailer.default.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: false, // Use TLS
      auth: {
        user: config.senderEmail,
        pass: config.senderPassword,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });
    
    // Send email
    await transporter.sendMail({
      from: `"${config.senderName}" <${config.senderEmail}>`,
      to,
      subject,
      text,
      html,
      replyTo: config.replyToEmail || config.senderEmail,
      cc: config.ccEmail,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Email send error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
