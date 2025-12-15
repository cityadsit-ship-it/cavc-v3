import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink,
  X as CloseIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { serviceData } from './ServicesData';
import ServiceGalleryModal from './ServiceGalleryModal';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1CjqGmsXb1/?mibextid=wwXIfr', label: 'Facebook' },
  ];

  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Locations', href: '#map' },
    // Remove Contact from here, will add custom below
  ];

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState(null);

  const openModal = (service) => {
    setModalService(service);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalService(null);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Phone numbers in display and international format
  const phoneNumbers = [
    { display: '(02) 8535-5555', intl: '+63285355555' },
    { display: '(02) 8532-5400', intl: '+63285325400' },
    { display: '(02) 8531-0152', intl: '+63285310152' },
    { display: '(02) 8532-5216', intl: '+63285325216' },
  ];

  const mainIntlNumber = '+63285355555';
  const mainDisplayNumber = '(02) 8535-5555';

  // Simple mobile detection
  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(window.navigator.userAgent);

  // Call modal state
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(mainIntlNumber);

  const openCallModal = (intlNum) => {
    setSelectedNumber(intlNum);
    setCallModalOpen(true);
  };

  const closeCallModal = () => {
    setCallModalOpen(false);
  };

  // QR Code modal state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrModalNumber, setQrModalNumber] = useState(mainIntlNumber);

  const openQrModal = (intlNum) => {
    setQrModalNumber(intlNum);
    setQrModalOpen(true);
  };

  const closeQrModal = () => {
    setQrModalOpen(false);
  };

  const mapsUrl = "https://maps.app.goo.gl/rAmDMQMvppMJqai37";
  const handleLocationClick = () => {
    if (isMobile) {
      window.location.href = mapsUrl;
    } else {
      window.open(mapsUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCallUsClick = () => {
    if (isMobile) {
      openCallModal(mainIntlNumber);
    } else {
      openQrModal(mainIntlNumber);
    }
  };

  // Gallery Modal State
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryService, setGalleryService] = useState(null);

  const openGallery = (service) => {
    setGalleryService(service);
    setGalleryOpen(true);
  };
  const closeGallery = () => {
    setGalleryOpen(false);
    setGalleryService(null);
  };

  return (
    <footer id="footer" className="bg-gradient-to-br from-primary-dark via-accent-green to-lime-green text-white relative overflow-hidden">
      {/* Animated background shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-green rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-highlight rounded-full blur-2xl opacity-60 animate-pulse" />
      </motion.div>

      {/* Main Footer Content */}
      <div className="section-padding relative z-10">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 p-1.5 shadow-lg">
                  <img 
                    src="/images/cavclogo.png" 
                    alt="CAVC Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">City Advertising <br /> Venture Corporation</h3>

                </div>
              </div>
              
              <p className="text-gray-200 mb-6 leading-relaxed">
                We impact customers through a variety of messages in many ways at any period of time and place.
              </p>

              {/* Social Media */}
              <div className="flex space-x-4 mt-4">
                {/* Facebook Icon */}
                <motion.a
                  href={socialLinks[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
                  className="btn-social bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 flex items-center cursor-pointer"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white group-hover:text-accent-green transition-colors duration-300" />
                </motion.a>
                {/* Facebook Text */}
                <motion.a
                  href={socialLinks[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, color: "#16a34a" }}
                  className="font-semibold text-white hover:text-accent-green transition-colors duration-300 cursor-pointer flex items-center"
                  aria-label="Facebook"
                >
                  Facebook
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h4 className="text-lg font-semibold mb-6 text-yellow-highlight">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-200 hover:text-white transition-colors duration-300 flex items-center group font-medium"
                      type="button"
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </li>
                ))}
                {/* Uniform Call Us button */}
                <li>
                  <button
                    onClick={handleCallUsClick}
                    className="text-gray-200 hover:text-white transition-colors duration-300 flex items-center group font-medium"
                    type="button"
                  >
                    <span>Call Us</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </li>
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h4 className="text-lg font-semibold mb-6 text-yellow-highlight">
                Our Services
              </h4>
              <ul className="space-y-3">
                {serviceData.map((service) => (
                  <li key={service.id}>
                    <button
                      className="text-gray-200 hover:text-white transition-colors duration-300 cursor-pointer font-medium flex items-start group text-left"
                      onClick={() => openGallery(service)}
                      type="button"
                    >
                      <span className="break-words">{service.title}</span>
                      <ExternalLink className="w-3 h-3 ml-1 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <h4 className="text-lg font-semibold mb-6 text-yellow-highlight">
                Contact Info
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-yellow-highlight mt-1 flex-shrink-0" />
                  <div>
                    <button
                      className="text-gray-200 text-sm text-left underline hover:text-yellow-highlight transition-colors duration-200"
                      style={{ whiteSpace: 'normal' }}
                      onClick={handleLocationClick}
                      type="button"
                      aria-label="Open location in Google Maps"
                    >
                      6th & 7th Floor, MG Tower,<br />
                      #75 Shaw Boulevard, Daang Bakal,<br />
                      Mandaluyong City, Philippines
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-yellow-highlight mt-1 flex-shrink-0" />
                  <div className="w-full">
                    {isMobile ? (
                      <div className="flex flex-wrap gap-2">
                        {phoneNumbers.map((num) => (
                          <button
                            key={num.intl}
                            className="text-gray-200 text-sm px-3 py-1 rounded bg-accent-green/80 hover:bg-yellow-highlight font-medium transition-colors duration-200 mb-1"
                            onClick={() => openCallModal(num.intl)}
                            type="button"
                          >
                            {num.display}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {phoneNumbers.map((num) => (
                          <button
                            key={num.intl}
                            className="text-gray-200 text-sm px-3 py-1 rounded bg-white/10 hover:bg-accent-green hover:text-white font-medium transition-colors duration-200 mb-1"
                            onClick={() => openQrModal(num.intl)}
                            type="button"
                          >
                            {num.display}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-yellow-highlight flex-shrink-0" />
                  <div>
                    <button
                      className="text-gray-200 text-sm underline hover:text-yellow-highlight transition-colors duration-200"
                      type="button"
                      onClick={() => window.location.href = "mailto:sales.cityads@gmail.com"}
                      aria-label="Send email to sales.cityads@gmail.com"
                    >
                      sales.cityads@gmail.com
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Centered Copyright */}
      <div className="border-t border-white border-opacity-10">
        <div className="container-custom py-6">
          <div className="flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-300 text-sm text-center"
            >
              © {currentYear} City Advertising Ventures Corporation. All rights reserved.
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call Now Modal for mobile */}
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
            <span className="mb-4 text-gray-700 font-medium">
              {phoneNumbers.find(num => num.intl === selectedNumber)?.display || selectedNumber.replace('+632', '(02) ')}
            </span>
            <button
              className="px-6 py-2 rounded bg-accent-green text-white font-semibold text-base shadow hover:bg-yellow-highlight transition-colors duration-200"
              onClick={() => { window.location.href = `tel:${selectedNumber}`; }}
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
              <QRCode value={`tel:${qrModalNumber}`} size={128} />
              <span className="mt-4 text-base text-gray-700 font-medium text-center">
                {phoneNumbers.find(num => num.intl === qrModalNumber)?.display || qrModalNumber.replace('+632', '(02) ')}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Footer Service Gallery Modal --- */}
      <AnimatePresence>
        {galleryOpen && galleryService && (
          <ServiceGalleryModal
            service={galleryService}
            isOpen={galleryOpen}
            onClose={closeGallery}
          />
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
