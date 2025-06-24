'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineAdjustmentsHorizontal, HiChevronDown } from 'react-icons/hi2';
import Sidebar from '../components/Sidebar';
import KnowledgeBaseCard from '../components/KnowledgeBaseCard';
import AddKnowledgeBaseModal from '../components/AddKnowledgeBaseModal';
import Image from 'next/image';

interface KnowledgeBase {
  id: number;
  name: string;
  category: string;
  tags: string[];
  version: string;
  faqPack: string;
}

export default function KnowledgeBasePage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Personal' | 'Company'>('Personal');
  const [addPronouns, setAddPronouns] = useState(true);

  // Form state
  const [fullName, setFullName] = useState('Troy Teeples');
  const [preferredName, setPreferredName] = useState('Troy');
  const [gender, setGender] = useState('Male');
  const [pronouns, setPronouns] = useState('He/Him');
  const [birthday, setBirthday] = useState('12/25/1990');
  const [phone, setPhone] = useState('(801) 335-9507');
  const [email, setEmail] = useState('troy@hurdman.net');
  const [linkedin, setLinkedin] = useState('linkedin.com/troyteeples');
  const [preferredContact, setPreferredContact] = useState<'Phone' | 'Email'>('Phone');
  const [country, setCountry] = useState('United States');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#fafbfa] text-gray-900'} font-poppins transition-colors duration-300 flex`}>
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
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-24' : 'ml-72'} px-0 py-0 w-full max-w-full`}>
        <div className="w-full max-w-4xl mx-auto pt-10 pb-8">
          <h1 className="text-2xl font-extrabold mb-8 ml-2">Knowledge Base</h1>
          {/* Tabs */}
          <div className="flex space-x-2 mb-8 ml-2">
            <button
              className={`px-4 py-1.5 rounded-lg font-medium text-base ${activeTab === 'Personal' ? 'bg-[#e9ece8] text-gray-900' : 'bg-transparent text-gray-500'} ${isDarkMode ? (activeTab === 'Personal' ? 'bg-gray-800 text-white' : 'text-gray-400') : ''}`}
              onClick={() => setActiveTab('Personal')}
            >
              Personal
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg font-medium text-base ${activeTab === 'Company' ? 'bg-[#e9ece8] text-gray-900' : 'bg-transparent text-gray-500'} ${isDarkMode ? (activeTab === 'Company' ? 'bg-gray-800 text-white' : 'text-gray-400') : ''}`}
              onClick={() => setActiveTab('Company')}
            >
              Company
            </button>
          </div>

          {/* Only show Personal tab for now */}
          {activeTab === 'Personal' && (
            <form className="space-y-12">
              {/* Profile Section */}
              <div className="flex flex-row w-full">
                <div className="w-1/3 pr-8 flex flex-col">
                  <span className="font-semibold text-base mb-1">Profile</span>
                  <span className="text-sm text-gray-500 leading-snug">Manage your personal details and preferences here.</span>
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:space-x-8">
                  <div className="flex-1 flex flex-col space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Full Name</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Preferred Name</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={preferredName}
                        onChange={e => setPreferredName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Gender</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-1 mb-1">
                      <button type="button" onClick={() => setAddPronouns(!addPronouns)} className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${addPronouns ? 'bg-teal-500' : 'bg-gray-200'}`}> <span className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${addPronouns ? 'translate-x-4' : 'translate-x-0'}`}></span></button>
                      <span className="text-sm font-medium text-gray-700">Add pronouns</span>
                    </div>
                    {addPronouns && (
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-400">Preferred Pronouns</label>
                        <input
                          type="text"
                          className={`w-full p-2 rounded-md border text-sm
                            ${isDarkMode
                              ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                              : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                            }`}
                          value={pronouns}
                          onChange={e => setPronouns(e.target.value)}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Birthday</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={birthday}
                        onChange={e => setBirthday(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:w-48 mt-2 md:mt-0">
                    <span className="font-semibold text-sm mb-2">Profile Picture</span>
                    <Image src="/images/Troy.jpg" alt="Profile" width={48} height={48} className="rounded-full mb-2" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Contact Information */}
              <div className="flex flex-row w-full">
                <div className="w-1/3 pr-8 flex flex-col">
                  <span className="font-semibold text-base mb-1">Contact Information</span>
                  <span className="text-sm text-gray-500 leading-snug">Provide your preferred contact details.</span>
                </div>
                <div className="flex-1 flex flex-col space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Phone Number</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Personal Email Address</label>
                      <input
                        type="email"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold mb-1 text-gray-400">LinkedIn Profile</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={linkedin}
                        onChange={e => setLinkedin(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="block text-xs font-semibold mb-2 text-gray-400">Preferred Contact Method</span>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2">
                        <input type="radio" checked={preferredContact === 'Phone'} onChange={() => setPreferredContact('Phone')} className="accent-teal-500" />
                        <span className="text-sm">Phone</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" checked={preferredContact === 'Email'} onChange={() => setPreferredContact('Email')} className="accent-teal-500" />
                        <span className="text-sm">Email</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Address Information */}
              <div className="flex flex-row w-full">
                <div className="w-1/3 pr-8 flex flex-col">
                  <span className="font-semibold text-base mb-1">Address Information</span>
                  <span className="text-sm text-gray-500 leading-snug">Enter your address details to ensure accurate communication.</span>
                </div>
                <div className="flex-1 flex flex-col space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Country</label>
                      <div className="relative">
                        <select
                          className={`w-full p-2 rounded-md border text-sm
                            ${isDarkMode
                              ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                              : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                            }`}
                          value={country}
                          onChange={e => setCountry(e.target.value)}
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                          <option>Other</option>
                        </select>
                        <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Address Line 1</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={address1}
                        onChange={e => setAddress1(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Address Line 2</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={address2}
                        onChange={e => setAddress2(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">City</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={city}
                        onChange={e => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Zip Code</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value={zip}
                        onChange={e => setZip(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end space-x-2 mt-8">
                <button type="button" className="px-5 py-2 rounded border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 text-sm">Discard</button>
                <button type="submit" className="px-5 py-2 rounded bg-[#23423f] text-white font-semibold hover:bg-[#1d3532] text-sm">Save Changes</button>
              </div>
            </form>
          )}
          {activeTab === 'Company' && (
            <form className="space-y-12">
              {/* Profile Section */}
              <div className="flex flex-row w-full">
                <div className="w-1/3 pr-8 flex flex-col">
                  <span className="font-semibold text-base mb-1">Profile</span>
                  <span className="text-sm text-gray-500 leading-snug">Provide additional details about your company to enhance your profile.</span>
                </div>
                <div className="flex-1 flex flex-col md:flex-row md:space-x-8">
                  <div className="flex-1 flex flex-col space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Company Name</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value="Greencheck"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Company Website</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value="greencheck.ai"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Industry or Business Type</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value="SaaS"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:w-48 mt-2 md:mt-0">
                    <span className="font-semibold text-sm mb-2">Company Logo</span>
                    <Image src="/images/google-drive.png" alt="Company Logo" width={48} height={48} className="rounded-full mb-2 bg-[#e9ece8] p-2" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Company Theme Section */}
              <div className="flex flex-row w-full">
                <div className="w-1/3 pr-8 flex flex-col">
                  <span className="font-semibold text-base mb-1">Company Theme</span>
                  <span className="text-sm text-gray-500 leading-snug">Choose a preferred theme for your company. This serves as an indicator for what company you are using.</span>
                </div>
                <div className="flex-1 flex flex-col space-y-3">
                  <div className="flex flex-row space-x-4 items-center">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Company</label>
                      <select
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value="Greencheck"
                        disabled
                      >
                        <option>Greencheck</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-row items-center space-x-2 mt-2">
                    {/* Color picker mockup */}
                    <button className="w-7 h-7 rounded bg-green-500 border-2 border-green-700 flex items-center justify-center"><span className="text-white">✓</span></button>
                    <button className="w-7 h-7 rounded bg-green-400"></button>
                    <button className="w-7 h-7 rounded bg-teal-400"></button>
                    <button className="w-7 h-7 rounded bg-cyan-400"></button>
                    <button className="w-7 h-7 rounded bg-sky-400"></button>
                    <button className="w-7 h-7 rounded bg-blue-400"></button>
                    <button className="w-7 h-7 rounded bg-indigo-400"></button>
                    <button className="w-7 h-7 rounded bg-violet-400"></button>
                    <button className="w-7 h-7 rounded bg-purple-400"></button>
                    <button className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-400">+</button>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Contact Information */}
              <div className="flex flex-row w-full">
                <div className="w-1/3 pr-8 flex flex-col">
                  <span className="font-semibold text-base mb-1">Contact Information</span>
                  <span className="text-sm text-gray-500 leading-snug">Provide your preferred contact details.</span>
                </div>
                <div className="flex-1 flex flex-col space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Company Phone Number</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value="(801) 335-9507"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Company Email</label>
                      <input
                        type="email"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value="contact@greencheck.com"
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Company Website</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value="greencheck.ai"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Address Section */}
              <div className="flex flex-row w-full">
                <div className="w-1/3 pr-8 flex flex-col">
                  <span className="font-semibold text-base mb-1">Address</span>
                  <span className="text-sm text-gray-500 leading-snug">Enter your address details to ensure accurate communication.</span>
                </div>
                <div className="flex-1 flex flex-col space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Country</label>
                      <div className="relative">
                        <select
                          className={`w-full p-2 rounded-md border text-sm
                            ${isDarkMode
                              ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                              : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                            }`}
                          value={country}
                          onChange={e => setCountry(e.target.value)}
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                          <option>Other</option>
                        </select>
                        <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Address Line 1</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value=""
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Address Line 2</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value=""
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">City</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value=""
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-400">Zip Code</label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md border text-sm
                          ${isDarkMode
                            ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                            : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                          }`}
                        value=""
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Other Information Section */}
              <div className="flex flex-row w-full">
                <div className="w-1/3 pr-8 flex flex-col">
                  <span className="font-semibold text-base mb-1">Other Information</span>
                  <span className="text-sm text-gray-500 leading-snug">Additional details that may be relevant to your company profile.</span>
                </div>
                <div className="flex-1 flex flex-col space-y-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-400">Number of Employees</label>
                    <input
                      type="text"
                      className={`w-full p-2 rounded-md border text-sm
                        ${isDarkMode
                          ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                          : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                        }`}
                      value="5000"
                      readOnly
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-semibold mb-1 text-gray-400">Socials</label>
                    <input
                      type="text"
                      className={`w-full p-2 rounded-md border text-sm
                        ${isDarkMode
                          ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                          : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                        }`}
                      placeholder="Add link here"
                    />
                    <button type="button" className="px-3 py-1 rounded bg-[#23423f] text-white text-xs font-semibold mb-2">+ Add Social Link</button>
                    <input
                      type="text"
                      className={`w-full p-2 rounded-md border text-sm
                        ${isDarkMode
                          ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400'
                          : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
                        }`}
                      value="https://facebook.com/greencheck"
                      readOnly
                    />
                    <div className="flex space-x-2 mb-4">
                      <button type="button" className="px-3 py-1 rounded bg-[#23423f] text-white text-xs font-semibold">Save Changes</button>
                      <button type="button" className="px-3 py-1 rounded border border-gray-300 text-gray-600 bg-white text-xs font-semibold">Cancel</button>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400">Instagram</span>
                        <div className="flex items-center space-x-2">
                          <a href="https://instagram.com/greencheck" className="text-xs text-[#23423f] underline">https://instagram.com/greencheck</a>
                          <button type="button" className="text-gray-400 hover:text-[#23423f] text-lg">✎</button>
                          <button type="button" className="text-gray-400 hover:text-red-500 text-lg">🗑️</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-400">LinkedIn</span>
                        <div className="flex items-center space-x-2">
                          <a href="https://linkedin.com/greencheck" className="text-xs text-[#23423f] underline">https://linkedin.com/greencheck</a>
                          <button type="button" className="text-gray-400 hover:text-[#23423f] text-lg">✎</button>
                          <button type="button" className="text-gray-400 hover:text-red-500 text-lg">🗑️</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end space-x-2 mt-8">
                <button type="button" className="px-5 py-2 rounded border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 text-sm">Discard</button>
                <button type="submit" className="px-5 py-2 rounded bg-[#23423f] text-white font-semibold hover:bg-[#1d3532] text-sm">Save Changes</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 