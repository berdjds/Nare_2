import { NextRequest, NextResponse } from 'next/server';
import { createInquiry, getInquiries, InquiryCreate } from '@/lib/inquiries';
import { getEmailConfig, isEmailConfigured } from '@/lib/email-config';
import { generateAdminNotificationEmail, generateCustomerAutoReply, sendEmail } from '@/lib/email-sender';

// POST - Create new inquiry
export async function POST(request: NextRequest) {
  try {
    const data: InquiryCreate = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }
    
    // Create inquiry
    const inquiry = await createInquiry(data);
    
    // Send email notifications if configured
    try {
      const emailConfigured = await isEmailConfigured();
      if (emailConfigured) {
        const emailConfig = await getEmailConfig();
        
        // Send admin notification
        if (emailConfig.notifyOnNewInquiry && emailConfig.adminEmail) {
          const adminTemplate = generateAdminNotificationEmail(inquiry);
          await sendEmail(emailConfig.adminEmail, adminTemplate, emailConfig);
        }
        
        // Send customer auto-reply
        if (emailConfig.autoReplyEnabled) {
          const customerTemplate = generateCustomerAutoReply(inquiry, emailConfig.autoReplyMessage);
          await sendEmail(data.email, customerTemplate, emailConfig);
        }
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the inquiry creation if email fails
    }
    
    return NextResponse.json({
      success: true,
      inquiry,
      message: 'Inquiry submitted successfully'
    });
  } catch (error: any) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}

// GET - List all inquiries (admin only)
export async function GET(request: NextRequest) {
  try {
    // In production, check admin authentication here
    // For now, we'll allow it
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    let inquiries = await getInquiries();
    
    // Filter by status if provided
    if (status) {
      inquiries = inquiries.filter(inq => inq.status === status);
    }
    
    // Filter by type if provided
    if (type) {
      inquiries = inquiries.filter(inq => inq.type === type);
    }
    
    return NextResponse.json({
      success: true,
      inquiries,
      count: inquiries.length
    });
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
