"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { User, Send, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from "../components/Sidebar";
import { useTheme } from "@/context/ThemeContext";
import Head from 'next/head';

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

  // Chatbot notification badge state
  const [showChatBadge, setShowChatBadge] = useState(true);

  // 1. Add minimize state
  const [isMinimized, setIsMinimized] = useState(false);

  // 4. Bounce animation when minimized and new message
  const [bounce, setBounce] = useState(false);

  // Move activeChat above useEffects that use it
  const activeChat = chatSessions.find(s => s.id === activeChatId);

  // 3. Play sound on new assistant message
  useEffect(() => {
    if (!isMinimized && showChatbot && activeChat) {
      const lastMsg = activeChat.messages[activeChat.messages.length - 1];
      if (lastMsg && lastMsg.role === 'assistant') {
        const ctx = new window.AudioContext();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 880;
        g.gain.value = 0.08;
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.15);
        setTimeout(() => ctx.close(), 200);
      }
    }
  }, [activeChat?.messages.length, showChatbot, isMinimized]);

  useEffect(() => {
    if (isMinimized && activeChat) {
      const lastMsg = activeChat.messages[activeChat.messages.length - 1];
      if (lastMsg && lastMsg.role === 'assistant') {
        setBounce(true);
        setTimeout(() => setBounce(false), 600);
      }
    }
  }, [activeChat?.messages.length, isMinimized]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Compose mailto link
    const subject = encodeURIComponent('Support Request from ' + form.email);
    const body = encodeURIComponent(form.message + '\n\nReply to: ' + form.email);
    window.location.href = `mailto:mark@hurdman.net?subject=${subject}&body=${body}`;
    setForm({ email: "", message: "" });
  };

  // Back to Top
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Simulate receiving a new message after 8 seconds if chat not opened
  useEffect(() => {
    if (!showChatbot && showChatBadge) {
      const timer = setTimeout(() => {
        setShowChatBadge(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showChatbot, showChatBadge]);
  // Hide badge when chat is opened
  useEffect(() => {
    if (showChatbot) setShowChatBadge(false);
  }, [showChatbot]);

  return (
    <>
      <Head>
        <title>Help & Support | Simplabots</title>
        <meta name="description" content="Get help, support, and answers to your questions about Simplabots. Browse FAQs, contact support, or chat live with our AI assistant Navi." />
      </Head>
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

            {/* Enhanced Support & Community Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-emerald-700 dark:text-emerald-300 tracking-tight">Support & Community Resources</h2>
            </div>
            {/* Platform Status, Live Chat, Community Forum */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Product Updates Card */}
              <div className={`rounded-2xl p-6 shadow-lg flex flex-col gap-2 relative overflow-hidden group transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl ${isDarkMode ? "bg-gradient-to-br from-yellow-900 via-gray-800 to-yellow-700 border border-yellow-700" : "bg-gradient-to-br from-white via-yellow-50 to-yellow-100 border border-yellow-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 8V6a4 4 0 0 0-8 0v2M5 8h14l1 12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2l1-12Zm5 4v4m4-4v4" /></svg>
                  <h2 className="text-xl font-semibold text-yellow-700">Product Updates</h2>
                </div>
                <p className="text-lg font-medium">See the latest features, improvements, and news about Simplabots.</p>
                <a href="https://simplabots.com/updates" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition-all text-sm">View Updates</a>
                <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="#facc15" /></svg>
                </div>
              </div>
              {/* Live Chat Card (no button) */}
              <div className={`rounded-2xl p-6 shadow-lg flex flex-col items-start gap-2 relative overflow-hidden group transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl ${isDarkMode ? "bg-gradient-to-br from-gray-800 via-emerald-900 to-gray-700 border border-emerald-700" : "bg-gradient-to-br from-white via-emerald-50 to-emerald-100 border border-emerald-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" /></svg>
                <h2 className="text-xl font-semibold text-emerald-600">Live Chat</h2>
                </div>
                <p className="mb-2">Need instant help? Our agents are available during support hours.</p>
                <div className="absolute left-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="#10b981" /></svg>
                </div>
              </div>
              {/* Community Forum Card */}
              <div className={`rounded-2xl p-6 shadow-lg flex flex-col items-start gap-2 relative overflow-hidden group transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl ${isDarkMode ? "bg-gradient-to-br from-blue-900 via-gray-800 to-blue-700 border border-blue-700" : "bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2h5m6-8a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm6 0a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" /></svg>
                  <h2 className="text-xl font-semibold text-blue-600">Community Forum</h2>
                </div>
                <p>Join our user community to ask questions, share tips, and connect with other users.</p>
                <a href="https://community.simplabots.com" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all text-sm">Visit Forum</a>
                <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="#3b82f6" /></svg>
                </div>
            </div>
              {/* Video Tutorials Card */}
              <div className={`rounded-2xl p-6 shadow-lg flex flex-col items-start gap-2 relative overflow-hidden group transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl ${isDarkMode ? "bg-gradient-to-br from-pink-900 via-gray-800 to-pink-700 border border-pink-700" : "bg-gradient-to-br from-white via-pink-50 to-pink-100 border border-pink-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0 1 22 9.618v4.764a2 2 0 0 1-2.447 1.894L15 14M4 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z" /></svg>
                  <h2 className="text-xl font-semibold text-pink-700">Video Tutorials</h2>
                </div>
                <p>Watch step-by-step guides to get the most out of Simplabots.</p>
                <a href="https://simplabots.com/tutorials" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block px-4 py-2 rounded-lg bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition-all text-sm">Watch Tutorials</a>
                <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="#ec4899" /></svg>
                </div>
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
            <form onSubmit={handleSubmit} className={`relative rounded-2xl shadow-lg p-8 space-y-8 ${isDarkMode ? "bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600" : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"} mt-16 mb-8 transition-all duration-300`}>
              <div className="mb-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-60" />
                <span className="text-xs uppercase tracking-widest text-emerald-500 font-semibold">Contact</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-emerald-300 to-transparent opacity-60" />
              </div>
            <h2 className="text-2xl font-semibold mb-2 text-emerald-600 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 17.25V6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25ZM17.25 7.5l-5.25 5.25-5.25-5.25" /></svg>
              Contact Support
            </h2>
            <div className="relative z-0">
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                  className="peer w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 transition-colors placeholder-transparent focus:bg-emerald-50 dark:focus:bg-gray-800 rounded-md focus:shadow-lg"
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
                  className="peer w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-3 text-black dark:text-gray-100 focus:outline-none focus:border-emerald-500 transition-colors placeholder-transparent resize-none focus:bg-emerald-50 dark:focus:bg-gray-800 rounded-md focus:shadow-lg"
                rows={5}
                placeholder=" "
                required
                  style={{ color: isDarkMode ? '#fff' : '#000', background: 'transparent' }}
              />
              <label htmlFor="message" className="absolute left-0 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-emerald-600 peer-focus:dark:text-emerald-400 bg-transparent pointer-events-none">Message</label>
            </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition-all w-full text-lg mt-2 focus:outline-none focus:ring-4 focus:ring-emerald-300">Send Message</button>
          </form>
        </div>
          {/* Floating Chatbot Button */}
          {!showChatbot && (
            <div className="fixed z-50 bottom-8 right-8 flex flex-col items-end gap-2">
              {/* Floating message bubble above chatbot icon */}
              {showChatBadge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="mb-3 max-w-xs px-4 py-2 rounded-2xl shadow-xl bg-gradient-to-br from-emerald-400 via-emerald-200 to-white dark:from-emerald-700 dark:via-gray-800 dark:to-gray-900 text-emerald-900 dark:text-emerald-100 font-semibold text-sm relative animate-fade-in"
                  style={{ pointerEvents: 'none' }}
                >
                  <span>Need help? Ask Navi!</span>
                  <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-emerald-400 via-emerald-200 to-white dark:from-emerald-700 dark:via-gray-800 dark:to-gray-900 rotate-45 shadow-md"></span>
                </motion.div>
              )}
          <button
                onClick={() => setShowChatbot(true)}
                className={`relative bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg p-2 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 animate-float hover:shadow-emerald-400/80 group ${showChatBadge ? 'animate-pulse' : ''} cursor-pointer`}
                aria-label="Open chat with Navi"
                style={{ boxShadow: '0 4px 24px 0 rgba(16,185,129,0.25)' }}
              >
                {/* Navi Picture as Icon, enhanced */}
                <span className="relative w-14 h-14 flex items-center justify-center cursor-pointer">
                  <Image src="/images/Navi.png" alt="Navi" width={56} height={56} className="rounded-full border-4 border-white group-hover:shadow-emerald-400/80 group-hover:ring-4 group-hover:ring-emerald-400 transition-all duration-300" />
                  {/* Glowing ring */}
                  <span className="absolute -inset-1 rounded-full border-4 border-emerald-400 opacity-70 animate-pulse pointer-events-none"></span>
                  {/* Notification badge */}
                  {showChatBadge && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border-2 border-white animate-bounce">1</span>
                  )}
                </span>
          </button>
            </div>
        )}
        {/* Chatbot Modal */}
        <AnimatePresence>
            {showChatbot && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                aria-modal="true"
                role="dialog"
                aria-label="Navi Support Chatbot Modal"
              >
                <div className="relative w-full max-w-3xl h-[85vh] rounded-3xl bg-[#181c24]/90 border border-emerald-700 shadow-2xl flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-t-3xl shadow-sm border-b border-emerald-700">
                    <div className="flex items-center gap-3">
                      <Image src='/images/Navi.png' alt='Navi' width={44} height={44} className="rounded-full border-2 border-white shadow" />
                      <div>
                        <div className="font-bold text-lg text-white">Navi</div>
                        <div className="text-xs text-emerald-100">Support Assistant</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsMinimized(true)}
                        className="rounded-full bg-white/10 text-white hover:bg-emerald-600/80 shadow w-9 h-9 flex items-center justify-center transition-all duration-200 border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Minimize Chatbot"
                        title="Minimize"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                      </button>
              <button
                onClick={() => setShowChatbot(false)}
                        className="rounded-full bg-white/10 text-white hover:bg-red-500/80 shadow w-9 h-9 flex items-center justify-center transition-all duration-200 border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        aria-label="Close Chatbot"
                        title="Close"
                      >
                        <span className="text-2xl">&times;</span>
                      </button>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-1/3 bg-[#232a36]/80 border-r border-emerald-800 p-4 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-lg text-emerald-100">Chats</h2>
                        <button onClick={handleNewChat} className="p-2 rounded-full hover:bg-emerald-700/30 transition-colors" aria-label="New Chat">
                          <Plus className="w-5 h-5 text-emerald-300" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {chatSessions.map(session => (
                          <div key={session.id} className={`flex items-center justify-between gap-2 mb-2 px-3 py-2 rounded-full cursor-pointer transition-all ${activeChatId === session.id ? 'bg-emerald-700/80 text-white' : 'hover:bg-emerald-700/30 text-emerald-100'}`} onClick={() => setActiveChatId(session.id)}>
                            <span className="truncate text-sm font-medium">{session.messages.find(m => m.role === 'user')?.content || 'New Chat'}</span>
                            <button onClick={e => {e.stopPropagation(); handleDeleteChat(session.id);}} className="p-1 rounded-full text-emerald-200 hover:text-red-400 hover:bg-red-900/30 transition-colors" aria-label="Delete Chat">
                            <Trash2 className="w-4 h-4"/>
              </button>
              </div>
                      ))}
                    </div>
                    </aside>
                    {/* Chat area */}
                    <section className="flex-1 flex flex-col justify-end p-6 space-y-4">
                      {/* Messages */}
                      <div ref={chatContainerRef} className="flex flex-col gap-6 overflow-y-auto flex-1 pr-2 custom-scrollbar" style={{scrollbarWidth: 'thin', scrollbarColor: '#34d399 #232a36'}}>
                        {activeChat?.messages.map((msg, i) => (
                          msg.role === 'assistant' ? (
                            <div key={i} className="flex items-start gap-3 mb-2">
                              <div className="flex-shrink-0 z-10">
                                <Image src='/images/Navi.png' alt='Navi' width={22} height={22} className="rounded-full border-2 border-emerald-400 shadow -mb-2 ml-2" />
                              </div>
                              <div className="relative bg-[#232a36]/90 text-white rounded-2xl px-7 py-5 shadow-lg ring-2 ring-emerald-500/30 font-medium text-[1.08rem] leading-relaxed max-w-xl" style={{ boxShadow: '0 4px 24px 0 #10b98133' }}>
                                {/* AI label chip */}
                                <span className="absolute -top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                                  Navi
                                </span>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                            </div>
                          ) : (
                            <div key={i} className="flex items-end justify-end gap-2 mb-2">
                              <div className="bg-emerald-600 text-white rounded-2xl px-6 py-4 shadow max-w-xl font-semibold text-base leading-relaxed">
                                {msg.content}
                          </div>
                            </div>
                          )
                ))}
                {isChatLoading && (
                          <div className="flex items-center gap-2 px-6 py-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            <span className="text-xs text-emerald-500 font-medium ml-2">Navi is typing...</span>
                          </div>
                        )}
                      </div>
                      {/* Input bar */}
                      <form className="flex items-center gap-2 mt-6 bg-[#232a36]/80 rounded-full px-4 py-3 shadow-lg" onSubmit={e => {e.preventDefault(); editingMessage ? handleSaveEdit() : handleSendMessage();}}>
                <input
                          ref={inputRef}
                  type="text"
                          className="flex-1 bg-transparent text-white placeholder-gray-400 border-none focus:ring-0 outline-none text-base"
                          placeholder="Ask Navi a question..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  disabled={isChatLoading}
                  autoFocus
                          aria-label="Chat input"
                />
                            <button
                              type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              disabled={isChatLoading || !chatInput.trim()}
                          aria-label={editingMessage ? 'Save & Submit' : 'Send'}
                >
                            <Send className="w-5 h-5" />
                </button>
              </form>
                    </section>
            </div>
          </div>
            </motion.div>
        )}
        </AnimatePresence>
          {/* Minimized bubble */}
          {isMinimized && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: bounce ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="fixed z-50 bottom-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl p-3 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 animate-float cursor-pointer"
              style={{ boxShadow: '0 4px 24px 0 rgba(16,185,129,0.25)' }}
              onClick={() => { setIsMinimized(false); setShowChatbot(true); }}
              aria-label="Restore chat with Navi"
              title="Restore Chatbot"
            >
              <Image src="/images/Navi.png" alt="Navi" width={40} height={40} className="rounded-full border-2 border-white shadow" />
              {showChatBadge && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border-2 border-white animate-bounce">1</span>
              )}
            </motion.button>
          )}
      </main>
    </div>
    </>
  );
} 