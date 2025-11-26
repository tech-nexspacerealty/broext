import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Property Info Extractor',
  description: 'AI-powered tool to extract property details from brochures efficiently',
    icons: [
    { rel: 'icon', url: '/extract.ico' },
    { rel: 'apple-touch-icon', url: '/extract.png' }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        newestOnTop 
        theme="dark"
        toastClassName="bg-gray-800 border border-gray-700"
        progressClassName="bg-blue-600"
      />
      </body>
    </html>
  );
}
