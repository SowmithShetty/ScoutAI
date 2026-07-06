import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScoutAI — Intelligent Football Recruitment Platform",
  description:
    "AI-powered football recruitment and transfer analytics. Advanced scouting, player comparison, tactical fit analysis, and data-driven transfer intelligence for elite clubs.",
  keywords: [
    "football scouting",
    "player analytics",
    "transfer intelligence",
    "AI recruitment",
    "football data",
    "player comparison",
  ],
  authors: [{ name: "ScoutAI" }],
  openGraph: {
    title: "ScoutAI — Intelligent Football Recruitment Platform",
    description: "AI-powered football recruitment and transfer analytics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-midnight text-text-primary antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
