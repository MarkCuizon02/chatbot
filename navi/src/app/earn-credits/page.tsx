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
  
  // Control whether to show empty state or populated state
  const hasReferralData = false; // Set to false to show empty state

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
        <div className="top-section flex flex-col sm:flex-row gap-6 mb-8">
          {/* Total Earnings Card */}
          <div className={`earnings-card ${isDarkMode ? 'bg-gray-800 shadow-gray-900/50 border-gray-700' : 'bg-white shadow-lg border-gray-200'} rounded-2xl p-6 flex flex-col w-full sm:w-auto border`}>
            <div className="card-header flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 ${isDarkMode ? 'bg-cyan-900/50' : 'bg-cyan-100'} rounded-full flex items-center justify-center`}>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Your Total Earnings</span>
              <button className={`ml-auto px-3 py-1 ${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-white text-cyan-600 hover:bg-cyan-50 border-gray-300'} text-sm font-medium rounded-lg transition-colors border`}>
                Update
              </button>
            </div>
            <div className={`earnings-amount ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl p-4 flex flex-col relative border`}>
              <div className="flex items-center justify-between">
                <span className={`number text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>$200</span>
                <button className={`${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} focus:outline-none`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <span className={`label text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Affiliate</span>
            </div>
          </div>

          {/* Invite Friends Card */}
          <div className={`invite-card ${isDarkMode ? 'bg-gray-800 shadow-gray-900/50 border-gray-700' : 'bg-white shadow-lg border-gray-200'} rounded-2xl p-6 flex flex-col w-full sm:w-auto sm:flex-1 border`}>
            <div className="card-header flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 ${isDarkMode ? 'bg-cyan-900/50' : 'bg-cyan-100'} rounded-full flex items-center justify-center`}>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <span className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Invite Your Friends</span>
            </div>
            <div className={`invite-link-section ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl p-4 flex items-center gap-3 mb-3 border`}>
              <input 
                type="text" 
                value="https://simplabots.com/invite/troyteeples" 
                readOnly 
                className={`flex-1 bg-transparent ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm focus:outline-none`}
              />
              <button className={`copy-button p-2 ${isDarkMode ? 'hover:bg-gray-600/50' : 'hover:bg-gray-200'} rounded-lg transition-colors`}>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Share your unique referral link</p>
          </div>
        </div>

        {/* Affiliate Program Banner - Only show in empty state */}
        {!hasReferralData && (
          <div className="affiliate-banner bg-gradient-to-r from-cyan-900 to-green-200 rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
            <div className="banner-content text-white max-w-lg">
              <h2 className="text-2xl lg:text-xl font-bold mb-3">Earn Real Money by Promoting Our Platform</h2>
              <p className="text-cyan-50 text-normal mb-6 leading-relaxed">Sign up to our affiliate program to get started.</p>
              <button className="signup-button bg-white text-cyan-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold text-base shadow-md transition-colors duration-200">
                Sign Up Now
              </button>
            </div>
            <div className="banner-graphic mt-6 lg:mt-0 lg:ml-8">
              {/* World/Globe Graphic */}
              <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-30">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                  <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  <path d="M 40 100 Q 100 80 160 100" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
                  <path d="M 40 100 Q 100 120 160 100" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
                  <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                </svg>
                {/* Floating dots for decoration */}
                <div className="absolute top-4 right-8 w-2 h-2 bg-white opacity-40 rounded-full"></div>
                <div className="absolute bottom-8 left-4 w-3 h-3 bg-white opacity-30 rounded-full"></div>
                <div className="absolute top-12 left-12 w-1 h-1 bg-white opacity-50 rounded-full"></div>
              </div>
            </div>
          </div>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
        </div>
        )}

        {/* No Invitation View - Only show in empty state */}
        {!hasReferralData && (
        <div className="how-it-works">
          <div className={`section-header w-full flex flex-col items-center p-6 mb-8 ${isDarkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'} rounded-2xl shadow-lg border`}>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center">Start sharing your referral link to get started</h3>
          </div>
          
          <div className={`steps grid grid-cols-1 md:grid-cols-3 gap-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {/* Step 1 */}
            <div className={`step ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 text-center border shadow-lg`}>
              <div className="step-icon w-16 h-16 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Invite Friends</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Share your unique referral link</p>
            </div>

            {/* Step 2 */}
            <div className={`step ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 text-center border shadow-lg`}>
              <div className="step-icon w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">They Sign Up</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Friends create accounts using your link</p>
            </div>

            {/* Step 3 */}
            <div className={`step ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 text-center border shadow-lg`}>
              <div className="step-icon w-16 h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-lg font-bold mb-2">Earn Credits or Money</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get credits or money per successful referral</p>
            </div>
          </div>
        </div>
        )}

        {/* Referral Data Table - Populated View - Only show when data exists */}
        {hasReferralData && (
        <div className={`referral-data ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border mb-8`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Invited</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Earned</th>
                </tr>
              </thead>
              <tbody className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <tr>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">Alex Johnson</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>alex.johnson@example.com</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">Jan 5, 2023</td>
                  <td className="px-6 py-4 text-sm">--</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">+100</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">Alex Johnson</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>alex.johnson@example.com</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">Jan 5, 2023</td>
                  <td className="px-6 py-4 text-sm">--</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">+100</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">Maria Smith</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>maria.smith@example.com</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">Feb 14, 2023</td>
                  <td className="px-6 py-4 text-sm">Feb 14, 2023</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">+100</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">David Lee</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>david.lee@example.com</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">Mar 22, 2023</td>
                  <td className="px-6 py-4 text-sm">Mar 22, 2023</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">+$100</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">Maria Smith</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>maria.smith@example.com</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">Feb 14, 2023</td>
                  <td className="px-6 py-4 text-sm">Feb 14, 2023</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">+$100</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">David Lee</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>david.lee@example.com</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">Mar 22, 2023</td>
                  <td className="px-6 py-4 text-sm">Mar 22, 2023</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">+$100</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} flex items-center justify-between`}>
            <div className="text-sm text-gray-500">
              Showing 1 to 7 of 20 entries
            </div>
            <div className="flex space-x-1">
              <button className={`px-3 py-1 text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                &lt;
              </button>
              <button className="px-3 py-1 text-sm bg-cyan-500 text-white rounded">1</button>
              <button className={`px-3 py-1 text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>2</button>
              <button className={`px-3 py-1 text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>3</button>
              <span className="px-3 py-1 text-sm text-gray-400">...</span>
              <button className={`px-3 py-1 text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>8</button>
              <button className={`px-3 py-1 text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>9</button>
              <button className={`px-3 py-1 text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>10</button>
              <button className={`px-3 py-1 text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                &gt;
              </button>
            </div>
          </div>
        </div>
        )}

        {/* ...existing code... */}
      </div>
    </div>
  );
}
