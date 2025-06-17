import React from 'react';
import { HiOutlineCheck, HiOutlineTrash } from 'react-icons/hi2';

interface AccountCardProps {
  email: string;
  isDarkMode: boolean;
  onDelete: (email: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  email,
  isDarkMode,
  onDelete,
}) => {
  return (
    <div className={`flex items-center px-4 py-2 text-sm justify-between ${isDarkMode ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>
      <div className="flex items-center">
        <HiOutlineCheck size={20} className="mr-3 text-emerald-500" />
        <span>{email}</span>
      </div>
      <HiOutlineTrash 
        size={20} 
        className={`cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-red-500`}
        onClick={() => onDelete(email)}
      />
    </div>
  );
};

export default AccountCard; 