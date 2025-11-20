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
        <div className="relative z-10 flex items-center justify-between p-2 sm:p-3 lg:px-6">
          <button 
            onClick={() => handleNavClick('hero')}
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
            type="button"
            aria-label="Go to home"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center p-1.5">
              <img 
                src="/images/cavclogo.png" 
                alt="CAVC Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="ml-3 text-white font-semibold text-lg hidden sm:block">
              City Advertising Ventures Corporation
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => handleNavClick('hero')} className="btn-nav">
              Home
            </button>
            <button onClick={() => handleNavClick('services')} className="btn-nav">
              Services
            </button>
            <button onClick={() => handleNavClick('about')} className="btn-nav">
              About Us
            </button>
            {/* New Contact button */}
            <button onClick={() => handleNavClick('footer')} className="btn-nav">
              Contact
            </button>
            <CallButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn-mobile-menu md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-0 right-0 bg-primary-dark bg-opacity-95 backdrop-blur-sm z-40 md:hidden"
        >
          <div className="px-4 py-6 space-y-4">
            <button onClick={() => handleNavClick('hero')} className="block w-full text-left btn-nav">
              Home
            </button>
            <button onClick={() => handleNavClick('services')} className="block w-full text-left btn-nav">
              Services
            </button>
            <button onClick={() => handleNavClick('about')} className="block w-full text-left btn-nav">
              About
            </button>
            <button onClick={() => handleNavClick('footer')} className="block w-full text-left btn-nav">
              Contact
            </button>
            <CallButton />
          </div>
        </motion.div>
      )}

      {/* Call Modal for mobile */}
      {isMobile && callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-xs w-full flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
              onClick={closeCallModal}
              aria-label="Close"
              type="button"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            <Phone className="w-8 h-8 text-accent-green mb-2" />
            <h3 className="text-lg font-bold mb-2 text-primary-dark">Call Manila Office</h3>
            <span className="mb-4 text-gray-700 font-medium">{mainDisplayNumber}</span>
            <button
              className="px-6 py-2 rounded bg-accent-green text-white font-semibold text-base shadow hover:bg-yellow-highlight transition-colors duration-200"
              onClick={() => { window.location.href = `tel:${mainIntlNumber}`; }}
              type="button"
            >
              Call Now
            </button>
          </div>
        </div>
      )}

      {/* Desktop QR Modal */}
      <AnimatePresence>
        {!isMobile && qrModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-lg shadow-lg p-6 relative max-w-xs w-full flex flex-col items-center"
            >
              <button
                className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
                onClick={closeQrModal}
                aria-label="Close"
                type="button"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
              <Phone className="w-8 h-8 text-accent-green mb-2" />
              <h3 className="text-lg font-bold mb-2 text-primary-dark">Scan to Call Manila Office</h3>
              <QRCode value={`tel:${mainIntlNumber}`} size={128} />
              <span className="mt-4 text-base text-gray-700 font-medium text-center">
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
