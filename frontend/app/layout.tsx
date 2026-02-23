import type { Metadata } from "next";
import { Geist, Geist_Mono, Kumbh_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/custom/navbar/NavBar";
import { QueryProvider } from "@/lib/React-query-setup";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "core-js/stable";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

import "regenerator-runtime/runtime";
import { Suspense } from "react";
import ClientSideScrollRestorer from "@/components/ui/custom/common/ClientSideScrollRestorer";
import { PageViewTracker } from "@/components/ui/custom/common/PageViewTracker";
import Footer from "@/components/ui/custom/common/Footer";
import WhatsAppSupport from "@/components/ui/custom/common/WhatsAppSupport";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-kumbh-sans",
});

export const metadata: Metadata = {
  // Basic Info
  title: {
    default: "Tiger Bhai - Buy & Sell Online | Multi-Vendor Marketplace",
    template: "%s | Tiger vai", // For child pages: "Product Name | YourStore"
  },
  description:
    "Bangladesh's leading online marketplace. Shop from millions of products across electronics, fashion, home, beauty, and more. Best prices, fast delivery, secure payment. Sell your products and grow your business online.",

  // Application name
  applicationName: "Tiger vai",

  // Authors
  authors: [{ name: "Tiger vai Team" }],

  // Generator
  generator: "Next.js",

  // Keywords for SEO
  keywords: [
    "online shopping Bangladesh",
    "buy online",
    "sell online",
    "multi-vendor marketplace",
    "e-commerce Bangladesh",
    "electronics",
    "fashion",
    "home appliances",
    "best prices",
    "online store",
    "shopping app",
    "vendor platform",
    "wholesale",
    "retail",
    "cash on delivery",
    "free delivery",
  ],

  // Creator
  creator: "Tiger vai",
  publisher: "Tiger vai",

  // Referrer policy
  referrer: "origin-when-cross-origin",

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#e04756",
      },
    ],
  },

  // Manifest for PWA
  manifest: "/manifest.json",

  // Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    url: "https://yourdomain.com",
    siteName: "YourStore",
    title: "YourStore - Bangladesh's Best Online Shopping Marketplace",
    description:
      "Shop from millions of products. Electronics, Fashion, Home & Living, Beauty, Sports and more. Best deals, fast delivery, secure payment. Start selling today!",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YourStore - Online Shopping Marketplace",
        type: "image/jpeg",
      },
      {
        url: "https://yourdomain.com/og-image-square.jpg",
        width: 1200,
        height: 1200,
        alt: "YourStore Logo",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@YourStore",
    creator: "@YourStore",
    title: "YourStore - Buy & Sell Online | Multi-Vendor Marketplace",
    description:
      "Bangladesh's leading online marketplace. Shop electronics, fashion, home & more. Best prices, fast delivery. Start selling today!",
    images: ["https://yourdomain.com/twitter-image.jpg"],
  },

  // Verification tags
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
    // other: {
    //   "facebook-domain-verification": "your-facebook-verification-code",
    //   "pinterest-verification": "your-pinterest-verification-code",
    // },
  },

  // App Links (for mobile apps)
  appLinks: {
    ios: {
      url: "yourstore://home",
      app_store_id: "123456789",
    },
    android: {
      package: "com.yourstore.app",
      app_name: "YourStore",
    },
    web: {
      url: "https://yourdomain.com",
      should_fallback: true,
    },
  },

  // Alternate languages
  alternates: {
    canonical: "https://yourdomain.com",
    languages: {
      "en-US": "https://yourdomain.com",
      "bn-BD": "https://yourdomain.com/bn",
    },
  },

  // Additional meta tags
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
    "msapplication-TileColor": "#e04756",
    "msapplication-tap-highlight": "no",
    "theme-color": "#ffffff",
  },

  // Category for search engines
  category: "e-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-53K4CD6D" />

      <Suspense>
        <WhatsAppSupport />
      </Suspense>

      <body
        className={`${kumbhSans.variable} antialiased bg-palette-bg h-full`}
      >
        <Script id="text">
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-53K4CD6D"
              height="0"
              width="0"
              className="display:none;visibility:hidden"
            ></iframe>
          </noscript>
        </Script>
        <Suspense>
          <PageViewTracker />
        </Suspense>
        <Script
          id="jsonld-main"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Tiger vai",
              alternateName: "Tiger vai Bangladesh",
              url: "https://yourdomain.com",
              logo: "https://yourdomain.com/logo.png",
              description:
                "Bangladesh's leading multi-vendor online marketplace",
              sameAs: [
                "https://www.facebook.com/Tiger vai",
                "https://twitter.com/Tiger vai",
                "https://www.instagram.com/Tiger vai",
                "https://www.youtube.com/Tiger vai",
                "https://www.linkedin.com/company/Tiger vai",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+880-1234-567890",
                contactType: "customer service",
                areaServed: "BD",
                availableLanguage: ["English", "Bengali"],
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Your Street Address",
                addressLocality: "Dhaka",
                addressRegion: "Dhaka",
                postalCode: "1000",
                addressCountry: "BD",
              },
            }),
          }}
        />

        {/* ✅ JSON-LD for WebSite with SearchAction */}
        <Script
          id="jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "YourStore",
              url: "https://yourdomain.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://yourdomain.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <Suspense>
          <ClientSideScrollRestorer />
        </Suspense>
        <QueryProvider>
          <NuqsAdapter>
            <Navbar />

            {children}
            <Footer />
            <Toaster />
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  );
}
