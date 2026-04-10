import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VerticalParts | Compras Nacionais",
  description: "Sistema Inteligente de Suprimentos e Compras Nacionais",
};

/**
 * Root Layout for vpcompras-nacionais.
 * Provides the base HTML structure mandatory for Next.js App Router.
 * @architect-spaceX
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
