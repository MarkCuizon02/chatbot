'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import {
  HiOutlineInformationCircle,
  HiOutlineEllipsisHorizontal,
  HiOutlinePlus,
  HiMagnifyingGlass,
  HiChevronDown,
  HiChevronUp,
} from 'react-icons/hi2';

interface ConnectionCardProps {
  name: string;
  description: string;
  credits: string;
  isAvailable: boolean;
  bgColor?: string;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  name,
  description,
  credits,
  isAvailable,
  bgColor = 'bg-white',
}) => {
  const { isDarkMode } = useTheme();
  const [isEnabled, setIsEnabled] = useState(isAvailable);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className={`rounded-xl p-5 shadow-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : `${bgColor} border-gray-200 text-gray-900`} flex flex-col`}
    >
      <div className="flex justify-between items-center mb-3">
        <label htmlFor={`toggle-${name}`} className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              id={`toggle-${name}`}
              className="sr-only"
              checked={isEnabled}
              onChange={() => setIsEnabled(!isEnabled)}
            />
            <div
              className={`block w-12 h-6 rounded-full ${isEnabled ? (isDarkMode ? 'bg-teal-700' : 'bg-teal-500') : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')} transition-colors duration-200`}
            ></div>
            <div
              className={`dot absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isEnabled ? 'translate-x-6' : 'translate-x-0'}
              `}
            ></div>
          </div>
        </label>
        <div className="flex items-center space-x-3">
          <HiOutlineInformationCircle size={22} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} cursor-pointer hover:text-teal-500`} />
          <HiOutlineEllipsisHorizontal size={22} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} cursor-pointer hover:text-teal-500`} />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex-grow`}>{description}</p>
      <p className={`text-sm mt-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{credits}</p>
    </motion.div>
  );
};

export default function ConnectionsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Status');

  const connectionCategories = ['All', 'OpenAI', 'Anthropic', 'Google DeepMind', 'Mistral / Mixtral', 'More'];
  const statusOptions = ['Status', 'Active', 'Inactive', 'Coming Soon'];

  const connections = [
    { name: 'GPT-4.1', description: 'Internal name often used to refer to improved GPT-4-turbo in 2024.', credits: '0.8 Credits / 1k Tokens', isAvailable: false },
    { name: 'GPT-4.1 nano', description: 'Hypothetical or future model variants for mobile/local deployment (not officially branded).', credits: 'FREE • For paid account only', isAvailable: true },
    { name: 'o4-mini', description: 'Hypothetical or future model variants for mobile/local deployment (not officially branded).', credits: '0.8 Credits / 1k Tokens', isAvailable: false },
    { name: 'GPT-4-turbo', description: 'Not officially branded, but often refers to an interim improvement in 2024.', credits: '0.8 Credits / 1k Tokens', isAvailable: false },
    { name: 'GPT-3.5-turbo-instruct', description: 'Instruct-tuned version of 3.5, mostly for API compatibility.', credits: '0.8 Credits / 1k Tokens', isAvailable: false },
    { name: 'Claude 1, 2, 3', description: 'Claude 3 family includes Opus (most powerful), Sonnet (balanced), and Haiku (fastest).', credits: '0.8 Credits / 1k Tokens', isAvailable: true },
    { name: 'Claude 3.5 Opus', description: 'Latest flagship model from Anthropic (mid-2025).', credits: '0.8 Credits / 1k Tokens', isAvailable: true },
    { name: 'Claude-instant', description: 'Lighter, faster Claude variant.', credits: '0.8 Credits / 1k Tokens', isAvailable: true },
    { name: 'Gemini 1, 1.5', description: 'Multimodal models with text, image, code understanding.', credits: '0.8 Credits / 1k Tokens', isAvailable: false },
    { name: 'Gemini Nano', description: 'On-device variant used in Android and Pixel devices.', credits: '0.8 Credits / 1k Tokens', isAvailable: false },
    { name: 'Mistral 7B', description: 'Open-weight LLM by Mistral AI.', credits: '0.8 Credits / 1k Tokens', isAvailable: true },
    { name: 'Mixtral 8x7B', description: 'Mixture-of-Experts model with 8 experts.', credits: '0.8 Credits / 1k Tokens', isAvailable: true },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} flex font-poppins transition-colors duration-300`}>
      <Sidebar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isNaviModalOpen={isNaviModalOpen}
        setIsNaviModalOpen={setIsNaviModalOpen}
        isNaviDropdownOpen={isNaviDropdownOpen}
        setIsNaviDropdownOpen={setIsNaviDropdownOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        isNaviChatbotOpen={false}
        setIsNaviChatbotOpen={function (value: React.SetStateAction<boolean>): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-12' : 'ml-32'} p-6 sm:p-8 overflow-x-hidden flex justify-center`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Connections</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base sm:text-lg mt-2`}>A curated list of connected AI models ready for use in your applications.</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search connections..."
                  className={`w-full p-3 pl-10 rounded-xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200`}
                />
                <HiMagnifyingGlass size={22} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button className="flex items-center justify-center px-4 py-3 bg-teal-500 text-white rounded-xl shadow-md hover:bg-teal-600 transition-colors duration-200 shrink-0">
                <HiOutlinePlus size={22} className="mr-2" /> Add a custom connection
              </button>
            </div>
          </div>

          {/* Categories and Status Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <div className={`flex flex-wrap gap-2 mb-4 sm:mb-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-1.5 shadow-sm`}>
              {connectionCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTab === category
                      ? isDarkMode
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-white text-gray-900 shadow-sm'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-48">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} shadow-sm hover:bg-gray-700 transition-colors duration-200`}
              >
                {selectedStatus}
                {isStatusDropdownOpen ? <HiChevronUp size={22} /> : <HiChevronDown size={22} />}
              </button>
              <AnimatePresence>
                {isStatusDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`absolute right-0 mt-2 w-full rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${isDarkMode ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-gray-200'}`}
                  >
                    <div className="py-1.5">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatus(status);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-100' : 'hover:bg-gray-100 text-gray-700'} transition-colors duration-200`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Connections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {connections.map((connection, index) => (
              <ConnectionCard key={index} {...connection} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}