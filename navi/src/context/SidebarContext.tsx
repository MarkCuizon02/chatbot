'use client';

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface SidebarContextType {
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
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);

  const value: SidebarContextType = {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isNaviModalOpen,
    setIsNaviModalOpen,
    isNaviDropdownOpen,
    setIsNaviDropdownOpen,
    isProfileOpen,
    setIsProfileOpen,
    isNaviChatbotOpen,
    setIsNaviChatbotOpen,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}; 