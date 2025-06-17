"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../../context/ThemeContext";
import { HiOutlineEye } from "react-icons/hi2";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
        setIsProfileOpen={setIsProfileOpen} isNaviChatbotOpen={false} setIsNaviChatbotOpen={function (value: React.SetStateAction<boolean>): void {
          throw new Error("Function not implemented.");
        } }      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "ml-12" : "ml-32"} p-8 overflow-x-hidden`}>  
        <h1 className="text-2xl font-bold mb-8">Billing & Subscription</h1>
        {/* Your Plan Section */}
        <div className="mb-8">
          <div className="font-semibold text-lg mb-3">Your Plan</div>
          <div className="bg-white rounded-2xl border border-gray-300 p-8 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-1 flex flex-col gap-2 min-w-[220px]">
              <div className="text-sm text-gray-400 mb-1">Renews on April 5</div>
              <div className="font-semibold mb-1">Family Plus (Personal)</div>
              <div className="text-2xl font-bold mb-1">$99.00<span className="text-base font-medium">/month</span></div>
              <div className="text-gray-500 mb-4">unlimited users • 1500 credits/month</div>
              <button className="border border-teal-400 text-teal-700 px-4 py-1 rounded font-medium text-sm hover:bg-teal-50 transition w-fit" onClick={() => router.push('/billing/plan')}>Upgrade Plan</button>
            </div>
            <div className="flex flex-col min-w-[260px] gap-2">
              <div className="flex flex-col items-end">
                <button className="mb-4 border border-gray-300 text-gray-700 px-4 py-1 rounded font-medium text-sm hover:bg-gray-100 transition self-end" onClick={() => router.push('/billing/plan')}>Change Plan</button>
                <div className="w-full flex flex-col items-start">
                  <div className="font-semibold text-gray-500">Additional Credits</div>
                  <div className="text-lg font-semibold">--</div>
                  <div className="text-gray-500 mb-2">0 additional credits</div>
                  <button className="border border-teal-400 text-teal-700 px-4 py-1 rounded font-medium text-sm hover:bg-teal-50 transition w-fit">Add more</button>
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
    </div>
  );
} 