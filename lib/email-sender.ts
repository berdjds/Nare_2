// Email Sender using Office 365
import { EmailConfig } from './email-config';
import { Inquiry, getInquiryTypeDisplay } from './inquiries';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Send email notification to admin
export function generateAdminNotificationEmail(inquiry: Inquiry): EmailTemplate {
  const inquiryType = getInquiryTypeDisplay(inquiry.type);
  const dateStr = new Date(inquiry.createdAt).toLocaleString();
  
  const subject = `New Inquiry: ${inquiryType} from ${inquiry.name}`;
  
  const text = `
New Inquiry Received

Type: ${inquiryType}
From: ${inquiry.name}
Email: ${inquiry.email}
${inquiry.phone ? `Phone: ${inquiry.phone}` : ''}
Date: ${dateStr}
${inquiry.preferredDate ? `Preferred Date: ${inquiry.preferredDate}` : ''}
${inquiry.numberOfPeople ? `Number of People: ${inquiry.numberOfPeople}` : ''}
${inquiry.tourTitle ? `Tour: ${inquiry.tourTitle}` : ''}
${inquiry.packageTitle ? `Package: ${inquiry.packageTitle}` : ''}

${inquiry.subject ? `Subject: ${inquiry.subject}` : ''}

Message:
${inquiry.message}

---
View in Admin Panel: ${typeof window !== 'undefined' ? window.location.origin : ''}/admin/dashboard
Inquiry ID: ${inquiry.id}

Nare Travel Admin System
  `.trim();
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f97316 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-row { margin: 15px 0; }
    .label { font-weight: bold; color: #6b7280; }
    .value { color: #111827; }
    .message-box { background: white; padding: 20px; border-left: 4px solid #f97316; margin: 20px 0; border-radius: 4px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
    .button { display: inline-block; padding: 12px 24px; background: #f97316; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">🔔 New Inquiry Received</h2>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Type: ${inquiryType}</p>
    </div>
    <div class="content">
      <div class="info-row">
        <span class="label">From:</span>
        <span class="value">${inquiry.name}</span>
      </div>
      <div class="info-row">
        <span class="label">Email:</span>
        <span class="value">${inquiry.email}</span>
      </div>
      ${inquiry.phone ? `
      <div class="info-row">
        <span class="label">Phone:</span>
        <span class="value">${inquiry.phone}</span>
      </div>
      ` : ''}
      <div class="info-row">
        <span class="label">Date:</span>
        <span class="value">${dateStr}</span>
      </div>
      ${inquiry.preferredDate ? `
      <div class="info-row">
        <span class="label">Preferred Date:</span>
        <span class="value">${inquiry.preferredDate}</span>
      </div>
      ` : ''}
      ${inquiry.numberOfPeople ? `
      <div class="info-row">
        <span class="label">Number of People:</span>
        <span class="value">${inquiry.numberOfPeople}</span>
      </div>
      ` : ''}
      ${inquiry.tourTitle ? `
      <div class="info-row">
        <span class="label">Tour:</span>
        <span class="value">${inquiry.tourTitle}</span>
      </div>
      ` : ''}
      ${inquiry.packageTitle ? `
      <div class="info-row">
        <span class="label">Package:</span>
        <span class="value">${inquiry.packageTitle}</span>
      </div>
      ` : ''}
      ${inquiry.subject ? `
      <div class="info-row">
        <span class="label">Subject:</span>
        <span class="value">${inquiry.subject}</span>
      </div>
      ` : ''}
      
      <div class="message-box">
        <div class="label">Message:</div>
        <div style="margin-top: 10px;">${inquiry.message.replace(/\n/g, '<br>')}</div>
      </div>
      
      <div style="text-align: center;">
        <a href="${typeof window !== 'undefined' ? window.location.origin : ''}/admin/dashboard?tab=inquiries&id=${inquiry.id}" class="button">
          View in Admin Panel →
        </a>
      </div>
      
      <div class="footer">
        <p><strong>Inquiry Reference:</strong> #${inquiry.id}</p>
        <p>Nare Travel Admin System</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
  
  return { subject, html, text };
}

// Send auto-reply to customer
export function generateCustomerAutoReply(inquiry: Inquiry, customMessage?: string): EmailTemplate {
  const inquiryType = getInquiryTypeDisplay(inquiry.type);
  
  const subject = `We Received Your Inquiry - Nare Travel`;
  
  const message = customMessage || `Thank you for contacting Nare Travel!

We have received your inquiry and our team will respond within 24 hours.

If you have any urgent questions, please call us at +374-10-545046.

Best regards,
Nare Travel Team
91 Teryan St, Yerevan, Armenia
www.nare.am`;
  
  const text = `
Dear ${inquiry.name},

${message}

---
Inquiry Details:
Type: ${inquiryType}
Reference: #${inquiry.id}
Date: ${new Date(inquiry.createdAt).toLocaleString()}

${inquiry.tourTitle ? `Tour: ${inquiry.tourTitle}` : ''}
${inquiry.packageTitle ? `Package: ${inquiry.packageTitle}` : ''}
  `.trim();
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f97316 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .message { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .info-box { background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0 0 10px 0;">✅ Inquiry Received</h1>
      <p style="margin: 0; opacity: 0.9;">Nare Travel & Tours</p>
    </div>
    <div class="content">
      <h2>Dear ${inquiry.name},</h2>
      
      <div class="message">
        ${message.replace(/\n/g, '<br>')}
      </div>
      
      <div class="info-box">
        <h3 style="margin-top: 0;">Your Inquiry Details</h3>
        <p><strong>Type:</strong> ${inquiryType}</p>
        <p><strong>Reference:</strong> #${inquiry.id}</p>
        <p><strong>Date:</strong> ${new Date(inquiry.createdAt).toLocaleString()}</p>
        ${inquiry.tourTitle ? `<p><strong>Tour:</strong> ${inquiry.tourTitle}</p>` : ''}
        ${inquiry.packageTitle ? `<p><strong>Package:</strong> ${inquiry.packageTitle}</p>` : ''}
      </div>
      
      <div class="footer">
        <p><strong>Nare Travel and Tours</strong></p>
        <p>📍 91 Teryan St, Business Center, Yerevan, Armenia</p>
        <p>📞 +374-10-545046 | 📧 info@nare.am</p>
        <p>🌐 www.nare.am</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
  
  return { subject, html, text };
}

// Send email via API
export async function sendEmail(
  to: string,
  template: EmailTemplate,
  config: EmailConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
        config,
      }),
    });
    
    const data = await response.json();
    return { success: response.ok, error: data.error };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
