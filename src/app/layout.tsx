import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Safa Selim – Senior Angular Frontend Engineer',
  description:
    'Senior Angular Frontend Engineer with 6+ years of experience building enterprise-scale systems, monorepo architectures, and scalable component libraries.',
  keywords: ['Angular', 'Frontend Engineer', 'TypeScript', 'NGRX', 'Enterprise', 'Monorepo'],
  openGraph: {
    title: 'Safa Selim – Senior Angular Frontend Engineer',
    description:
      'Senior Angular Frontend Engineer with 6+ years of experience building enterprise-scale systems.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
