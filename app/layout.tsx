import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AudioProvider } from "./contexts/AudioContext";

import { Toaster } from "sonner";

// 메인 폰트 - Pretendard (한국어 최적화)
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
  preload: true,
});

// 영문 폰트 - Geist Sans  
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});

// 모노스페이스 폰트 - Geist Mono (네비게이션용)
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: '%s | InnoCard',
    default: "InnoCard - 혁신적인 전자 명함"
  },
  description: "InnoCard - AI 기반 스마트 전자 명함 솔루션. 혁신적인 디지털 네트워킹의 새로운 시대를 열어갑니다.",
  keywords: [
    "전자명함", "디지털명함", "AI", "네트워킹", "비즈니스카드", "스마트명함",
    "digital business card", "AI networking", "smart card", "professional networking"
  ],
  authors: [{ name: "INNOCURVE", url: baseUrl }],
  creator: "INNOCURVE",
  publisher: "INNOCURVE",
  category: "Technology",
  classification: "Business Tools",
  alternates: {
    canonical: baseUrl,
    languages: {
      'ko': `${baseUrl}`,
      'en': `${baseUrl}?lang=en`,
      'ja': `${baseUrl}?lang=ja`,
      'zh': `${baseUrl}?lang=zh`,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "InnoCard - 혁신적인 전자 명함",
    description: "AI 기반 스마트 전자 명함 솔루션. 혁신적인 디지털 네트워킹의 새로운 시대를 열어갑니다.",
    type: "website",
    siteName: "InnoCard",
    locale: "ko_KR",
    alternateLocale: ["en_US", "ja_JP", "zh_CN"],
    url: baseUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InnoCard - 혁신적인 전자 명함",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@innocurve",
    creator: "@innocurve",
    title: "InnoCard - 혁신적인 전자 명함",
    description: "AI 기반 스마트 전자 명함 솔루션",
    images: {
      url: "/og-image.png",
      alt: "InnoCard - 혁신적인 전자 명함",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  other: {
    'theme-color': '#3b82f6',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

// 구조화된 데이터 (JSON-LD)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "INNOCURVE",
  "url": baseUrl,
  "logo": `${baseUrl}/logo.png`,
  "description": "AI 기반 스마트 전자 명함 솔루션을 제공하는 혁신적인 기술 회사",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "KR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Korean", "English", "Japanese", "Chinese"]
  },
  "sameAs": [
    "https://twitter.com/innocurve"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "InnoCard Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI 기반 전자 명함",
          "description": "스마트한 디지털 네트워킹 솔루션"
        }
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      <body
        className={`${pretendard.variable} ${geistSans.variable} ${geistMono.variable} font-pretendard antialiased min-h-screen`}
      >
        {/* Enhanced Global Background */}
        <div className="fixed inset-0 -z-50">
          {/* Primary gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950" />
          
          {/* Animated mesh gradients */}
          <div className="absolute inset-0 opacity-30 dark:opacity-20">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
          </div>
          
          {/* Subtle pattern overlay */}
          <div 
            className="absolute inset-0 dark:opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        {/* Enhanced Toaster */}
        <Toaster
          position="bottom-center"
          theme="light"
          richColors
          toastOptions={{
            duration: 3000,
            className: "modern-toast",
            style: {
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "16px 20px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              fontSize: "0.9rem",
              fontWeight: "500",
              borderRadius: "16px",
              marginBottom: "6rem",
              color: "#1f2937",
            },
          }}
        />

        {/* App Content */}
        <ThemeProvider>
          <LanguageProvider>
            <AudioProvider>
              <div className="relative">
                {children}
              </div>
            </AudioProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}