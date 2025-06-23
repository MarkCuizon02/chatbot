'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { HiOutlineCube } from 'react-icons/hi2';
import { useTheme } from '../../context/ThemeContext';

interface KnowledgeBaseCardProps {
  name: string;
  category: string;
  tags: string[];
  version: string;
  faqPack: string;
}

const tagColorMap: { [key: string]: string } = {
  'Supportive': 'bg-yellow-100 text-yellow-800',
  'Help Assistant': 'bg-purple-100 text-purple-800',
  'Enthusiastic': 'bg-yellow-100 text-yellow-800',
  'Virtual Support Agent': 'bg-purple-100 text-purple-800',
};

const tagColorMapDark: { [key: string]: string } = {
    'Supportive': 'bg-yellow-900 text-yellow-300',
    'Help Assistant': 'bg-purple-900 text-purple-300',
    'Enthusiastic': 'bg-yellow-900 text-yellow-300',
    'Virtual Support Agent': 'bg-purple-900 text-purple-300',
};

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({
  name,
  category,
  tags,
  version,
  faqPack,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className={`rounded-2xl p-6 flex flex-col justify-between h-full ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border shadow-sm transition-all duration-300`}
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {/* Replace with a proper icon if available */}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{category}</p>
            </div>
          </div>
          <button className={`p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
            <HiOutlineDotsVertical size={20} />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`px-3 py-1 text-xs font-semibold rounded-full ${isDarkMode ? tagColorMapDark[tag] : tagColorMap[tag]}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <HiOutlineCube size={16}/>
            <span>{faqPack}</span>
        </div>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{version}</span>
      </div>
    </motion.div>
  );
};

export default KnowledgeBaseCard; 