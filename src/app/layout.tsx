import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

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
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
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
        <Script type="application/ld+json">
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
