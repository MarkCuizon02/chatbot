"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
}

export interface Account {
  id: number;
  name: string;
  description?: string;
  type: string;
  credits: number;
  setup: boolean;
}

export interface UserContextType {
  user: User | null;
  currentAccount: Account | null;
  accounts: Account[];
  isLoading: boolean;
  switchAccount: (accountId: number) => void;
  refreshAccount: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user and account data for development
  // TODO: Replace with real authentication and account fetching
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: 1, // Use the existing user ID from database
        username: 'testuser',
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User'
      };
      
      // Mock account data (using the existing test account from database)
      const mockAccount: Account = {
        id: 1, // Use the existing account ID from database
        name: 'Test Account',
        description: 'Test account for development',
        type: 'personal',
        credits: 100,
        setup: true
      };
      
      setUser(mockUser);
      setCurrentAccount(mockAccount);
      setAccounts([mockAccount]);
      setIsLoading(false);
    };
    
    loadUserData();
  }, []);

  const switchAccount = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setCurrentAccount(account);
    }
  };

  const refreshAccount = async () => {
    // TODO: Implement actual account refresh from API
    console.log('Refreshing account data...');
    
    if (currentAccount) {
      // For now, just update the credits by fetching from the API
      try {
        const response = await fetch(`/api/accounts/${currentAccount.id}`);
        if (response.ok) {
          const accountData = await response.json();
          setCurrentAccount(prev => prev ? { ...prev, credits: accountData.credits } : null);
        }
      } catch (error) {
        console.error('Failed to refresh account:', error);
      }
    }
  };

  const value: UserContextType = {
    user,
    currentAccount,
    accounts,
    isLoading,
    switchAccount,
    refreshAccount
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// For backward compatibility and ease of use
export function useCurrentAccount() {
  const { currentAccount, refreshAccount } = useUser();
  return { currentAccount, refreshAccount };
}
