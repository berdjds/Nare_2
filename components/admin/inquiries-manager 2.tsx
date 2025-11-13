"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, Mail, Phone, Calendar, MessageSquare, Trash2, Eye, Edit,
  CheckCircle, Clock, AlertCircle, XCircle, Filter, RefreshCw
} from 'lucide-react';
import { 
  Inquiry, 
  InquiryStatus, 
  InquiryType,
  getInquiryTypeDisplay,
  getStatusColor,
  getPriorityColor
} from '@/lib/inquiries';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function InquiriesManager() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [searchQuery, statusFilter, typeFilter, inquiries]);

  const loadInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries');
      const data = await response.json();
      
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterInquiries = () => {
    let filtered = [...inquiries];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inq =>
        inq.name.toLowerCase().includes(query) ||
        inq.email.toLowerCase().includes(query) ||
        inq.message.toLowerCase().includes(query) ||
        (inq.subject && inq.subject.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inq => inq.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(inq => inq.type === typeFilter);
    }

    setFilteredInquiries(filtered);
  };

  const handleViewDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.adminNotes || '');
    setIsDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (inquiryId: string, newStatus: InquiryStatus) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setInquiries(inquiries.map(inq => 
          inq.id === inquiryId ? data.inquiry : inq
        ));
        
        toast({
          title: "✅ Success",
          description: "Status updated successfully",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;

    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });

      const data = await response.json();
      
      if (data.success) {
        setInquiries(inquiries.map(inq => 
          inq.id === selectedInquiry.id ? data.inquiry : inq
        ));
        setSelectedInquiry(data.inquiry);
        
        toast({
          title: "✅ Success",
          description: "Notes saved successfully",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setInquiries(inquiries.filter(inq => inq.id !== inquiryId));
        setIsDetailDialogOpen(false);
        
        toast({
          title: "✅ Success",
          description: "Inquiry deleted successfully",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: InquiryStatus) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'responded': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadgeVariant = (status: InquiryStatus) => {
    switch (status) {
      case 'new': return 'default';
      case 'in_progress': return 'secondary';
      case 'responded': return 'outline';
      case 'closed': return 'outline';
      default: return 'default';
    }
  };

  const newCount = inquiries.filter(inq => inq.status === 'new').length;

  if (loading) {
    return <div className="text-center py-8">Loading inquiries...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Inquiries & Bookings
            <Badge variant="secondary" className="text-sm">
              {inquiries.length} Total
            </Badge>
            {newCount > 0 && (
              <Badge className="text-sm bg-blue-600">
                {newCount} New
              </Badge>
            )}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Manage customer inquiries and booking requests
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={loadInquiries}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">🔵 New</SelectItem>
                <SelectItem value="in_progress">🟡 In Progress</SelectItem>
                <SelectItem value="responded">🟢 Responded</SelectItem>
                <SelectItem value="closed">⚪ Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tour_booking">Tour Booking</SelectItem>
                <SelectItem value="package_booking">Package Booking</SelectItem>
                <SelectItem value="air_ticket">Air Ticket</SelectItem>
                <SelectItem value="visa_assistance">Visa Assistance</SelectItem>
                <SelectItem value="dmc_partnership">DMC Partnership</SelectItem>
                <SelectItem value="mice_event">MICE Event</SelectItem>
                <SelectItem value="general_contact">General Contact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No inquiries found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Inquiries will appear here when customers submit booking requests'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredInquiries.map((inquiry) => (
            <Card 
              key={inquiry.id} 
              className={`transition-all duration-200 hover:shadow-md ${
                inquiry.status === 'new' ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getStatusBadgeVariant(inquiry.status)} className="gap-1">
                        {getStatusIcon(inquiry.status)}
                        {inquiry.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium text-gray-600">
                        {getInquiryTypeDisplay(inquiry.type)}
                      </span>
                      {inquiry.tourTitle && (
                        <span className="text-sm text-blue-600">• {inquiry.tourTitle}</span>
                      )}
                      {inquiry.packageTitle && (
                        <span className="text-sm text-blue-600">• {inquiry.packageTitle}</span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{inquiry.name}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {inquiry.email}
                      </span>
                      {inquiry.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {inquiry.phone}
                        </span>
                      )}
                      {inquiry.preferredDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(inquiry.preferredDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 line-clamp-2 mb-2">{inquiry.message}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}</span>
                      {inquiry.respondedAt && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">
                            Responded {formatDistanceToNow(new Date(inquiry.respondedAt), { addSuffix: true })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(inquiry)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>

                    {inquiry.status === 'new' && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(inquiry.id, 'in_progress')}
                      >
                        Start
                      </Button>
                    )}

                    {inquiry.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUpdateStatus(inquiry.id, 'responded')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Done
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      {selectedInquiry && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Inquiry Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Status & Type */}
              <div className="flex items-center gap-3">
                <Badge variant={getStatusBadgeVariant(selectedInquiry.status)} className="gap-1">
                  {getStatusIcon(selectedInquiry.status)}
                  {selectedInquiry.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="font-medium">{getInquiryTypeDisplay(selectedInquiry.type)}</span>
                {selectedInquiry.tourTitle && (
                  <Badge variant="outline">{selectedInquiry.tourTitle}</Badge>
                )}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Name</Label>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="font-medium">{selectedInquiry.email}</p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <p className="font-medium">{selectedInquiry.phone}</p>
                  </div>
                )}
                {selectedInquiry.preferredDate && (
                  <div>
                    <Label className="text-xs text-gray-500">Preferred Date</Label>
                    <p className="font-medium">
                      {new Date(selectedInquiry.preferredDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedInquiry.numberOfPeople && (
                  <div>
                    <Label className="text-xs text-gray-500">Number of People</Label>
                    <p className="font-medium">{selectedInquiry.numberOfPeople}</p>
                  </div>
                )}
              </div>

              {/* Subject */}
              {selectedInquiry.subject && (
                <div>
                  <Label className="text-xs text-gray-500">Subject</Label>
                  <p className="font-medium">{selectedInquiry.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <Label className="text-xs text-gray-500">Message</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this inquiry..."
                  rows={4}
                  className="w-full"
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" onClick={handleSaveNotes}>
                    Save Notes
                  </Button>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-500">Created</Label>
                  <p>{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                </div>
                {selectedInquiry.respondedAt && (
                  <div>
                    <Label className="text-xs text-gray-500">Responded</Label>
                    <p>{new Date(selectedInquiry.respondedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedInquiry.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Inquiry
                </Button>

                <div className="flex gap-2">
                  {selectedInquiry.status === 'new' && (
                    <Button onClick={() => handleUpdateStatus(selectedInquiry.id, 'in_progress')}>
                      Start Working
                    </Button>
                  )}
                  {selectedInquiry.status === 'in_progress' && (
                    <Button onClick={() => handleUpdateStatus(selectedInquiry.id, 'responded')}>
                      Mark as Responded
                    </Button>
                  )}
                  {selectedInquiry.status === 'responded' && (
                    <Button variant="secondary" onClick={() => handleUpdateStatus(selectedInquiry.id, 'closed')}>
                      Close Inquiry
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
