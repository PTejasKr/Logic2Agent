import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Waves } from "@/components/ui/wave-background";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logic2Agent",
  description: "Logic2Agent - Autonomous AI Solutions",
  icons: {
    icon: "/icon.png",
  },
};


import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "sonner";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Provider from "./provider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-blue-500/30 min-h-screen flex flex-col relative overflow-x-hidden`}
      >
        <Waves
          className="fixed inset-0 z-0 pointer-events-none"
          backgroundColor="#000000"
          strokeColor="rgba(255,255,255,0.08)"
          pointerSize={0}
        />
        <div className="grainy-overlay" />
        <div className="relative z-10 flex flex-col min-h-screen">
          {
            (typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'string' && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_')) ? (
              <ClerkProvider>
                <ConvexClientProvider>
                  <Provider>
                    {children}
                    <Toaster richColors />
                  </Provider>
                </ConvexClientProvider>
              </ClerkProvider>
            ) : (
              // Clerk not configured: render app without Clerk to allow builds and local dev without keys
              <ConvexClientProvider>
                <Provider>
                  {children}
                  <Toaster richColors />
                </Provider>
              </ConvexClientProvider>
            )
          }
        </div>
      </body>
    </html>


  );
}

