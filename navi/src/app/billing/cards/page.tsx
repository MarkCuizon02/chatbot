"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { useTheme } from "../../../context/ThemeContext";

// Define the Card type for better TypeScript support
interface Card {
  id: string; // Added unique id
  brand: string;
  logo: string;
  number: string;
  expiry: string;
  isDefault: boolean;
  cardholderName?: string; // Added for editing functionality
  cvv?: string; // Optional for editing
  zipCode?: string; // Optional for editing
  country?: string; // Optional for editing
}

// Sample card data
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
  },
  {
    id: "card-2",
    brand: "Mastercard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
    number: "****1234",
    expiry: "05/32",
    isDefault: false,
    cardholderName: "Troy Teeples",
    zipCode: "84003",
    country: "United States",
  },
];

export default function CardDetailsPage() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = React.useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Cards state management
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    zipCode: "",
    country: "United States",
    isDefault: false,
  });

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
    });
    setShowEditModal(true);
  };

  // Save edited card
  const saveEditedCard = () => {
    if (!currentCard) return;

    const updatedCards = cards.map((card) => {
      if (card.id === currentCard.id) {
        return {
          ...card,
          expiry: formData.expiry,
          cardholderName: formData.cardholderName,
          zipCode: formData.zipCode,
          country: formData.country,
          isDefault: formData.isDefault,
        };
      }

      // If this card is not the default and the current card is marked as default
      if (formData.isDefault && card.id !== currentCard.id) {
        return { ...card, isDefault: false };
      }

      return card;
    });

    setCards(updatedCards);
    setShowEditModal(false);
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
      brand: detectCardBrand(formData.cardNumber),
      logo: getCardLogo(detectCardBrand(formData.cardNumber)),
      number: maskCardNumber(formData.cardNumber),
      expiry: formData.expiry,
      cardholderName: formData.cardholderName,
      zipCode: formData.zipCode,
      country: formData.country,
      isDefault: formData.isDefault,
    };

    // Update other cards if this one is default
    let updatedCards = [...cards];
    if (formData.isDefault) {
      updatedCards = updatedCards.map((card) => ({ ...card, isDefault: false }));
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
    });
    setShowAddModal(false);
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
      default:
        return "";
    }
  };

  const maskCardNumber = (cardNumber: string): string => {
    // Keep only last 4 digits and mask the rest
    return `****${cardNumber.slice(-4)}`;
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } flex font-poppins transition-colors duration-300`}
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
      <div className="flex-1 flex flex-col items-center p-10">
        <div className="w-full max-w-5xl">
          <div className="flex items-start justify-between mb-8 w-full">
            <div>
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700 text-base font-medium mb-1"
              >
                &lt; Back
              </button>
              <h1 className="text-2xl font-bold mb-1">
                Billing & Subscription
              </h1>
              <div className="text-sm text-gray-500">
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => router.push("/billing")}
                >
                  Billing & Subscription
                </span>
                <span className="mx-1">&gt;</span>
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => router.push("/billing/cards")}
                >
                  Card Details
                </span>
              </div>
            </div>
            <button
              className="bg-sky-500 text-white px-5 py-2 rounded font-medium hover:bg-sky-600 h-12 self-start"
              onClick={() => setShowAddModal(true)}
            >
              + Add Payment Method
            </button>
          </div>
          <div className="flex gap-8 flex-wrap">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col min-w-[320px] max-w-[340px] flex-1 relative items-start"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={card.logo}
                    alt={card.brand}
                    className="w-12 h-8 object-contain"
                  />
                  <div className="font-semibold text-lg">
                    {card.brand} {card.number}
                  </div>
                  {card.isDefault && (
                    <span
                      className="ml-2 text-sky-500"
                      title="Default"
                    >
                      &#10003;
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-sm mb-4">
                  Expires {card.expiry}
                </div>                <div className="flex gap-6 mt-auto">
                  <button
                    className={`${isDarkMode ? 'text-sky-400' : 'text-sky-600'} hover:underline font-medium transition-colors focus:outline-none`}
                    onClick={() => handleRemoveCard(card)}
                  >
                    Remove
                  </button>
                  <button
                    className={`${isDarkMode ? 'text-sky-400' : 'text-sky-600'} hover:underline font-medium transition-colors focus:outline-none`}
                    onClick={() => handleEditCard(card)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Add Payment Method Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fadeIn">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-6">
                  Add Payment Method
                </h2>
                <form className="space-y-4" onSubmit={handleAddCard}>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      defaultValue="Troy Teeples"
                      name="cardholderName"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="relative">
                    <input
                      className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400 pr-28"
                      placeholder="**** **** **** 1234"
                      name="cardNumber"
                      onChange={handleInputChange}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                        alt="Visa"
                        className="w-7 h-5 object-contain"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                        alt="Mastercard"
                        className="w-7 h-5 object-contain"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/04/American_Express_logo_%282018%29.svg"
                        alt="Amex"
                        className="w-7 h-5 object-contain"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Discover_Card_logo.svg"
                        alt="Discover"
                        className="w-7 h-5 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">
                        Expiration Date
                      </label>
                      <input
                        className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        placeholder="01/29"
                        name="expiry"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">CVV</label>
                      <input
                        className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        placeholder="CVV"
                        name="cvv"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">
                        Zip Code
                      </label>
                      <input
                        className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        placeholder="0000"
                        name="zipCode"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">
                        Country
                      </label>
                      <select
                        className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        name="country"
                        onChange={handleInputChange}
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-gray-700 text-sm">Set as default</label>
                    <input
                      type="checkbox"
                      className="toggle toggle-info"
                      style={{
                        accentColor: "#38bdf8",
                        width: "40px",
                        height: "20px",
                      }}
                      checked={formData.isDefault}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-sky-500 text-white font-medium hover:bg-sky-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Edit Card Modal */}
          {showEditModal && currentCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fadeIn">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-6">
                  Edit Payment Method
                </h2>
                <form className="space-y-4" onSubmit={saveEditedCard}>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      value={formData.cardholderName}
                      name="cardholderName"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="relative">
                    <input
                      className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400 pr-28"
                      placeholder="**** **** **** 1234"
                      value={formData.cardNumber}
                      name="cardNumber"
                      onChange={handleInputChange}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                        alt="Visa"
                        className="w-7 h-5 object-contain"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                        alt="Mastercard"
                        className="w-7 h-5 object-contain"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/04/American_Express_logo_%282018%29.svg"
                        alt="Amex"
                        className="w-7 h-5 object-contain"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Discover_Card_logo.svg"
                        alt="Discover"
                        className="w-7 h-5 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">
                        Expiration Date
                      </label>
                      <input
                        className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        placeholder="01/29"
                        value={formData.expiry}
                        name="expiry"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">CVV</label>
                      <input
                        className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        placeholder="CVV"
                        value={formData.cvv}
                        name="cvv"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">
                        Zip Code
                      </label>
                      <input
                        className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        placeholder="0000"
                        value={formData.zipCode}
                        name="zipCode"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">
                        Country
                      </label>
                      <select
                        className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-gray-700 text-sm">Set as default</label>
                    <input
                      type="checkbox"
                      className="toggle toggle-info"
                      style={{
                        accentColor: "#38bdf8",
                        width: "40px",
                        height: "20px",
                      }}
                      checked={formData.isDefault}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-sky-500 text-white font-medium hover:bg-sky-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Remove Card Confirmation Modal */}
          {showRemoveModal && currentCard && (            <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-gray-900 bg-opacity-80' : 'backdrop-blur-sm bg-black bg-opacity-30'}`}>
              <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fadeIn`}>
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className={`absolute top-4 right-4 text-2xl ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Remove Payment Method</h2>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  Are you sure you want to remove this {currentCard.brand} card ending in {currentCard.number.slice(-4)}?
                </p>                <div className="flex justify-end gap-3">
                  <button 
                    className={`px-4 py-2 rounded ${
                      isDarkMode
                        ? 'border border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                        : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-100'
                    }`}
                    onClick={() => setShowRemoveModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 rounded bg-red-500 text-white font-medium hover:bg-red-600"
                    onClick={confirmRemoveCard}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}