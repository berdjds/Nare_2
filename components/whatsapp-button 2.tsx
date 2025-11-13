"use client";

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

export function WhatsAppButton() {
  const { t } = useLanguage();
  
  // Replace with your actual WhatsApp number (international format)
  const phoneNumber = "37491005046"; // Example: 374-91-005046
  const message = t('home.whatsapp.message');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative">
        {/* Pulsing ring */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        
        {/* Main button */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            {t('home.whatsapp.tooltip')}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
