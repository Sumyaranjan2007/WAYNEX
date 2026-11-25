import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'WAYNEX — Your World. Your Way. | AI Travel Intelligence for India',
  description:
    'AI-powered travel discovery, 3D interactive maps, personalized budget planner, verified transport, community travel rooms, and 24/7 emergency safety across all 28 states and 8 union territories of India.',
  keywords: [
    'India Travel',
    'AI Trip Planner',
    'Karnataka Tourism',
    'Hampi',
    'Coorg',
    'Solo Travel India',
    '3D India Map',
    'Travel Safety',
    'Budget Travel India',
  ],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-navy-950 text-navy-50 flex flex-col antialiased selection:bg-cyan-500 selection:text-navy-950 font-sans">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
