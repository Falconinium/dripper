import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Dripper — les meilleurs coffee shops de France',
    template: '%s · Dripper',
  },
  description:
    'Découvre les meilleurs coffee shops de France. Notes communautaires, sélection éditoriale, carte interactive.',
  openGraph: {
    type: 'website',
    siteName: 'Dripper',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dripper — les meilleurs coffee shops de France',
    description:
      'Découvre les meilleurs coffee shops de France. Notes communautaires, sélection éditoriale, carte interactive.',
  },
  applicationName: 'Dripper',
  appleWebApp: {
    capable: true,
    title: 'Dripper',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
