import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, Eye } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cavc-cookie-consent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cavc-cookie-consent', JSON.stringify({
      accepted: true,
      date: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cavc-cookie-consent', JSON.stringify({
      accepted: false,
      date: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="container-custom">
          <div className="relative bg-gradient-to-br from-primary-dark via-accent-green to-primary-dark rounded-2xl shadow-2xl border-2 border-lime-green/30 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-highlight rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-lime-green rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-yellow-highlight rounded-full flex items-center justify-center shadow-lg">
                    <Cookie className="w-8 h-8 text-primary-dark" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-yellow-highlight" />
                    Your Privacy Matters
                  </h3>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                    Your data is handled in accordance with our privacy policy.
                  </p>
                  
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            What we collect:
                          </h4>
                          <ul className="text-white/80 text-sm space-y-1 list-disc list-inside">
                            <li>Essential cookies for site functionality</li>
                            <li>Analytics cookies to understand user behavior</li>
                            <li>Performance cookies to optimize your experience</li>
                            <li>No personal data is sold to third parties</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="mt-3 text-yellow-highlight hover:text-white text-sm font-medium transition-colors duration-200 underline"
                  >
                    {showDetails ? 'Show less' : 'Learn more'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={handleAccept}
                    className="bg-yellow-highlight hover:bg-yellow-400 text-primary-dark font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-400/20 transform hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-100 whitespace-nowrap"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm transform hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-100 whitespace-nowrap"
                  >
                    Reject All
                  </button>
                </div>

                <button
                  onClick={handleReject}
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
