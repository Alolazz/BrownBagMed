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
  title: "Brown Bag Med – Medication Analysis and Management",
  description: "We help patients safely manage medications through structured analysis by licensed pharmacists.",
  icons: {
    icon: "/favicon.ico", // Use favicon.ico for browser tab icon
    shortcut: "/favicon.ico",
    apple: "/logo1.png", // Apple touch icon
  },
  openGraph: {
    title: "Brown Bag Med",
    description: "Medication Analysis & Management – Private & Secure",
    images: [
      {
        url: "/logo1.png",
        width: 1200,
        height: 630,
        alt: "Brown Bag Med Logo",
        type: "image/png"
      },
      {
        url: "/logo1.webp",
        width: 1200,
        height: 630,
        alt: "Brown Bag Med Logo",
        type: "image/webp"
      }
    ],
    type: "website",
    url: "https://yourdomain.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "Brown Bag Med",
    description: "Medication Analysis & Management – Private & Secure",
    images: [
      {
        url: "/logo1.png",
        alt: "Brown Bag Med Logo"
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
        <meta property="og:url" content="https://yourdomain.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Brown Bag Med" />
        <meta name="twitter:description" content="Medication Analysis & Management – Private & Secure" />
        <meta name="twitter:image" content="/logo1.png" />
        <meta name="google-site-verification" content="your-google-site-verification-code" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo1.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-5XLB8C4V1X"
              strategy="afterInteractive"
            />
            <Script id="ga4-inline" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-5XLB8C4V1X');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
