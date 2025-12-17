import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import BackToTop from './BackToTop';
import MessageMe from './MessageMe';
import { useState, useEffect, useRef } from 'react';

// Use local images from public/images/hero/1.jpg to X.jpg
// Update the length parameter to match your actual number of images
const bgImages = Array.from({ length: 11 }, (_, i) => `/images/hero/${i + 1}.jpg`);

const Hero = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const [prevBgIndex, setPrevBgIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [canTransition, setCanTransition] = useState(false);
  const imageCache = useRef({});

  // Preload and cache all images on mount
  useEffect(() => {
    const loadedStatus = {};

    bgImages.forEach((src, index) => {
      const img = new window.Image();
      img.src = src;
      imageCache.current[index] = img;
      
      img.onload = () => {
        loadedStatus[index] = true;
        
        // Update loaded status
        setImagesLoaded(prev => ({ ...prev, [index]: true }));
        
        // Once first image is loaded, allow transitions
        if (index === 0 && !firstImageLoaded) {
          setFirstImageLoaded(true);
          setCanTransition(true);
        }
      };
      
      img.onerror = () => {
        loadedStatus[index] = true;
        setImagesLoaded(prev => ({ ...prev, [index]: true }));
        
        if (index === 0 && !firstImageLoaded) {
          setFirstImageLoaded(true);
          setCanTransition(true);
        }
      };
    });
  }, [firstImageLoaded]);

  // Auto-transition with image readiness check
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (bgIndex + 1) % bgImages.length;
      // Only transition if next image is loaded
      if (imagesLoaded[nextIndex] && canTransition) {
        setPrevBgIndex(bgIndex);
        setBgIndex(nextIndex);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [bgIndex, imagesLoaded, canTransition]);

  const handlePrev = () => {
    const prevIndex = (bgIndex - 1 + bgImages.length) % bgImages.length;
    if (imagesLoaded[prevIndex]) {
      setPrevBgIndex(bgIndex);
      setBgIndex(prevIndex);
    }
  };

  const handleNext = () => {
    const nextIndex = (bgIndex + 1) % bgImages.length;
    if (imagesLoaded[nextIndex]) {
      setPrevBgIndex(bgIndex);
      setBgIndex(nextIndex);
    }
  };

  const handleDotClick = (index) => {
    if (index !== bgIndex && imagesLoaded[index]) {
      setPrevBgIndex(bgIndex);
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
      <div id="hero" className="relative w-full h-[75vh] sm:h-[85vh] lg:h-[80vh] overflow-hidden">
        {/* Sliding Background Images */}
        <div className="absolute inset-0 w-full h-full">
          {/* Previous image - stays underneath */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ 
              backgroundImage: `url(${bgImages[prevBgIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Current image - fades in on top */}
          <AnimatePresence mode="wait">
            <motion.div
              key={bgIndex}
              initial={{ opacity: firstImageLoaded ? 0 : 0, filter: !firstImageLoaded ? 'blur(10px)' : 'blur(0px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ 
                opacity: { duration: firstImageLoaded ? 0.8 : 1, ease: 'easeInOut' },
                filter: { duration: 0.8, ease: 'easeInOut' }
              }}
              className="absolute inset-0 w-full h-full"
              style={{ 
                backgroundImage: `url(${bgImages[bgIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
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
          <div className="relative z-30 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-16">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight italic tracking-tight"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.5)' }}
              >
                We Move Your{' '}
                <span className="text-yellow-highlight font-extrabold italic">Brand</span>{' '} !
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 px-2"
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
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
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white cursor-pointer"
            onClick={() => scrollToSection('services')}
          >
            <ArrowDown size={28} className="sm:w-8 sm:h-8 animate-bounce" />
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full p-2 sm:p-2.5 transition-all duration-300 group active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-white" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-full p-2 sm:p-2.5 transition-all duration-300 group active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-40 flex gap-1.5 sm:gap-2">
          {bgImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === bgIndex 
                  ? 'bg-white w-6 sm:w-8' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75 w-2'
              } ${!imagesLoaded[idx] ? 'opacity-30 cursor-not-allowed' : ''}`}
              aria-label={`Go to image ${idx + 1}`}
              disabled={!imagesLoaded[idx]}
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
