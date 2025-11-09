"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useImages } from "@/hooks/use-images";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/lib/localization-helper";

interface Destination {
  id: number | string;
  key?: string;
  title?: string;
  description?: string;
  backgroundImage: string;
  cardImage: string;
  order?: number;
  // CTA Buttons
  button1Text?: string;
  button1TextHy?: string;
  button1TextRu?: string;
  button1TextAr?: string;
  button1Link?: string;
  button1Enabled?: boolean;
  button2Text?: string;
  button2TextHy?: string;
  button2TextRu?: string;
  button2TextAr?: string;
  button2Link?: string;
  button2Enabled?: boolean;
}

export function HeroSlider() {
  const { images } = useImages();
  const { t, currentLanguage } = useLanguage();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const [destinations, setDestinations] = React.useState<Destination[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch hero slides from admin API
  React.useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/content/heroSlides');
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // Filter only active slides and sort by order
          const activeSlides = data
            .filter((slide: any) => slide.isActive !== false)
            .sort((a, b) => a.order - b.order);
          
          if (activeSlides.length > 0) {
            setDestinations(activeSlides);
          } else {
            // Fallback if no active slides
            setDestinations(data.sort((a, b) => a.order - b.order));
          }
        } else {
          // Fallback to default data if no admin data
          setDestinations([
            {
              id: 1,
              key: "sharm",
              title: "Sharm El Sheikh",
              description: "Beautiful beaches and crystal clear water",
              backgroundImage: images.heroNoravank,
              cardImage: images.tourNoravank,
              order: 0,
            },
            {
              id: 2,
              key: "dubai",
              title: "Dubai",
              description: "Modern architecture and luxury",
              backgroundImage: images.heroGarni,
              cardImage: images.tourGarni,
              order: 1,
            },
            {
              id: 3,
              key: "tunisia",
              title: "Tunisia",
              description: "Rich history and culture",
              backgroundImage: images.heroSevan,
              cardImage: images.tourSevan,
              order: 2,
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);
        // Use fallback data on error
        setDestinations([
          {
            id: 1,
            key: "sharm",
            title: "Sharm El Sheikh",
            description: "Beautiful beaches",
            backgroundImage: images.heroNoravank,
            cardImage: images.tourNoravank,
            order: 0,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [images]);

  // Auto-slide functionality
  React.useEffect(() => {
    if (destinations.length === 0) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % destinations.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [destinations.length]);

  const handlePrevSlide = React.useCallback(() => {
    if (destinations.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  }, [destinations.length]);

  const handleNextSlide = React.useCallback(() => {
    if (destinations.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % destinations.length);
  }, [destinations.length]);

  const slideVariants = {
    enter: () => ({
      opacity: 0,
      filter: "blur(12px)",
      scale: 1.1,
    }),
    center: {
      zIndex: 1,
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
    },
    exit: () => ({
      zIndex: 0,
      opacity: 0,
      filter: "blur(12px)",
      scale: 0.9,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prevIndex) => (prevIndex + newDirection + destinations.length) % destinations.length
    );
  };

  if (loading) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  if (destinations.length === 0) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">No hero slides configured</h2>
          <p className="text-gray-400">Please add slides in the admin panel</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Section */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 1.2 },
            filter: { duration: 1.2 },
            scale: { duration: 1.5, ease: "easeInOut" }
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: destinations[currentIndex].backgroundImage ? `url(${destinations[currentIndex].backgroundImage})` : 'none',
          }}
        />

      </AnimatePresence>

      {/* Content Section */}
      <div className="relative z-10 flex min-h-screen items-center">
        {/* Left Navigation Line */}
        <div className="absolute left-8 h-full flex flex-col items-center">
          {/* Vertical Line */}
          <div className="absolute h-[50%] top-[25%] w-[1px] bg-white/20" />
          
          {/* Progress Bar */}
          <div className="absolute top-1/2 -translate-y-1/2 flex flex-col space-y-8">
            {destinations.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  const newDirection = index > currentIndex ? 1 : -1;
                  setDirection(newDirection);
                  setCurrentIndex(index);
                }}
                className="relative group z-10 flex items-center justify-center w-6 h-6"
              >
                <motion.div
                  initial={false}
                  animate={{
                    width: index === currentIndex ? 24 : 6,
                    height: index === currentIndex ? 24 : 6,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative flex items-center justify-center"
                >
                  <div className={`rounded-full ${
                    index === currentIndex 
                      ? "bg-white w-full h-full flex items-center justify-center text-[10px] font-medium" 
                      : "bg-white/40 w-full h-full group-hover:bg-white/60"
                  } transition-colors duration-300`}>
                    {index === currentIndex && String(index + 1).padStart(2, '0')}
                  </div>
                  {index === currentIndex && (
                    <div className="absolute -inset-0.5 border border-white/20 rounded-full" />
                  )}
                </motion.div>
              </motion.button>
            ))}
          </div>

          {/* Side Counter - Mirrored for RTL */}
          <div className={`absolute top-[80%] ${currentLanguage === 'ar' ? 'right-1/2 translate-x-1/2 rotate-90' : 'left-1/2 -translate-x-1/2 -rotate-90'} origin-center transform text-sm font-medium tracking-wider whitespace-nowrap`}>
            <span className="text-white/80">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-white/40 mx-1">/</span>
            <span className="text-white/40">{String(destinations.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className={`grid w-full grid-cols-1 ${currentLanguage === 'ar' ? 'lg:grid-cols-[40%,60%]' : 'lg:grid-cols-[60%,40%]'} gap-0 px-8 lg:px-16 py-20`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          {/* Text Area with Gradient Background */}
          <div className={`flex flex-col justify-center space-y-6 relative ${currentLanguage === 'ar' ? 'lg:order-2' : 'lg:order-1'}`}>
            {/* Gradient Background for Text Area */}
            <div className={`absolute inset-0 ${currentLanguage === 'ar' ? '-right-8 left-0' : '-left-8 right-0'} bg-gradient-to-${currentLanguage === 'ar' ? 'l' : 'r'} from-black/60 via-black/40 to-transparent rounded-2xl backdrop-blur-sm`} />
            
            <div className={`relative z-10 p-8 ${currentLanguage === 'ar' ? 'text-right' : ''}`}>
              <motion.h1
                key={`title-${currentIndex}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg"
              >
                {getLocalizedField(destinations[currentIndex], 'title', currentLanguage) || 
                  (destinations[currentIndex].key ? t(`home.destinations.${destinations[currentIndex].key}.title`) : 'Destination')}
              </motion.h1>
              <motion.p
                key={`description-${currentIndex}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="text-lg md:text-xl text-white/90 drop-shadow-md mt-6 leading-relaxed"
              >
                {getLocalizedField(destinations[currentIndex], 'description', currentLanguage) || 
                  (destinations[currentIndex].key ? t(`home.destinations.${destinations[currentIndex].key}.description`) : '')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap gap-4 mt-6"
              >
                {/* Primary Button */}
                {(destinations[currentIndex].button1Enabled !== false) && (destinations[currentIndex].button1Text || destinations[currentIndex].button1Link) && (
                  <Link 
                    href={destinations[currentIndex].button1Link || '#'}
                    className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <span>{getLocalizedField(destinations[currentIndex], 'button1Text', currentLanguage) || 'View All Tours'}</span>
                    <ChevronRight className={`w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 ${currentLanguage === 'ar' ? 'rotate-180' : ''}`} />
                  </Link>
                )}
                
                {/* Secondary Button */}
                {(destinations[currentIndex].button2Enabled !== false) && (destinations[currentIndex].button2Text || destinations[currentIndex].button2Link) && (
                  <Link 
                    href={destinations[currentIndex].button2Link || '#'}
                    className="group flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <span>{getLocalizedField(destinations[currentIndex], 'button2Text', currentLanguage) || 'Contact Us'}</span>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>

          {/* Carousel Section */}
          <div className={`relative flex items-center ${currentLanguage === 'ar' ? 'lg:order-1 justify-start' : 'lg:order-2 justify-center'}`}>
            <div className="relative w-full h-[450px] overflow-visible">
              <AnimatePresence initial={false}>
                {[0, 1, 2].map((offset) => {
                  const index = (currentIndex + offset) % destinations.length;
                  const isRTL = currentLanguage === 'ar';
                  
                  // Thumbnails within 40% column, equal spacing
                  // Card width: 250px, gap: 15px between cards
                  const positions = [0, 265, 530];
                  
                  return (
                    <motion.div
                      key={`${index}`}
                      className={`absolute w-[250px] h-[390px] rounded-[6px] overflow-hidden shadow-2xl ${offset === 0 ? 'ring-2 ring-white/30' : ''}`}
                      initial={{
                        // New card enters from RIGHT
                        x: isRTL ? -265 : 800,
                        opacity: 0,
                        scale: 0.95,
                      }}
                      animate={{
                        x: isRTL ? positions[2 - offset] : positions[offset],
                        opacity: 1,
                        scale: offset === 0 ? 1.05 : 1,
                        zIndex: offset === 0 ? 20 : 10,
                      }}
                      exit={{
                        // First card exits to LEFT with fade
                        x: isRTL ? 800 : -265,
                        opacity: 0,
                        scale: 0.9,
                        transition: { 
                          duration: 0.7,
                          ease: [0.43, 0.13, 0.23, 0.96]
                        }
                      }}
                      transition={{
                        duration: 0.7,
                        ease: [0.43, 0.13, 0.23, 0.96],
                      }}
                    >
                    <div className="relative w-full h-full group cursor-pointer">
                      {destinations[index].cardImage && (
                        <Image
                          src={destinations[index].cardImage}
                          alt={destinations[index].title || t(`home.destinations.${destinations[index].key}.title`)}
                          fill
                          sizes="250px"
                          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                          priority={index === 0}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <button 
                          className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="w-3.5 h-3.5 border-[1.5px] border-white rounded"
                          />
                        </button>
                      </div>
                      <motion.div 
                        className={`absolute bottom-0 left-0 right-0 p-3 ${currentLanguage === 'ar' ? 'text-right' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className={`flex items-center gap-1 mb-1 ${currentLanguage === 'ar' ? 'justify-end' : ''}`}>
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-white/60" />
                          ))}
                        </div>
                        <h3 className="text-white text-sm font-medium tracking-wide">
                          {getLocalizedField(destinations[index], 'title', currentLanguage) || 
                            (destinations[index].key ? t(`home.destinations.${destinations[index].key}.title`) : '')}
                        </h3>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            
              {/* Navigation Buttons - Positioned properly for LTR/RTL */}
              <div className={`absolute ${currentLanguage === 'ar' ? 'left-0' : 'left-[403px]'} flex gap-4 z-40`} style={{ top: 'calc(390px + 15px)' }}>
                <button
                  onClick={() => {
                    setDirection(-1);
                    setCurrentIndex((prev) => (prev === 0 ? destinations.length - 1 : prev - 1));
                  }}
                  className="h-12 w-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
                >
                  {currentLanguage === 'ar' ? <ChevronRight className="w-6 h-6 text-white/80" /> : <ChevronLeft className="w-6 h-6 text-white/80" />}
                </button>
                <button
                  onClick={() => {
                    setDirection(1);
                    setCurrentIndex((prev) => (prev === destinations.length - 1 ? 0 : prev + 1));
                  }}
                  className="h-12 w-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
                >
                  {currentLanguage === 'ar' ? <ChevronLeft className="w-6 h-6 text-white/80" /> : <ChevronRight className="w-6 h-6 text-white/80" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
