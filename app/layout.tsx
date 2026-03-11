import { Analytics } from '@vercel/analytics/next'
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
  metadataBase: new URL("https://40karmy.com"),
  title: "Warhammer 40K Army Cost Calculator | 40KArmy",
  description:
    "Calculate the real cost of building a Warhammer 40K army. Add units, track points, estimate boxes and total army price.",
  keywords: [
    "warhammer 40k army calculator",
    "40k army cost",
    "warhammer army cost calculator",
    "40k army builder cost",
    "warhammer points calculator",
  ],
  openGraph: {
    title: "Warhammer 40K Army Cost Calculator",
    description:
      "Build your Warhammer 40K army and instantly calculate points, boxes, and real-world cost.",
    url: "https://40karmy.com",
    siteName: "40KArmy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warhammer 40K Army Cost Calculator",
    description:
      "Calculate the real cost of a Warhammer 40K army.",
  },
  verification: {
    google: "XpdILhXzGcYP2lOOpZt0wJSPoKDFB9Vv5KCPEiKKM9A",
  },
  icons: {
    icon: "/40KArmy_Favicon.svg",
  },
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
        <Analytics />
      </body>
    </html>
  );
}
