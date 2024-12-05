"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useImages } from "@/hooks/use-images";

interface Destination {
  id: number;
  title: string;
  description: string;
  backgroundImage: string;
  cardImage: string;
}

export function HeroSlider() {
  const { images } = useImages();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const destinations: Destination[] = React.useMemo(() => [
    {
      id: 1,
      title: "NORAVANK",
      description:
        "Discover the 13th-century Noravank monastery, a masterpiece of medieval Armenian architecture nestled in a narrow gorge. Marvel at its stunning red cliffs and intricate stone carvings that tell stories of Armenia's rich spiritual heritage.",
      backgroundImage: images.heroNoravank,
      cardImage: images.tourNoravank,
    },
    {
      id: 2,
      title: "GARNI TEMPLE",
      description:
        "Experience the only standing Greco-Roman colonnaded building in Armenia, the Temple of Garni. Built in the 1st century AD, this pagan temple stands as a symbol of Armenia's classical heritage, offering breathtaking views of the Azat River Gorge.",
      backgroundImage: images.heroGarni,
      cardImage: images.tourGarni,
    },
    {
      id: 3,
      title: "LAKE SEVAN",
      description:
        "Explore the jewel of Armenia's natural beauty, Lake Sevan. This stunning alpine lake, one of the largest freshwater high-altitude lakes in the world, is surrounded by ancient monasteries and offers spectacular views of the Armenian highlands.",
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
            opacity: { duration: 0.8 },
            filter: { duration: 0.8 },
            scale: { duration: 0.8 }
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${destinations[currentIndex].backgroundImage})`,
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-black/40"
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(0px)" }}
            exit={{ backdropFilter: "blur(4px)" }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content Section */}
      <div className="relative z-10 flex h-full">
        {/* Left Progress Bar */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col space-y-6">
          {destinations.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                const newDirection = index > currentIndex ? 1 : -1;
                setDirection(newDirection);
                setCurrentIndex(index);
              }}
              className={`h-12 w-12 rounded-full border-2 relative ${
                index === currentIndex ? "border-white bg-white/30" : "border-white/50 hover:border-white/80"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              <span className="absolute left-16 top-1/2 -translate-y-1/2 text-white/80 text-xs">
                {String(index + 1).padStart(2, '0')}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2 px-8 lg:px-16">
          {/* Text Area */}
          <div className="flex flex-col justify-center space-y-6 lg:ml-24">
            <motion.h1
              key={destinations[currentIndex].title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold text-white lg:text-8xl"
            >
              {destinations[currentIndex].title}
            </motion.h1>
            <motion.p
              key={destinations[currentIndex].description}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-lg text-white/80 leading-relaxed max-w-xl"
            >
              {destinations[currentIndex].description}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="w-fit rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors duration-300"
            >
              Explore
              <ChevronRight className="ml-2 inline h-5 w-5" />
            </motion.button>
          </div>

          {/* Carousel Section */}
          <div className="relative flex items-center justify-center">
            {[-1, 0, 1].map((offset) => {
              const index =
                (currentIndex + offset + destinations.length) % destinations.length;
              return (
                <motion.div
                  key={index}
                  className="absolute w-64 h-96 bg-gray-800 rounded-xl overflow-hidden"
                  animate={{
                    scale: offset === 0 ? 1 : 0.8,
                    opacity: offset === 0 ? 1 : 0.5,
                    zIndex: offset === 0 ? 2 : 1,
                    x: offset * 200,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={destinations[index].cardImage}
                    alt={destinations[index].title}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
