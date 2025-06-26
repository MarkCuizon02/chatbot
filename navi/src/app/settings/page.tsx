"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../../context/ThemeContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Profile state
  const [fullName, setFullName] = useState("Troy Teeples");
  const [preferredName, setPreferredName] = useState("Troy");
  const [email, setEmail] = useState("troy@hurdman.net");
  const [phone, setPhone] = useState("(801) 335-9507");
  const [contactMethod, setContactMethod] = useState("Phone");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // 2FA state
  const [twoFA, setTwoFA] = useState(true);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState(1);
  const [country, setCountry] = useState("USA(+1)");
  const [phoneInput, setPhoneInput] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCode] = useState("a1b2*c3d4!  e5f6@g7h8#  ij9?kl1l2$  m3n4&o5p6%  q7r8*s9t0^  u1v2#w3x4@  y5z6+a7b8~  c9d0-elf2.");
  const recoveryRef = useRef<HTMLDivElement>(null);
  const [pendingTwoFA, setPendingTwoFA] = useState(false);

  // Add state for account deletion modal
  const [showAccountDeletionModal, setShowAccountDeletionModal] = useState(false);

  // Appearance state - connect to theme context
  const [appearance, setAppearance] = useState<'system' | 'light' | 'dark'>('system');

  // Store original values for change tracking
  const [originalValues, setOriginalValues] = useState({
    fullName: '',
    preferredName: '',
    email: '',
    phone: '',
    contactMethod: '',
    twoFA: false,
    appearance: 'system' as 'system' | 'light' | 'dark'
  });

  // Initialize appearance based on current theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setAppearance('dark');
    } else if (savedTheme === 'light') {
      setAppearance('light');
    } else {
      setAppearance('system');
    }
  }, []);

  // Sync appearance with theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' && appearance !== 'dark') {
      setAppearance('dark');
    } else if (savedTheme === 'light' && appearance !== 'light') {
      setAppearance('light');
    } else if (!savedTheme && appearance !== 'system') {
      setAppearance('system');
    }
  }, [isDarkMode, appearance]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (appearance === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [appearance]);

  // Form state management
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    preferredName?: string;
    email?: string;
    phone?: string;
  }>({});

  // Load user settings from database
  const loadUserSettings = async () => {
    try {
      const response = await fetch('/api/settings/load');
      if (response.ok) {
        const result = await response.json();
        const settings = result.data;
        
        // Update state with loaded data
        setFullName(settings.profile.fullName);
        setPreferredName(settings.profile.preferredName);
        setEmail(settings.personalInfo.email);
        setPhone(settings.personalInfo.phone);
        setContactMethod(settings.personalInfo.contactMethod);
        setTwoFA(settings.twoFA.enabled);
        setAppearance(settings.appearance as 'system' | 'light' | 'dark');
        
        // Store original values for change tracking
        setOriginalValues({
          fullName: settings.profile.fullName,
          preferredName: settings.profile.preferredName,
          email: settings.personalInfo.email,
          phone: settings.personalInfo.phone,
          contactMethod: settings.personalInfo.contactMethod,
          twoFA: settings.twoFA.enabled,
          appearance: settings.appearance as 'system' | 'light' | 'dark'
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  // Track changes to enable/disable save button
  useEffect(() => {
    const hasChanges = 
      fullName !== originalValues.fullName ||
      preferredName !== originalValues.preferredName ||
      email !== originalValues.email ||
      phone !== originalValues.phone ||
      contactMethod !== originalValues.contactMethod ||
      currentPassword !== "" ||
      newPassword !== "" ||
      confirmPassword !== "" ||
      pendingTwoFA ||
      appearance !== originalValues.appearance;
    
    setHasUnsavedChanges(hasChanges);
  }, [fullName, preferredName, email, phone, contactMethod, currentPassword, newPassword, confirmPassword, pendingTwoFA, appearance, originalValues]);

  // Validate password match
  useEffect(() => {
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [newPassword, confirmPassword]);

  // Handle appearance change
  const handleAppearanceChange = (mode: 'system' | 'light' | 'dark') => {
    setAppearance(mode);
    
    // Apply theme immediately
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      // System mode - remove saved theme and use system preference
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setPasswordError("");
    setFormErrors({});

    // Validate form fields
    const errors: typeof formErrors = {};
    
    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    
    if (!preferredName.trim()) {
      errors.preferredName = "Preferred name is required";
    }
    
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }
    
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSaving(false);
      return;
    }

    try {
      // Validate password change if attempted
      if (newPassword || confirmPassword) {
        if (!currentPassword) {
          setPasswordError("Current password is required");
          setIsSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setPasswordError("New passwords do not match");
          setIsSaving(false);
          return;
        }
        if (newPassword.length < 8) {
          setPasswordError("New password must be at least 8 characters");
          setIsSaving(false);
          return;
        }
      }

      // Prepare data for API call
      const updateData: {
        profile: { fullName: string; preferredName: string };
        personalInfo: { email: string; phone: string; contactMethod: string };
        password?: { currentPassword: string; newPassword: string };
        twoFA?: { enabled: boolean; phone: string; country: string };
        appearance?: 'light' | 'dark';
      } = {
        profile: {
          fullName,
          preferredName
        },
        personalInfo: {
          email,
          phone,
          contactMethod
        }
      };

      // Add password change if attempted
      if (newPassword && confirmPassword) {
        updateData.password = {
          currentPassword,
          newPassword
        };
      }

      // Add 2FA changes if pending
      if (pendingTwoFA) {
        updateData.twoFA = {
          enabled: true,
          phone: phoneInput,
          country
        };
      }

      // Add appearance changes
      if (appearance !== 'system') {
        updateData.appearance = appearance;
      }

      // Make API call to save settings
      const response = await fetch('/api/settings/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }

      await response.json();

      // Clear password fields after successful save
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Apply pending 2FA changes
      if (pendingTwoFA) {
        setTwoFA(true);
        setPendingTwoFA(false);
      }

      setSaveSuccess(true);
      
      // Refresh the page after showing success notification
      setTimeout(() => {
        setSaveSuccess(false);
        window.location.reload();
      }, 2000);

      // Reset change tracking
      setHasUnsavedChanges(false);

    } catch (error) {
      console.error('Error saving settings:', error);
      setPasswordError(error instanceof Error ? error.message : "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    // Reset all fields to original values
    setFullName(originalValues.fullName);
    setPreferredName(originalValues.preferredName);
    setEmail(originalValues.email);
    setPhone(originalValues.phone);
    setContactMethod(originalValues.contactMethod);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setFormErrors({});
    setPendingTwoFA(false);
    setAppearance(originalValues.appearance);
    setHasUnsavedChanges(false);
  };

  // Handle sign out
  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} font-poppins flex transition-colors duration-300`}>
      <Sidebar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isNaviModalOpen={isNaviModalOpen}
        setIsNaviModalOpen={setIsNaviModalOpen}
        isNaviDropdownOpen={isNaviDropdownOpen}
        setIsNaviDropdownOpen={setIsNaviDropdownOpen}
        isNaviChatbotOpen={isNaviChatbotOpen}
        setIsNaviChatbotOpen={setIsNaviChatbotOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />
      <div className={`flex-1 flex flex-col items-center py-10 px-4 sm:px-10 transition-all duration-300 ${isSidebarCollapsed ? 'ml-12' : 'ml-32'} ${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="w-full max-w-3xl space-y-8">
          <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Settings</h1>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              <span className="ml-3 text-lg">Loading settings...</span>
            </div>
          )}

          {/* Settings Content */}
          {!isLoading && (
            <>
              {/* Success Notification */}
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
                  >
                    Settings saved successfully!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Profile Section */}
              <div className={`rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-8 flex flex-col sm:flex-row gap-8`}>
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1">Profile</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">This will be displayed as your profile information.</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-cyan-400 shadow">
                      <Image src="/images/Troy.jpg" alt="Profile" width={80} height={80} />
                    </div>
                  </div>
                  <input
                    type="text"
                    className={`w-full mb-3 px-4 py-2 rounded-lg border text-lg font-medium ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${formErrors.fullName ? 'border-red-500' : ''}`}
                    placeholder="Full Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                  {formErrors.fullName && (
                    <div className="text-red-500 text-sm mb-2">{formErrors.fullName}</div>
                  )}
                  <input
                    type="text"
                    className={`w-full px-4 py-2 rounded-lg border text-lg font-medium ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${formErrors.preferredName ? 'border-red-500' : ''}`}
                    placeholder="Preferred Name"
                    value={preferredName}
                    onChange={e => setPreferredName(e.target.value)}
                  />
                  {formErrors.preferredName && (
                    <div className="text-red-500 text-sm mt-1">{formErrors.preferredName}</div>
                  )}
                </div>
              </div>

              {/* Personal Information Section */}
              <div className={`rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-8 flex flex-col sm:flex-row gap-8`}>
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1">Personal Information</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Communication details in case we want to connect with you. These will be kept private.</div>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <input
                    type="email"
                    className={`w-full px-4 py-2 rounded-lg border text-base ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${formErrors.email ? 'border-red-500' : ''}`}
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {formErrors.email && (
                    <div className="text-red-500 text-sm">{formErrors.email}</div>
                  )}
                  <input
                    type="tel"
                    className={`w-full px-4 py-2 rounded-lg border text-base ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ${formErrors.phone ? 'border-red-500' : ''}`}
                    placeholder="Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                  {formErrors.phone && (
                    <div className="text-red-500 text-sm">{formErrors.phone}</div>
                  )}
                  <div className="mt-2">
                    <div className="font-medium mb-2">Preferred Contact Method</div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-cyan-500 focus:ring-cyan-500"
                          checked={contactMethod === 'Phone'}
                          onChange={() => setContactMethod('Phone')}
                        />
                        <span className="ml-2">Phone</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-cyan-500 focus:ring-cyan-500"
                          checked={contactMethod === 'Email'}
                          onChange={() => setContactMethod('Email')}
                        />
                        <span className="ml-2">Email</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password Section */}
              <div className={`rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-8 flex flex-col sm:flex-row gap-8`}>
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1">Change Password</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Changing your password will log you out of all your active sessions.</div>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      className={`w-full px-4 py-2 rounded-lg border text-base ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={() => setShowCurrent(v => !v)}
                      tabIndex={-1}
                    >
                      {showCurrent ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.873A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.43 5.818M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      className={`w-full px-4 py-2 rounded-lg border text-base ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={() => setShowNew(v => !v)}
                      tabIndex={-1}
                    >
                      {showNew ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.873A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.43 5.818M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className={`w-full px-4 py-2 rounded-lg border text-base ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-cyan-500 transition`}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={() => setShowConfirm(v => !v)}
                      tabIndex={-1}
                    >
                      {showConfirm ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.873A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.43 5.818M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <div className="text-red-500 text-sm mt-1">{passwordError}</div>
                  )}
                </div>
              </div>

              {/* Two-Factor Authentication Section */}
              <div className={`rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-8 flex flex-col sm:flex-row gap-8 items-center`}>
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1">Two-Factor Authentication (2FA)</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Keep your account secure by enabling 2FA via SMS or using a temporary one-time passcode (TOTP) from an authenticator app.</div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Two-Factor Authentication</span>
                    <button
                      type="button"
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${(twoFA || pendingTwoFA) ? 'bg-teal-500' : 'bg-gray-300'}`}
                      onClick={() => {
                        if (twoFA) {
                          // Turn off 2FA if currently enabled
                          setTwoFA(false);
                          setPendingTwoFA(false); // Clear pending state if turning off
                        } else if (!twoFA && !pendingTwoFA) {
                          // Initiate setup if 2FA is off and not pending
                          setShow2FAModal(true);
                          setTwoFAStep(1);
                        } else if (pendingTwoFA) {
                          // If pending, do nothing on toggle click (user must save or discard)
                          return;
                        }
                      }}
                      aria-pressed={twoFA || pendingTwoFA}
                      // Only disable if pending activation to allow turning off
                      disabled={pendingTwoFA}
                    >
                      <span className="sr-only">Enable two-factor authentication</span>
                      <span
                        className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform ${(twoFA || pendingTwoFA) ? 'translate-x-5' : 'translate-x-1'}`}
                      />
                    </button>
                    {!twoFA && !pendingTwoFA && (
                      <button
                        type="button"
                        className={`ml-2 text-cyan-600 dark:text-cyan-400 underline font-medium text-sm hover:text-cyan-800 dark:hover:text-cyan-300 transition`}
                        onClick={() => {
                          setShow2FAModal(true);
                          setTwoFAStep(1);
                        }}
                      >
                        Setup Two-Factor
                      </button>
                    )}
                    {pendingTwoFA && (
                      <span className="ml-2 text-yellow-600 dark:text-yellow-400 font-medium text-sm">Pending Activation</span>
                    )}
                    {twoFA && !pendingTwoFA && (
                      <span className="ml-2 text-green-600 dark:text-green-400 font-medium text-sm">Enabled</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Receive a one-time passcode via SMS each time you sign in.</div>
                </div>
              </div>

              {/* Appearance Section */}
              <div className={`rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-8 flex flex-col sm:flex-row gap-8`}>
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1">Appearance</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select or customize your UI theme and company color.</div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex gap-4">
                    {['system', 'light', 'dark'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleAppearanceChange(mode as 'system' | 'light' | 'dark')}
                        className={`relative rounded-xl border-2 flex flex-col items-center justify-center w-32 h-20 p-2 transition-all duration-200
                          ${appearance === mode ? 'border-cyan-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'}`}
                      >
                        {/* Visual preview */}
                        <div className="flex w-full h-10 mb-2">
                          <div className={`flex-1 rounded-l ${mode === 'dark' ? 'bg-gray-800' : mode === 'light' ? 'bg-white' : 'bg-gray-100 dark:bg-gray-800'}`}></div>
                          <div className={`flex-1 rounded-r ${mode === 'dark' ? 'bg-gray-900' : mode === 'light' ? 'bg-gray-100' : 'bg-white dark:bg-gray-900'}`}></div>
                        </div>
                        <span className="text-xs font-medium capitalize">{mode}</span>
                        {appearance === mode && (
                          <span className="absolute -top-2 -left-2 bg-cyan-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Danger Zone Section */}
              <div className={`rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-8 flex flex-col sm:flex-row gap-8 items-center`}>
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1 text-red-600 dark:text-red-400">Danger Zone</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">By deleting your account you will lose all your data and access to any workspaces that you are associated with.</div>
                </div>
                <div className="flex-1 flex flex-col gap-2 items-end">
                  <div className="flex gap-3 mb-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className={`px-5 py-2 rounded font-medium border ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'}`}
                    >
                      Sign Out
                    </button>
                    <button
                      type="button"
                      className="px-5 py-2 rounded font-medium bg-red-500 text-white hover:bg-red-600"
                      onClick={() => setShowAccountDeletionModal(true)}
                    >
                      Request Account Deletion
                    </button>
                  </div>
                </div>
              </div>

              {/* Save/Discard Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  className={`px-6 py-2 rounded-lg font-medium border shadow-sm ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'} transition`}
                  onClick={handleDiscardChanges}
                  disabled={!hasUnsavedChanges}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className={`px-6 py-2 rounded-lg font-medium shadow-sm transition ${
                    hasUnsavedChanges && !isSaving
                      ? isDarkMode 
                        ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                        : 'bg-cyan-500 text-white hover:bg-cyan-600'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                  onClick={handleSaveChanges}
                  disabled={!hasUnsavedChanges || isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2FA Modal */}
      <AnimatePresence>
        {show2FAModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur"
          >
            <div className={`w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden border relative ${isDarkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}
              style={{boxShadow: isDarkMode ? '0 8px 40px rgba(0,0,0,0.7)' : '0 8px 40px rgba(0,0,0,0.12)'}}>
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 transition"
                onClick={() => setShow2FAModal(false)}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="text-xs mb-2 text-gray-400">Two-Factor Authentication Setup &gt; {twoFAStep}</div>
                <h2 className="text-2xl font-bold mb-2">Two-Factor Authentication Setup</h2>
                <div className="flex items-center mb-4">
                  <div className={`flex items-center mr-4 ${twoFAStep >= 1 ? 'text-cyan-500' : 'text-gray-400'}`}><span className="font-bold mr-1">1</span>Phone Number</div>
                  <div className={`flex items-center mr-4 ${twoFAStep >= 2 ? 'text-cyan-500' : 'text-gray-400'}`}><span className="font-bold mr-1">2</span>Confirm</div>
                  <div className={`flex items-center ${twoFAStep === 3 ? 'text-cyan-500' : 'text-gray-400'}`}><span className="font-bold mr-1">3</span>Recovery Code</div>
                </div>
              </div>
              <div className="p-8">
                {twoFAStep === 1 && (
                  <>
                    <div className="mb-4">
                      <div className="font-semibold mb-2">Enter your mobile phone number below.</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">We will send an authentication code if we detect a sign in attempt from an unrecognized location.</div>
                      <input
                        type="text"
                        className={`w-full mb-3 px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        placeholder="Country"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                      />
                      <input
                        type="tel"
                        className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        placeholder="Enter phone number"
                        value={phoneInput}
                        onChange={e => setPhoneInput(e.target.value)}
                      />
                      <div className="text-xs text-gray-400 mt-2">Your phone number will only be used for two-factor authentication purposes.</div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        className={`px-6 py-2 rounded-lg font-medium border ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'}`}
                        onClick={() => { setShow2FAModal(false); setPhoneInput(""); setVerificationCode(""); }}
                      >Cancel</button>
                      <button
                        className={`px-6 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}
                        onClick={() => setTwoFAStep(2)}
                        disabled={!phoneInput}
                      >Continue</button>
                    </div>
                  </>
                )}
                {twoFAStep === 2 && (
                  <>
                    <div className="mb-4">
                      <div className="font-semibold mb-2">A verification code has been sent to +xxxxxxxxx000.</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please confirm by entering the code below.</div>
                      <input
                        type="text"
                        className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        placeholder="Enter code"
                        value={verificationCode}
                        onChange={e => setVerificationCode(e.target.value)}
                      />
                      <div className="text-xs text-gray-400 mt-2">We use this code to verify your identity whenever a sign in attempt is detected from an unrecognized location.</div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        className={`px-6 py-2 rounded-lg font-medium border ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'}`}
                        onClick={() => setTwoFAStep(1)}
                      >Back</button>
                      <button
                        className={`px-6 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}
                        onClick={() => setTwoFAStep(3)}
                        disabled={!verificationCode}
                      >Continue</button>
                    </div>
                  </>
                )}
                {twoFAStep === 3 && (
                  <>
                    <div className="mb-4">
                      <div className="font-semibold mb-2">This is your <span className="text-orange-500">ONE TIME</span> recovery code.</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please save your recovery code in a secure place by selecting at least one of the options below.</div>
                      <div ref={recoveryRef} className={`w-full p-4 rounded-lg border font-mono text-base whitespace-pre-wrap break-words ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}>{recoveryCode}</div>
                      <div className="flex gap-2 mt-2">
                        <button
                          className={`px-4 py-1 rounded border ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'}`}
                          onClick={() => {
                            if (recoveryRef.current) {
                              navigator.clipboard.writeText(recoveryRef.current.textContent || '');
                            }
                          }}
                        >Copy</button>
                        <button
                          className={`px-4 py-1 rounded border ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'}`}
                          onClick={() => {
                            const blob = new Blob([recoveryCode], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'recovery-code.txt';
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >Download</button>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        className={`px-6 py-2 rounded-lg font-medium border ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'}`}
                        onClick={() => setTwoFAStep(2)}
                      >Back</button>
                      <button
                        className={`px-6 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}
                        onClick={() => {
                          setShow2FAModal(false);
                          setPendingTwoFA(true);
                        }}
                      >Confirm</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Deletion Modal */}
      {showAccountDeletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: isDarkMode ? 'rgba(17,24,39,0.7)' : 'rgba(243,244,246,0.7)', backdropFilter: 'blur(8px)'}}>
          <div className={`w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden border relative ${isDarkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}
            style={{boxShadow: isDarkMode ? '0 8px 40px rgba(0,0,0,0.7)' : '0 8px 40px rgba(0,0,0,0.12)'}}>
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 transition"
              onClick={() => setShowAccountDeletionModal(false)}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold">Confirm Account Deletion</h2>
            </div>
            <div className="p-8">
              <p className={`mb-6 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Are you sure you want to request account deletion? All your data and access to associated workspaces will be lost.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAccountDeletionModal(false)}
                  className={`px-6 py-2 rounded-lg font-medium border shadow-sm ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'} transition`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Account deletion requested!');
                    setShowAccountDeletionModal(false);
                    // Implement actual deletion request logic here
                  }}
                  className="px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Confirm Deletion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 