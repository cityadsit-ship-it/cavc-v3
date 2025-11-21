import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, X as CloseIcon } from 'lucide-react';
import QRCode from 'react-qr-code';

const Navbar = ({ scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Call modal state
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const mainIntlNumber = '+63285355555';
  const mainDisplayNumber = '(02) 8535-5555';

  // Simple mobile detection
  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(window.navigator.userAgent);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  const blurAmount = Math.min(scrollY / 200, 5);

  const openCallModal = () => setCallModalOpen(true);
  const closeCallModal = () => setCallModalOpen(false);

  const openQrModal = () => setQrModalOpen(true);
  const closeQrModal = () => setQrModalOpen(false);

  // CallButton component
  const CallButton = () => (
    <button
      onClick={isMobile ? openCallModal : openQrModal}
      className="btn-primary relative overflow-hidden h-10 flex items-center justify-center px-4 text-sm font-semibold tracking-wide glow-animate call-btn-animate"
      style={{ minWidth: '190px' }}
      type="button"
    >
      <Phone className="w-5 h-5 mr-2 text-yellow-highlight call-btn-icon" />
      Call Us {mainDisplayNumber}
      {/* Glowing effect */}
      <span className="absolute inset-0 rounded-lg pointer-events-none glow-overlay"></span>
    </button>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${hasScrolled ? 'py-1' : 'py-2'}`}>
        {/* Blur background */}
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${hasScrolled ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundColor: hasScrolled ? 'rgba(17, 24, 39, 0.5)' : 'transparent',
            backdropFilter: hasScrolled ? `blur(${blurAmount}px)` : 'none',
          }}
        ></div>

        {/* Navbar content */}
        <div className="relative z-10 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 max-w-screen-2xl mx-auto">
          {/* Logo - Responsive sizing */}
          <button 
            onClick={() => handleNavClick('hero')}
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
            type="button"
            aria-label="Go to home"
          >
            <div className="h-8 xs:h-9 sm:h-10 md:h-11 lg:h-12 flex items-center">
              <img 
                src="/images/cavclogohorizontal.webp" 
                alt="CAVC Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
          </button>

          {/* Desktop Navigation - Responsive breakpoints and spacing */}
          <div className="hidden lg:flex absolute left-1/2 items-center space-x-4 xl:space-x-8">
            <button onClick={() => handleNavClick('hero')} className="btn-nav text-sm xl:text-base">
              Home
            </button>
            <button onClick={() => handleNavClick('services')} className="btn-nav text-sm xl:text-base">
              Services
            </button>
            <button onClick={() => handleNavClick('about')} className="btn-nav text-sm xl:text-base">
              About Us
            </button>
            <button onClick={() => handleNavClick('footer')} className="btn-nav text-sm xl:text-base">
              Contact
            </button>
            <CallButton />
          </div>

          {/* Tablet Navigation (md to lg) - Compact version */}
          <div className="hidden md:flex lg:hidden absolute left-1/2 items-center space-x-3">
            <button onClick={() => handleNavClick('hero')} className="btn-nav text-xs">
              Home
            </button>
            <button onClick={() => handleNavClick('services')} className="btn-nav text-xs">
              Services
            </button>
            <button onClick={() => handleNavClick('about')} className="btn-nav text-xs">
              About
            </button>
            <button onClick={() => handleNavClick('footer')} className="btn-nav text-xs">
              Contact
            </button>
            <button
              onClick={isMobile ? openCallModal : openQrModal}
              className="btn-primary relative overflow-hidden h-9 flex items-center justify-center px-3 text-xs font-semibold tracking-wide glow-animate call-btn-animate"
              type="button"
            >
              <Phone className="w-4 h-4 mr-1.5 text-yellow-highlight call-btn-icon" />
              <span className="hidden lg:inline">Call Us </span>{mainDisplayNumber}
              <span className="absolute inset-0 rounded-lg pointer-events-none glow-overlay"></span>
            </button>
          </div>

          {/* Spacer for balance - Responsive */}
          <div className="hidden md:block lg:w-[190px] xl:w-[210px] md:w-[160px]"></div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn-mobile-menu md:hidden p-2"
            aria-label="Toggle menu"
            type="button"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation - Improved spacing */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 xs:top-18 sm:top-20 left-0 right-0 bg-primary-dark bg-opacity-95 backdrop-blur-sm z-40 md:hidden"
          >
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
              <button onClick={() => handleNavClick('hero')} className="block w-full text-left btn-nav py-2 text-base sm:text-lg">
                Home
              </button>
              <button onClick={() => handleNavClick('services')} className="block w-full text-left btn-nav py-2 text-base sm:text-lg">
                Services
              </button>
              <button onClick={() => handleNavClick('about')} className="block w-full text-left btn-nav py-2 text-base sm:text-lg">
                About
              </button>
              <button onClick={() => handleNavClick('footer')} className="block w-full text-left btn-nav py-2 text-base sm:text-lg">
                Contact
              </button>
              <div className="pt-2">
                <CallButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Modal for mobile - Responsive sizing */}
      {isMobile && callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 relative max-w-xs w-full flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
              onClick={closeCallModal}
              aria-label="Close"
              type="button"
            >
              <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-accent-green mb-2" />
            <h3 className="text-base sm:text-lg font-bold mb-2 text-primary-dark text-center">Call Manila Office</h3>
            <span className="mb-4 text-gray-700 font-medium text-sm sm:text-base">{mainDisplayNumber}</span>
            <button
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded bg-accent-green text-white font-semibold text-sm sm:text-base shadow hover:bg-yellow-highlight transition-colors duration-200 w-full sm:w-auto"
              onClick={() => { window.location.href = `tel:${mainIntlNumber}`; }}
              type="button"
            >
              Call Now
            </button>
          </div>
        </div>
      )}

      {/* Desktop QR Modal - Responsive sizing */}
      <AnimatePresence>
        {!isMobile && qrModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-lg shadow-lg p-5 sm:p-6 lg:p-8 relative max-w-xs sm:max-w-sm w-full flex flex-col items-center"
            >
              <button
                className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
                onClick={closeQrModal}
                aria-label="Close"
                type="button"
              >
                <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-accent-green mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-primary-dark text-center">
                Scan to Call Manila Office
              </h3>
              <QRCode value={`tel:${mainIntlNumber}`} size={window.innerWidth < 640 ? 112 : 128} />
              <span className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700 font-medium text-center">
                {mainDisplayNumber}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

<style>
  {`
    .glow-animate .glow-overlay {
      box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.6);
      animation: glowPulse 2.5s infinite;
      transition: box-shadow 0.3s;
    }
    @keyframes glowPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.0); }
      70% { box-shadow: 0 0 16px 4px rgba(255, 193, 7, 0.5); }
    }
    /* Minimalist pulse for icon */
    .call-btn-animate .call-btn-icon {
      animation: callIconPulse 1.8s infinite;
      filter: drop-shadow(0 0 4px #ffe066);
      transition: filter 0.2s;
    }
    @keyframes callIconPulse {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px #ffe066); }
      50% { transform: scale(1.15); filter: drop-shadow(0 0 8px #ffe066); }
    }
  `}
</style>
