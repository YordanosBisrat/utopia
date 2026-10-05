import type { Metadata } from "next";
import { Cinzel, Outfit, Noto_Serif_Ethiopic } from "next/font/google";
import "./globals.css";
import { Assistant } from "@/components/Assistant";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});
const notoEthiopic = Noto_Serif_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-noto-ethiopic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UTOPIA | you-ጦቢያ",
  description:
    "Where Ethiopia Comes Alive. An interactive Ethiopian knowledge universe.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/brand/icon.png?v=2", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/brand/apple-icon.png?v=2", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${outfit.variable} ${notoEthiopic.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <Assistant />
      </body>
    </html>
  );
}