import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers, ThemeProvider } from '@/components';
import { Toaster } from '@/components/ui';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MMSS - Medical Management System',
  description: 'Medical Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
        <Toaster
          toastOptions={{
            style: { background: '#18222d', color: '#fff', borderColor: '#18222d' },
          }}
        />
      </body>
    </html>
  );
}
