'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import { HiOutlineCog } from 'react-icons/hi';

export default function AgentsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Agent data
  const frequentlyUsedAgents = [
    { name: 'Navi', image: '/images/Navi.png', bgColor: 'from-cyan-400 to-teal-500', description: 'Lorem ipsum' },
    { name: 'Flicka', image: '/images/flicka.png', bgColor: 'from-purple-600 to-indigo-700', description: 'Lorem ipsum' },
    { name: 'Audra', image: '/images/Audra.png', bgColor: 'from-green-600 to-emerald-700', description: 'Lorem ipsum' },
  ];

  const availableAgents = [
    { name: 'Navi', image: '/images/Navi.png', bgColor: 'from-cyan-400 to-teal-500', description: 'Lorem ipsum' },
    { name: 'Flicka', image: '/images/flicka.png', bgColor: 'from-purple-600 to-indigo-700', description: 'Lorem ipsum' },
    { name: 'Audra', image: '/images/Audra.png', bgColor: 'from-green-600 to-emerald-700', description: 'Lorem ipsum' },
    { name: 'Pixie', image: '/images/Pixie.png', bgColor: 'from-pink-400 to-rose-500', description: 'Lorem ipsum' },
    { name: 'Paige', image: '/images/Paige.png', bgColor: 'from-amber-400 to-orange-500', description: 'Lorem ipsum' },
    { name: 'Neuro', image: null, bgColor: 'from-gray-600 to-gray-700', description: 'Coming Soon' },
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
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsNaviModalOpen(true)}
              className={`px-4 py-2 rounded-xl ${isDarkMode ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-white text-gray-900 hover:bg-gray-200'} shadow-md transition-colors duration-200`}
            >
              Open Agents Modal
            </button>
          </div>

          {/* Agents Modal */}
          <AnimatePresence>
            {isNaviModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full max-w-4xl p-6 sm:p-8 rounded-xl ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} shadow-lg overflow-y-auto max-h-[90vh]`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold">AI Agents</h2>
                    <button
                      onClick={() => setIsNaviModalOpen(false)}
                      className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Most Frequently Used Section */}
                  <div className="mb-8">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4">Most Frequently Used</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {frequentlyUsedAgents.map((agent, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                          className={`rounded-xl p-4 flex flex-col items-center justify-center text-center text-white min-h-[180px] bg-gradient-to-br ${agent.bgColor} shadow-md`}
                        >
                          {agent.image ? (
                            <Image src={agent.image} alt={agent.name} width={96} height={96} className="rounded-full mb-2" />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center mb-2">
                              <span className="text-gray-300 text-3xl">?</span>
                            </div>
                          )}
                          <h4 className="text-lg font-semibold">{agent.name}</h4>
                          <p className="text-sm opacity-80">{agent.description}</p>
                          <HiOutlineCog size={20} className="mt-2 text-white opacity-70 hover:opacity-100 cursor-pointer" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Available Agents Section */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-4">Available Agents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {availableAgents.map((agent, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                          className={`rounded-xl p-4 flex flex-col items-center justify-center text-center text-white min-h-[180px] bg-gradient-to-br ${agent.bgColor} shadow-md`}
                        >
                          {agent.image ? (
                            <Image src={agent.image} alt={agent.name} width={96} height={96} className="rounded-full mb-2" />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center mb-2">
                              <span className="text-gray-300 text-3xl">?</span>
                            </div>
                          )}
                          <h4 className="text-lg font-semibold">{agent.name}</h4>
                          <p className="text-sm opacity-80">{agent.description}</p>
                          <HiOutlineCog size={20} className="mt-2 text-white opacity-70 hover:opacity-100 cursor-pointer" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}