const { getCreditPackPrice, getPricePerCredit, CREDIT_PACKS, formatPrice, formatPricePerCredit } = require('./src/lib/creditPricing.ts');

console.log('Testing Credit Pricing System\n');

// Test individual pricing functions
console.log('Testing getCreditPackPrice:');
console.log('100 credits:', formatPrice(getCreditPackPrice(100))); // Should be $20.00
console.log('500 credits:', formatPrice(getCreditPackPrice(500))); // Should be $50.00
console.log('1000 credits:', formatPrice(getCreditPackPrice(1000))); // Should be $75.00
console.log('2000 credits:', formatPrice(getCreditPackPrice(2000))); // Should be $150.00
console.log('5000 credits:', formatPrice(getCreditPackPrice(5000))); // Should be $325.00
console.log('10000 credits:', formatPrice(getCreditPackPrice(10000))); // Should be $500.00
console.log('20000 credits:', formatPrice(getCreditPackPrice(20000))); // Should be $1000.00

console.log('\nTesting getPricePerCredit:');
console.log('100 credits per credit:', formatPricePerCredit(getPricePerCredit(100))); // Should be $0.200
console.log('500 credits per credit:', formatPricePerCredit(getPricePerCredit(500))); // Should be $0.100
console.log('1000 credits per credit:', formatPricePerCredit(getPricePerCredit(1000))); // Should be $0.075

console.log('\nTesting CREDIT_PACKS:');
CREDIT_PACKS.forEach(pack => {
  console.log(`${pack.credits.toLocaleString()} credits: ${formatPrice(pack.totalPrice)} (${formatPricePerCredit(pack.pricePerCredit)} per credit)${pack.popular ? ' - POPULAR' : ''}`);
});

console.log('\nTesting with discount (20% off):');
CREDIT_PACKS.forEach(pack => {
  const discountedPrice = pack.totalPrice * 0.8;
  console.log(`${pack.credits.toLocaleString()} credits: ${formatPrice(discountedPrice)} (discounted from ${formatPrice(pack.totalPrice)})`);
}); 