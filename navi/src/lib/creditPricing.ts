export interface CreditPack {
  credits: number;
  pricePerCredit: number;
  totalPrice: number;
  popular?: boolean;
  description?: string;
}

export function getCreditPackPrice(credits: number): number {
  const pricingTiers: { [key: number]: number } = {
    100: 0.200,
    500: 0.100,
    1000: 0.075,
    2000: 0.075,
    5000: 0.065,
    10000: 0.050,
    20000: 0.050,
  };

  const pricePerCredit = pricingTiers[credits] || 0.200; // Default to highest price if not matched
  return credits * pricePerCredit;
}

export function getPricePerCredit(credits: number): number {
  const pricingTiers: { [key: number]: number } = {
    100: 0.200,
    500: 0.100,
    1000: 0.075,
    2000: 0.075,
    5000: 0.065,
    10000: 0.050,
    20000: 0.050,
  };

  return pricingTiers[credits] || 0.200;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    credits: 500,
    pricePerCredit: 0.100,
    totalPrice: 50.00,
    description: "Great value for regular users",
  },
  {
    credits: 1000,
    pricePerCredit: 0.075,
    totalPrice: 75.00,
    popular: true,
    description: "Most popular choice",
  },
  {
    credits: 5000,
    pricePerCredit: 0.065,
    totalPrice: 325.00,
    description: "Enterprise-level value",
  },
  {
    credits: 10000,
    pricePerCredit: 0.050,
    totalPrice: 500.00,
    description: "Maximum savings",
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatPricePerCredit(pricePerCredit: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 3,
  }).format(pricePerCredit);
} 