"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { User, Send, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from "../components/Sidebar";
import { useTheme } from "@/context/ThemeContext";

// Fix for window.tawkLoaded type
declare global {
  interface Window {
    tawkLoaded?: boolean;
  }
}

const faqs = [
  {
    question: "How do I reset my password?",
    answer: (
      <span>Go to <b>Settings &gt; Account</b> and click "Reset Password". Follow the instructions sent to your email.</span>
    ),
    answerText: "Go to Settings > Account and click \"Reset Password\". Follow the instructions sent to your email."
  },
  {
    question: "How do I contact support?",
    answer: (
      <span>Use the contact form below, email <a href="mailto:support@example.com" className="text-emerald-600 underline">support@example.com</a>, or use the live chat widget at the bottom right.</span>
    ),
    answerText: "Use the contact form below, email support@example.com, or use the live chat widget at the bottom right."
  },
  {
    question: "Where can I find billing information?",
    answer: (
      <span>Visit the <b>Billing & Subscription</b> page from your profile menu for invoices, payment methods, and more.</span>
    ),
    answerText: "Visit the Billing & Subscription page from your profile menu for invoices, payment methods, and more."
  },
  {
    question: "How do I upgrade or downgrade my plan?",
    answer: (
      <span>Go to <b>Billing & Subscription</b> and select the plan you want to change to. Changes take effect immediately.</span>
    ),
    answerText: "Go to Billing & Subscription and select the plan you want to change to. Changes take effect immediately."
  },
  {
    question: "Is my data secure?",
    answer: (
      <span>Yes, we use industry-standard encryption and security practices to protect your data.</span>
    ),
    answerText: "Yes, we use industry-standard encryption and security practices to protect your data."
  },
  {
    question: "Can I get a refund?",
    answer: (
      <span>Refunds are handled on a case-by-case basis. Please contact support with your request and details.</span>
    ),
    answerText: "Refunds are handled on a case-by-case basis. Please contact support with your request and details."
  },
  {
    question: "How do I add more team members?",
    answer: (
      <span>Go to <b>Manage Users</b> in your profile menu and invite new members by email.</span>
    ),
    answerText: "Go to Manage Users in your profile menu and invite new members by email."
  },
  {
    question: "What browsers are supported?",
    answer: (
      <span>We support the latest versions of Chrome, Firefox, Safari, and Edge.</span>
    ),
    answerText: "We support the latest versions of Chrome, Firefox, Safari, and Edge."
  },
  {
    question: "How do I delete my account?",
    answer: (
      <span>Contact support via the form, live chat, or email to request account deletion. We'll guide you through the process.</span>
    ),
    answerText: "Contact support via the form, live chat, or email to request account deletion. We'll guide you through the process."
  },
];

export default function HelpSupportPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);
  const [form, setForm] = useState({ email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Chatbot modal state
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatSessions, setChatSessions] = useState<{ id: string; messages: { role: 'user' | 'assistant'; content: string }[] }[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<{ session: string; index: number } | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const faqContext = faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answerText}`).join('\n\n');

  const systemPrompt = `You are Navi, a friendly and helpful AI support assistant for a company called Simplabots. Your goal is to assist users by answering their questions based on the provided Frequently Asked Questions (FAQ) and general knowledge about the platform.

  Here is the FAQ content:
  ${faqContext}

  When responding:
  1. Be concise and clear.
  2. If the answer is in the FAQ, use it directly.
  3. If the question is outside the FAQ, use your general knowledge but mention that for specific account details, they should contact support.
  4. Format your answers using markdown (e.g., bullet points, bold text) for better readability.
  5. Maintain a friendly and professional tone.`;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatSessions, activeChatId]);

  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    setChatSessions(prev => [{ id: newChatId, messages: [] }, ...prev]);
    setActiveChatId(newChatId);
    setEditingMessage(null);
    setChatInput("");
  };

  const handleSendMessage = async () => {
    const content = chatInput.trim();
    if (!content || !activeChatId) return;

    const currentSession = chatSessions.find(s => s.id === activeChatId);
    if (!currentSession) return;

    const newMessages: { role: 'user' | 'assistant'; content: string }[] = [...currentSession.messages, { role: 'user', content }];
    const updatedSessions = chatSessions.map(s => s.id === activeChatId ? { ...s, messages: newMessages } : s);
    setChatSessions(updatedSessions);
    
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/openai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ]
        }),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'API error');
      
      const data = await res.json();
      setChatSessions(prev => prev.map(s => s.id === activeChatId ? { ...s, messages: [...newMessages, { role: 'assistant', content: data.message }] } : s));
    } catch (err) {
      const errorMsg = 'Sorry, there was an error contacting Navi. Please try again later.';
      setChatSessions(prev => prev.map(s => s.id === activeChatId ? { ...s, messages: [...newMessages, { role: 'assistant', content: errorMsg }] } : s));
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleEditMessage = (session: string, index: number) => {
    const messageToEdit = chatSessions.find(s => s.id === session)?.messages[index];
    if (messageToEdit) {
      setEditingMessage({ session, index });
      setChatInput(messageToEdit.content);
      inputRef.current?.focus();
    }
  };
  
  const handleSaveEdit = async () => {
    if (!editingMessage || !activeChatId) return;
    
    const { session, index } = editingMessage;
    const content = chatInput.trim();
    if (!content) return;

    const sessionToUpdate = chatSessions.find(s => s.id === session);
    if (!sessionToUpdate) return;

    const newMessages = sessionToUpdate.messages.slice(0, index);
    newMessages.push({ role: 'user', content });

    const updatedSessions = chatSessions.map(s => s.id === session ? { ...s, messages: newMessages } : s);
    setChatSessions(updatedSessions);
    
    setChatInput("");
    setEditingMessage(null);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/openai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ]
        }),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'API error');
      
      const data = await res.json();
      setChatSessions(prev => prev.map(s => s.id === session ? { ...s, messages: [...newMessages, { role: 'assistant', content: data.message }] } : s));
    } catch (err) {
      const errorMsg = 'Sorry, there was an error contacting Navi. Please try again later.';
      setChatSessions(prev => prev.map(s => s.id === session ? { ...s, messages: [...newMessages, { role: 'assistant', content: errorMsg }] } : s));
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setChatInput("");
  };

  const handleDeleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== chatId));
    if (activeChatId === chatId) {
      const remainingSessions = chatSessions.filter(s => s.id !== chatId);
      setActiveChatId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  useEffect(() => {
    if (showChatbot && chatSessions.length === 0) {
      handleNewChat();
    }
  }, [showChatbot]);

  const activeChat = chatSessions.find(s => s.id === activeChatId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  // Back to Top
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`min-h-screen relative ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900"} flex font-poppins transition-all duration-500`}>  
      {/* Subtle background accent */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10 select-none" aria-hidden>
        <svg width="100%" height="100%" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="accent" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#accent)" />
        </svg>
      </div>
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
      <main className={`flex-1 transition-all duration-300 z-10 ${isSidebarCollapsed ? "ml-24" : "ml-72"} p-4 md:p-10 overflow-x-hidden`}>  
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 0 1-4-.8l-4.28 1.07a1 1 0 0 1-1.21-1.21l1.07-4.28A8.96 8.96 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" /></svg>
            </span>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Help & Support</h1>
              <p className={`mt-2 text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>We're here to help! Browse our FAQ, reach out to support, or start a live chat below.</p>
            </div>
          </div>

          {/* Support Hours, Live Chat, Phone */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`rounded-2xl p-6 shadow-lg flex flex-col gap-2 ${isDarkMode ? "bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600" : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <h2 className="text-xl font-semibold text-emerald-600">Support Hours</h2>
              </div>
              <p>Mon-Fri: <span className="font-medium">8:00 AM - 8:00 PM</span></p>
              <p>Saturday: <span className="font-medium">10:00 AM - 4:00 PM</span></p>
              <p>Sunday: <span className="font-medium">Closed</span></p>
              <p className="text-xs text-gray-400 mt-2">All times are in your local timezone.</p>
            </div>
            <div className={`rounded-2xl p-6 shadow-lg flex flex-col items-start gap-2 ${isDarkMode ? "bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600" : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" /></svg>
                <h2 className="text-xl font-semibold text-emerald-600">Live Chat</h2>
              </div>
              <p>Need instant help? Our agents are available during support hours.</p>
              <button
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold shadow transition-all cursor-pointer hover:bg-emerald-700"
                onClick={() => setShowChatbot(true)}
              >
                Chat with Navi
              </button>
            </div>
            <div className={`rounded-2xl p-6 shadow-lg flex flex-col items-start gap-2 ${isDarkMode ? "bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600" : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h2.28a2 2 0 0 1 1.94 1.515l.34 1.36a2 2 0 0 1-1.1 2.32l-.82.41a16.06 16.06 0 0 0 6.29 6.29l.41-.82a2 2 0 0 1 2.32-1.1l1.36.34A2 2 0 0 1 21 16.72V19a2 2 0 0 1-2 2h-.01C7.61 21 3 16.39 3 11.01V11V5Z" /></svg>
                <h2 className="text-xl font-semibold text-emerald-600">Contact by Phone</h2>
              </div>
              <p className="mb-2">Call us at <a href="tel:+1234567890" className="text-emerald-600 underline font-medium">+1 (234) 567-890</a></p>
              <p className="text-xs text-gray-400">Available during support hours</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-60" />
            <span className="text-xs uppercase tracking-widest text-emerald-500 font-semibold">FAQ</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-emerald-300 to-transparent opacity-60" />
          </div>

          {/* Collapsible FAQ */}
          <div className="mb-12 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl shadow group border transition-colors duration-300
                    ${isOpen
                      ? 'border-emerald-400 bg-emerald-50 dark:bg-gray-100'
                      : 'border-gray-200 dark:border-gray-300 bg-white dark:bg-gray-100'}
                  `}
                >
                  <button
                    className={`w-full flex items-center justify-between px-6 py-4 focus:outline-none rounded-xl transition-colors
                      ${isOpen
                        ? 'bg-emerald-50 dark:bg-emerald-100 text-emerald-900 font-semibold'
                        : 'hover:bg-emerald-50 dark:hover:bg-emerald-100 text-gray-900'}
                    `}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${idx}`}
                  >
                    <span className="text-base text-left flex-1">{faq.question}</span>
                    <svg
                      className={`w-6 h-6 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'}`}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    id={`faq-panel-${idx}`}
                    className={`px-6 pb-4 text-gray-700 text-sm transition-all duration-300
                      ${isOpen ? 'block' : 'hidden'}
                    `}
                  >
                    {faq.answer}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-60" />
            <span className="text-xs uppercase tracking-widest text-emerald-500 font-semibold">Contact</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-emerald-300 to-transparent opacity-60" />
          </div>

          {/* Contact Support Form */}
          <form onSubmit={handleSubmit} className={`relative rounded-2xl shadow-lg p-8 space-y-8 ${isDarkMode ? "bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600" : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"}`}>
            <h2 className="text-2xl font-semibold mb-2 text-emerald-600 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 17.25V6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25ZM17.25 7.5l-5.25 5.25-5.25-5.25" /></svg>
              Contact Support
            </h2>
            {submitted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-900/80 bg-opacity-80 rounded-2xl z-10 animate-fade-in">
                <svg className="w-16 h-16 text-emerald-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <div className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-1">Thank you!</div>
                <div className="text-emerald-700 dark:text-emerald-100 text-sm">Your message has been sent. Our team will get back to you soon.</div>
              </div>
            )}
            <div className="relative z-0">
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="peer w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 transition-colors placeholder-transparent"
                placeholder=" "
                required
                autoComplete="email"
              />
              <label htmlFor="email" className="absolute left-0 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-emerald-600 peer-focus:dark:text-emerald-400 bg-transparent pointer-events-none">Your Email</label>
            </div>
            <div className="relative z-0">
              <textarea
                id="message"
                value={form.message}
                onChange={handleChange}
                className="peer w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 transition-colors placeholder-transparent resize-none"
                rows={5}
                placeholder=" "
                required
              />
              <label htmlFor="message" className="absolute left-0 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-emerald-600 peer-focus:dark:text-emerald-400 bg-transparent pointer-events-none">Message</label>
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition-all w-full text-lg">Send Message</button>
          </form>
        </div>
        {/* Back to Top Button */}
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg transition-all"
            aria-label="Back to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
          </button>
        )}
        {/* Chatbot Modal */}
        <AnimatePresence>
          {showChatbot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-md sm:items-center"
            >
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative max-w-2xl w-full flex flex-col h-[90vh] sm:h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={() => setShowChatbot(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl z-10"
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="flex-1 overflow-hidden flex">
                  {/* Sidebar for Chat History */}
                  <div className="w-1/3 border-r border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 flex flex-col">
                    <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center">
                      <h2 className="font-semibold text-lg text-emerald-700 dark:text-emerald-200">Chats</h2>
                      <button onClick={handleNewChat} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Plus className="w-5 h-5 text-emerald-600" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {chatSessions.map(session => (
                        <div key={session.id} className={`p-3 m-2 rounded-lg cursor-pointer flex justify-between items-center transition-all ${activeChatId === session.id ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`} onClick={() => setActiveChatId(session.id)}>
                          <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">{session.messages.find(m => m.role === 'user')?.content || 'New Chat'}</span>
                          <button onClick={(e) => {e.stopPropagation(); handleDeleteChat(session.id);}} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Chat Area */}
                  <div className="w-2/3 flex flex-col">
                    <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center gap-3 bg-gradient-to-b from-white/90 to-white/60 dark:from-gray-900/90 dark:to-gray-900/60 rounded-tr-2xl">
                      <Image src="/images/Navi.png" alt="Navi" width={40} height={40} className="rounded-full" />
                      <div>
                        <div className="font-semibold text-lg text-emerald-700 dark:text-emerald-200">Navi</div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-300">AI Support Assistant</div>
                      </div>
                    </div>
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                      {!activeChat || activeChat.messages.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                          <div className="inline-block bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl">
                            Ask me anything about the platform!
                          </div>
                        </div>
                      )}
                      {activeChat?.messages.map((msg, i) => (
                        <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.role === 'assistant' && (
                            <Image src="/images/Navi.png" alt="Navi" width={32} height={32} className="rounded-full mt-1" />
                          )}
                          <div className={`rounded-xl px-4 py-3 max-w-md break-words shadow-md group relative transition-all
                            ${editingMessage?.session === activeChatId && editingMessage.index === i ? 'ring-2 ring-emerald-500' : ''}
                            ${msg.role === 'user' 
                              ? 'bg-emerald-600 text-white' 
                              : `prose prose-sm max-w-none ${isDarkMode ? 'prose-invert bg-gray-700' : 'bg-gray-200 text-black'}`}`}
                          >
                            {msg.role === 'assistant' 
                              ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                              : msg.content
                            }
                            {msg.role === 'user' && !editingMessage && (
                              <button onClick={() => handleEditMessage(activeChatId!, i)} className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit2 className="w-3 h-3"/>
                              </button>
                            )}
                          </div>
                          {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                              <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="flex items-start gap-3 justify-start">
                          <Image src="/images/Navi.png" alt="Navi" width={32} height={32} className="rounded-full mt-1" />
                          <div className={`rounded-xl px-4 py-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-gray-400 text-sm`}>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-75"></span>
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-150"></span>
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-300"></span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <form
                      className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col gap-2 bg-white/60 dark:bg-gray-900/60 rounded-br-2xl"
                      onSubmit={e => {
                        e.preventDefault();
                        if (editingMessage) {
                          handleSaveEdit();
                        } else {
                          handleSendMessage();
                        }
                      }}
                    >
                      <AnimatePresence>
                        {editingMessage && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-xs text-center text-emerald-700 dark:text-emerald-300 font-semibold mb-1"
                          >
                            Editing message...
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="flex gap-4">
                        <input
                          ref={inputRef}
                          type="text"
                          className="flex-1 rounded-xl border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-all"
                          placeholder="Ask Navi a question..."
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          disabled={isChatLoading}
                          autoFocus
                        />
                        {editingMessage ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center text-sm"
                              disabled={isChatLoading || !chatInput.trim()}
                            >
                              Save & Submit
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center"
                            disabled={isChatLoading || !chatInput.trim()}
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}