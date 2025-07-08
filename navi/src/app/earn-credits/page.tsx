'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../components/Sidebar';

export default function EarnCreditsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} font-poppins transition-colors duration-300 flex`}>
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

      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-24' : 'ml-72'} p-6 sm:p-8`}>
        {/* Page Header */}
        <div className="page-header p-6 mb-8">
          <h1 className='text-4xl font-extrabold text-gray-900 dark:text-gray-600 mb-1'>Earn Credits and Money</h1>
          <p>Refer friends to earn credits or become an affiliate to earn real money.</p>
        </div>

        {/* Stats and Invite Section */}
        <div className="top-section">
          {/* Total Earnings Card */}
          <div className="earnings-card">
            <div className="card-header">
              <span className="icon">📈</span>
              <span>Your Total Earnings</span>
            </div>
            <div className="earnings-amount">
              <span className="number">0</span>
              <span className="label">Credits</span>
            </div>
          </div>

          {/* Invite Friends Card */}
          <div className="invite-card">
            <div className="card-header">
              <span className="icon">👥</span>
              <span>Invite Your Friends</span>
            </div>
            <div className="invite-link-section">
              <input 
                type="text" 
                value="https://simplabots.com/invite/troyteeples" 
                readOnly 
              />
              <button className="copy-button">📋</button>
            </div>
            <p>Share you unique referral link</p>
          </div>
        </div>

        {/* Affiliate Program Banner */}
        <div className="affiliate-banner">
          <div className="banner-content">
            <h2>Earn Real Money by Promoting Our Platform</h2>
            <p>Sign up to our affiliate program to get started.</p>
            <button className="signup-button">Sign Up Now</button>
          </div>
          <div className="banner-graphic">
            {/* World map graphic placeholder */}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works">
          <div className="section-header">
            <span className="icon">🎯</span>
            <h3>Start sharing your referral link to get started</h3>
          </div>
          
          <div className="steps">
            {/* Step 1 */}
            <div className="step">
              <div className="step-icon">👥</div>
              <h4>Invite Friends</h4>
              <p>Share your unique referral link</p>
            </div>

            {/* Step 2 */}
            <div className="step">
              <div className="step-icon">✅</div>
              <h4>They Sign Up</h4>
              <p>Friends create accounts using your link</p>
            </div>

            {/* Step 3 */}
            <div className="step">
              <div className="step-icon">💰</div>
              <h4>Earn Credits or Money</h4>
              <p>Get credits or money per successful referral</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
