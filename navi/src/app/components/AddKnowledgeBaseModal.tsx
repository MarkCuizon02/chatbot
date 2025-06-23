'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiOutlineUpload, 
  HiOutlineChevronDown, 
  HiOutlinePaperClip, 
  HiOutlineMicrophone, 
  HiOutlinePaperAirplane,
  HiOutlineSearch,
  HiOutlineCube,
  HiOutlineDocumentText
} from 'react-icons/hi';
import Image from 'next/image';

interface AddKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const AddKnowledgeBaseModal: React.FC<AddKnowledgeBaseModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState('Logs');

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div
      className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backdropVariants}
      onClick={onClose}
    >
          <motion.div
            className={`w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex justify-between items-center p-5 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shrink-0`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Knowledge Base 1</h2>
              </div>
              <button onClick={onClose} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <HiX size={24} />
              </button>
            </div>

            <div className="flex flex-grow overflow-hidden">
              {/* Left Side: Form */}
              <div className={`w-1/2 p-6 overflow-y-auto border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="font-semibold text-lg mb-4">Files</h3>
                <div className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                  <HiOutlineUpload size={40} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className="mt-4 font-semibold">Drop your files here or <span className="text-teal-500">browse</span></p>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload relevant documents to enhance the context of Neuros prompts.</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                    <input type="text" defaultValue="Knowledge Base 1" className={`w-full p-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pack</label>
                    <div className="relative">
                      <div className={`w-full p-2 rounded-lg border flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                        <div className={`flex items-center space-x-2 px-2 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                            <HiOutlineCube size={16}/>
                            <span>Neuro FAQ Pack</span>
                        </div>
                        <HiOutlineChevronDown size={20} />
                      </div>
                    </div>
                  </div>
                   <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tone</label>
                    <div className="relative">
                      <div className={`w-full p-2 rounded-lg border flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                        <span className="px-2 py-0.5 text-sm font-medium rounded-md bg-yellow-100 text-yellow-800">Supportive</span>
                        <HiOutlineChevronDown size={20} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Persona</label>
                     <div className="relative">
                      <div className={`w-full p-2 rounded-lg border flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                        <span className="px-2 py-0.5 text-sm font-medium rounded-md bg-purple-100 text-purple-800">Help Assistant</span>
                        <HiOutlineChevronDown size={20} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Industry</label>
                     <div className="relative">
                      <div className={`w-full p-2 rounded-lg border flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                        <span className={`px-2 py-0.5 text-sm font-medium rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>New User</span>
                        <HiOutlineChevronDown size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Chat */}
              <div className="w-1/2 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-1 border-b-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
                    {['Logs', 'Test'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? (isDarkMode ? 'text-teal-400 border-b-2 border-teal-400' : 'text-teal-600 border-b-2 border-teal-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                   <HiOutlineSearch size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                
                <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                    {/* Chat Messages */}
                    <div className="flex justify-end">
                      <div className="flex items-start gap-2.5">
                          <div className={`flex flex-col gap-1 w-full max-w-[320px] p-4 border-gray-200 rounded-s-xl rounded-ee-xl ${isDarkMode ? 'bg-teal-600' : 'bg-gray-200'}`}>
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                  <HiOutlineDocumentText className="w-5 h-5"/>
                                  <span className="text-sm font-semibold">New Knowledge Base.pdf</span>
                              </div>
                          </div>
                          <Image src="/images/Troy.jpg" alt="Troy" width={32} height={32} className="rounded-full shrink-0" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className={`flex items-start gap-2.5`}>
                           <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-s-xl rounded-ee-xl ${isDarkMode ? 'bg-teal-600' : 'bg-gray-200'}`}>
                              <p className="text-sm font-normal">Draw up QA Pairs from the file added.</p>
                          </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                           <p className="text-sm font-normal">Sure thing! I'll be back shortly with the full breakdown.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-2.5">
                        <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                           <p className="text-sm font-semibold">Analyzing the file...</p>
                           <div className="flex justify-between items-center mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-600">
                                <div className="bg-teal-500 h-1.5 rounded-full" style={{width: '50%'}}></div>
                            </div>
                            <span className="text-sm font-medium ml-3">50%</span>
                           </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 shrink-0">
                  <div className={`relative border rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <textarea
                      placeholder="Ask Neuro..."
                      rows={2}
                      className={`w-full bg-transparent p-2 pl-10 pr-20 rounded-lg focus:outline-none resize-none`}
                    />
                    <button className="absolute left-3 top-3">
                        <HiOutlinePaperClip size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}/>
                    </button>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                        <button><HiOutlineMicrophone size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}/></button>
                        <button className={`ml-2 p-1.5 rounded-full ${isDarkMode ? 'bg-teal-500' : 'bg-teal-600'}`}>
                            <HiOutlinePaperAirplane size={18} className="text-white transform rotate-45"/>
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex justify-end items-center p-5 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shrink-0`}>
              <button onClick={onClose} className={`px-4 py-2 rounded-lg mr-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>Cancel</button>
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-600">Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddKnowledgeBaseModal; 