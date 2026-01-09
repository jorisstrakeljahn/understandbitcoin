import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { routing } from '@/i18n/routing';
import { Locale } from '@/i18n/config';
import { Header, Footer } from '@/components/layout';
import { PostHogProvider } from '@/components/analytics';

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
    <html lang={locale} suppressHydrationWarning>
      <head>
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
