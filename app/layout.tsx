import './globals.css';
import { Metadata, Viewport } from 'next';
import ThemeProvider from '@/components/theme-provider';
import { LanguageProvider } from '@/components/language-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  metadataBase: new URL('https://filarche.com'),
  title: {
    default: 'Nare Travel and Tours - Your Travel Partner',
    template: '%s | Nare Travel and Tours',
  },
  description: 'Professional travel services, DMC, MICE, and tour packages',
  keywords: ['travel', 'tourism', 'Armenia', 'DMC', 'MICE', 'tours', 'packages'],
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        {/* Preload critical images for faster loading */}
        <link
          rel="preload"
          href="/logo/Nare_logo_menu_web.webp"
          as="image"
          type="image/webp"
        />
        <link
          rel="dns-prefetch"
          href="https://fonts.googleapis.com"
        />
        <meta name="google" content="notranslate" />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}