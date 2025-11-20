import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const MessageMe = ({ scrollToSection }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AnimatePresence>
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -10, 10, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-white bg-gradient-to-r from-accent-green to-lime-green px-4 py-2 rounded-lg text-sm shadow-lg mr-2"
            >
              Let's Talk!
            </motion.span>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="bg-gradient-to-r from-accent-green to-lime-green text-white p-5 rounded-full shadow-lg backdrop-blur-sm relative"
            onClick={() => window.open('http://m.me/cityadvertising/', '_blank')}
          >
            {/* Facebook Messenger SVG Icon */}
            <svg
              width={32}
              height={32}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-pulse"
            >
              <circle cx="16" cy="16" r="16" fill="#0084FF"/>
              <path
                d="M16 8C11.03 8 7 11.69 7 16.07c0 2.54 1.33 4.81 3.5 6.32v3.61c0 .37.4.6.72.42l3.21-1.93c.85.18 1.74.28 2.57.28 4.97 0 9-3.69 9-8.07C25 11.69 20.97 8 16 8zm1.54 10.37l-2.13-2.28-4.13 2.28c-.36.2-.77-.19-.59-.57l2.13-4.28c.13-.26.48-.32.7-.13l2.13 2.28 4.13-2.28c.36-.2.77.19.59.57l-2.13 4.28c-.13.26-.48.32-.7.13z"
                fill="#fff"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MessageMe;
