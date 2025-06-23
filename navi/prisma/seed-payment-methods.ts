import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding payment methods...');

  // Create sample payment methods for user ID 1
  const samplePaymentMethods = [
    {
      userId: 1,
      brand: "Visa",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
      number: "****1234",
      expiry: "01/29",
      cardholderName: "Troy Teeples",
      cvv: "123",
      zipCode: "84003",
      country: "United States",
      isDefault: true,
      paymentMethod: "card",
      status: "active",
      securityFeatures: ["3D Secure", "Fraud Protection"],
      lastUsed: new Date("2025-03-15")
    },
    {
      userId: 1,
      brand: "Mastercard",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
      number: "****5678",
      expiry: "05/32",
      cardholderName: "Troy Teeples",
      cvv: "456",
      zipCode: "84003",
      country: "United States",
      isDefault: false,
      paymentMethod: "card",
      status: "active",
      securityFeatures: ["SecureCode", "Zero Liability"],
      lastUsed: new Date("2025-03-10")
    },
    {
      userId: 1,
      brand: "PayPal",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg",
      number: "troy.teeples@email.com",
      cardholderName: "Troy Teeples",
      isDefault: false,
      paymentMethod: "paypal",
      status: "active",
      securityFeatures: ["Buyer Protection", "Encryption"],
      email: "troy.teeples@email.com",
      lastUsed: new Date("2025-03-12")
    }
  ];

  for (const paymentMethod of samplePaymentMethods) {
    await prisma.paymentMethod.create({
      data: paymentMethod
    });
  }

  console.log('Payment methods seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 