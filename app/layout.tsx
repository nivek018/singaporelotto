import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DelayedScripts } from "@/components/DelayedScripts";
import { SuppressHydrationWarning } from "@/components/SuppressHydrationWarning";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sglottoresult.com"),
  title: "Singapore Lotto Results - 4D, TOTO & Sweep | SG Lotto",
  description: "Get the latest Singapore Pools lottery results for 4D, TOTO, and Singapore Sweep. Live updates, past results history, statistics, and jackpot information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
        <DelayedScripts />
        <SuppressHydrationWarning />
      </body>
    </html>
  );
}

