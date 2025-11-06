import { NextRequest, NextResponse } from 'next/server';
import { getInquiryById, updateInquiry, deleteInquiry, InquiryUpdate } from '@/lib/inquiries';

// GET - Get single inquiry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = await getInquiryById(params.id);
    
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      inquiry
    });
  } catch (error: any) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

// PATCH - Update inquiry
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates: InquiryUpdate = await request.json();
    
    const inquiry = await updateInquiry(params.id, updates);
    
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      inquiry,
      message: 'Inquiry updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteInquiry(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
