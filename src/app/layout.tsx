import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";


export const metadata: Metadata = {
  title: "Chat App",
  description: "Realtime Chat with Google Auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-black text-black dark:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
