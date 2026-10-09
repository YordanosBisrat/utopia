import type { Metadata } from "next";
import { Cinzel, Figtree, Noto_Serif_Ethiopic, Noto_Sans_Ethiopic } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Assistant } from "@/components/Assistant";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const notoEthiopic = Noto_Serif_Ethiopic({ subsets: ["ethiopic"], variable: "--font-noto-ethiopic", display: "swap" });
const notoSansEthiopic = Noto_Sans_Ethiopic({ subsets: ["ethiopic"], variable: "--font-noto-sans-ethiopic", display: "swap" });

export const metadata: Metadata = {
  title: { default: "UTOPIA | you-ጦቢያ: Where Ethiopia Comes Alive", template: "%s" },
  description:
    "Explore the people, places, stories, cultures and wonders of Ethiopia through discovery, games and journeys.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/brand/icon.png?v=2", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/brand/apple-icon.png?v=2", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${figtree.variable} ${notoEthiopic.variable} ${notoSansEthiopic.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <Assistant />
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
