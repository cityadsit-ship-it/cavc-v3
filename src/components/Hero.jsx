import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import BackToTop from './BackToTop';
import MessageMe from './MessageMe';
import { useState, useEffect } from 'react';

// Use local images from public/images/hero/1.jpg to X.jpg
// Update the length parameter to match your actual number of images
const bgImages = Array.from({ length: 11 }, (_, i) => `/images/hero/${i + 1}.jpg`);

const Hero = () => {
  const [bgIndex, setBgIndex] = useState(0);

  // Preload all images on mount
  useEffect(() => {
    bgImages.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setBgIndex((prev) => (prev - 1 + bgImages.length) % bgImages.length);
  };

  const handleNext = () => {
    setBgIndex((prev) => (prev + 1) % bgImages.length);
  };

  const handleDotClick = (index) => {
    if (index !== bgIndex) {
      setBgIndex(index);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64; // Height of navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <div id="hero" className="relative w-full h-[80vh] overflow-hidden">
        {/* Sliding Background Images */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={bgImages[bgIndex]}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}
            />
          </AnimatePresence>
        </div>
        {/* Gradient overlay for brand connection */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-accent-green to-lime-green opacity-30"></div>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        {/* Navbar */}
        <Navbar scrollToSection={scrollToSection} />
        {/* Hero Content */}
          <div className="relative z-30 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8 pt-16">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight italic tracking-tight"
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5), 0 0 4px rgba(0,0,0,0.3)' }}
              >
                We Move Your{' '}
                <span className="text-yellow-highlight font-extrabold italic">Brand</span>{' '} !
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl text-gray-200 mb-8"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                Scroll down to discover our services and solutions.
              </motion.p>
            </div>
          </div>

          {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white cursor-pointer"
            onClick={() => scrollToSection('services')}
          >
            <ArrowDown size={32} className="animate-bounce" />
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 group"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 group"
          aria-label="Next image"
        >
          <ChevronRight size={24} className="text-white" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {bgImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === bgIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      <BackToTop />
      <MessageMe scrollToSection={scrollToSection} />
    </>
  );
};

export default Hero;
