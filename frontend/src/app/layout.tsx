import "./globals.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font/sans";
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MessageVerse - Connect Instantly",
  description:
    "Experience seamless communication with friends and family through secure, private messaging - all in your web browser.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
