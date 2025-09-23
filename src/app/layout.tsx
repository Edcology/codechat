import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'light'
};

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'CodeChat - Real-time Messaging Platform',
    template: '%s | CodeChat'
  },
  description: 'Secure real-time chat application with private messaging, group chats, and multimedia support. Built with Next.js and WebSocket technology.',
  keywords: [
    'chat application',
    'real-time messaging',
    'secure chat',
    'private messaging',
    'group chat',
    'websocket chat',
    'multimedia messaging'
  ],
  authors: [{ name: 'Your Name' }],
  creator: 'Awofala Gbolahan Edward',
  publisher: 'CodeChat',
  applicationName: 'CodeChat',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'CodeChat',
    title: 'CodeChat - Secure Real-time Messaging Platform',
    description: 'Experience seamless real-time communication with CodeChat. Features include private messaging, group chats, and multimedia support.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'CodeChat Preview'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeChat - Real-time Messaging Platform',
    description: 'Secure real-time chat application with private messaging and group chats',
    images: ['/twitter-card.png'],
    creator: '@AwofalaGbolaha1'
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  category: 'technology',
};

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
      </body>
    </html>
  );
}
