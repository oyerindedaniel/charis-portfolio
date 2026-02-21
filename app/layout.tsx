import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./page.module.css";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/motion-provider";
import { siteConfig } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bricolage = localFont({
  src: "../public/fonts/bricolage/bricolage-variable.ttf",
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Portfolio`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${bricolage.variable}`}>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/@oyerinde/caliper/dist/index.global.js"
            data-config={JSON.stringify({
              bridge: { enabled: true }
            })}
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider>
          <MotionProvider>
            <div className={styles.page}>
              <main className={styles.main}>
                {children}
              </main>
            </div>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
