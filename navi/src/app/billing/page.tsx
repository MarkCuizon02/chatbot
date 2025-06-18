"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../../context/ThemeContext";
import { HiOutlineEye } from "react-icons/hi2";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

// Add subscription state interface
interface Subscription {
  plan: string;
  price: number;
  renewalDate: string;
  status: 'active' | 'cancelled' | 'pending';
  credits: number;
  additionalCredits: number;
}

const billingHistory = [
  { id: "#10003", plan: "Family Plus", date: "March 5, 2025", status: "Failed" },
  { id: "#10002", plan: "Family Plus", date: "February 5, 2025", status: "Paid" },
  { id: "#10001", plan: "Family Plus", date: "January 5, 2025", status: "Paid" },
];

export default function BillingPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const router = useRouter();

  // Add subscription state
  const [subscription, setSubscription] = useState<Subscription>({
    plan: "Family Plus",
    price: 99.00,
    renewalDate: "April 5",
    status: 'active',
    credits: 1500,
    additionalCredits: 0
  });

  // Handle plan change
  const handlePlanChange = () => {
    router.push('/billing/plan');
  };

  // Handle subscription cancellation
  const handleCancelSubscription = () => {
    setShowCancelConfirm(true);
  };

  // Confirm cancellation
  const confirmCancellation = () => {
    setSubscription(prev => ({
      ...prev,
      status: 'cancelled'
    }));
    setShowCancelConfirm(false);
  };

  // Handle additional credits
  const handleAddCredits = () => {
    // Implement credit purchase logic here
    console.log('Adding credits...');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} flex font-poppins transition-colors duration-300`}>
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
        isNaviChatbotOpen={false}
        setIsNaviChatbotOpen={function (value: React.SetStateAction<boolean>): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "ml-12" : "ml-32"} p-8 overflow-x-hidden`}>  
        <h1 className="text-2xl font-bold mb-8">Billing & Subscription</h1>
        {/* Your Plan Section */}
        <div className="mb-8">
          <div className="font-semibold text-lg mb-3">Your Plan</div>
          <div className="bg-white rounded-2xl border border-gray-300 p-8 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-1 flex flex-col gap-2 min-w-[220px]">
              <div className="text-sm text-gray-400 mb-1">Renews on {subscription.renewalDate}</div>
              <div className="font-semibold mb-1">{subscription.plan} (Personal)</div>
              <div className="text-2xl font-bold mb-1">${subscription.price.toFixed(2)}<span className="text-base font-medium">/month</span></div>
              <div className="text-gray-500 mb-4">unlimited users • {subscription.credits} credits/month</div>
              <div className="flex gap-2">
                <button 
                  className="border border-teal-400 text-teal-700 px-4 py-1 rounded font-medium text-sm hover:bg-teal-50 transition w-fit" 
                  onClick={handlePlanChange}
                >
                  Upgrade Plan
                </button>
                {subscription.status === 'active' && (
                  <button 
                    className="border border-red-400 text-red-700 px-4 py-1 rounded font-medium text-sm hover:bg-red-50 transition w-fit" 
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col min-w-[260px] gap-2">
              <div className="flex flex-col items-end">
                <button 
                  className="mb-4 border border-gray-300 text-gray-700 px-4 py-1 rounded font-medium text-sm hover:bg-gray-100 transition self-end"
                  onClick={handlePlanChange}
                >
                  Change Plan
                </button>
                <div className="w-full flex flex-col items-start">
                  <div className="font-semibold text-gray-500">Additional Credits</div>
                  <div className="text-lg font-semibold">{subscription.additionalCredits}</div>
                  <div className="text-gray-500 mb-2">{subscription.additionalCredits} additional credits</div>
                  <button 
                    className="border border-teal-400 text-teal-700 px-4 py-1 rounded font-medium text-sm hover:bg-teal-50 transition w-fit"
                    onClick={handleAddCredits}
                  >
                    Add more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Payment Method Section */}
        <div className="mb-8">
          <div className="font-semibold text-lg mb-3">Payment Method</div>
          <div className="bg-white rounded-2xl border border-gray-300 p-8 relative flex items-center min-h-[80px]">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="w-12 h-8 object-contain mr-4" />
            <div className="flex-1">
              <div className="text-sm font-medium">Visa ending in **** 1234</div>
            </div>
            <button className="absolute top-6 right-6 border border-gray-300 text-gray-700 px-4 py-1 rounded font-medium text-sm hover:bg-gray-100 transition" onClick={() => router.push('/billing/cards')}>Update</button>
          </div>
        </div>
        {/* Billing History Section */}
        <div className="mb-8">
          <div className="font-semibold text-lg mb-3">Billing History</div>
          <div className="bg-white rounded-2xl border border-gray-300 p-8">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-700 font-semibold border-b">
                  <th className="py-2 pr-4">Invoice ID</th>
                  <th className="py-2 pr-4">Plan</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((row) => (
                  <tr key={row.id} className="border-b last:border-0 group">
                    <td className="py-2 pr-4 font-mono">{row.id}</td>
                    <td className="py-2 pr-4">{row.plan}</td>
                    <td className="py-2 pr-4">{row.date}</td>
                    <td className="py-2 pr-4">
                      {row.status === "Paid" ? (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">Paid</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">Failed</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 relative text-right">
                      <button
                        className="p-2 rounded hover:bg-gray-100"
                        onClick={() => setMenuOpen(menuOpen === row.id ? null : row.id)}
                      >
                        <span className="sr-only">Actions</span>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                          <circle cx="12" cy="6" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="12" cy="18" r="1.5" />
                        </svg>
                      </button>
                      {menuOpen === row.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                          <button className="flex items-center gap-2 px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 text-sm">
                            <HiOutlineEye className="w-4 h-4" /> View
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-50 text-sm">
                            <Download className="w-4 h-4" /> Download
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Cancel Subscription</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll still have access until {subscription.renewalDate}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Keep Subscription
              </button>
              <button
                onClick={confirmCancellation}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 