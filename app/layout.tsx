import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nebura Client",
  description:
    "Este proyecto es una API modular que integra múltiples servicios como Discord, WhatsApp, GitHub, Google AI, y más. A continuación, se detallan las funcionalidades, rutas, comandos y eventos disponibles en el proyecto.",
  generator: "Next.js",
  applicationName: "Nebura Client",
  keywords: "API, modular, Discord, WhatsApp, GitHub, Google AI",
  authors: [
    {
      name: "Hiroshi025",
      url: "https://help.hiroshi-dev.me",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/placeholder-logo.png" type="image/x-icon" />
      </head>
      <body>{children}</body>
    </html>
  );
}
