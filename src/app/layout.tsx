import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Understand Bitcoin - Clear Answers About Bitcoin",
    template: "%s | Understand Bitcoin",
  },
  description:
    "A comprehensive, balanced knowledge base about Bitcoin. Clear answers, fair objections, and primary sources.",
  keywords: [
    "Bitcoin",
    "cryptocurrency",
    "blockchain",
    "sound money",
    "Austrian economics",
    "digital currency",
  ],
  authors: [{ name: "Understand Bitcoin Contributors" }],
  creator: "Understand Bitcoin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://understandbitcoin.com",
    siteName: "Understand Bitcoin",
    title: "Understand Bitcoin - Clear Answers About Bitcoin",
    description:
      "A comprehensive, balanced knowledge base about Bitcoin. Clear answers, fair objections, and primary sources.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Understand Bitcoin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Understand Bitcoin",
    description: "Clear answers. Fair objections. Primary sources.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        {/* Analytics stub - add PostHog here later */}
      </body>
    </html>
  );
}
