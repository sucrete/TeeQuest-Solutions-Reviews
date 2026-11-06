import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { stats } from "@/lib/reviews";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const title = `TeeQuest Reviews: ${stats.average} Stars from ${stats.count} Golf Course Operators`;
const description = `Read all ${stats.count} verified TeeQuest reviews from golf course owners, general managers and PGA professionals. Rated ${stats.average} out of 5 on Capterra.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description,
  },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // bg-black on <html> colors the area revealed when overscrolling; the
    // body's white background still covers the page itself
    <html lang="en" className={`${geistSans.variable} bg-black antialiased`}>
      <body>{children}</body>
    </html>
  );
}
