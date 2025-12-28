import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DropVentures | African Dropshipping Marketplace",
  description:
    "DropVentures connects African sellers and buyers with seamless dropshipping via CJdropshipping, Paystack onboarding, and Firebase authentication.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col bg-[color:var(--background)]">
            <Header />
            <main className="flex-1 bg-[color:var(--background)]">
              <div className="mx-auto w-full max-w-7xl px-4 py-10 md:py-14">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
