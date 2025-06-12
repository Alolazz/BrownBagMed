import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pharmacist Medication Check | Brown Bag Med – Medication Review for Seniors, Polypharmacy Risks",
  description: "Pharmacist medication check online. Review prescription drugs online. Safe medication use for elderly. Check my medications for interactions.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo1.png",
  },
  openGraph: {
    title: "Pharmacist Medication Check | Brown Bag Med",
    description: "Medication review for seniors. Polypharmacy risks. Are my medications safe? Help with too many medications.",
    images: [
      {
        url: "/logo1.png",
        width: 1200,
        height: 630,
        alt: "Brown Bag Med Logo - safe medication use for elderly, medication review for seniors",
        type: "image/png"
      },
      {
        url: "/logo1.webp",
        width: 1200,
        height: 630,
        alt: "Brown Bag Med Logo - review prescription drugs online, polypharmacy risks",
        type: "image/webp"
      }
    ],
    type: "website",
    url: "https://www.brownbagmed.eu"
  },
  twitter: {
    card: "summary_large_image",
    title: "Pharmacist Medication Check | Brown Bag Med",
    description: "Pharmacist medication check online. Review prescription drugs online. Safe medication use for elderly.",
    images: [
      "/logo1.png"
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Brown Bag Med</title>
        <meta name="description" content="Medication Analysis & Management – Private & Secure" />
        <meta property="og:title" content="Brown Bag Med" />
        <meta property="og:description" content="Medication Analysis & Management – Private & Secure" />
        <meta property="og:image" content="/logo1.png" />
        <meta property="og:image" content="/logo1.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.brownbagmed.eu" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Brown Bag Med" />
        <meta name="twitter:description" content="Medication Analysis & Management – Private & Secure" />
        <meta name="twitter:image" content="/logo1.png" />
        <meta name="google-site-verification" content="your-google-site-verification-code" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo1.png" />
        <meta name="keywords" content="medication review for seniors, check my medications for interactions, pharmacist medication check online, are my medications safe?, help with too many medications, review prescription drugs online, safe medication use for elderly, polypharmacy risks" />
        <link rel="canonical" href="https://www.brownbagmed.eu" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/" legacyBehavior>
              <a style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold' }}>Home</a>
            </Link>
            <Link href="/upload" legacyBehavior>
              <a style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold' }}>Upload</a>
            </Link>
            <Link href="/blog" legacyBehavior>
              <a style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold' }}>Blog</a>
            </Link>
            <Link href="/faq" legacyBehavior>
              <a style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold' }}>FAQ</a>
            </Link>
            <Link href="/contact" legacyBehavior>
              <a style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold' }}>Contact</a>
            </Link>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', fontWeight: 'bold' }}>Languages</button>
              <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '10px', display: 'none' }}>
                <a href="#" style={{ display: 'block', textDecoration: 'none', color: '#2563eb', padding: '5px 10px' }}>English</a>
                <a href="#" style={{ display: 'block', textDecoration: 'none', color: '#2563eb', padding: '5px 10px' }}>German</a>
                <a href="#" style={{ display: 'block', textDecoration: 'none', color: '#2563eb', padding: '5px 10px' }}>Arabic</a>
              </div>
            </div>
            <Link href="/upload" legacyBehavior>
              <a style={{ textDecoration: 'none', background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold' }}>Get Started</a>
            </Link>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', fontWeight: 'bold' }}>Toggle Theme</button>
          </div>
        </header>
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              id="ga4-inline"
              src="https://www.googletagmanager.com/gtag/js?id=G-5XLB8C4V1X"
              strategy="afterInteractive"
            />
            <Script id="google-analytics-inline" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-5XLB8C4V1X');
              `}
            </Script>
          </>
        )}
        <Script id="json-ld-organization" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.brownbagmed.eu/#organization",
              "mainEntityOfPage": "https://www.brownbagmed.eu",
              "name": "Brown Bag Med",
              "url": "https://www.brownbagmed.eu",
              "logo": "https://www.brownbagmed.eu/logo1.png",
              "description": "Brown Bag Med offers structured medication reviews to help patients understand and optimize their medication regimen, reduce risks, and improve health outcomes.",
              "founder": {
                "@type": "Person",
                "name": "Aly Nabil Abotaleb"
              },
              "sameAs": [
                "https://www.instagram.com/brownbag.med",
                "https://www.facebook.com/brownbag.med"
              ],
              "areaServed": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 51.1657,
                  "longitude": 10.4515
                },
                "geoRadius": 2000
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "email": "info@brownbagmed.eu",
                "availableLanguage": ["English", "German", "Arabic"]
              }
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
