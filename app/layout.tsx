import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/footer";
import { CartProvider } from "../components/cart-provider";

export const metadata: Metadata = {
  title: "Delight",
  description: "Discover quality products at great prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <div className="flex-1">
            {children}
          </div>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}