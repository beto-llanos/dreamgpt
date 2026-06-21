import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const title = "DreamGPT — Your subconscious has memory";
const description =
  "Talk about your dreams. DreamGPT records them by voice, remembers everything, and reveals the patterns hidden across years. Join the waitlist.";

export const metadata: Metadata = {
  metadataBase: new URL("https://dreamgpt.app"),
  title,
  description,
  keywords: [
    "dream journal",
    "voice dream journal",
    "AI dream analysis",
    "dream tracker",
    "DreamGPT",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "DreamGPT",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌙</text></svg>",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
