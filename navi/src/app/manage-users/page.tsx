'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineMagnifyingGlass, HiOutlineUserPlus, HiLink, HiOutlinePlus, HiOutlineEnvelope, HiEllipsisHorizontal, HiOutlinePencil, HiOutlineKey, HiOutlineUserGroup, HiOutlineTrash, HiOutlineAdjustmentsHorizontal, HiOutlineUser, HiOutlineShieldCheck } from 'react-icons/hi2';
import Sidebar from '../components/Sidebar';
import { HiX } from 'react-icons/hi';

interface UserItem {
  id: number;
  name: string;
  email: string;
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
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]); // Will be initialized dynamically
  const [groups, setGroups] = useState<string[]>(['Admin', 'Tech Virtual Assistant', 'Chat Support']);
  const [agents, setAgents] = useState([
    { id: 'N', name: 'Navi', description: 'Your smart, friendly assistant', color: 'emerald' },
    { id: 'P', name: 'Pixie', description: 'Conversational AI', color: 'pink' },
    { id: 'PA', name: 'Paige', description: 'Image Generation', color: 'yellow' },
    { id: 'A', name: 'Audra', description: 'Video Generation', color: 'teal' },
    { id: 'F', name: 'Flicka', description: 'Audio Generation', color: 'purple' },
  ]);
  const [invitedUsers, setInvitedUsers] = useState<{ email: string; group: string; status: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedGroupForAddMember, setSelectedGroupForAddMember] = useState<string | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserItem[]>([]);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<UserItem[]>([]);
  const [showAgentsModal, setShowAgentsModal] = useState(false);
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteGroup, setInviteGroup] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  // Add state for Add/Edit User modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    access: 'Support Agent' as UserItem['access'],
    group: groups[0],
    credit: 'Unlimited' as 'Unlimited' | number,
    agents: [] as string[],
  });
  // Add state for reassign group modal
  const [showReassignGroupModal, setShowReassignGroupModal] = useState(false);
  const [reassignUser, setReassignUser] = useState<UserItem | null>(null);
  // 1. Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState<UserItem | null>(null);

  // --- Utility Functions ---
  const getUserInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
  };
  const avatarColors = [
    'bg-emerald-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-teal-500',
    'bg-purple-500',
    'bg-blue-500',
    'bg-orange-500',
    'bg-gray-500',
  ];
  const getAvatarColor = (id: number) => avatarColors[id % avatarColors.length];

  // --- Initialization (for demo, can be replaced with API call) ---
  useEffect(() => {
    setUsers([
      { id: 1, name: 'Oliver Thompson', email: 'oliverthompson@email.com', access: 'Owner', group: 'Admin', credit: 'Unlimited', agents: ['N', 'P', 'C'] },
      { id: 2, name: 'Gretchen Schleifer', email: 'gretchen@email.com', access: 'Admin', group: 'Admin', credit: 'Unlimited', agents: ['N', 'P', 'C'] },
      { id: 3, name: 'Cristofer Stanton', email: 'cristoferpson@email.com', access: 'Support Agent', group: 'Tech Virtual Assistant', credit: 5000, agents: ['N', 'P', 'C', '+2'] },
      { id: 4, name: 'Hanna Kenter', email: 'hanna@email.com', access: 'Team Lead', group: 'Tech Virtual Assistant', credit: 10000, agents: ['N', 'P', 'C'] },
      { id: 5, name: 'Jaxson Herwitz', email: 'jaxson@email.com', access: 'Support Agent', group: 'Tech Virtual Assistant', credit: 5000, agents: ['N', 'C'] },
      { id: 6, name: 'Marcus Korsgaard', email: 'marcus@email.com', access: 'Team Lead', group: 'Chat Support', credit: 10000, agents: ['N', 'F'] },
      { id: 7, name: 'Martin Ekstrom Bothman', email: 'martin@email.com', access: 'Support Agent', group: 'Chat Support', credit: 5000, agents: ['N', 'C'] },
      { id: 8, name: 'Ann George', email: 'ann@email.com', access: 'Support Agent', group: 'Chat Support', credit: 5000, agents: ['N', 'C'] },
      { id: 9, name: 'Martin Torff', email: 'martintorff@email.com', access: 'Requested', group: 'Admin', credit: 0, agents: [] },
      { id: 10, name: 'Carter Saris', email: 'cartersaris@email.com', access: 'Requested', group: 'Tech Virtual Assistant', credit: 0, agents: [] },
      { id: 11, name: 'Charlie Press', email: 'charlie@email.com', access: 'Requested', group: 'Chat Support', credit: 0, agents: [], status: 'pending' },
      { id: 12, name: 'Cheyenne Bator', email: 'cheyenne@email.com', access: 'Requested', group: 'Admin', credit: 0, agents: [], status: 'pending' },
      { id: 13, name: 'James Levin', email: 'james@email.com', access: 'Requested', group: 'Tech Virtual Assistant', credit: 0, agents: [], status: 'pending' },
    ]);
    setInvitedUsers([
      { email: 'invited1@email.com', group: 'Tech Virtual Assistant', status: 'Invited' },
      { email: 'invited2@email.com', group: 'Chat Support', status: 'Invited' },
    ]);
  }, []);

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
      <div className="rounded-2xl shadow-sm bg-white font-poppins">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} sticky top-0 z-10`}>
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-teal-600"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedUsers(filteredUsers.map(u => u.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agents</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => {
              const isSelected = selectedUsers.includes(user.id);
              return (
                <tr key={user.id} className={`transition-colors duration-200 hover:shadow-md font-poppins ${isSelected ? 'shadow-md bg-teal-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setSelectedUsers(isSelected
                          ? selectedUsers.filter(id => id !== user.id)
                          : [...selectedUsers, user.id]
                        );
                      }}
                      className="form-checkbox h-4 w-4 text-teal-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full shadow ring-2 ring-teal-400 flex items-center justify-center font-bold text-white text-lg ${getAvatarColor(user.id)}`}>{getUserInitials(user.name)}</div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 font-poppins">{user.name}</div>
                        <div className="text-xs font-normal text-gray-500 font-poppins">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <HiOutlineUserGroup className="text-gray-400" />
                    {user.group === 'Not Assigned' ? (
                      <select className={`ml-1 border rounded px-2 py-1 text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}> 
                        <option>Assign Group</option>
                        {groups.map(group => <option key={group}>{group}</option>)}
                      </select>
                    ) : user.group}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1 text-teal-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                      {user.credit === 'Unlimited' ? 'Unlimited' : user.credit.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex gap-1">
                      {user.agents.slice(0, 3).map((agent, i) => {
                        const agentObj = agents.find(a => a.id === agent);
                        return (
                          <span
                            key={i}
                            className={`inline-flex items-center justify-center h-6 w-6 rounded text-xs font-bold
                              ${agentObj ? getAgentColor(agentObj.color, isDarkMode) : (isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700')}`}
                          >
                            {agent}
                          </span>
                        );
                      })}
                      {user.agents.length > 3 && (
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded text-xs font-bold ${isDarkMode ? 'bg-gray-200 text-gray-700' : 'bg-gray-200 text-gray-700'}`}>+{user.agents.length - 3}</span>
                      )}
                    </div>
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
                            className={`${isDarkMode ? 'bg-white border border-gray-200' : 'bg-white border border-gray-200'} origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
                          >
                            <div className="py-1">
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                aria-label="Edit user"
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowUserModal(true);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <HiOutlinePencil size={18} className="mr-2" />Edit
                              </button>
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                aria-label="Reassign group"
                                onClick={() => {
                                  setReassignUser(user);
                                  setShowReassignGroupModal(true);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <HiOutlineUserGroup size={18} className="mr-2" />Reassign Group
                              </button>
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded transition-colors"
                                aria-label="Delete user"
                                onClick={() => {
                                  setDeleteUser(user);
                                  setShowDeleteModal(true);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <HiOutlineTrash size={18} className="mr-2" />Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGroupedUsers = () => {
    // Map group names to display names as in the image
    const groupDisplayNames: Record<string, string> = {
      'Admin': 'Billing',
      'Tech Virtual Assistant': 'Tech Virtual Group',
      'Chat Support': 'Chat Support Group',
    };
    const sortedGroupNames = Object.keys(groupedUsers).sort((a, b) => {
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
        {sortedGroupNames.map(groupName => {
          // const allSelected = groupedUsers[groupName].every(user => selectedUsers.includes(user.id));
          return (
            <div key={groupName} className={`rounded-2xl shadow-sm bg-white font-poppins mb-8 ${isDarkMode ? 'ring-2 ring-teal-400 bg-teal-50' : ''}`}>
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">{groupDisplayNames[groupName] || groupName}</h2>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-sm font-medium p-2 rounded hover:bg-gray-100 text-gray-600"><HiOutlineUserPlus size={18} /><span>Add Member</span></button>
                  <button className="p-2 rounded hover:bg-gray-100 text-gray-600"><HiOutlineAdjustmentsHorizontal size={18} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3"><input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600" /></th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agents</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {groupedUsers[groupName].map((user) => {
                      const isSelected = selectedUsers.includes(user.id);
                      return (
                        <tr key={user.id} className={`transition-colors duration-200 hover:shadow-md font-poppins ${isSelected ? 'shadow-md bg-teal-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap"><input type="checkbox" className="form-checkbox h-4 w-4 text-teal-600" /></td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`h-10 w-10 rounded-full shadow ring-2 ring-teal-400 flex items-center justify-center font-bold text-white text-lg ${getAvatarColor(user.id)}`}>{getUserInitials(user.name)}</div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900 font-poppins">{user.name}</div>
                                <div className="text-xs font-normal text-gray-500 font-poppins">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="inline-flex items-center">
                              <svg className="w-4 h-4 mr-1 text-teal-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                              {user.credit === 'Unlimited' ? 'Unlimited' : user.credit.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-1">
                              {user.agents.slice(0, 3).map((agent, i) => {
                                const agentObj = agents.find(a => a.id === agent);
                                return (
                                  <span
                                    key={i}
                                    className={`inline-flex items-center justify-center h-6 w-6 rounded text-xs font-bold
                                      ${agentObj ? getAgentColor(agentObj.color, isDarkMode) : 'bg-gray-200 text-gray-700'}`}
                                  >
                                    {agent}
                                  </span>
                                );
                              })}
                              {user.agents.length > 3 && (
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded text-xs font-bold bg-gray-200 text-gray-700">+{user.agents.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="relative inline-block text-right">
                              <button
                                onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                                className="text-gray-600 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
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
                                    className="bg-white border border-gray-200 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                  >
                                    <div className="py-1">
                                      <button className="flex items-center px-4 py-2 text-sm w-full text-left text-gray-700 hover:bg-gray-100"><HiOutlinePencil size={18} className="mr-2" />Edit</button>
                                      <button className="flex items-center px-4 py-2 text-sm w-full text-left text-gray-700 hover:bg-gray-100"><HiOutlineUserGroup size={18} className="mr-2" />Reassign Group</button>
                                      <button className="flex items-center px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-gray-100"><HiOutlineTrash size={18} className="mr-2" />Delete</button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Add this section below the All Users table, before the return statement
  const renderInvitedUsers = () => (
    <div className="mt-12">
      <h2 className="text-lg font-semibold mb-4">Invited Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}> 
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {invitedUsers.map((user, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.group}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Open modal for new user
  const openAddUserModal = () => {
    setEditingUser(null);
    setUserForm({ name: '', email: '', access: 'Support Agent', group: groups[0], credit: 'Unlimited', agents: [] });
    setShowUserModal(true);
  };
  // Open modal for editing user
  const openEditUserModal = (user: UserItem) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      access: user.access,
      group: user.group,
      credit: user.credit,
      agents: user.agents,
    });
    setShowUserModal(true);
  };
  // Handle form change
  const handleUserFormChange = (field: string, value: any) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  };
  // Save user (add or edit)
  const saveUser = () => {
    const userToSave = {
      ...userForm,
      access: userForm.access as UserItem['access'],
      credit: userForm.credit,
    };
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...userToSave } : u));
    } else {
      setUsers([...users, { ...userToSave, id: Date.now() }]);
    }
    setShowUserModal(false);
  };

  // Add agent image mapping for Create Group modal
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} flex font-poppins transition-colors duration-300`}>
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
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className={`text-3xl sm:text-4xl font-extrabold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Manage Users</h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base sm:text-lg mt-2`}>Manage your team members and their account permissions.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
                <div className={`relative flex items-center rounded-full pl-4 pr-3 py-2.5 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm focus-within:ring-2 focus-within:ring-teal-500`}>
                  <HiOutlineMagnifyingGlass size={20} className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search user..."
                    className={`pl-2 bg-transparent focus:outline-none w-48 sm:w-64 ${isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                  />
                </div>
                <button className={`border px-3 py-2.5 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-200
                  ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
                  focus:outline-none focus:ring-2 focus:ring-teal-500`}>
                  <HiOutlineAdjustmentsHorizontal size={20} />
                </button>
                
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className={`flex rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-1 shadow-inner`}>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${activeTab === 'all' ? (isDarkMode ? 'bg-teal-600 text-white' : 'bg-white text-gray-900 shadow-sm') : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200')}`}
                >
                  All Users ({allUsersCount})
                </button>
                <button
                  onClick={() => setActiveTab('groups')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${activeTab === 'groups' ? (isDarkMode ? 'bg-teal-600 text-white' : 'bg-white text-gray-900 shadow-sm') : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200')}`}
                >
                  Groups ({groupsCount})
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><HiOutlineTrash size={20} /></button>
                <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><HiOutlineAdjustmentsHorizontal size={20} /></button>
                <button className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white text-gray-900 border border-gray-200' : 'bg-white text-gray-900 border border-gray-200'} flex items-center gap-2`} onClick={() => setShowCreateGroupModal(true)}><HiOutlinePlus size={20} />Create Groups</button>
                <button className={`px-4 py-2 rounded-lg bg-teal-500 text-white flex items-center gap-2 hover:bg-teal-600`} onClick={() => setShowInviteUserModal(true)}><HiOutlineEnvelope size={20} />Invite User</button>
              </div>
            </div>
          </div>

          {activeTab === 'groups' ? renderGroupedUsers() : (filteredUsers.length > 0 ? <>
            {renderUserTable()}
            {renderInvitedUsers()}
          </> : (
            <div className={`flex flex-col items-center justify-center py-16 text-center w-full max-w-lg mx-auto rounded-xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="relative mb-6">
                <HiOutlineUserPlus size={56} className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <span className={`absolute -bottom-1 -right-1 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white ${isDarkMode ? 'bg-teal-600' : 'bg-teal-500'} rounded-full ring-2 ${isDarkMode ? 'ring-gray-800' : 'ring-white'}`}>
                  <HiOutlinePlus size={18} />
                </span>
              </div>
              <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Invite your first user</h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center max-w-md`}>Add your team members and external users.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8 w-full px-6">
                <button className={`border px-6 py-3 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-sm w-full sm:flex-1 transition-colors duration-200
                  ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-gray-100' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                  focus:outline-none focus:ring-2 focus:ring-teal-500`}>
                  <HiLink size={20} />
                  <span>Copy Share Link</span>
                </button>
                <button className={`border px-6 py-3 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-sm w-full sm:flex-1 transition-colors duration-200
                  ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-gray-100' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                  focus:outline-none focus:ring-2 focus:ring-teal-500`} onClick={() => setShowCreateGroupModal(true)}>
                  <HiOutlinePlus size={20} />
                  <span>Create Groups</span>
                </button>
                <button className={`px-6 py-3 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-md w-full sm:flex-1 transition-colors duration-200
                  ${isDarkMode ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}
                  focus:outline-none focus:ring-2 focus:ring-teal-500`}>
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowCreateGroupModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'} rounded-3xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
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

              <div className="p-6 space-y-6">
                {/* Group Name */}
                <div>
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>
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
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>
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
                <div className="pb-6">
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-3`}>
                    Members
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleAddMembersClick}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed transition-colors duration-200
                        ${isDarkMode
                          ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                          : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500'
                        }`}
                    >
                      <HiOutlinePlus size={20} />
                    </button>
                    {selectedGroupMembers.map((member) => (
                      <div key={member.id} className="relative group">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${getAvatarColor(member.id)}`}>{getUserInitials(member.name)}</div>
                        <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'}`}>
                          {member.name}
                        </div>
                        <button
                          onClick={() => handleMemberRemove(member.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs hover:bg-gray-500 transition-colors font-bold"
                        >
                          <HiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateGroupModal(false)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
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
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${isDarkMode ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`w-96 max-w-sm mx-4 rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Members
              </h2>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors
                    ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                />
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredUsers.map((member) => (
                  <div key={member.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${getAvatarColor(member.id)}`}>{getUserInitials(member.name)}</div>
                      <div>
                        <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {member.name}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <button className={`p-1 rounded-full transition-colors duration-200 ${isDarkMode ? 'text-gray-400 hover:bg-gray-600 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}>
                      <HiX size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowMembersModal(false)}
                className={`mt-6 w-full py-2 px-4 rounded-xl font-medium transition-colors duration-200
                  ${isDarkMode ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}
                  focus:outline-none focus:ring-2 focus:ring-teal-500`}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Members Modal */}
      <AnimatePresence>
        {showAddMembersModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddMembersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'} rounded-3xl shadow-xl w-full max-w-md mx-4 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Add Members
                </h2>
                <button
                  onClick={() => setShowAddMembersModal(false)}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors absolute top-6 right-6`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors
                      ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {availableUsers
                    .filter(user =>
                      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleMemberSelect(user)}
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${getAvatarColor(user.id)}`}>{getUserInitials(user.name)}</div>
                          <div>
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user.name}
                            </h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowAddMembersModal(false)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                      ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Close
                  </button>
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
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${getAvatarColor(Number(agent.id))}`}>{agent.name[0]}</div>
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

      {/* Invite User Modal */}
      <AnimatePresence>
        {showInviteUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowInviteUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'} rounded-3xl shadow-xl w-full max-w-md mx-4 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Invite User
                </h2>
                <button
                  onClick={() => setShowInviteUserModal(false)}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors absolute top-6 right-6`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Email Input */}
                <div>
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors
                      ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>



                {/* Group Selection */}
                <div>
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>
                    Add to Group
                  </label>
                  <select
                    value={inviteGroup}
                    onChange={(e) => setInviteGroup(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors
                      ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  >
                    <option value="">Select a group</option>
                    {Object.keys(groupedUsers).map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-6 pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowInviteUserModal(false)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Cancel
                  </button>
                <button
                  onClick={async () => {
                    setIsInviting(true);
                    try {
                      // Here you would typically make an API call to invite the user
                      console.log('Inviting user:', { email: inviteEmail, group: inviteGroup });
                      // Simulate API call
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      setShowInviteUserModal(false);
                      setInviteEmail('');
                      setInviteGroup('');
                    } catch (error) {
                      console.error('Error inviting user:', error);
                    } finally {
                      setIsInviting(false);
                    }
                  }}
                  disabled={isInviting || !inviteEmail}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2
                    ${isInviting || !inviteEmail
                      ? isDarkMode
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isDarkMode
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                    }`}
                >
                  {isInviting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending Invite...</span>
                    </>
                  ) : (
                    <>
                      <HiOutlineEnvelope size={20} />
                      <span>Send Invite</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'} rounded-3xl shadow-xl w-full max-w-md mx-4 overflow-hidden`}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{editingUser ? 'Edit User' : 'Add User'}</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>Name</label>
                  <input type="text" value={userForm.name} onChange={e => handleUserFormChange('name', e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}/>
                </div>
                <div>
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>Email</label>
                  <input type="email" value={userForm.email} onChange={e => handleUserFormChange('email', e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}/>
                </div>
                <div>
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>Access</label>
                  <select value={userForm.access} onChange={e => handleUserFormChange('access', e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <option value="Admin">Admin</option>
                    <option value="Support Agent">Support Agent</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Requested">Requested</option>
                  </select>
                </div>
                <div>
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>Group</label>
                  <select value={userForm.group} onChange={e => handleUserFormChange('group', e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    {groups.map(group => <option key={group} value={group}>{group}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>Credit</label>
                  <input
                    type="text"
                    value={userForm.credit === 'Unlimited' ? 'Unlimited' : userForm.credit}
                    onChange={e => {
                      const val = e.target.value;
                      handleUserFormChange('credit', val === 'Unlimited' ? 'Unlimited' : Number(val));
                    }}
                    placeholder="Unlimited or number"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
                <div>
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>Agents</label>
                  <div className="flex flex-wrap gap-2">
                    {agents.map(agent => (
                      <button key={agent.id} type="button" onClick={() => handleUserFormChange('agents', userForm.agents.includes(agent.id) ? userForm.agents.filter(a => a !== agent.id) : [...userForm.agents, agent.id])} className={`px-3 py-1 rounded-full text-sm font-medium border ${userForm.agents.includes(agent.id) ? 'bg-teal-500 text-white border-teal-600' : isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{agent.name}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 pt-4 flex justify-end space-x-3">
                <button onClick={() => setShowUserModal(false)} className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>Cancel</button>
                <button onClick={saveUser} className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}>{editingUser ? 'Save Changes' : 'Add User'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reassign Group Modal */}
      <AnimatePresence>
        {showReassignGroupModal && reassignUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowReassignGroupModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl w-full max-w-md mx-4 overflow-hidden`}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Reassign Group</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm block mb-2`}>Select Group</label>
                  <select
                    value={reassignUser.group}
                    onChange={e => setReassignUser({ ...reassignUser, group: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  >
                    {groups.map(group => <option key={group} value={group}>{group}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-6 pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReassignGroupModal(false)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setUsers(users.map(u => u.id === reassignUser.id ? { ...u, group: reassignUser.group } : u));
                    setShowReassignGroupModal(false);
                    setReassignUser(null);
                  }}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deleteUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl w-full max-w-md mx-4 overflow-hidden`}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <div className={`flex-shrink-0 p-2 rounded-full ${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                  <HiOutlineTrash size={28} className={`${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <h2 className={`text-xl font-semibold ml-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Delete User</h2>
              </div>
              <div className="p-6 space-y-6">
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-base leading-relaxed font-poppins`}>
                  Are you sure you want to delete <span className="font-medium">{deleteUser.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="p-6 pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setUsers(users.filter(u => u.id !== deleteUser.id));
                    setShowDeleteModal(false);
                    setDeleteUser(null);
                  }}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}