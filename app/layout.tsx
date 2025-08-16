import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/contexts/cart-context";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair", // ⬅️ necesario para poder usar .variable
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter", // ⬅️ necesario para poder usar .variable
});

export const metadata: Metadata = {
  title: "2MyLover",
  description: "Moda urbana minimalista en blanco y negro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <body className="font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
