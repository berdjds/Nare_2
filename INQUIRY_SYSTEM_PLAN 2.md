# 📋 Comprehensive Inquiry & Booking System

## 🎯 Objectives

Fix visitor page issues and create complete inquiry management system:

1. ✅ Fix translation keys in all dialogs
2. ✅ Create proper booking/inquiry forms for each service
3. ✅ Store form submissions in database
4. ✅ Admin panel to manage inquiries
5. ✅ Email notifications via Office 365
6. ✅ Email configuration in Super Admin

---

## 📊 System Architecture

### **Database Schema**

```typescript
// Inquiry Types
- Tour Booking (Armenia Tours)
- Package Booking (Outgoing Packages)
- Air Ticket Request
- Visa Assistance Request
- DMC Partnership Request
- MICE Event Request
- General Contact

// Inquiry Table
{
  id: string
  type: 'tour' | 'package' | 'ticket' | 'visa' | 'dmc' | 'mice' | 'contact'
  status: 'new' | 'in_progress' | 'responded' | 'closed'
  priority: 'low' | 'medium' | 'high'
  
  // Customer Info
  name: string
  email: string
  phone?: string
  
  // Inquiry Details
  subject?: string
  message: string
  date?: string (preferred travel date)
  
  // Related Item
  tourId?: string
  packageId?: string
  ticketId?: string
  
  // Metadata
  createdAt: string
  updatedAt: string
  respondedAt?: string
  respondedBy?: string (admin username)
  adminNotes?: string
}
```

### **Email Configuration**

```typescript
{
  provider: 'office365'
  smtpHost: 'smtp.office365.com'
  smtpPort: 587
  senderEmail: string (e.g., info@naretravel.com)
  senderPassword: string (encrypted)
  senderName: string (e.g., "Nare Travel Team")
  
  // Notification Settings
  notifyOnNewInquiry: boolean
  adminEmail: string (where to send notifications)
  autoReplyEnabled: boolean
  autoReplyMessage: string
}
```

---

## 🔧 Implementation Steps

### **Phase 1: Translation Fixes**
1. ✅ Find all translation keys in booking dialog
2. ✅ Add proper translations to translation files
3. ✅ Fix useLanguage hook in dialogs

### **Phase 2: Database & API**
1. ✅ Create inquiry types and interfaces
2. ✅ Create localStorage/database helper functions
3. ✅ Create API endpoints:
   - POST /api/inquiries - Submit new inquiry
   - GET /api/inquiries - List all (admin only)
   - PATCH /api/inquiries/[id] - Update status/notes
   - DELETE /api/inquiries/[id] - Delete inquiry

### **Phase 3: Admin Management**
1. ✅ Create Inquiries Manager component
2. ✅ Add to admin dashboard (Content Management section)
3. ✅ Features:
   - View all inquiries
   - Filter by type/status/date
   - Search by name/email
   - Update status
   - Add admin notes
   - Mark as responded
   - Delete inquiries

### **Phase 4: Email System**
1. ✅ Create Email Settings component (Super Admin only)
2. ✅ Configure Office 365 SMTP
3. ✅ Test email connection
4. ✅ Create email templates
5. ✅ Send notifications on new inquiry
6. ✅ Send auto-reply to customer (optional)

### **Phase 5: Forms Update**
1. ✅ Update booking dialog with proper forms
2. ✅ Different forms for different services:
   - Tour booking form
   - Package inquiry form
   - Ticket request form
   - Visa assistance form
   - DMC partnership form
   - MICE event form
   - General contact form
3. ✅ Connect forms to API
4. ✅ Show success messages

---

## 📝 Files to Create/Modify

### **New Files:**
```
lib/inquiries.ts - Inquiry types and functions
lib/email-config.ts - Email configuration
lib/email-sender.ts - Office 365 email sender
components/admin/inquiries-manager.tsx - Admin panel
components/admin/email-settings.tsx - Email config
components/booking-dialog.tsx - Updated booking dialog
app/api/inquiries/route.ts - API endpoints
app/api/inquiries/[id]/route.ts - Single inquiry API
app/api/email/test/route.ts - Test email endpoint
app/api/email/send/route.ts - Send email endpoint
```

### **Files to Modify:**
```
app/admin/dashboard/page.tsx - Add Inquiries tab
locales/en.json - Add missing translations
locales/hy.json - Add Armenian translations
locales/ru.json - Add Russian translations
locales/ar.json - Add Arabic translations
```

---

## 🎨 Admin UI - Inquiries Manager

```
┌─────────────────────────────────────────────────┐
│ Inquiries Management     [24 New] [156 Total]   │
│ Manage customer inquiries and booking requests  │
│                          [+ Mark All as Read]   │
├─────────────────────────────────────────────────┤
│ [Search...] [Filter: All ▼] [Status: All ▼]    │
├─────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐  │
│ │ 🔵 NEW  Tour Booking - Garni & Geghard    │  │
│ │ John Smith • john@email.com               │  │
│ │ "Interested in 2-day tour for 4 people"  │  │
│ │ 2 hours ago                               │  │
│ │ [View Details] [Respond] [Mark Done]      │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ ┌───────────────────────────────────────────┐  │
│ │ 🟡 IN PROGRESS  Air Ticket Request        │  │
│ │ Sarah Johnson • sarah@email.com           │  │
│ │ "Need tickets for Dubai on Dec 15"       │  │
│ │ Yesterday • Assigned to: admin            │  │
│ │ [View Details] [Update Status]            │  │
│ └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 📧 Email Configuration UI

```
┌─────────────────────────────────────────────────┐
│ 📧 Email Configuration (Super Admin Only)       │
│ Configure Office 365 email for notifications   │
├─────────────────────────────────────────────────┤
│ Email Provider: Office 365                      │
│                                                 │
│ SMTP Host: smtp.office365.com                   │
│ SMTP Port: 587                                  │
│                                                 │
│ Sender Email: info@naretravel.com               │
│ Sender Password: ••••••••••••                   │
│ Sender Name: Nare Travel Team                   │
│                                                 │
│ ☑ Send notifications to admin                  │
│ Admin Email: admin@naretravel.com               │
│                                                 │
│ ☑ Send auto-reply to customers                 │
│ Auto-Reply Message:                             │
│ ┌─────────────────────────────────────────┐    │
│ │ Thank you for contacting Nare Travel!   │    │
│ │ We received your inquiry and will       │    │
│ │ respond within 24 hours.                │    │
│ └─────────────────────────────────────────┘    │
│                                                 │
│ [Test Connection] [Save Configuration]          │
└─────────────────────────────────────────────────┘
```

---

## 🔔 Email Notifications

### **To Admin (New Inquiry):**
```
Subject: New Inquiry: Tour Booking from John Smith

Hello Admin,

You have received a new inquiry:

Type: Tour Booking - Garni & Geghard Temple
From: John Smith (john@email.com)
Phone: +374-99-123456
Date: December 15, 2025

Message:
"We are a group of 4 people interested in booking the 
Garni & Geghard Temple tour for December 15th. Could 
you please provide pricing and availability?"

View in Admin Panel:
https://naretravel.com/admin/dashboard?tab=inquiries&id=12345

---
Nare Travel Admin System
```

### **To Customer (Auto-Reply):**
```
Subject: We Received Your Inquiry - Nare Travel

Dear John Smith,

Thank you for contacting Nare Travel!

We have received your inquiry about "Tour Booking - 
Garni & Geghard Temple" and our team will respond 
within 24 hours.

Inquiry Reference: #12345
Submitted: Nov 5, 2025 at 9:58 PM

If you have any urgent questions, please call us at:
+374-10-545046

Best regards,
Nare Travel Team
91 Teryan St, Yerevan, Armenia
www.naretravel.com
```

---

## ✅ Success Criteria

1. ✅ All translation keys working properly
2. ✅ Each button opens appropriate form
3. ✅ Forms submit to database successfully
4. ✅ Admin can view all inquiries
5. ✅ Admin can filter/search/manage inquiries
6. ✅ Email notifications sent on submission
7. ✅ Email configuration in Super Admin panel
8. ✅ Office 365 integration working
9. ✅ Auto-reply to customers working

---

## 🚀 Ready to Implement!

Starting with Phase 1...
