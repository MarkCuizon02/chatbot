'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineGift } from 'react-icons/hi2';

export default function EarnRewardsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);

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
      <div className={`flex-1 flex items-center justify-center transition-all duration-300 ${isSidebarCollapsed ? 'ml-12' : 'ml-32'} p-6 sm:p-8`}>  
        <div className={`rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-col items-center justify-center p-10 w-full max-w-md`}>
          <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-6 ${isDarkMode ? 'bg-teal-900' : 'bg-teal-100'}`}>
            <HiOutlineGift size={40} className={`${isDarkMode ? 'text-teal-300' : 'text-teal-500'}`} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Coming Soon!</h1>
          <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>Stay tuned for more updates and get ready to maximize your earning potential!</p>
        </div>
      </div>
    </div>
  );
} 