import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shorepoint Technologies | Custom Software, Built Around Your Business",
  description: "Independent software development studio in Southern New Jersey. Custom web and mobile applications, AI automation, and business systems for the Jersey Shore and beyond.",
  applicationName: "Shorepoint Technologies",
  openGraph: { title: "Shorepoint Technologies", description: "Software built around your business. Custom applications and intelligent automation from Southern New Jersey.", type: "website", locale: "en_US" },
  twitter: { card: "summary", title: "Shorepoint Technologies", description: "Software built around your business." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
