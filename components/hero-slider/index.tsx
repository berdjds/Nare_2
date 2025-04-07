"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useImages } from "@/hooks/use-images";
import { useLanguage } from "@/hooks/use-language";

interface Destination {
  id: number;
  key: string;
  backgroundImage: string;
  cardImage: string;
}

export function HeroSlider() {
  const { images } = useImages();
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const destinations: Destination[] = React.useMemo(() => [
    {
      id: 1,
      key: "sharm",
      backgroundImage: images.heroNoravank,
      cardImage: images.tourNoravank,
    },
    {
      id: 2,
      key: "dubai",
      backgroundImage: images.heroGarni,
      cardImage: images.tourGarni,
    },
    {
      id: 3,
      key: "tunisia",
      backgroundImage: images.heroSevan,
      cardImage: images.tourSevan,
    },
    {
      id: 4,
      key: "cyprus",
      backgroundImage: images.heroNoravank,
      cardImage: images.tourNoravank,
    },
    {
      id: 5,
      key: "abudhabi",
      backgroundImage: images.heroGarni,
      cardImage: images.tourGarni,
    },
    {
      id: 6,
      key: "zanzibar",
      backgroundImage: images.heroSevan,
      cardImage: images.tourSevan,
    },
  ], [images]);

  // Auto-slide functionality
  React.useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % destinations.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [destinations.length]);

  const handlePrevSlide = React.useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  }, [destinations.length]);

  const handleNextSlide = React.useCallback(() => {
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

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
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
            backgroundImage: `url(${destinations[currentIndex].backgroundImage})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content Section */}
      <div className="relative z-10 flex h-full">
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

          {/* Side Counter */}
          <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -rotate-90 origin-center transform text-sm font-medium tracking-wider whitespace-nowrap">
            <span className="text-white/80">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-white/40 mx-1">/</span>
            <span className="text-white/40">{String(destinations.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid h-full w-full grid-cols-1 lg:grid-cols-[1fr,400px] px-8 lg:px-16">
          {/* Text Area */}
          <div className="flex flex-col justify-center space-y-6 lg:ml-16">
            <motion.h1
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter"
            >
              {t(`home.destinations.${destinations[currentIndex].key}.title`)}
            </motion.h1>
            <motion.p
              key={`description-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-lg text-white/80 max-w-2xl"
            >
              {t(`home.destinations.${destinations[currentIndex].key}.description`)}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button className="group flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-300">
                <span>Explore</span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>

          {/* Carousel Section */}
          <div className="relative flex items-center justify-end">
            <div className="relative w-[1000px] h-[450px]">
              {[0, 1, 2].map((offset) => {
                const index = (currentIndex + offset) % destinations.length;
                
                return (
                  <motion.div
                    key={`slide-${index}`}
                    className="absolute w-[250px] h-[390px] rounded-[6px] overflow-hidden shadow-2xl"
                    style={{ 
                      originX: 0.5,
                      originY: 0.5,
                    }}
                    animate={{
                      x: offset === 0 ? 0 : offset === 1 ? 260 : 520,
                      opacity: 1,
                      zIndex: 1,
                      scale: 1,
                    }}
                    exit={{
                      x: -100,
                      opacity: 0,
                      scale: 0.95,
                      transition: { 
                        duration: 0.5,
                        ease: [0.32, 0.72, 0, 1]
                      }
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.32, 0.72, 0, 1]
                    }}
                  >
                    <div className="relative w-full h-full group cursor-pointer">
                      <img
                        src={destinations[index].cardImage}
                        alt={t(`home.destinations.${destinations[index].key}.title`)}
                        className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
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
                        className="absolute bottom-0 left-0 right-0 p-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-white/60" />
                          ))}
                        </div>
                        <h3 className="text-white text-sm font-medium tracking-wide">
                          {t(`home.destinations.${destinations[index].key}.title`)}
                        </h3>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Exiting Card */}
              <AnimatePresence mode="wait">
                {direction === 1 && (
                  <motion.div
                    key="exit-card"
                    className="absolute w-[250px] h-[390px] rounded-[6px] overflow-hidden shadow-2xl"
                    initial={{ x: 0, opacity: 1, scale: 1 }}
                    animate={{ 
                      x: -100,
                      opacity: 0,
                      scale: 0.95,
                      transition: { 
                        duration: 0.5,
                        ease: [0.32, 0.72, 0, 1]
                      }
                    }}
                    style={{
                      zIndex: 0
                    }}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={destinations[(currentIndex - 1 + destinations.length) % destinations.length].cardImage}
                        alt={t(`home.destinations.${destinations[(currentIndex - 1 + destinations.length) % destinations.length].key}.title`)}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Navigation Buttons */}
            <div className="absolute left-[300px] bottom-20 flex space-x-4">
              <button
                onClick={() => {
                  setDirection(-1);
                  setCurrentIndex((prev) => (prev === 0 ? destinations.length - 1 : prev - 1));
                }}
                className="group h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
              </button>
              <button
                onClick={() => {
                  setDirection(1);
                  setCurrentIndex((prev) => (prev === destinations.length - 1 ? 0 : prev + 1));
                }}
                className="group h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
