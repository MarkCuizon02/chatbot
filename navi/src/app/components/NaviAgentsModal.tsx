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

export default function NaviAgentsModal({
  isOpen,
  onClose,
  isDarkMode,
}: NaviAgentsModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const availableAgents = [
    { name: 'Navi', image: '/images/Navi.png', bgColor: 'from-emerald-400 to-teal-500' },
    { name: 'Flicka', image: '/images/flicka.png', bgColor: 'from-purple-600 to-indigo-700' },
    { name: 'Audra', image: '/images/Audra.png', bgColor: 'from-green-600 to-emerald-700' },
    { name: 'Pixie', image: '/images/Pixie.png', bgColor: 'from-pink-400 to-rose-500' },
    { name: 'Paige', image: '/images/Paige.png', bgColor: 'from-amber-400 to-orange-500' },
  ];

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl rounded-2xl shadow-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-black/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10 dark:border-black/20">
              <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>Choose an Agent</h2>
              <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors focus:outline-none`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {availableAgents.map((agent) => (
                  <motion.div
                    key={agent.name}
                    whileHover={{ scale: 1.05, y: -5, filter: 'brightness(1.1)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className={`group relative rounded-2xl p-4 flex flex-col items-center justify-center text-center text-white min-h-[160px] bg-gradient-to-br ${agent.bgColor} cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20`}
                    onClick={handleAgentClick}
                  >
                    {agent.name === 'Navi' && (
                      <div className="absolute top-3 right-3 p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                    {agent.image ? (
                      <Image src={agent.image} alt={agent.name} width={72} height={72} className="rounded-full mb-3 border-2 border-white/50 shadow-md" />
                    ) : (
                      <div className="w-18 h-18 rounded-full bg-gray-500 flex items-center justify-center mb-3 border-2 border-white/50 shadow-md">
                        <span className="text-gray-300 text-4xl">?</span>
                      </div>
                    )}
                    <h4 className="font-semibold text-xl tracking-tight">{agent.name}</h4>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}