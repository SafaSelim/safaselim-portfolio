import type { Metadata, Viewport } from 'next';
import { Fraunces, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PaletteProvider } from '@/components/PaletteProvider';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
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
  title: 'Safa Selim — Senior Software Engineer',
  description:
    'Senior Software Engineer with 6+ years building enterprise-scale web and mobile applications — Angular, React, Next.js, React Native and Node/Elysia backends, with deep experience in monorepo architecture and large-scale migrations across European markets.',
  keywords: [
    'Safa Selim',
    'Senior Software Engineer',
    'Frontend Engineer',
    'Angular',
    'React',
    'Next.js',
    'React Native',
    'TypeScript',
    'Monorepo',
    'Enterprise',
  ],
  authors: [{ name: 'Safa Selim' }],
  openGraph: {
    title: 'Safa Selim — Senior Software Engineer',
    description:
      'Senior Software Engineer with 6+ years building enterprise-scale web and mobile applications across European markets.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Safa Selim',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safa Selim — Senior Software Engineer',
    description:
      'Senior Software Engineer with 6+ years building enterprise-scale web and mobile applications.',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=localStorage.getItem('portfolio-palette');if(p)document.documentElement.dataset.palette=p;}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <PaletteProvider>
            <Grain />
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </PaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
