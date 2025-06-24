'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface NaviAgentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const colorVariants = {
  emerald: { border: 'border-emerald-500', shadow: 'hover:shadow-emerald-500/20', text: 'text-emerald-500', bg_subtle: 'bg-emerald-500/10' },
  purple: { border: 'border-purple-500', shadow: 'hover:shadow-purple-500/20', text: 'text-purple-500', bg_subtle: 'bg-purple-500/10' },
  green: { border: 'border-green-500', shadow: 'hover:shadow-green-500/20', text: 'text-green-500', bg_subtle: 'bg-green-500/10' },
  pink: { border: 'border-pink-500', shadow: 'hover:shadow-pink-500/20', text: 'text-pink-500', bg_subtle: 'bg-pink-500/10' },
  orange: { border: 'border-orange-500', shadow: 'hover:shadow-orange-500/20', text: 'text-orange-500', bg_subtle: 'bg-orange-500/10' },
};

const availableAgents = [
  { name: 'Navi', image: '/images/Navi.png', color: 'emerald' as keyof typeof colorVariants },
  { name: 'Flicka', image: '/images/flicka.png', color: 'purple' as keyof typeof colorVariants },
  { name: 'Audra', image: '/images/Audra.png', color: 'green' as keyof typeof colorVariants },
  { name: 'Pixie', image: '/images/Pixie.png', color: 'pink' as keyof typeof colorVariants },
  { name: 'Paige', image: '/images/Paige.png', color: 'orange' as keyof typeof colorVariants },
];

export default function NaviAgentsModal({
  isOpen,
  onClose,
  isDarkMode,
}: NaviAgentsModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleAgentClick = () => {
    router.push('/agents');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative w-full max-w-4xl rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-black border-gray-200'} border backdrop-blur-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Choose an Agent</h2>
              <button 
                onClick={onClose} 
                className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} focus:outline-none`}
              >
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {availableAgents.map((agent) => {
                  const variant = colorVariants[agent.color];
                  return (
                    <motion.div
                      key={agent.name}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className={`group relative rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg transition-all duration-300 border-t-4 ${variant.border} ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} hover:shadow-xl ${variant.shadow}`}
                      onClick={handleAgentClick}
                    >
                      {agent.name === 'Navi' && (
                        <div className={`absolute top-3 right-3 p-1.5 rounded-full ${variant.bg_subtle}`}></div>
                      )}
                      {agent.image ? (
                        <Image src={agent.image} alt={agent.name} width={72} height={72} className={`rounded-full mb-3 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-md`} />
                      ) : (
                        <div className={`w-18 h-18 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center mb-3 border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} shadow-md`}>
                          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-4xl`}>?</span>
                        </div>
                      )}
                      <h4 className={`font-semibold text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>{agent.name}</h4>
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:${variant.text}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}