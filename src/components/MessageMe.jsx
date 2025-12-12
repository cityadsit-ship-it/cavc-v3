import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageMe = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
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
        className="flex items-center"
      >
        <AnimatePresence>
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
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="bg-gradient-to-r from-accent-green to-lime-green text-white p-3 rounded-full shadow-lg backdrop-blur-sm relative"
          onClick={() => window.open('http://m.me/cityadvertising/', '_blank')}
        >
          <img
            src="/images/msgr_icon.svg"
            alt="Messenger"
            width={40}
            height={40}
            className="animate-pulse"
          />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MessageMe;
