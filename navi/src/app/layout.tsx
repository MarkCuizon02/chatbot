
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '../context/ThemeContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import { UserProvider } from '../context/UserContext';
import { SidebarProvider } from '../context/SidebarContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Navi Dashboard",
  description: "AI Agents Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-poppins antialiased`}
      >
        <ThemeProvider>
          <UserProvider>
            <SubscriptionProvider>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </SubscriptionProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
