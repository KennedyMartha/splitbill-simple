import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/components/providers";
import { APP_CONFIG } from "@/lib/appConfig";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SplitBill Simple",
  description: "A clean Base Mini App for simple onchain bill splitting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content={APP_CONFIG.appId} />
        <meta name="base:coded_string" content={APP_CONFIG.codedString} />
        <meta name="base:build_code" content={APP_CONFIG.buildCode} />
        <meta
          name="talentapp:project_verification"
          content="bceea379e90e426348993a8be744a9f16f0d726def9c457013e8f443b9432b626a0f81a4357a467c75b160964ccc8d0c700278aa6dc57a579265cd2ec03abe31"
        />
      </head>
      <body className={dmSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
