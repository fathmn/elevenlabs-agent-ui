import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nohemi = localFont({
  src: [
    {
      path: "../node_modules/@tamagui/font-nohemi/fonts/Nohemi-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@tamagui/font-nohemi/fonts/Nohemi-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nohemi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ElevenLabs Agent UI",
  description: "Minimal Next.js UI to start an ElevenLabs Agent conversation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nohemi.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
