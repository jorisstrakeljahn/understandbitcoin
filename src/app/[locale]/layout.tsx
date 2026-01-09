import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Inter, Libre_Baskerville, JetBrains_Mono } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { Locale } from '@/i18n/config';
import { Header, Footer } from '@/components/layout';
import { PostHogProvider } from '@/components/analytics';

// Optimized font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  preload: true,
});

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-serif',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  preload: false, // Monospace is not critical
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html 
      lang={locale} 
      suppressHydrationWarning
      className={`${inter.variable} ${libreBaskerville.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://eu.i.posthog.com" />
        
        {/* Theme initialization script to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || theme === 'light') {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Suspense fallback={null}>
            <PostHogProvider>
              <a href="#main-content" className="skip-link">
                {locale === 'de' ? 'Zum Hauptinhalt springen' : 'Skip to main content'}
              </a>
              <Header />
              <main id="main-content">{children}</main>
              <Footer />
            </PostHogProvider>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
