import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import dynamic from 'next/dynamic';

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
    icon: "/logo1.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {process.env.NODE_ENV === 'production' && (
          <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-5XLB8C4V1X"></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-5XLB8C4V1X');
                `,
              }}
            />
          </>
        )}
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

// Example: dynamically import a heavy component (replace with actual component names if needed)
// const HeavyComponent = dynamic(() => import('./HeavyComponent'), { ssr: false, loading: () => <div>Loading...</div> });
