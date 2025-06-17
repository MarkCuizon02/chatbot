'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { HiXMark, HiChevronDown } from 'react-icons/hi2';

interface AgentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  agent: {
    name: string;
    image: string | null;
    bgColor: string;
    description: string;
  } | null;
}

export default function AgentsModal({
  isOpen,
  onClose,
  isDarkMode,
  agent,
}: AgentsModalProps) {
  const [mood, setMood] = useState<'professional' | 'casual' | 'relaxed'>('casual');
  const [aiModel, setAiModel] = useState('GPT-4');
  const [customTraits, setCustomTraits] = useState('');

  if (!isOpen || !agent) return null;

  const handleSave = () => {
    console.log('Saving changes for agent:', agent.name);
    console.log('Mood:', mood);
    console.log('AI Model:', aiModel);
    console.log('Custom Traits:', customTraits);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-3xl shadow-xl w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transform transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className={`relative h-40 rounded-t-3xl overflow-hidden ${agent.bgColor} flex items-center justify-between p-6`}>
              <div className="flex flex-col">
                <h2 className="text-white text-3xl font-bold">{agent.name}</h2>
                <p className="text-white text-opacity-80 mt-1 pr-16">Your smart dashboard assistant — here to guide you through setup, manage your companies, and simplify every step. Fast. Friendly. Always ready to help.</p>
              </div>
              {agent.image && (
                <Image
                  src={agent.image}
                  alt={agent.name}
                  width={160}
                  height={160}
                  className="absolute -bottom-8 right-6 transform translate-x-1/4 rounded-full"
                />
              )}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'}`}
              >
                <HiXMark size={24} />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mood</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-200
                    ${mood === 'professional' ? (isDarkMode ? 'bg-teal-600 text-white' : 'bg-teal-500 text-white') : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200')} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    onClick={() => setMood('professional')}
                  >
                    Strictly Professional
                  </button>
                  <button
                    className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-200
                    ${mood === 'casual' ? (isDarkMode ? 'bg-teal-600 text-white' : 'bg-teal-500 text-white') : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200')} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    onClick={() => setMood('casual')}
                  >
                    Business Casual
                  </button>
                  <button
                    className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-200
                    ${mood === 'relaxed' ? (isDarkMode ? 'bg-teal-600 text-white' : 'bg-teal-500 text-white') : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200')} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    onClick={() => setMood('relaxed')}
                  >
                    Friendly and Relaxed
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>AI Model</label>
                <div className="relative">
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className={`block w-full py-2 px-3 pr-10 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500
                    ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                  >
                    <option value="GPT-4">GPT-4</option>
                    <option value="GPT-3.5">GPT-3.5</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <HiChevronDown className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Custom Traits</label>
                <textarea
                  value={customTraits}
                  onChange={(e) => setCustomTraits(e.target.value)}
                  rows={4}
                  placeholder="Describe what will your agent will do specifically"
                  className={`block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y
                  ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end`}>
              <button
                onClick={handleSave}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 