'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineMagnifyingGlass, HiOutlineUserPlus, HiLink, HiOutlinePlus, HiOutlineEnvelope, HiEllipsisHorizontal, HiOutlinePencil, HiOutlineKey, HiOutlineUserGroup, HiOutlineTrash, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import Sidebar from '../components/Sidebar';
import { HiX } from 'react-icons/hi';

interface UserItem {
  id: number;
  name: string;
  email: string;
  avatar: string;
  access: 'Owner' | 'Admin' | 'Support Agent' | 'Team Lead' | 'Requested';
  group: 'Admin' | 'Tech Virtual Assistant' | 'Chat Support' | 'Not Assigned' | string;
  credit: 'Unlimited' | number;
  agents: string[];
  status?: 'pending' | 'active';
}

export default function ManageUsersPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'all' | 'unassigned' | 'groups'>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [creditLimit, setCreditLimit] = useState<number | ''>('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 1,
      name: 'Oliver Thompson',
      email: 'oliverthompson@email.com',
      avatar: '/images/Oliver.jpg',
      access: 'Owner',
      group: 'Admin',
      credit: 'Unlimited',
      agents: ['N', 'P', 'C'],
    },
    {
      id: 2,
      name: 'Gretchen Schleifer',
      email: 'gretchen@email.com',
      avatar: '/images/Gretchen.jpg',
      access: 'Admin',
      group: 'Admin',
      credit: 'Unlimited',
      agents: ['N', 'P', 'C'],
    },
    {
      id: 3,
      name: 'Cristofer Stanton',
      email: 'cristoferpson@email.com',
      avatar: '/images/Cristofer.jpg',
      access: 'Support Agent',
      group: 'Tech Virtual Assistant',
      credit: 5000,
      agents: ['N', 'P', 'C', '+2'],
    },
    
    {
      id: 4,
      name: 'Hanna Kenter',
      email: 'hanna@email.com',
      avatar: '/images/Hanna.jpg',
      access: 'Team Lead',
      group: 'Tech Virtual Assistant',
      credit: 10000,
      agents: ['N', 'P', 'C'],
    },
    {
      id: 5,
      name: 'Jaxson Herwitz',
      email: 'jaxson@email.com',
      avatar: '/images/Jaxson.jpg',
      access: 'Support Agent',
      group: 'Tech Virtual Assistant',
      credit: 5000,
      agents: ['N', 'C'],
    },
    {
      id: 6,
      name: 'Marcus Korsgaard',
      email: 'marcus@email.com',
      avatar: '/images/Marcus.jpg',
      access: 'Team Lead',
      group: 'Chat Support',
      credit: 10000,
      agents: ['N', 'F'],
    },
    {
      id: 7,
      name: 'Martin Ekstrom Bothman',
      email: 'martin@email.com',
      avatar: '/images/Martin.jpg',
      access: 'Support Agent',
      group: 'Chat Support',
      credit: 5000,
      agents: ['N', 'C'],
    },
    {
      id: 8,
      name: 'Ann George',
      email: 'ann@email.com',
      avatar: '/images/Ann.jpg',
      access: 'Support Agent',
      group: 'Chat Support',
      credit: 5000,
      agents: ['N', 'C'],
    },
    {
      id: 9,
      name: 'Martin Torff',
      email: 'martintorff@email.com',
      avatar: '/images/Martin.jpg',
      access: 'Requested',
      group: 'Not Assigned',
      credit: 0,
      agents: [],
    },
    {
      id: 10,
      name: 'Carter Saris',
      email: 'cartersaris@email.com',
      avatar: '/images/Carter.jpg',
      access: 'Requested',
      group: 'Not Assigned',
      credit: 0,
      agents: [],
    },
    {
      id: 11,
      name: 'Charlie Press',
      email: 'charlie@email.com',
      avatar: '/images/Charlie.jpg',
      access: 'Requested',
      group: 'Not Assigned',
      credit: 0,
      agents: [],
      status: 'pending',
    },
    {
      id: 12,
      name: 'Cheyenne Bator',
      email: 'cheyenne@email.com',
      avatar: '/images/Cheyenne.jpg',
      access: 'Requested',
      group: 'Not Assigned',
      credit: 0,
      agents: [],
      status: 'pending',
    },
    {
      id: 13,
      name: 'James Levin',
      email: 'james@email.com',
      avatar: '/images/James.jpg',
      access: 'Requested',
      group: 'Not Assigned',
      credit: 0,
      agents: [],
      status: 'pending',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedGroupForAddMember, setSelectedGroupForAddMember] = useState<string | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserItem[]>([]);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<UserItem[]>([]);
  const [showAgentsModal, setShowAgentsModal] = useState(false);

  const members = [
    {
      id: 1,
      name: "Oliver Thompson",
      email: "oliverthompson@email.com",
      avatar: "/path/to/oliver-avatar.jpg",
      access: "Admin" as const,
      group: "Admin",
      credit: "Unlimited" as const,
      agents: []
    },
    {
      id: 2,
      name: "Hanna Kenter",
      email: "hanna@email.com",
      avatar: "/path/to/hanna-avatar.jpg",
      access: "Admin" as const,
      group: "Admin",
      credit: "Unlimited" as const,
      agents: []
    }
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unassignedCount = users.filter(user => user.group === 'Not Assigned').length;
  const allUsersCount = users.length;
  const groupsCount = [...new Set(users.map(user => user.group).filter(group => group !== 'Not Assigned'))].length;

  const groupedUsers = users.reduce((acc, user) => {
    if (user.group !== 'Not Assigned') {
      if (!acc[user.group]) {
        acc[user.group] = [];
      }
      acc[user.group].push(user);
    }
    return acc;
  }, {} as Record<string, UserItem[]>);

  const filteredUsers = activeTab === 'all'
    ? users
    : activeTab === 'unassigned'
      ? users.filter(user => user.group === 'Not Assigned')
      : users; // Placeholder for now, will be replaced with grouped rendering

  const getAccessTagClass = (access: UserItem['access']) => {
    switch (access) {
      case 'Owner':
        return 'bg-blue-100 text-blue-800';
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Support Agent':
        return 'bg-yellow-100 text-yellow-800';
      case 'Team Lead':
        return 'bg-green-100 text-green-800';
      case 'Requested':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  const handleDeleteUser = (userId: number) => {
    setShowDeleteConfirm(userId);
  };

  const confirmDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowDeleteConfirm(null);
    setOpenDropdownId(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const openAddMemberModal = (groupName: string) => {
    setSelectedGroupForAddMember(groupName);
    setShowAddMemberModal(true);
  };

  const closeAddMemberModal = () => {
    setShowAddMemberModal(false);
    setSelectedGroupForAddMember(null);
  };

  const handleAddMembersToGroup = (groupName: string, userIds: number[]) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        userIds.includes(user.id) ? { ...user, group: groupName } : user
      )
    );
    closeAddMemberModal();
  };

  const handleAddMembersClick = () => {
    // Filter out users that are already in the group
    const available = users.filter(user => !selectedGroupMembers.some(member => member.id === user.id));
    setAvailableUsers(available);
    setShowAddMembersModal(true);
  };

  const handleMemberSelect = (user: UserItem) => {
    setSelectedGroupMembers(prev => [...prev, user]);
    setAvailableUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const handleMemberRemove = (userId: number) => {
    const removedUser = selectedGroupMembers.find(member => member.id === userId);
    if (removedUser) {
      setSelectedGroupMembers(prev => prev.filter(member => member.id !== userId));
      setAvailableUsers(prev => [...prev, removedUser]);
    }
  };

  const agents = [
    {
      id: 'N',
      name: 'Navi',
      description: 'Your smart, friendly assistant',
      avatar: '/images/Navi.png',
      color: 'emerald'
    },
    {
      id: 'P',
      name: 'Pixie',
      description: 'Conversational AI',
      avatar: '/images/Pixie.png',
      color: 'pink'
    },
    {
      id: 'PA',
      name: 'Paige',
      description: 'Image Generation',
      avatar: '/images/Paige.png',
      color: 'yellow'
    },
    {
      id: 'A',
      name: 'Audra',
      description: 'Video Generation',
      avatar: '/images/Audra.png',
      color: 'teal'
    },
    {
      id: 'F',
      name: 'Flicka',
      description: 'Audio Generation',
      avatar: '/images/flicka.png',
      color: 'purple'
    }
  ];

  const handleAgentSelect = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  const getAgentColor = (color: string, isDark: boolean) => {
    const colors = {
      emerald: isDark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-800',
      pink: isDark ? 'bg-pink-900 text-pink-300' : 'bg-pink-100 text-pink-800',
      yellow: isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      teal: isDark ? 'bg-teal-900 text-teal-300' : 'bg-teal-100 text-teal-800',
      purple: isDark ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  const getAgentBadgeColor = (color: string, isDark: boolean) => {
    const colors = {
      emerald: isDark ? 'bg-emerald-700 text-emerald-200' : 'bg-emerald-200 text-emerald-700',
      pink: isDark ? 'bg-pink-700 text-pink-200' : 'bg-pink-200 text-pink-700',
      yellow: isDark ? 'bg-yellow-700 text-yellow-200' : 'bg-yellow-200 text-yellow-700',
      teal: isDark ? 'bg-teal-700 text-teal-200' : 'bg-teal-200 text-teal-700',
      purple: isDark ? 'bg-purple-700 text-purple-200' : 'bg-purple-200 text-purple-700'
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  const renderUserTable = () => (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} sticky top-0 z-10`}>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out" />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agents</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredUsers.map((user) => (
            <tr key={user.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <Image className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} width={40} height={40} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {user.group === 'Not Assigned' ? (
                  <select className={`block w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}>
                    <option>Assign Group</option>
                    <option>Admin</option>
                    <option>Tech Virtual Assistant</option>
                    <option>Chat Support</option>
                  </select>
                ) : (
                  user.group
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {typeof user.credit === 'number' ? `$${user.credit.toLocaleString()}` : (
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                    {user.credit}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {user.agents.length > 0 ? (
                  <div className="flex space-x-2">
                    {user.agents.slice(0, 2).map((agent, agentIndex) => {
                      const agentObj = agents.find(a => a.id === agent);
                      return (
                        <span key={agentIndex} className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${agentObj ? getAgentColor(agentObj.color, isDarkMode) : (isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700')}`}>
                          {agent}
                        </span>
                      );
                    })}
                    {user.agents.length > 2 && (
                      <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                        +{user.agents.length - 2}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative inline-block text-right">
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                    className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-100'} p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                    aria-expanded={openDropdownId === user.id}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open options</span>
                    <HiEllipsisHorizontal size={20} />
                  </button>
                  <AnimatePresence>
                    {openDropdownId === user.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
                      >
                        <div className="py-1">
                          <button onClick={() => console.log('Edit')} className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} flex items-center px-4 py-2 text-sm w-full text-left`}>
                            <HiOutlinePencil size={18} className="mr-2" />
                            Edit
                          </button>
                          <button onClick={() => console.log('Assign Access')} className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} flex items-center px-4 py-2 text-sm w-full text-left`}>
                            <HiOutlineKey size={18} className="mr-2" />
                            Assign Access
                          </button>
                          <button onClick={() => console.log('Assign Group')} className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} flex items-center px-4 py-2 text-sm w-full text-left`}>
                            <HiOutlineUserGroup size={18} className="mr-2" />
                            Assign Group
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className={`${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'} flex items-center px-4 py-2 text-sm w-full text-left`}>
                            <HiOutlineTrash size={18} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {showDeleteConfirm === user.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} origin-top-right absolute right-0 mt-2 w-96 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20`}
                      >
                        <div className="p-5">
                          <div className="flex items-center mb-4">
                            <div className={`flex-shrink-0 p-2 rounded-full ${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                              <HiOutlineTrash size={20} className={`${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                            </div>
                            <h3 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'} text-base font-semibold ml-3`}>Delete User</h3>
                          </div>
                          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-5 leading-relaxed`}>
                            Are you sure you want to delete <span className="font-medium">{user.name}</span>?
                          </p>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={cancelDelete}
                              className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200`}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => confirmDelete(user.id)}
                              className={`${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200`}
                            >
                              Delete User
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGroupedUsers = () => {
    const sortedGroupNames = Object.keys(groupedUsers).sort((a, b) => {
      // Custom sorting for group names as per the image (Admins, Tech Virtual Group, Chat Support Group)
      const order = {
        'Admin': 1,
        'Tech Virtual Assistant': 2,
        'Chat Support': 3,
      };
      const orderA = order[a as keyof typeof order] || 99;
      const orderB = order[b as keyof typeof order] || 99;
      return orderA - orderB;
    });

    return (
      <div className="mt-8 space-y-8">
        {sortedGroupNames.map(groupName => (
          <div key={groupName} className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-lg shadow-sm overflow-hidden`}>
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-lg font-semibold`}>{groupName}</h2>
              <div className="flex items-center space-x-4">
                <button className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} flex items-center space-x-2 text-sm font-medium p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700`} onClick={() => openAddMemberModal(groupName)}>
                  <HiOutlineUserPlus size={18} />
                  <span>Add Member</span>
                </button>
                <button className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700`}>
                  <HiOutlineAdjustmentsHorizontal size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agents</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {groupedUsers[groupName].map((user) => (
                    <tr key={user.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} width={40} height={40} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.group === 'Not Assigned' ? (
                          <select className={`block w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}>
                            <option>Assign Group</option>
                            <option>Admin</option>
                            <option>Tech Virtual Assistant</option>
                            <option>Chat Support</option>
                          </select>
                        ) : (
                          user.group
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {typeof user.credit === 'number' ? `$${user.credit.toLocaleString()}` : (
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                            {user.credit}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.agents.length > 0 ? (
                          <div className="flex space-x-2">
                            {user.agents.slice(0, 2).map((agent, agentIndex) => {
                              const agentObj = agents.find(a => a.id === agent);
                              return (
                                <span key={agentIndex} className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${agentObj ? getAgentColor(agentObj.color, isDarkMode) : (isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700')}`}>
                                  {agent}
                                </span>
                              );
                            })}
                            {user.agents.length > 2 && (
                              <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                                +{user.agents.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block text-right">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-100'} p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                            aria-expanded={openDropdownId === user.id}
                            aria-haspopup="true"
                          >
                            <span className="sr-only">Open options</span>
                            <HiEllipsisHorizontal size={20} />
                          </button>
                          <AnimatePresence>
                            {openDropdownId === user.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
                              >
                                <div className="py-1">
                                  <button onClick={() => console.log('Edit')} className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} flex items-center px-4 py-2 text-sm w-full text-left`}>
                                    <HiOutlinePencil size={18} className="mr-2" />
                                    Edit
                                  </button>
                                  <button onClick={() => console.log('Assign Access')} className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} flex items-center px-4 py-2 text-sm w-full text-left`}>
                                    <HiOutlineKey size={18} className="mr-2" />
                                    Assign Access
                                  </button>
                                  <button onClick={() => console.log('Assign Group')} className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} flex items-center px-4 py-2 text-sm w-full text-left`}>
                                    <HiOutlineUserGroup size={18} className="mr-2" />
                                    Assign Group
                                  </button>
                                  <button onClick={() => handleDeleteUser(user.id)} className={`${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'} flex items-center px-4 py-2 text-sm w-full text-left`}>
                                    <HiOutlineTrash size={18} className="mr-2" />
                                    Delete
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <AnimatePresence>
                            {showDeleteConfirm === user.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} origin-top-right absolute right-0 mt-2 w-96 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20`}
                              >
                                <div className="p-5">
                                  <div className="flex items-center mb-4">
                                    <div className={`flex-shrink-0 p-2 rounded-full ${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                                      <HiOutlineTrash size={20} className={`${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                                    </div>
                                    <h3 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'} text-base font-semibold ml-3`}>Delete User</h3>
                                  </div>
                                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-5 leading-relaxed`}>
                                    Are you sure you want to delete <span className="font-medium">{user.name}</span>?
                                  </p>
                                  <div className="flex justify-end space-x-3">
                                    <button
                                      onClick={cancelDelete}
                                      className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200`}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => confirmDelete(user.id)}
                                      className={`${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200`}
                                    >
                                      Delete User
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} flex font-poppins transition-colors duration-300`}>
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
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-12' : 'ml-32'} p-4 sm:p-6 lg:p-8 overflow-x-auto`}>
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-500">Manage Users</h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base sm:text-lg mt-2`}>Manage your team members and their account permissions.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
                <div className={`relative flex items-center rounded-full pl-4 pr-3 py-2.5 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                  <HiOutlineMagnifyingGlass size={20} className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search user..."
                    className={`pl-2 bg-transparent focus:outline-none w-48 sm:w-64 ${isDarkMode ? 'text-gray-100 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
                <button className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-100'} border px-3 py-2.5 rounded-lg flex items-center justify-center shadow-sm`}>
                  <HiOutlineAdjustmentsHorizontal size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
                <button className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-100'} border px-4 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-sm`} onClick={() => setShowCreateGroupModal(true)}>
                  <HiOutlinePlus size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span>Create Groups</span>
                </button>
                <button className={`${isDarkMode ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'} px-4 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-md`}>
                  <HiOutlineEnvelope size={20} />
                  <span>Invite User</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className={`flex rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-1 shadow-sm`}>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${activeTab === 'all' ? (isDarkMode ? 'bg-teal-600 text-white' : 'bg-white text-gray-900 shadow-inner') : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200')}`}
                >
                  All Users ({allUsersCount})
                </button>
                <button
                  onClick={() => setActiveTab('groups')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${activeTab === 'groups' ? (isDarkMode ? 'bg-teal-600 text-white' : 'bg-white text-gray-900 shadow-inner') : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200')}`}
                >
                  Groups ({groupsCount})
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'groups' ? renderGroupedUsers() : (filteredUsers.length > 0 ? renderUserTable() : (
            <div className="flex flex-col items-center justify-center py-12 text-center w-full max-w-md mx-auto">
              <div className="relative mb-6">
                <HiOutlineUserPlus size={48} className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <span className={`absolute bottom-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white ${isDarkMode ? 'bg-teal-600' : 'bg-teal-500'} rounded-full`}>
                  <HiOutlinePlus size={16} />
                </span>
              </div>
              <h2 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} text-xl font-semibold mb-2`}>Invite your first user</h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center max-w-md`}>Add your team members and external users.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6 w-full">
                <button className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-100'} border px-6 py-3 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-sm`}>
                  <HiLink size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span>Copy Share Link</span>
                </button>
                <button className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-100'} border px-6 py-3 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-sm`}>
                  <HiOutlinePlus size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span>Create Groups</span>
                </button>
                <button className={`${isDarkMode ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'} px-6 py-3 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-md`}>
                  <HiOutlineEnvelope size={20} />
                  <span>Invite User</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>      
      
      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCreateGroupModal(false)}
          >            <motion.div
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
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setCreditLimit('');
                      } else {
                        const numericValue = parseInt(value.replace(/,/g, ''), 10);
                        if (!isNaN(numericValue)) {
                          setCreditLimit(numericValue);
                        }
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>

                {/* AI Agents */}
                <div>
                  <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm block mb-2`}>
                    AI Agents
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      {selectedAgents.map(agentId => {
                        const agent = agents.find(a => a.id === agentId);
                        if (!agent) return null;
                        return (
                          <span key={agent.id} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAgentColor(agent.color, isDarkMode)}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${getAgentBadgeColor(agent.color, isDarkMode)}`}>
                              {agent.id}
                            </span>
                            {agent.name}
                            <button 
                              onClick={() => handleAgentSelect(agent.id)}
                              className="ml-2 hover:text-opacity-75"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setShowAgentsModal(true)}
                      className={`p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
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
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleAddMembersClick}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed transition-colors ${
                        isDarkMode 
                          ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                          : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500'
                      }`}
                    >
                      <HiOutlinePlus size={20} />
                    </button>
                    {selectedGroupMembers.map((member) => (
                      <div key={member.id} className="relative group">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700"
                        />
                        <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'}`}>
                          {member.name}
                        </div>
                        <button 
                          onClick={() => handleMemberRemove(member.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs hover:bg-gray-500 transition-colors font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
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
                    setSelectedAgents([]);
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

      {/* Members Modal */}
      <AnimatePresence>
        {showMembersModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMembersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 pb-4 flex-shrink-0">
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Members
                </h2>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  />
                </div>
              </div>
              
              {/* Scrollable Members List */}
              <div className="flex-1 overflow-y-auto px-6">
                <div className="space-y-2 pb-4">
                  {filteredMembers.map((member) => (
                    <div 
                      key={member.id}
                      className={`flex items-center justify-between p-3 rounded-2xl group cursor-pointer transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700/50 hover:bg-gray-700' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => handleMemberSelect(member)}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full flex-shrink-0"
                        />
                        <div className="ml-3 min-w-0 flex-1">
                          <h3 className={`font-semibold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {member.name}
                          </h3>
                          <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {member.email}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMemberRemove(member.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2 ${
                          isDarkMode 
                            ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200' 
                            : 'hover:bg-gray-300 text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {filteredMembers.length === 0 && (
                    <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchTerm ? 'No members found' : 'No members yet'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 pt-4 flex-shrink-0 border-t border-gray-200/20">
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleAddMembersClick}
                    className={`flex items-center px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-teal-600 text-white hover:bg-teal-700' 
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Members
                  </button>
                  
                  <button
                    onClick={() => setShowMembersModal(false)}
                    className={`px-6 py-2 rounded-xl font-medium transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Members Modal */}
      <AnimatePresence>
        {showAddMembersModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddMembersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Members</h2>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  />
                </div>
                {/* Scrollable members list with max height and padding */}
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {availableUsers
                    .filter(user => 
                      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => {
                      const isSelected = selectedGroupMembers.some(member => member.id === user.id);
                      return (
                        <div 
                          key={user.id} 
                          onClick={() => {
                            if (!isSelected) handleMemberSelect(user);
                          }}
                          className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${
                            isSelected
                              ? (isDarkMode ? 'bg-teal-700/40' : 'bg-teal-100')
                              : (isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/50 cursor-pointer' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer')
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleMemberRemove(user.id);
                              }}
                              className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-400 text-white hover:bg-gray-500 transition-colors font-bold"
                              title="Remove"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Agents Modal */}
      <AnimatePresence>
        {showAgentsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAgentsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl w-full max-w-md mx-4 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  AI Agents
                </h2>
                
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search Agents..."
                    className={`w-full px-4 py-3 rounded-2xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  />
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {/* All AI Agents Option */}
                  <div 
                    onClick={() => {
                      // Select all agents
                      const allAgentIds = agents.map(agent => agent.id);
                      setSelectedAgents(allAgentIds);
                      setShowAgentsModal(false);
                    }}
                    className={`flex items-center p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-gray-700/50' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-teal-600' : 'bg-teal-500'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        All AI Agents
                      </h3>
                    </div>
                    {selectedAgents.length === agents.length && (
                      <div className={`ml-auto ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Individual AI Agents */}
                  {agents.map((agent) => (
                    <div 
                      key={agent.id}
                      onClick={() => {
                        handleAgentSelect(agent.id);
                        setShowAgentsModal(false);
                      }}
                      className={`flex items-center p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                        isDarkMode 
                          ? 'hover:bg-gray-700/50' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Image
                        src={agent.avatar}
                        alt={agent.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {agent.name}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {agent.description}
                        </p>
                      </div>
                      {selectedAgents.includes(agent.id) && (
                        <div className={`ml-auto ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}