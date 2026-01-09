import type { Metadata } from "next";
import "@/styles/globals.css";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Therefor Bitcoin - Clear Answers About Bitcoin",
    template: "%s | Therefor Bitcoin",
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
  authors: [{ name: "Therefor Bitcoin Contributors" }],
  creator: "Therefor Bitcoin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Therefor Bitcoin - Clear Answers About Bitcoin",
    description:
      "A comprehensive, balanced knowledge base about Bitcoin. Clear answers, fair objections, and primary sources.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Therefor Bitcoin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Therefor Bitcoin",
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
  return children;
}
