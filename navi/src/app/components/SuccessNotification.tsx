"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCheckCircle } from 'react-icons/hi2';

interface SuccessNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessNotification({ isVisible, message, onClose }: SuccessNotificationProps) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 right-4 z-50"
        >
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <HiOutlineCheckCircle className="w-6 h-6" />
            </motion.div>
            <div className="flex-1">
              <p className="font-medium">{message}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white hover:text-green-100 transition-colors"
            >
              ×
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 