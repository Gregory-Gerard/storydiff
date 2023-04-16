import React from 'react';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata = {
  title: {
    default: 'Storydiff',
    template: '%s | Storydiff',
  },
  description: 'Comparer facilement ses maquettes Figma et Storybook',
  robots: {
    index: false,
    follow: false,
  },
  colorScheme: 'dark',
  generator: 'Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-full bg-neutral-950 text-sm text-neutral-50">
        <main>{children}</main>
      </body>
    </html>
  );
}
