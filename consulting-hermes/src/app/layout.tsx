import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  weight: ["500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consulting Hermes — AI-Powered 8-Second VSLs",
  description: "Generate scroll-stopping video sales letters with AI. Start free with 3 credits.",
  metadataBase: new URL("https://consulting-hermes.local"),
  openGraph: {
    title: "Consulting Hermes",
    description: "AI-Powered 8-Second VSLs That Convert in Seconds.",
    url: "https://consulting-hermes.local",
    siteName: "Consulting Hermes",
  },
};

import { Header } from "@/components/Header";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProvider>
          <Header />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
