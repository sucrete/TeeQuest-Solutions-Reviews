import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import { stats } from "@/lib/reviews";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// All monospaced type: Tailwind's --font-mono points here (globals.css)
const departureMono = localFont({
  src: "../../public/fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
  weight: "400",
});

// Display face for review card titles (see ReviewCard.tsx)
const redaction = localFont({
  src: "../../public/fonts/Redaction35-Regular.otf",
  variable: "--font-redaction",
  weight: "400",
});

const title = `TeeQuest Reviews: ${stats.average} Stars from ${stats.count} Golf Course Operators`;
const description = `Read all ${stats.count} verified TeeQuest reviews from golf course owners, GMs and PGA pros on tee sheet, POS and online booking. Rated ${stats.average} out of 5 on Capterra.`;

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
  // large card: the share image (src/app/opengraph-image.jpg and
  // twitter-image.jpg, 1200x630, made from public/logos/tqs-bloom.png) shows
  // as a wide banner; Next adds the image tags from those files
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // bg-black on <html> colors the area revealed when overscrolling; the
    // body's white background still covers the page itself
    <html
      lang="en"
      className={`${geistSans.variable} ${departureMono.variable} ${redaction.variable} bg-black antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
