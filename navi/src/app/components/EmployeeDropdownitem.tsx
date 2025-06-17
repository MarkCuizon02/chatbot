import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  User,
  Gift,
  BookOpen, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon,
  Palette
} from 'lucide-react';

interface EmployeeDropdownItemProps {
  icon: React.ReactNode;
  label: string;
  isDarkMode: boolean;
  path?: string;
  onClick?: () => void;
  isThemeItem?: boolean;
  children?: React.ReactNode;
}

const EmployeeDropdownItem: React.FC<EmployeeDropdownItemProps> = ({ 
  icon, 
  label, 
  isDarkMode, 
  path,
  onClick,
  isThemeItem = false,
  children
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      router.push(path);
    } else {
      console.log(`Clicked ${label}`);
    }
  };

  if (isThemeItem) {
    return (
      <div className={`flex items-center justify-between px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="flex items-center space-x-3">
          <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={`${
        isDarkMode 
          ? 'text-gray-300 hover:bg-gray-700' 
          : 'text-gray-700 hover:bg-gray-50'
      } flex items-center px-4 py-3 font-medium w-full text-left transition-colors`}
    >
      <span className="mr-3 w-5 h-5 flex items-center justify-center">{icon}</span>
      {label}
    </motion.button>
  );
};

// Profile Header Component
export const ProfileHeader: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Image
          src="/images/Troy.jpg"
          alt="Troy Teeples"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
      </div>
      <div>
        <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Troy Teeples</h3>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Online</p>
      </div>
    </div>
  </div>
);

// Theme Toggle Component
export const ThemeToggle: React.FC<{ isDarkMode: boolean; toggleDarkMode: () => void }> = ({ 
  isDarkMode, 
  toggleDarkMode 
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={toggleDarkMode}
      className={`p-1 rounded-full ${
        !isDarkMode ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-400'
      } transition-colors`}
    >
      <Sun className="w-4 h-4" />
    </button>
    <button
      onClick={toggleDarkMode}
      className={`p-1 rounded-full ${
        isDarkMode ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
      } transition-colors`}
    >
      <Moon className="w-4 h-4" />
    </button>
  </div>
);

// Export the icons for use in the sidebar
export const employeeDropdownIcons = {
  Profile: <User size={20} />,
  EarnCredits: <Gift size={20} />,
  KnowledgeBase: <BookOpen size={20} />,
  Settings: <Settings size={20} />,
  HelpSupport: <HelpCircle size={20} />,
  Theme: <Palette size={20} />,
  SignOut: <LogOut size={20} />
};

export default EmployeeDropdownItem;