import type { Metadata } from "next";
import { Workbench, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const workbench = Workbench({
  variable: "--font-workbench",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "40KArmy – Warhammer 40K Army Calculator",
  description: "Build and cost your Warhammer 40K army. Points, boxes, and estimated cost.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${workbench.variable} ${ibmPlexMono.variable}`}>
      <body className="font-plex-mono antialiased bg-[#B2C4AE] text-[#231F20]">
        {children}
      </body>
    </html>
  );
}
