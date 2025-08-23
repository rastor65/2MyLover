// ./v0/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/contexts/cart-context";
import type { ReactNode } from "react";
import ClientProviders from "./ClientProviders";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair", // ← necesario para usar .variable
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter", // ← necesario para usar .variable
});

export const metadata: Metadata = {
  title: "2MyLover",
  description: "Moda urbana minimalista en blanco y negro",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="antialiased">
      <body className="min-h-screen bg-background text-foreground">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}