// Inquiry Management System
export type InquiryType = 
  | 'tour_booking' 
  | 'package_booking' 
  | 'air_ticket' 
  | 'visa_assistance' 
  | 'dmc_partnership' 
  | 'mice_event' 
  | 'general_contact';

export type InquiryStatus = 'new' | 'in_progress' | 'responded' | 'closed';
export type InquiryPriority = 'low' | 'medium' | 'high';

export interface Inquiry {
  id: string;
  type: InquiryType;
  status: InquiryStatus;
  priority: InquiryPriority;
  
  // Customer Information
  name: string;
  email: string;
  phone?: string;
  
  // Inquiry Details
  subject?: string;
  message: string;
  preferredDate?: string;
  numberOfPeople?: number;
  
  // Related Items (optional)
  tourId?: string;
  tourTitle?: string;
  packageId?: string;
  packageTitle?: string;
  ticketId?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
  respondedBy?: string; // admin username
  adminNotes?: string;
  
  // Source
  sourceUrl?: string;
  language?: string;
}

export interface InquiryCreate {
  type: InquiryType;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  preferredDate?: string;
  numberOfPeople?: number;
  tourId?: string;
  tourTitle?: string;
  packageId?: string;
  packageTitle?: string;
  ticketId?: string;
  sourceUrl?: string;
  language?: string;
}

export interface InquiryUpdate {
  status?: InquiryStatus;
  priority?: InquiryPriority;
  adminNotes?: string;
  respondedBy?: string;
}

// Storage key
const INQUIRIES_KEY = 'inquiries_data';

// Get all inquiries
export async function getInquiries(): Promise<Inquiry[]> {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(INQUIRIES_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing inquiries:', error);
    return [];
  }
}

// Save inquiries
export async function saveInquiries(inquiries: Inquiry[]): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
}

// Create new inquiry
export async function createInquiry(data: InquiryCreate): Promise<Inquiry> {
  const inquiries = await getInquiries();
  
  const newInquiry: Inquiry = {
    ...data,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    status: 'new',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  inquiries.unshift(newInquiry); // Add to beginning
  await saveInquiries(inquiries);
  
  return newInquiry;
}

// Get inquiry by ID
export async function getInquiryById(id: string): Promise<Inquiry | null> {
  const inquiries = await getInquiries();
  return inquiries.find(inq => inq.id === id) || null;
}

// Update inquiry
export async function updateInquiry(id: string, updates: InquiryUpdate): Promise<Inquiry | null> {
  const inquiries = await getInquiries();
  const index = inquiries.findIndex(inq => inq.id === id);
  
  if (index === -1) return null;
  
  const updatedInquiry = {
    ...inquiries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  if (updates.status === 'responded' && !inquiries[index].respondedAt) {
    updatedInquiry.respondedAt = new Date().toISOString();
  }
  
  inquiries[index] = updatedInquiry;
  await saveInquiries(inquiries);
  
  return updatedInquiry;
}

// Delete inquiry
export async function deleteInquiry(id: string): Promise<boolean> {
  const inquiries = await getInquiries();
  const filtered = inquiries.filter(inq => inq.id !== id);
  
  if (filtered.length === inquiries.length) return false;
  
  await saveInquiries(filtered);
  return true;
}

// Get inquiries by status
export async function getInquiriesByStatus(status: InquiryStatus): Promise<Inquiry[]> {
  const inquiries = await getInquiries();
  return inquiries.filter(inq => inq.status === status);
}

// Get inquiries by type
export async function getInquiriesByType(type: InquiryType): Promise<Inquiry[]> {
  const inquiries = await getInquiries();
  return inquiries.filter(inq => inq.type === type);
}

// Get new inquiries count
export async function getNewInquiriesCount(): Promise<number> {
  const inquiries = await getInquiries();
  return inquiries.filter(inq => inq.status === 'new').length;
}

// Search inquiries
export async function searchInquiries(query: string): Promise<Inquiry[]> {
  const inquiries = await getInquiries();
  const lowerQuery = query.toLowerCase();
  
  return inquiries.filter(inq => 
    inq.name.toLowerCase().includes(lowerQuery) ||
    inq.email.toLowerCase().includes(lowerQuery) ||
    inq.message.toLowerCase().includes(lowerQuery) ||
    (inq.subject && inq.subject.toLowerCase().includes(lowerQuery)) ||
    (inq.tourTitle && inq.tourTitle.toLowerCase().includes(lowerQuery)) ||
    (inq.packageTitle && inq.packageTitle.toLowerCase().includes(lowerQuery))
  );
}

// Get inquiry type display name
export function getInquiryTypeDisplay(type: InquiryType): string {
  const types: Record<InquiryType, string> = {
    'tour_booking': 'Tour Booking',
    'package_booking': 'Package Booking',
    'air_ticket': 'Air Ticket Request',
    'visa_assistance': 'Visa Assistance',
    'dmc_partnership': 'DMC Partnership',
    'mice_event': 'MICE Event',
    'general_contact': 'General Contact',
  };
  return types[type] || type;
}

// Get status color
export function getStatusColor(status: InquiryStatus): string {
  const colors: Record<InquiryStatus, string> = {
    'new': 'blue',
    'in_progress': 'yellow',
    'responded': 'green',
    'closed': 'gray',
  };
  return colors[status] || 'gray';
}

// Get priority color
export function getPriorityColor(priority: InquiryPriority): string {
  const colors: Record<InquiryPriority, string> = {
    'low': 'gray',
    'medium': 'blue',
    'high': 'red',
  };
  return colors[priority] || 'gray';
}
