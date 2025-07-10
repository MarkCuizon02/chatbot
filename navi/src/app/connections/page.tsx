'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import {
  HiOutlinePlus,
  HiMagnifyingGlass,
  HiChevronDown,
  HiChevronUp,
} from 'react-icons/hi2';

interface ModelItem {
  id: string;
  title: string;
  description: string;
  credits: string;
  isAvailable: boolean;
}

interface CategoryData {
  id: string;
  name: string;
  items: ModelItem[];
  subcategories?: {
    id: string;
    name: string;
    items: ModelItem[];
  }[];
}

interface ToggleSwitchProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
  id: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isEnabled, onChange, id }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={isEnabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`block w-12 h-6 rounded-full ${
            isEnabled 
              ? (isDarkMode ? 'bg-teal-700' : 'bg-teal-500') 
              : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
          } transition-colors duration-200`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            isEnabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        ></div>
      </div>
    </label>
  );
};

interface ModelItemComponentProps {
  item: ModelItem;
  onToggle: (id: string, enabled: boolean) => void;
}

const ModelItemComponent: React.FC<ModelItemComponentProps> = ({ item, onToggle }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`flex items-center justify-between py-4 px-6 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200`}>
      <div className="flex-1">
        <h4 className="font-medium text-base mb-1">{item.title}</h4>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {item.description}
        </p>
      </div>
      <div className="flex items-center space-x-4 ml-4">
        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
          {item.credits}
        </span>
        {item.isAvailable && (
          <ToggleSwitch
            isEnabled={item.isAvailable}
            onChange={(enabled) => onToggle(item.id, enabled)}
            id={`toggle-${item.id}`}
          />
        )}
      </div>
    </div>
  );
};

interface CategorySectionProps {
  category: CategoryData;
  onToggle: (id: string, enabled: boolean) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, onToggle }) => {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  const toggleSubcategory = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  return (
    <div className={`border rounded-lg ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-4`}>
      {/* Main Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-6 text-left ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200`}
      >
        <h3 className="text-lg font-semibold">{category.name}</h3>
        {isExpanded ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {/* Direct category items */}
              {category.items.map((item) => (
                <ModelItemComponent key={item.id} item={item} onToggle={onToggle} />
              ))}

              {/* Subcategories */}
              {category.subcategories?.map((subcategory) => (
                <div key={subcategory.id} className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button
                    onClick={() => toggleSubcategory(subcategory.id)}
                    className={`w-full flex items-center justify-between p-6 pl-8 text-left ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200`}
                  >
                    <h4 className="text-base font-medium">{subcategory.name}</h4>
                    {expandedSubcategories.has(subcategory.id) ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSubcategories.has(subcategory.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          {subcategory.items.map((item) => (
                            <div key={item.id} className="pl-4">
                              <ModelItemComponent item={item} onToggle={onToggle} />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ConnectionsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [categories, setCategories] = useState<CategoryData[]>([
    {
      id: 'text-writing',
      name: 'TEXT & WRITING',
      items: []
    },
    {
      id: 'image-generation',
      name: 'Image Generation',
      items: [],
      subcategories: [
        {
          id: 'dalle-3',
          name: 'DALL-E 3 (OpenAI)',
          items: [
            {
              id: 'dalle-3-1',
              title: 'Title-4.1',
              description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
              credits: '0.8 Credits / 1k Tokens',
              isAvailable: false
            },
            {
              id: 'dalle-3-2',
              title: 'Title-4.1',
              description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
              credits: '0.8 Credits / 1k Tokens',
              isAvailable: true
            },
            {
              id: 'dalle-3-3',
              title: 'Title-4.1',
              description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
              credits: '0.8 Credits / 1k Tokens',
              isAvailable: false
            }
          ]
        }
      ]
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      items: [
        {
          id: 'midjourney-1',
          title: 'Title-4.1',
          description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
          credits: '0.8 Credits / 1k Tokens',
          isAvailable: false
        },
        {
          id: 'midjourney-2',
          title: 'Title-4.1',
          description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
          credits: '0.8 Credits / 1k Tokens',
          isAvailable: false
        },
        {
          id: 'midjourney-3',
          title: 'Title-4.1',
          description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
          credits: '0.8 Credits / 1k Tokens',
          isAvailable: false
        }
      ]
    },
    {
      id: 'audio-music',
      name: 'AUDIO & MUSIC',
      items: [],
      subcategories: [
        {
          id: 'elevenlabs',
          name: 'ElevenLabs',
          items: [
            {
              id: 'elevenlabs-1',
              title: 'Title-4.1',
              description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
              credits: '0.8 Credits / 1k Tokens',
              isAvailable: true
            },
            {
              id: 'elevenlabs-2',
              title: 'Title-4.1',
              description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
              credits: '0.8 Credits / 1k Tokens',
              isAvailable: false
            },
            {
              id: 'elevenlabs-3',
              title: 'Title-4.1',
              description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
              credits: '0.8 Credits / 1k Tokens',
              isAvailable: false
            }
          ]
        },
        {
          id: 'google-audiolm',
          name: 'Google AudioLM',
          items: [
            {
              id: 'audiolm-1',
              title: 'Title-4.1',
              description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
              credits: '0.8 Credits / 1k Tokens',
              isAvailable: false
            },
            {
              id: 'audiolm-2',
              title: 'Title-4.1',
              description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
              credits: '0.8 Credits / 1k Tokens',
              isAvailable: true
            },
            {
              id: 'audiolm-3',
              title: 'Title-4.1',
              description: 'Lorem ipsum dolor sit amet consectetur. Ut porttitor nibh etiam ut vitae aliquet magna cursus.',
              credits: '0.8 Credits / 1k Tokens',
              isAvailable: false
            }
          ]
        }
      ]
    },
    {
      id: 'research-data',
      name: 'RESEARCH & DATA',
      items: []
    }
  ]);

  const handleToggle = (itemId: string, enabled: boolean) => {
    setCategories(prevCategories =>
      prevCategories.map(category => ({
        ...category,
        items: category.items.map(item =>
          item.id === itemId ? { ...item, isAvailable: enabled } : item
        ),
        subcategories: category.subcategories?.map(subcategory => ({
          ...subcategory,
          items: subcategory.items.map(item =>
            item.id === itemId ? { ...item, isAvailable: enabled } : item
          )
        }))
      }))
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} flex font-poppins transition-colors duration-300`}>
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
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-12' : 'ml-32'} p-6 sm:p-8 overflow-x-hidden flex justify-center`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Connections</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base sm:text-lg mt-2`}>A curated list of connected AI models ready for use in your applications.</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search connections..."
                  className={`w-full p-3 pl-10 rounded-xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200`}
                />
                <HiMagnifyingGlass size={22} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button className="flex items-center justify-center px-4 py-3 bg-teal-500 text-white rounded-xl shadow-md hover:bg-teal-600 transition-colors duration-200 shrink-0">
                <HiOutlinePlus size={22} className="mr-2" /> Add a custom connection
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {categories.map((category) => (
              <CategorySection key={category.id} category={category} onToggle={handleToggle} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}