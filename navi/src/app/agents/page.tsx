'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Sidebar from '@/app/components/Sidebar';
import AgentsModal from '@/app/components/AgentsModal';

export default function AgentsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAgentsModalOpen, setIsAgentsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);

  const agentsData = [
    {
      name: 'Navi',
      image: '/images/Navi.png',
      bgColor: 'from-cyan-400 to-teal-500',
      description: 'Your personal dashboard assistant for managing your account, companies, and more. Helps with account setup, adding new companies, etc.',
      role: 'Dashboard Assistant',
      roleDescription: 'Your guide for account management',
      features: [
        { title: 'Account Setup', description: 'Streamlined onboarding process.' },
        { title: 'Company Management', description: 'Add or remove companies easily.' },
        { title: 'Billing Inquiries', description: 'Get help with your subscription.' },
        { title: 'User Support', description: 'Answers to your questions.' },
      ],
    },
    {
      name: 'Flicka',
      image: '/images/flicka.png',
      bgColor: 'from-purple-600 to-indigo-700',
      description: 'AI-powered video generation to create stunning videos from text prompts, similar to Kling.',
      role: 'Video Generation',
      roleDescription: 'AI-powered video creation',
      features: [
        { title: 'Text-to-Video', description: 'Generate video from a simple prompt.' },
        { title: 'High-Resolution Output', description: 'Export in 1080p and 4K.' },
        { title: 'Multiple Styles', description: 'Cinematic, animation, and more.' },
        { title: 'Scene Control', description: 'Fine-tune scenes and characters.' },
      ],
    },
    {
      name: 'Audra',
      image: '/images/Audra.png',
      bgColor: 'from-green-600 to-emerald-700',
      description: 'Generate realistic, lifelike audio and speech, similar to Eleven Labs.',
      role: 'Audio Generation',
      roleDescription: 'Lifelike text-to-speech AI',
      features: [
        { title: 'Text-to-Speech', description: 'Convert text into natural audio.' },
        { title: 'Voice Cloning', description: 'Clone your own voice securely.' },
        { title: 'Multiple Languages', description: 'Support for over 20 languages.' },
        { title: 'Emotion Control', description: 'Add emotion to the generated audio.' },
      ],
    },
    {
      name: 'Pixie',
      image: '/images/Pixie.png',
      bgColor: 'from-pink-400 to-rose-500',
      description: 'Your creative partner for generating stunning and artistic images from text, like Midjourney or DALL-E.',
      role: 'Image Generation',
      roleDescription: 'Create images from text',
      features: [
        { title: 'Text-to-Image', description: 'Create visuals from text prompts.' },
        { title: 'Artistic Styles', description: 'Generate in various artistic styles.' },
        { title: 'Image Editing', description: 'Modify existing images with AI.' },
        { title: 'High-Fidelity Output', description: 'Produce high-resolution images.' },
      ],
    },
    {
      name: 'Paige',
      image: '/images/Paige.png',
      bgColor: 'from-amber-400 to-orange-500',
      description: 'An intelligent web chat bot to engage visitors on your customer-facing website and provide automated support.',
      role: 'Web Chat Bot',
      roleDescription: 'Engage your website visitors',
      features: [
        { title: 'Live Chat', description: 'Seamless handoff to human agents.' },
        { title: 'Lead Generation', description: 'Capture leads from conversations.' },
        { title: 'FAQ Automation', description: 'Answer common questions instantly.' },
        { title: 'Customizable Branding', description: 'Match the bot to your brand.' },
      ],
    },
  ];

  const comingSoonAgents = [
    {
      name: 'Hunter',
      image: null,
      bgColor: 'from-blue-600 to-blue-700',
      description: 'Coming Soon',
      role: 'Coming Soon',
      roleDescription: 'This agent is under development.',
      features: [
        { title: 'Advanced Analytics', description: 'Future capability.' },
        { title: 'Data Processing', description: 'Future capability.' },
      ],
    },
    {
      name: 'Dominic',
      image: null,
      bgColor: 'from-red-600 to-red-700',
      description: 'Coming Soon',
      role: 'Coming Soon',
      roleDescription: 'This agent is under development.',
      features: [
        { title: 'Machine Learning', description: 'Future capability.' },
        { title: 'Pattern Recognition', description: 'Future capability.' },
      ],
    },
    {
      name: 'Adsy',
      image: null,
      bgColor: 'from-yellow-600 to-yellow-700',
      description: 'Coming Soon',
      role: 'Coming Soon',
      roleDescription: 'This agent is under development.',
      features: [
        { title: 'Ad Campaign Management', description: 'Future capability.' },
        { title: 'Marketing Automation', description: 'Future capability.' },
      ],
    },
    {
      name: 'Paige',
      image: null,
      bgColor: 'from-indigo-600 to-indigo-700',
      description: 'Coming Soon',
      role: 'Coming Soon',
      roleDescription: 'This agent is under development.',
      features: [
        { title: 'Content Creation', description: 'Future capability.' },
        { title: 'Writing Assistant', description: 'Future capability.' },
      ],
    },
    {
      name: 'Callie',
      image: null,
      bgColor: 'from-emerald-600 to-emerald-700',
      description: 'Coming Soon',
      role: 'Coming Soon',
      roleDescription: 'This agent is under development.',
      features: [
        { title: 'Customer Support', description: 'Future capability.' },
        { title: 'Call Management', description: 'Future capability.' },
      ],
    },
    {
      name: 'Emmy',
      image: null,
      bgColor: 'from-violet-600 to-violet-700',
      description: 'Coming Soon',
      role: 'Coming Soon',
      roleDescription: 'This agent is under development.',
      features: [
        { title: 'Email Marketing', description: 'Future capability.' },
        { title: 'Campaign Analytics', description: 'Future capability.' },
      ],
    },
  ];

  const availableAgents = agentsData;

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
        setIsProfileOpen={setIsProfileOpen}
        isNaviChatbotOpen={isNaviChatbotOpen}
        setIsNaviChatbotOpen={setIsNaviChatbotOpen}
      />
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
                  <p className="text-base sm:text-lg opacity-80 mt-2">{agent.role}</p>
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
                  className={`rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center text-white min-h-[180px] sm:min-h-[220px] bg-gradient-to-br ${agent.bgColor} shadow-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} opacity-30 cursor-not-allowed`}
                >
                  {agent.image ? (
                    <Image src={agent.image} alt={agent.name} width={96} height={96} className="rounded-full mb-3 sm:mb-4" />
                  ) : (
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gray-500 flex items-center justify-center mb-3 sm:mb-4">
                      <span className="text-gray-300 text-3xl sm:text-5xl">?</span>
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-semibold">{agent.name}</h3>
                  <p className="text-base sm:text-lg opacity-80 mt-2">{agent.role}</p>
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