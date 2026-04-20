import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteNavigation } from "@/components/SiteNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RemoteVault | Secure Personal Device Access",
  description: "Access your PC and mobile storage from anywhere in the world using only a web browser. Secure, encrypted, and decentralized.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className={`${inter.className} antialiased min-h-screen`}>
            <SiteNavigation />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
