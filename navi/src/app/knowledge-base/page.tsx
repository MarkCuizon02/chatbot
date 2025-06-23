'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import Sidebar from '../components/Sidebar';
import KnowledgeBaseCard from '../components/KnowledgeBaseCard';
import AddKnowledgeBaseModal from '../components/AddKnowledgeBaseModal';

interface KnowledgeBase {
  id: number;
  name: string;
  category: string;
  tags: string[];
  version: string;
  faqPack: string;
}

export default function KnowledgeBasePage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const knowledgeBases: KnowledgeBase[] = [
    {
      id: 1,
      name: 'Knowledge Base 1',
      category: 'Healthcare',
      tags: ['Supportive', 'Help Assistant'],
      version: 'v1.0',
      faqPack: 'Neuro FAQ Pack'
    },
    {
      id: 2,
      name: 'Knowledge Base 2',
      category: 'Finance',
      tags: ['Enthusiastic', 'Virtual Support Agent'],
      version: 'v1.0',
      faqPack: 'Advanced FAQ Pack'
    },
  ];

  const filteredKnowledgeBases = knowledgeBases.filter((kb) =>
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kb.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kb.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} font-poppins transition-colors duration-300 flex`}>
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
        isNaviChatbotOpen={isNaviChatbotOpen}
        setIsNaviChatbotOpen={setIsNaviChatbotOpen}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-24' : 'ml-72'} p-6 sm:p-8 overflow-y-hidden w-full max-w-7xl mx-auto`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Knowledge Base</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base sm:text-lg mt-2`}>
                Train your Neuro agent with information specific to your use case.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-300`}
            >
              <HiOutlinePlus size={20} className="mr-2" />
              Add Knowledge Base
            </button>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search"
                className={`w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500
                  ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} shadow-sm
                `}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <HiOutlineMagnifyingGlass size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <button
              type="button"
              className={`flex items-center ${isDarkMode ? 'text-gray-300 bg-gray-800 hover:bg-gray-700' : 'text-gray-600 bg-white hover:bg-gray-100'} font-medium px-4 py-2 rounded-lg shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} transition-colors duration-300`}
            >
              <HiOutlineAdjustmentsHorizontal size={20} className="mr-2" />
              Filter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredKnowledgeBases.map((kb) => (
              <KnowledgeBaseCard key={kb.id} {...kb} />
            ))}
          </div>
        </motion.div>
      </div>
      <AddKnowledgeBaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
} 