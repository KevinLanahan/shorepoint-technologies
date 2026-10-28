import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shorepoint Technologies | Website Design & Custom Software",
  description: "Website design, website redesign, and custom software development in Southern New Jersey. Professional business websites, mobile apps, and automation for the Jersey Shore.",
  applicationName: "Shorepoint Technologies",
  openGraph: { title: "Shorepoint Technologies", description: "Website design, website redesign, and custom software development for businesses in Southern New Jersey.", type: "website", locale: "en_US" },
  twitter: { card: "summary", title: "Shorepoint Technologies", description: "Website design, website redesign, and custom software development in Southern New Jersey." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
