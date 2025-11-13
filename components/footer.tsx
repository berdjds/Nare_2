"use client";

import { useState, useEffect } from 'react';
import {
  Building2 as Building,
  CalendarDays as Calendar,
  Users2 as Users,
  Car,
  UtensilsCrossed as Utensils,
  Plane,
  Map,
  Navigation,
  Palmtree,
  Luggage,
  Anchor,
  Globe,
  Mountain,
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  ChevronRight,
  Wine,
  Twitter,
  Youtube,
  Music,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { getLocalizedAddress } from '@/lib/localization-helper';

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const defaultSocialLinks = [
  { Icon: Facebook, href: 'https://www.facebook.com/Nare.travel.and.tours/', color: '#1877f2', label: 'Facebook' },
  { Icon: Instagram, href: 'https://www.instagram.com/nare_travel/', color: '#e4405f', label: 'Instagram' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/company/105172290/', color: '#0A66C2', label: 'LinkedIn' }
];

const tourTypes = [
  { icon: Globe, label: 'Cultural Tours', href: '/armenia-tours/cultural' },
  { icon: Wine, label: 'Wine Tours', href: '/armenia-tours/wine' },
  { icon: Mountain, label: 'Adventure Tours', href: '/armenia-tours/adventure' },
  { icon: Building, label: 'City Tours', href: '/armenia-tours/daily' }
];

const services = [
  { icon: Calendar, label: 'Tour Planning', href: '/services' },
  { icon: Users, label: 'Group Tours', href: '/services/outgoing-packages' },
  { icon: Car, label: 'Transportation', href: '/services/transport' },
  { icon: Utensils, label: 'Food Tours', href: '/services/visa-assistance' }
];

const FooterColumn = ({ title, children }: { title: string | JSX.Element; children: React.ReactNode }) => (
  <motion.div
    variants={listVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="space-y-6"
  >
    <motion.div className="relative inline-block">
      {title}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "2rem" }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
      />
    </motion.div>
    {children}
  </motion.div>
);

const FooterTitle = ({ children }: { children: React.ReactNode }) => (
  <motion.span 
    className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] text-xl font-semibold"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.span>
);

export function Footer() {
  const { t, currentLanguage } = useLanguage();
  const [contactInfo, setContactInfo] = useState({
    phone: '+374 XX XXX XXX',
    email: 'info@naretravel.com',
    address: 'Yerevan, Armenia',
    addressHy: undefined as string | undefined,
    addressRu: undefined as string | undefined,
    addressUrl: undefined as string | undefined,
  });
  
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);

  useEffect(() => {
    // Fetch contact info
    fetch('/api/content/contactInfo')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setContactInfo(data);
        }
      })
      .catch(err => console.error('Failed to fetch contact info:', err));

    // Fetch social links
    fetch('/api/content/socialLinks')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          const links = [];
          if (data.facebook) links.push({ Icon: Facebook, href: data.facebook, color: '#1877f2', label: 'Facebook' });
          if (data.instagram) links.push({ Icon: Instagram, href: data.instagram, color: '#e4405f', label: 'Instagram' });
          if (data.twitter) links.push({ Icon: Twitter, href: data.twitter, color: '#1da1f2', label: 'Twitter' });
          if (data.linkedin) links.push({ Icon: Linkedin, href: data.linkedin, color: '#0A66C2', label: 'LinkedIn' });
          if (data.youtube) links.push({ Icon: Youtube, href: data.youtube, color: '#ff0000', label: 'YouTube' });
          if (data.tiktok) links.push({ Icon: Music, href: data.tiktok, color: '#000000', label: 'TikTok' });
          if (data.tripadvisor) links.push({ Icon: Star, href: data.tripadvisor, color: '#34e0a1', label: 'TripAdvisor' });
          if (links.length > 0) setSocialLinks(links);
        }
      })
      .catch(err => console.error('Failed to fetch social links:', err));
  }, []);

  return (
    <footer className="relative bg-[#1A1B1E] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-radial from-[#1A1B1E] via-[#1F2937] to-[#111827]" />
        
        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <motion.div 
            className="absolute top-[10%] left-[15%] text-white/5"
            animate={{ 
              y: [-20, 0, -20],
              opacity: [0.02, 0.04, 0.02]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Plane className="w-12 h-12 rotate-45" />
          </motion.div>

          <motion.div 
            className="absolute top-[30%] right-[20%] text-white/5"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.02, 0.04, 0.02]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Anchor className="w-10 h-10" />
          </motion.div>

          <motion.div 
            className="absolute bottom-[20%] left-[25%] text-white/5"
            animate={{ 
              y: [-15, 5, -15],
              opacity: [0.02, 0.04, 0.02]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Globe className="w-14 h-14" />
          </motion.div>

          <motion.div 
            className="absolute top-[60%] right-[30%] text-white/5"
            animate={{ 
              y: [5, -15, 5],
              opacity: [0.02, 0.04, 0.02]
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Navigation className="w-12 h-12" />
          </motion.div>

          <motion.div 
            className="absolute bottom-[40%] left-[40%] text-white/5"
            animate={{ 
              y: [-10, 10, -10],
              opacity: [0.02, 0.04, 0.02]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Map className="w-10 h-10" />
          </motion.div>

          <motion.div 
            className="absolute top-[40%] left-[20%] text-white/5"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.02, 0.04, 0.02]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Palmtree className="w-12 h-12" />
          </motion.div>

          <motion.div 
            className="absolute bottom-[30%] right-[25%] text-white/5"
            animate={{ 
              y: [-15, 5, -15],
              opacity: [0.02, 0.04, 0.02]
            }}
            transition={{
              duration: 9.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Luggage className="w-10 h-10" />
          </motion.div>

          <motion.div 
            className="absolute top-[25%] left-[35%] text-white/5"
            animate={{ 
              y: [-12, 8, -12],
              opacity: [0.02, 0.04, 0.02]
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Mountain className="w-12 h-12" />
          </motion.div>
        </div>

        {/* Animated color layers */}
        <div className="absolute inset-0">
          {/* Elegant moving gradients */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 animate-gradient-x" />
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-violet-500/10 to-pink-500/10 animate-gradient-y" />
          </div>
          
          {/* Subtle floating orbs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full filter blur-[80px] animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-purple-500/5 to-transparent rounded-full filter blur-[60px] animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-orange-500/5 to-transparent rounded-full filter blur-[70px] mix-blend-soft-light animate-pulse-slow" />
        </div>

        {/* Noise texture overlay - CSS generated pattern */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-soft-light" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }} 
        />
        
        {/* Glass effect overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <FooterColumn title={<FooterTitle>Nare Travel</FooterTitle>}>
            <motion.p 
              variants={itemVariants}
              className="text-gray-300 leading-relaxed"
            >
              Discover Armenia&apos;s hidden treasures with our expertly curated tours. 
              Let us guide you through an unforgettable journey of culture, history, and adventure.
            </motion.p>
            
            <motion.div 
              variants={listVariants}
              className="flex space-x-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -2,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="social-icon-wrapper group"
                >
                  <div className="social-icon-inner" style={{ '--hover-color': social.color } as any}>
                    <social.Icon className="w-5 h-5" />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </FooterColumn>

          {/* Tour Types */}
          <FooterColumn title={<FooterTitle>Tour Types</FooterTitle>}>
            <motion.div 
              variants={listVariants}
              className="space-y-3"
            >
              {tourTypes.map((tour) => (
                <motion.a
                  key={tour.label}
                  href={tour.href}
                  variants={itemVariants}
                  className="quick-link-item group"
                  whileHover={{ 
                    x: 5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  <tour.icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="ml-2 flex-grow">{tour.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </motion.a>
              ))}
            </motion.div>
          </FooterColumn>

          {/* Services */}
          <FooterColumn title={<FooterTitle>Our Services</FooterTitle>}>
            <motion.div 
              variants={listVariants}
              className="space-y-3"
            >
              {services.map((service) => (
                <motion.a
                  key={service.label}
                  href={service.href}
                  variants={itemVariants}
                  className="quick-link-item group"
                  whileHover={{ 
                    x: 5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  <service.icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="ml-2 flex-grow">{service.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </motion.a>
              ))}
            </motion.div>
          </FooterColumn>

          {/* Contact Info */}
          <FooterColumn title={<FooterTitle>Contact Us</FooterTitle>}>
            <motion.div 
              variants={listVariants}
              className="space-y-1"
            >
              {[
                { 
                  Icon: Map, 
                  text: getLocalizedAddress(contactInfo, currentLanguage),
                  href: contactInfo.addressUrl
                },
                {
                  Icon: Phone,
                  text: contactInfo.phone || '+374 XX XXX XXX',
                  href: contactInfo.phone ? `tel:${contactInfo.phone.replace(/\s/g, '')}` : undefined
                },
                { Icon: Mail, text: contactInfo.email || 'info@naretravel.com', href: contactInfo.email ? `mailto:${contactInfo.email}` : undefined }
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="contact-item group"
                  whileHover={{ 
                    x: 5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  <div className="contact-icon-wrapper">
                    <contact.Icon className="w-5 h-5" />
                  </div>
                  {contact.href ? (
                    <a 
                      href={contact.href} 
                      className="hover:text-blue-400 transition-colors"
                      target={contact.Icon === Map ? "_blank" : undefined}
                      rel={contact.Icon === Map ? "noopener noreferrer" : undefined}
                    >
                      <span>{contact.text}</span>
                    </a>
                  ) : (
                    <span>{contact.text}</span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </FooterColumn>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-800/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-500"
            >
              {new Date().getFullYear()} Nare Travel. All rights reserved.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex space-x-6"
            >
              <a href="/privacy" className="text-gray-500 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-500 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}