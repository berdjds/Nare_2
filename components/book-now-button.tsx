"use client";

import { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookNowButtonProps extends Partial<ButtonProps> {}

export function BookNowButton({ 
  variant = "default", 
  size = "default",
  className,
  ...props 
}: BookNowButtonProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {
      type: 'general_contact' as const,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string || 'Booking request',
      preferredDate: date ? date.toISOString().split('T')[0] : undefined,
      sourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      language: typeof window !== 'undefined' ? localStorage.getItem('language-storage') : 'en',
    };

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: t('booking.success.title'),
          description: t('booking.success.message'),
          duration: 5000,
        });
        setOpen(false);
        e.currentTarget.reset();
        setDate(undefined);
      } else {
        throw new Error(result.error || 'Failed to submit');
      }
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={className}
          {...props}
        >
          {t('cta.bookNow')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('booking.dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('booking.dialog.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('booking.form.name')}</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('booking.form.email')}</Label>
            <Input type="email" id="email" name="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{t('booking.form.message')}</Label>
            <Input id="message" name="message" placeholder="Any special requests?" />
          </div>
          <div className="space-y-2">
            <Label>{t('booking.form.date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : t('booking.form.pickDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" className="w-full">
            {t('booking.form.confirm')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}