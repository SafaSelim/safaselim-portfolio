import type { Metadata, Viewport } from 'next';
import { Fraunces, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { Cursor } from '@/components/Cursor';
import { Grain } from '@/components/Grain';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://safaselim.dev'),
  title: 'Safa Selim — Senior Angular Frontend Engineer',
  description:
    'Senior Angular Frontend Engineer with 6+ years building enterprise-scale web applications, monorepo architectures, NGRX state systems, and large-scale frontend migrations across European markets.',
  keywords: [
    'Safa Selim',
    'Angular',
    'Senior Frontend Engineer',
    'TypeScript',
    'NGRX',
    'Monorepo',
    'Enterprise',
    'Storybook',
    'Frontend Architecture',
  ],
  authors: [{ name: 'Safa Selim' }],
  openGraph: {
    title: 'Safa Selim — Senior Angular Frontend Engineer',
    description:
      'Senior Angular Frontend Engineer with 6+ years building enterprise-scale web applications and monorepo architectures.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Safa Selim',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safa Selim — Senior Angular Frontend Engineer',
    description:
      'Senior Angular Frontend Engineer with 6+ years building enterprise-scale web applications.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0c0a08' },
    { media: '(prefers-color-scheme: light)', color: '#f5efe6' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Grain />
          <Cursor />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
