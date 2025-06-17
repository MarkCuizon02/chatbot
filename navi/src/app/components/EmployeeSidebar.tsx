'use client';

import React, { useState, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  HiOutlineChartBarSquare,
  HiOutlineUserGroup,
  HiOutlinePuzzlePiece,
  HiOutlineBell,
  HiChevronUp,
  HiBars3,
  HiOutlineLink,
  HiOutlineGift,
  HiOutlineUser, 
  HiOutlineBookOpen, 
  HiOutlineCog6Tooth, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineSwatch, 
  HiOutlineSun, 
  HiOutlineMoon, 
  HiArrowRightOnRectangle, 
  HiArrowTopRightOnSquare, 
  HiChevronDown, 
  HiXMark, 
  HiOutlineCheck, 
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineArrowPathRoundedSquare,
  HiUsers,
} from 'react-icons/hi2';
import type { IconType } from 'react-icons';
import NaviAgentsModal from './NaviAgentsModal';
import AccountCard from './AccountCard';
import EmployeeDropdownItem, { 
  employeeDropdownIcons, 
  ProfileHeader, 
  ThemeToggle 
} from './EmployeeDropdownitem';

export type SidebarProps = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
  isNaviModalOpen: boolean;
  setIsNaviModalOpen: Dispatch<SetStateAction<boolean>>;
  isNaviDropdownOpen: boolean;
  setIsNaviDropdownOpen: Dispatch<SetStateAction<boolean>>;
  isProfileOpen: boolean;
  setIsProfileOpen: Dispatch<SetStateAction<boolean>>;
  isNaviChatbotOpen: boolean;
  setIsNaviChatbotOpen: Dispatch<SetStateAction<boolean>>;
};

type NavItem = {
  name: string;
  path: string;
  icon: IconType;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: HiOutlineChartBarSquare },
  { name: 'Agents', path: '/agents', icon: HiOutlineUserGroup },
  { name: 'Connections', path: '/connections', icon: HiOutlineLink },
  { name: 'Integrations', path: '/integrations', icon: HiOutlinePuzzlePiece },
  { name: 'Earn Credits and $', path: '/earn-credits', icon: HiOutlineGift },
  { name: 'Notifications', path: '/notifications', icon: HiOutlineBell },
];

const SimplabotsLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 9.42 20.94 7.1 19.26 5.42C19.1 5.26 18.92 5.12 18.75 4.98" stroke="#38B2AC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.98 18.75C5.12 18.92 5.26 19.1 5.42 19.26C7.1 20.94 9.42 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C9.42 2 7.1 3.06 5.42 4.74" stroke="#81E6D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 14H9V12H15V14Z" fill="#38B2AC"/>
    <ellipse cx="16" cy="9.5" rx="1" ry="1.5" fill="#38B2AC"/>
    <ellipse cx="8" cy="9.5" rx="1" ry="1.5" fill="#38B2AC"/>
  </svg>
);

export default function Sidebar({
  isDarkMode,
  toggleDarkMode,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isNaviModalOpen,
  setIsNaviModalOpen,
  isNaviDropdownOpen,
  setIsNaviDropdownOpen,
  isProfileOpen,
  setIsProfileOpen,
  isNaviChatbotOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['N', 'E']); // Default selected agents
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleNavigation = (path: string) => {
    router.push(path);
    if(isNaviModalOpen) {
      setIsNaviModalOpen(false);
    }
    setIsProfileOpen(false); // Close the profile dropdown when navigating
  };


  const ProfileDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={`absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg z-50`}
    >
      {/* User Profile Header */}
      <ProfileHeader isDarkMode={isDarkMode} />

      {/* Menu Items */}
      <div className="py-2">
        <EmployeeDropdownItem 
          icon={employeeDropdownIcons.Profile} 
          label="Profile" 
          isDarkMode={isDarkMode} 
          path="/profile" 
          onClick={() => handleNavigation('/profile')}
        />
        
        <EmployeeDropdownItem 
          icon={employeeDropdownIcons.EarnCredits} 
          label="Earn Credits and $" 
          isDarkMode={isDarkMode} 
          path="/earn-credits" 
          onClick={() => handleNavigation('/earn-credits')}
        />
        
        <EmployeeDropdownItem 
          icon={employeeDropdownIcons.KnowledgeBase} 
          label="Knowledge Base" 
          isDarkMode={isDarkMode} 
          path="/knowledge-base" 
          onClick={() => handleNavigation('/knowledge-base')}
        />
        
        <EmployeeDropdownItem 
          icon={employeeDropdownIcons.Settings} 
          label="Settings" 
          isDarkMode={isDarkMode} 
          path="/settings" 
          onClick={() => handleNavigation('/settings')}
        />
        
        <EmployeeDropdownItem 
          icon={employeeDropdownIcons.HelpSupport} 
          label="Help and Support" 
          isDarkMode={isDarkMode} 
          path="/help-support" 
          onClick={() => handleNavigation('/help-support')}
        />
      </div>

      {/* Theme Toggle */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-2">
        <EmployeeDropdownItem 
          icon={employeeDropdownIcons.Theme} 
          label="Theme" 
          isDarkMode={isDarkMode} 
          isThemeItem={true}
        >
          <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </EmployeeDropdownItem>
      </div>

      {/* Sign Out */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-2">
        <EmployeeDropdownItem 
          icon={employeeDropdownIcons.SignOut} 
          label="Sign Out" 
          isDarkMode={isDarkMode} 
          onClick={() => {
            console.log('Signing out...');
            // Add your sign out logic here
          }}
        />
      </div>
    </motion.div>
  );

  const SidebarContent = () => (
    <motion.div
      initial={false}
      animate={{ width: isSidebarCollapsed ? '96px' : '288px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
      style={{
        borderTopRightRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="flex-grow overflow-y-auto overflow-x-hidden">
        <div className={`p-5 flex items-start ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="flex items-center space-x-3"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-emerald-900' : 'bg-emerald-100'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              <div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Greencheck</span>
                    <HiChevronDown size={20} className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <div className={`w-4 h-4 text-xs font-bold rounded-full flex items-center justify-center ${isDarkMode ? 'bg-cyan-900 text-cyan-300' : 'bg-cyan-100 text-cyan-600'}`}>C</div>
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>5,700</span>
                  </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} hidden lg:block`}>
            <HiBars3 size={28} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
          <button onClick={() => setIsNaviModalOpen(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} block lg:hidden`}>
            <HiXMark size={28} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
          </div>

        {!isSidebarCollapsed && <div className={`border-t mx-5 my-2 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}></div>}
        
        <nav className="flex flex-col px-5 mt-3">
          <motion.div
            animate={{
              backgroundColor: isSidebarCollapsed ? "transparent" : isDarkMode ? "#2D6A61" : "#69CABD",
              padding: isSidebarCollapsed ? "0.5rem" : "0.75rem",
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between'
            }}
            className="flex items-center rounded-full text-white w-full cursor-pointer mb-4"
            onClick={() => setIsNaviModalOpen(true)}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <Image
                src="/images/Navi.png" 
                alt="Navi"
                width={isSidebarCollapsed ? 48 : 40}
                height={isSidebarCollapsed ? 48 : 40}
                className="rounded-full"
              />
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
                    exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                  >
                    <div className="font-semibold text-white text-base">Navi</div>
                    <div className="text-xs font-light text-white opacity-90">Navigator Agent</div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            {!isSidebarCollapsed && <HiChevronDown size={24} className="text-white opacity-80" />}
          </motion.div>

          {navItems.map((item) => {
            const isActive = item.path === '/' ? pathname === '/' : pathname?.startsWith(item.path) ?? false;
            return (
            <motion.button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`px-4 py-3 my-1 rounded-xl flex items-center w-full text-left transition-colors duration-200 group ${isSidebarCollapsed ? 'justify-center' : 'space-x-4'} ${isActive ? (isDarkMode ? 'bg-emerald-900' : 'bg-emerald-100') : (isDarkMode ? 'bg-gray-900 hover:bg-emerald-800' : 'bg-white hover:bg-emerald-50')}`}
                title={item.name}
              >
                <item.icon size={28} className={`shrink-0 transition-colors duration-200 ${isActive ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : (isDarkMode ? 'text-gray-500 group-hover:text-emerald-400' : 'text-gray-400 group-hover:text-emerald-600')}`} />
                <AnimatePresence>
                  {!isSidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`text-base font-medium whitespace-nowrap transition-colors duration-200 ${isActive ? (isDarkMode ? 'text-emerald-300' : 'text-emerald-800') : (isDarkMode ? 'text-gray-300 group-hover:text-emerald-300' : 'text-gray-700 group-hover:text-emerald-800')}`}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
            </motion.button>
            );
          })}
        </nav>
              </div>

      <div className="px-5 pb-5">
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1, transition: { delay: 0.1 } }}
              exit={{ height: 0, opacity: 0 }}
              className={`text-white rounded-xl p-4 my-4 relative overflow-hidden cursor-pointer ${isDarkMode ? 'bg-gradient-to-r from-teal-600 to-green-600' : 'bg-gradient-to-r from-teal-400 to-green-400'}`}
            >
              <h3 className="font-semibold text-base mb-1">Earn Rewards</h3>
              <p className="text-sm font-light">Coming soon</p>
              <p className="text-xs font-light opacity-80 mt-1">Experience more, earn more.</p>
              <div className="absolute -bottom-2 -right-2 opacity-20">
                <HiOutlineGift size={80} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`border-t -mx-5 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}></div>

        <div className="pt-4 relative"> 
          <AnimatePresence>
        {!isSidebarCollapsed && (
              <motion.div
                key="profile-expanded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className={`flex items-center w-full text-left p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} cursor-pointer`}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <Image
                  src="/images/Troy.jpg" 
                  alt="Troy"
                  width={40}
                  height={40}
                  className="rounded-full shrink-0"
                />
                <div className="flex-1 overflow-hidden ml-3">
                  <div className={`font-semibold whitespace-nowrap ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Troy</div>
                  <div className={`text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>troy@hurdman.net</div>
                </div>
                {isProfileOpen ? <HiChevronUp size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} /> : <HiChevronDown size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
                </motion.div>
              )}
          </AnimatePresence>
          <AnimatePresence>
            {isProfileOpen && !isSidebarCollapsed && <ProfileDropdown />}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            exit={{ opacity: 0 }}
            className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}
          >
            <div className="flex items-center justify-center space-x-2 py-4">
              <SimplabotsLogo />
              <span className={`font-semibold ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>simplabots</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NaviAgentsModal
        isOpen={isNaviModalOpen}
        onClose={() => setIsNaviModalOpen(false)}
        isDarkMode={isDarkMode}
      />
      </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {isNaviModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNaviModalOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:block flex-none">
        <SidebarContent />
      </aside>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCreateGroupModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 pb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Create Group
                </h2>
                <button
                  onClick={() => setShowCreateGroupModal(false)}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="px-6 space-y-6">
                {/* Group Name */}
                <div>
                  <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm block mb-2`}>
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="Virtual Assistant"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>

                {/* Credit Limit */}
                <div>
                  <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm block mb-2`}>
                    Credit Limit
                  </label>
                  <input
                    type="text"
                    placeholder="5,000"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>

                {/* AI Agents */}
                <div>
                  <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm block mb-2`}>
                    AI Agents
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${isDarkMode ? 'bg-emerald-700 text-emerald-200' : 'bg-emerald-200 text-emerald-700'}`}>
                          N
                        </span>
                        Navi
                        <button 
                          onClick={() => setSelectedAgents(selectedAgents.filter(a => a !== 'N'))}
                          className="ml-2 text-emerald-600 hover:text-emerald-800 text-sm font-bold"
                        >
                          ×
                        </button>
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-pink-900 text-pink-300' : 'bg-pink-100 text-pink-800'}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${isDarkMode ? 'bg-pink-700 text-pink-200' : 'bg-pink-200 text-pink-700'}`}>
                          E
                        </span>
                        Emmy
                        <button 
                          onClick={() => setSelectedAgents(selectedAgents.filter(a => a !== 'E'))}
                          className="ml-2 text-pink-600 hover:text-pink-800 text-sm font-bold"
                        >
                          ×
                        </button>
                      </span>
                    </div>
                    <button
                      className={`p-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Members */}
                <div className="pb-4">
                  <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm block mb-3`}>
                    Members
                  </label>
                  <div className="flex items-center space-x-3 flex-wrap gap-3">
                    <button className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed transition-colors ${isDarkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500'}`}>
                      <HiOutlinePlus size={20} />
                    </button>
                    
                    {/* Sample member avatars */}
                    <div className="relative group">
                      <Image
                        src="/images/Troy.jpg"
                        alt="Member"
                        width={48}
                        height={48}
                        className="rounded-full cursor-pointer border-2 border-white dark:border-gray-700"
                      />
                      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'}`}>
                        Cristofer Stanton
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <Image
                        src="/images/Audra.png"
                        alt="Member"
                        width={48}
                        height={48}
                        className="rounded-full cursor-pointer border-2 border-white dark:border-gray-700"
                      />
                      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'}`}>
                        Audra Smith
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <Image
                        src="/images/Paige.png"
                        alt="Member"
                        width={48}
                        height={48}
                        className="rounded-full cursor-pointer border-2 border-white dark:border-gray-700"
                      />
                      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'}`}>
                        Paige Johnson
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <Image
                        src="/images/Pixie.png"
                        alt="Member"
                        width={48}
                        height={48}
                        className="rounded-full cursor-pointer border-2 border-white dark:border-gray-700"
                      />
                      <button className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs hover:bg-gray-500 transition-colors font-bold">
                        ×
                      </button>
                      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'}`}>
                        Pixie Lee
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateGroupModal(false)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Create Group:', { groupName, creditLimit, selectedAgents, selectedUsers });
                    setShowCreateGroupModal(false);
                    setGroupName('');
                    setCreditLimit('');
                    setSelectedAgents(['N', 'E']);
                    setSelectedUsers([]);
                  }}
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}