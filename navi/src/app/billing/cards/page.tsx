"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';
import Sidebar from '@/app/components/Sidebar';
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCreditCard, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCheck, HiOutlineShare, HiOutlineLockClosed, HiArrowLeft } from "react-icons/hi2";
import { CreditCard, Shield, Lock, ArrowLeft, CheckCircle, AlertCircle, Info } from "lucide-react";


interface Card {
  id: string; 
  brand: string;
  logo: string;
  number: string;
  expiry: string;
  isDefault: boolean;
  cardholderName?: string; 
  cvv?: string;
  zipCode?: string;
  country?: string;
  paymentMethod: 'card' | 'paypal' | 'bank';
  status: 'active' | 'expired' | 'suspended';
  lastUsed?: string;
  securityFeatures?: string[];
}

// Sample card data with enhanced information
const initialCards: Card[] = [
  {
    id: "card-1",
    brand: "Visa",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
    number: "****1234",
    expiry: "01/29",
    isDefault: true,
    cardholderName: "Troy Teeples",
    zipCode: "84003",
    country: "United States",
    paymentMethod: 'card',
    status: 'active',
    lastUsed: "2025-03-15",
    securityFeatures: ["3D Secure", "Fraud Protection"]
  },
  {
    id: "card-2",
    brand: "Mastercard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
    number: "****5678",
    expiry: "05/32",
    isDefault: false,
    cardholderName: "Troy Teeples",
    zipCode: "84003",
    country: "United States",
    paymentMethod: 'card',
    status: 'active',
    lastUsed: "2025-03-10",
    securityFeatures: ["SecureCode", "Zero Liability"]
  },
  {
    id: "paypal-1",
    brand: "PayPal",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg",
    number: "troy.teeples@email.com",
    expiry: "N/A",
    isDefault: false,
    cardholderName: "Troy Teeples",
    paymentMethod: 'paypal',
    status: 'active',
    lastUsed: "2025-03-12",
    securityFeatures: ["Buyer Protection", "Encryption"]
  }
];

export default function CardDetailsPage() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { subscription, updatePaymentMethod } = useSubscription();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = React.useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Cards state management
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    zipCode: "",
    country: "United States",
    isDefault: false,
    email: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isDefault: e.target.checked });
  };

  // Edit card handler
  const handleEditCard = (card: Card) => {
    setCurrentCard(card);
    setFormData({
      cardholderName: card.cardholderName || "",
      cardNumber: card.number,
      expiry: card.expiry,
      cvv: card.cvv || "",
      zipCode: card.zipCode || "",
      country: card.country || "United States",
      isDefault: card.isDefault,
      email: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
    });
    setShowEditModal(true);
  };

  // Save edited card
  const saveEditedCard = () => {
    if (!currentCard) return;

    const updatedCards = cards.map((card) => {
      if (card.id === currentCard.id) {
        const updatedCard = {
          ...card,
          expiry: formData.expiry,
          cardholderName: formData.cardholderName,
          zipCode: formData.zipCode,
          country: formData.country,
          isDefault: formData.isDefault,
        };

        // If this card is being set as default, update subscription context
        if (formData.isDefault) {
          savePaymentMethod(updatedCard);
        }

        return updatedCard;
      }

      // If this card is not the default and the current card is marked as default
      if (formData.isDefault && card.id !== currentCard.id) {
        return { ...card, isDefault: false };
      }

      return card;
    });

    setCards(updatedCards);
    setShowEditModal(false);
    showNotification(`Payment method updated successfully`);
  };

  // Remove card handler
  const handleRemoveCard = (card: Card) => {
    setCurrentCard(card);
    setShowRemoveModal(true);
  };

  // Confirm removal of card
  const confirmRemoveCard = () => {
    if (!currentCard) return;

    // Filter out the card to remove
    const updatedCards = cards.filter((card) => card.id !== currentCard.id);

    // If the removed card was default, make the first remaining card default
    if (currentCard.isDefault && updatedCards.length > 0) {
      updatedCards[0].isDefault = true;
      // Update subscription context with new default payment method
      savePaymentMethod(updatedCards[0]);
    } else if (currentCard.isDefault && updatedCards.length === 0) {
      // If no cards remain, clear the subscription payment method
      updatePaymentMethod({
        type: "No Payment Method",
        last4: "",
        expiry: ""
      });
    }

    setCards(updatedCards);
    setShowRemoveModal(false);
  };

  // Add new card
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new card object
    const newCard: Card = {
      id: `card-${Date.now()}`,
      brand: selectedPaymentMethod === 'card' ? detectCardBrand(formData.cardNumber) : 
             selectedPaymentMethod === 'paypal' ? 'PayPal' : 'Bank Account',
      logo: selectedPaymentMethod === 'card' ? getCardLogo(detectCardBrand(formData.cardNumber)) :
            selectedPaymentMethod === 'paypal' ? "https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg" : "",
      number: selectedPaymentMethod === 'card' ? maskCardNumber(formData.cardNumber) :
              selectedPaymentMethod === 'paypal' ? formData.email : `****${formData.accountNumber.slice(-4)}`,
      expiry: selectedPaymentMethod === 'card' ? formData.expiry : 'N/A',
      cardholderName: formData.cardholderName,
      zipCode: formData.zipCode,
      country: formData.country,
      isDefault: formData.isDefault,
      paymentMethod: selectedPaymentMethod,
      status: 'active',
      lastUsed: new Date().toISOString().split('T')[0],
      securityFeatures: selectedPaymentMethod === 'card' ? ['3D Secure', 'Fraud Protection'] :
                       selectedPaymentMethod === 'paypal' ? ['Buyer Protection', 'Encryption'] :
                       ['Bank-Level Security', 'Encryption']
    };

    // Update other cards if this one is default
    let updatedCards = [...cards];
    if (formData.isDefault) {
      updatedCards = updatedCards.map((card) => ({ ...card, isDefault: false }));
      // Update subscription context with new default payment method
      savePaymentMethod(newCard);
    }

    // Add the new card
    setCards([...updatedCards, newCard]);

    // Reset and close
    setFormData({
      cardholderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      zipCode: "",
      country: "United States",
      isDefault: false,
      email: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
    });
    setShowAddModal(false);
    showNotification(`${newCard.brand} payment method added successfully`);
  };

  // Helper functions
  const detectCardBrand = (cardNumber: string): string => {
    // Simple detection based on first digit
    if (cardNumber.startsWith("4")) return "Visa";
    if (cardNumber.startsWith("5")) return "Mastercard";
    if (cardNumber.startsWith("3")) return "American Express";
    if (cardNumber.startsWith("6")) return "Discover";
    return "Card";
  };

  const getCardLogo = (brand: string): string => {
    switch (brand) {
      case "Visa":
        return "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png";
      case "Mastercard":
        return "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png";
      case "American Express":
        return "https://upload.wikimedia.org/wikipedia/commons/0/04/American_Express_logo_%282018%29.svg";
      case "Discover":
        return "https://upload.wikimedia.org/wikipedia/commons/0/0b/Discover_Card_logo.svg";
      case "PayPal":
        return "https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg";
      default:
        return "";
    }
  };

  const maskCardNumber = (cardNumber: string): string => {
    // Keep only last 4 digits and mask the rest
    return `****${cardNumber.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'expired':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'paypal':
        return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">P</span>
        </div>;
      case 'bank':
        return <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">B</span>
        </div>;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const formatLastUsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Enhanced save function that updates subscription context
  const savePaymentMethod = (card: Card) => {
    // Update subscription context with new payment method
    updatePaymentMethod({
      type: card.brand,
      last4: card.number.slice(-4),
      expiry: card.expiry
    });
  };

  // Set payment method as default
  const setAsDefault = (card: Card) => {
    const updatedCards = cards.map((c) => ({
      ...c,
      isDefault: c.id === card.id
    }));
    
    setCards(updatedCards);
    savePaymentMethod(card);
    showNotification(`${card.brand} set as default payment method`);
  };

  // Get payment method status indicator
  const getStatusIndicator = (card: Card) => {
    if (card.isDefault) {
      return (
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs font-medium text-green-600 dark:text-green-400">Default</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span className="text-xs text-gray-500">Secondary</span>
      </div>
    );
  };

  // Show success notification
  const showNotification = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900"
      } flex font-poppins transition-all duration-500`}
    >
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
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-24' : 'ml-72'} p-8 md:p-12 overflow-x-hidden`}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enhanced Header Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300' 
                        : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-sm'
                    }`}
                  >
                    <HiArrowLeft className="w-4 h-4" />
                    Back to Billing
                  </motion.button>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Payment Methods
                  </h1>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage your payment methods and billing information
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  onClick={() => setShowPaymentMethodModal(true)}
                >
                  <HiOutlinePlus className="w-5 h-5" />
                  Add Payment Method
                </motion.button>
              </div>
            </motion.div>

            {/* Payment Methods Summary */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className={`p-6 rounded-2xl border shadow-lg ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Payment Methods Summary</h2>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900 dark:to-purple-900 dark:text-blue-300">
                      {cards.length} {cards.length === 1 ? 'Method' : 'Methods'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Default Method</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {cards.find(c => c.isDefault)?.brand || 'None Set'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {cards.find(c => c.isDefault)?.number || 'No default payment method'}
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Card Methods</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {cards.filter(c => c.paymentMethod === 'card').length}
                    </div>
                    <div className="text-sm text-gray-500">Credit/Debit cards</div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Other Methods</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {cards.filter(c => c.paymentMethod !== 'card').length}
                    </div>
                    <div className="text-sm text-gray-500">PayPal & Bank accounts</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Cards Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className={`relative overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
                      : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10 p-6">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          {getPaymentMethodIcon(card.paymentMethod)}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{card.brand}</div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {card.paymentMethod === 'paypal' ? card.number : card.number}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIndicator(card)}
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                          {card.status}
                        </div>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Cardholder:</span>
                        <span className="font-medium">{card.cardholderName}</span>
                      </div>
                      {card.paymentMethod === 'card' && (
                        <div className="flex justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Expires:</span>
                          <span className="font-medium">{card.expiry}</span>
                        </div>
                      )}
                      {card.lastUsed && (
                        <div className="flex justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Last used:</span>
                          <span className="font-medium">{formatLastUsed(card.lastUsed)}</span>
                        </div>
                      )}
                    </div>

                    {/* Security Features */}
                    {card.securityFeatures && card.securityFeatures.length > 0 && (
                      <div className="mb-6">
                        <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Security Features
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {card.securityFeatures.map((feature, index) => (
                            <div
                              key={index}
                              className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                            >
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Shield className="w-3 h-3" />
                        Secure
                      </div>
                      <div className="flex items-center gap-2">
                        {!card.isDefault && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                              isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setAsDefault(card)}
                          >
                            Set Default
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                          }`}
                          onClick={() => handleEditCard(card)}
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-600 hover:text-red-600'
                          }`}
                          onClick={() => handleRemoveCard(card)}
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Payment Method Selection Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-md p-8 relative`}
          >
            <button
              onClick={() => setShowPaymentMethodModal(false)}
              className={`absolute top-4 right-4 text-2xl ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">Add Payment Method</h2>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedPaymentMethod('card');
                  setShowPaymentMethodModal(false);
                  setShowAddModal(true);
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-blue-500 bg-gray-700 hover:bg-gray-600' 
                    : 'border-gray-200 hover:border-blue-500 bg-gray-50 hover:bg-blue-50'
                }`}
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Credit or Debit Card</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Visa, Mastercard, American Express
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedPaymentMethod('paypal');
                  setShowPaymentMethodModal(false);
                  setShowAddModal(true);
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-blue-500 bg-gray-700 hover:bg-gray-600' 
                    : 'border-gray-200 hover:border-blue-500 bg-gray-50 hover:bg-blue-50'
                }`}
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-500 text-xs font-bold">P</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-semibold">PayPal</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Pay with your PayPal account
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedPaymentMethod('bank');
                  setShowPaymentMethodModal(false);
                  setShowAddModal(true);
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-blue-500 bg-gray-700 hover:bg-gray-600' 
                    : 'border-gray-200 hover:border-blue-500 bg-gray-50 hover:bg-blue-50'
                }`}
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-xs font-bold">B</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Bank Account</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Direct debit from your bank
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enhanced Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-md p-8 relative`}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className={`absolute top-4 right-4 text-2xl ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500`}>
                {getPaymentMethodIcon(selectedPaymentMethod)}
              </div>
              <h2 className="text-2xl font-bold">
                Add {selectedPaymentMethod === 'card' ? 'Card' : selectedPaymentMethod === 'paypal' ? 'PayPal' : 'Bank Account'}
              </h2>
            </div>
            
            <form className="space-y-4" onSubmit={handleAddCard}>
              {selectedPaymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Cardholder Name</label>
                    <input
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                      defaultValue="Troy Teeples"
                      name="cardholderName"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="relative">
                    <input
                      className={`w-full border rounded-xl px-4 py-3 pr-28 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                      placeholder="**** **** **** 1234"
                      name="cardNumber"
                      onChange={handleInputChange}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="w-7 h-5 object-contain" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="w-7 h-5 object-contain" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">Expiration Date</label>
                      <input
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                        placeholder="01/29"
                        name="expiry"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">CVV</label>
                      <input
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                        placeholder="123"
                        name="cvv"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedPaymentMethod === 'paypal' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">PayPal Email</label>
                  <input
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                    placeholder="your.email@example.com"
                    name="email"
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {selectedPaymentMethod === 'bank' && (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Bank Name</label>
                    <input
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                      placeholder="Bank Name"
                      name="bankName"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Account Number</label>
                    <input
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                      placeholder="Account Number"
                      name="accountNumber"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Routing Number</label>
                    <input
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                      placeholder="Routing Number"
                      name="routingNumber"
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -100, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50"
          >
            <div className={`px-6 py-4 rounded-xl shadow-lg border flex items-center gap-3 ${
              isDarkMode 
                ? 'bg-green-900 border-green-700 text-green-100' 
                : 'bg-green-50 border-green-200 text-green-800'
            }`}>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">{successMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}