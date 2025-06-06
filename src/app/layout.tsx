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
    icon: "/favicon.ico",
  },
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
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Brown Bag Med" />
        <meta name="twitter:description" content="Medication Analysis & Management – Private & Secure" />
        <meta name="twitter:image" content="/logo1.png" />
        <link rel="icon" href="/logo1.png" type="image/png" />
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
