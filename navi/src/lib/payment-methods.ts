import { prisma } from './db';

export interface PaymentMethodData {
  id?: number;
  userId: number;
  brand: string;
  logo?: string;
  number: string;
  expiry?: string;
  cardholderName?: string;
  cvv?: string;
  zipCode?: string;
  country?: string;
  isDefault: boolean;
  paymentMethod: 'card' | 'paypal' | 'bank';
  status?: string;
  lastUsed?: Date;
  securityFeatures?: string[];
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  email?: string;
}

export const paymentMethodService = {
  // Get all payment methods for a user
  async getUserPaymentMethods(userId: number) {
    try {
      const response = await fetch(`/api/payment-methods?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  // Get a specific payment method
  async getPaymentMethod(id: number) {
    try {
      const response = await fetch(`/api/payment-methods/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment method');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment method:', error);
      throw error;
    }
  },

  // Create a new payment method
  async createPaymentMethod(data: PaymentMethodData) {
    try {
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment method');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  },

  // Update a payment method
  async updatePaymentMethod(id: number, data: Partial<PaymentMethodData>) {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update payment method');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  },

  // Delete a payment method
  async deletePaymentMethod(id: number) {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete payment method');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },

  // Set a payment method as default
  async setAsDefault(id: number) {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDefault: true }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to set payment method as default');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error setting payment method as default:', error);
      throw error;
    }
  }
};

// Helper functions for payment method operations
export const paymentMethodHelpers = {
  // Detect card brand from card number
  detectCardBrand(cardNumber: string): string {
    if (cardNumber.startsWith("4")) return "Visa";
    if (cardNumber.startsWith("5")) return "Mastercard";
    if (cardNumber.startsWith("3")) return "American Express";
    if (cardNumber.startsWith("6")) return "Discover";
    return "Card";
  },

  // Get card logo URL
  getCardLogo(brand: string): string {
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
  },

  // Mask card number
  maskCardNumber(cardNumber: string): string {
    return `****${cardNumber.slice(-4)}`;
  },

  // Get status color classes
  getStatusColor(status: string) {
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
  },

  // Format last used date
  formatLastUsed(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }
}; 