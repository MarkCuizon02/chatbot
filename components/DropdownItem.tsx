import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Users, CreditCard, Trophy, BookOpen, Settings, HelpCircle, LogOut, Sun, Moon, ChevronDown, Link as LinkIcon } from 'lucide-react';

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  isDarkMode: boolean;
  hasExternalLink?: boolean;
  path?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ icon, label, isDarkMode, hasExternalLink, path }) => {
  const router = useRouter();

  const handleClick = () => {
    if (path) {
      router.push(path);
    } else {
      // Placeholder for items without a specific path, e.g., Sign Out if it becomes a DropdownItem
      console.log(`Clicked ${label}`);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} flex items-center px-5 py-2 font-medium w-full text-left`}
    >
      <span className="mr-3">{icon}</span>
      {label}
      {hasExternalLink && (
        <span className="ml-auto flex items-center space-x-2">
          <Image src="/images/h_icon.png" alt="H icon" width={20} height={20} className="rounded-full" />
          <LinkIcon size={16} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </span>
      )}
    </motion.button>
  );
};

export default DropdownItem; 