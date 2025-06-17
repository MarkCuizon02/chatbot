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

  const mostUsedAgents = [
    { name: 'Navi', description: 'Lorem Ipsum', image: '/images/Navi.png', bgColor: 'from-emerald-400 to-teal-500' },
    { name: 'Flicka', description: 'Lorem Ipsum', image: '/images/flicka.png', bgColor: 'from-purple-600 to-indigo-700' },
    { name: 'Audra', description: 'Lorem Ipsum', image: '/images/Audra.png', bgColor: 'from-green-600 to-emerald-700' },
  ];

  const availableAgents = [
    { name: 'Navi', description: 'Lorem Ipsum', image: '/images/Navi.png', bgColor: 'from-emerald-400 to-teal-500' },
    { name: 'Flicka', description: 'Lorem Ipsum', image: '/images/flicka.png', bgColor: 'from-purple-600 to-indigo-700' },
    { name: 'Audra', description: 'Lorem Ipsum', image: '/images/Audra.png', bgColor: 'from-green-600 to-emerald-700' },
    { name: 'Pixie', description: 'Lorem Ipsum', image: '/images/Pixie.png', bgColor: 'from-pink-400 to-rose-500' },
    { name: 'Paige', description: 'Lorem Ipsum', image: '/images/Paige.png', bgColor: 'from-amber-400 to-orange-500' },
    { name: 'Neuro', description: 'Coming Soon', image: null, bgColor: 'from-gray-600 to-gray-700' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-4xl p-8 transform transition-all scale-100 opacity-100`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-3xl font-bold`}>Choose an Agent</h2>
              <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} focus:outline-none`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="mb-8">
              <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg font-semibold mb-4`}>Most Frequently Used</h3>
              <div className="grid grid-cols-3 gap-4">
                {mostUsedAgents.map((agent, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className={`rounded-xl p-4 flex flex-col items-center justify-center text-center text-white min-h-[140px] bg-gradient-to-br ${agent.bgColor}`}
                  >
                    {agent.image ? (
                      <Image src={agent.image} alt={agent.name} width={64} height={64} className="rounded-full mb-2" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center mb-2">
                        <span className="text-gray-300 text-3xl">?</span>
                      </div>
                    )}
                    <h4 className="font-semibold text-lg">{agent.name}</h4>
                    <p className="text-sm opacity-80">{agent.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg font-semibold mb-4`}>Available Agents</h3>
              <div className="grid grid-cols-3 gap-4">
                {availableAgents.map((agent, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className={`relative rounded-xl p-4 flex flex-col items-center justify-center text-center text-white min-h-[140px] bg-gradient-to-br ${agent.bgColor}`}
                  >
                    {agent.name === 'Navi' && (
                      <div className="absolute bottom-2 left-2 p-2 bg-white bg-opacity-20 rounded-full">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M11.49 4.382a1 1 0 011.02-1.302l1.638.163a1 1 0 011.173.96l.163 1.638a1 1 0 01-1.302 1.02l-1.638-.163a1 1 0 01-.96-1.173zM5.51 16.618a1 1 0 01-1.02 1.302l-1.638-.163a1 1 0 01-1.173-.96l-.163-1.638a1 1 0 011.302-1.02l1.638.163a1 1 0 01.96 1.173zM16.618 5.51a1 1 0 011.302-1.02l.163-1.638a1 1 0 01.96-1.173l1.638.163a1 1 0 011.02 1.302l-.163 1.638a1 1 0 01-1.173.96zM4.382 11.49a1 1 0 01-1.302 1.02l-1.638-.163a1 1 0 01-.96-1.173l.163-1.638a1 1 0 011.173-.96zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {agent.image ? (
                      <Image src={agent.image} alt={agent.name} width={64} height={64} className="rounded-full mb-2" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center mb-2">
                        <span className="text-gray-300 text-3xl">?</span>
                      </div>
                    )}
                    <h4 className="font-semibold text-lg">{agent.name}</h4>
                    <p className="text-sm opacity-80">{agent.description}</p>
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