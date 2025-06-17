'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import AgentsModal from '../components/AgentsModal';

export default function AgentsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAgentsModalOpen, setIsAgentsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const availableAgents = [
    { name: 'Navi', image: '/images/Navi.png', bgColor: 'from-cyan-400 to-teal-500', description: 'Lorem ipsum' },
    { name: 'Flicka', image: '/images/flicka.png', bgColor: 'from-purple-600 to-indigo-700', description: 'Lorem ipsum' },
    { name: 'Audra', image: '/images/Audra.png', bgColor: 'from-green-600 to-emerald-700', description: 'Lorem ipsum' },
    { name: 'Pixie', image: '/images/Pixie.png', bgColor: 'from-pink-400 to-rose-500', description: 'Lorem ipsum' },
    { name: 'Paige', image: '/images/Paige.png', bgColor: 'from-amber-400 to-orange-500', description: 'Lorem ipsum' },
    { name: 'Neuro', image: null, bgColor: 'from-gray-600 to-gray-700', description: 'Coming Soon' },
  ];

  const comingSoonAgents = [
    { name: 'Navi', image: '/images/Navi.png', bgColor: 'from-cyan-400 to-teal-500', description: 'Lorem ipsum' },
    { name: 'Flicka', image: '/images/flicka.png', bgColor: 'from-purple-600 to-indigo-700', description: 'Lorem ipsum' },
    { name: 'Audra', image: '/images/Audra.png', bgColor: 'from-green-600 to-emerald-700', description: 'Lorem ipsum' },
    { name: 'Pixie', image: '/images/Pixie.png', bgColor: 'from-pink-400 to-rose-500', description: 'Lorem ipsum' },
    { name: 'Paige', image: '/images/Paige.png', bgColor: 'from-amber-400 to-orange-500', description: 'Lorem ipsum' },
    { name: 'Neuro', image: null, bgColor: 'from-gray-600 to-gray-700', description: 'Coming Soon' },
  ];

  const openAgentsModal = (agent: any) => {
    setSelectedAgent(agent);
    setIsAgentsModalOpen(true);
  };

  const closeAgentsModal = () => {
    setIsAgentsModalOpen(false);
    setSelectedAgent(null);
  };

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
        setIsProfileOpen={setIsProfileOpen} isNaviChatbotOpen={false} setIsNaviChatbotOpen={function (value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.');
        } }      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-12' : 'ml-32'} p-6 sm:p-8 overflow-x-hidden flex justify-center ${isAgentsModalOpen ? 'filter blur-sm' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 sm:mb-10">
            <div className="text-center sm:text-left w-full">
              <h1 className="text-3xl sm:text-4xl font-extrabold">Meet Your Agents</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base sm:text-lg mt-2`}>
                Lorem ipsum dolor sit amet consectetur. Etiu eu eu mauris purus. Facibus amet sed ut
              </p>
            </div>
          </div>

          <div className="mb-10 sm:mb-14">
            <h2 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-xl sm:text-2xl font-semibold mb-6 sm:mb-8`}>Available Agents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {availableAgents.map((agent, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className={`rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center text-white min-h-[180px] sm:min-h-[220px] bg-gradient-to-br ${agent.bgColor} shadow-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer`}
                  onClick={() => openAgentsModal(agent)}
                >
                  {agent.image ? (
                    <Image src={agent.image} alt={agent.name} width={96} height={96} className="rounded-full mb-3 sm:mb-4" />
                  ) : (
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gray-500 flex items-center justify-center mb-3 sm:mb-4">
                      <span className="text-gray-300 text-3xl sm:text-5xl">?</span>
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-semibold">{agent.name}</h3>
                  <p className="text-base sm:text-lg opacity-80 mt-2">{agent.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-xl sm:text-2xl font-semibold mb-6 sm:mb-8`}>Coming Soon Agents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {comingSoonAgents.map((agent, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className={`rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center text-white min-h-[180px] sm:min-h-[220px] bg-gradient-to-br ${agent.bgColor} shadow-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  {agent.image ? (
                    <Image src={agent.image} alt={agent.name} width={96} height={96} className="rounded-full mb-3 sm:mb-4" />
                  ) : (
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gray-500 flex items-center justify-center mb-3 sm:mb-4">
                      <span className="text-gray-300 text-3xl sm:text-5xl">?</span>
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-semibold">{agent.name}</h3>
                  <p className="text-base sm:text-lg opacity-80 mt-2">{agent.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <AgentsModal
        isOpen={isAgentsModalOpen}
        onClose={closeAgentsModal}
        isDarkMode={isDarkMode}
        agent={selectedAgent}
      />
    </div>
  );
}