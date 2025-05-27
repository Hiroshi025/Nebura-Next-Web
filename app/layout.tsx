import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nebura - Hiroshi025",
  description:
    "Soy un desarrollador que crea distintos proyectos y herramientas por pasion y gusto del anime y manga japones, espero seguir compartiendo mi trabajo y aprendiendo de la comunidad.",
  generator: "Next.js",
  applicationName: "Portfolio Hiroshi025",
  keywords: "desarrollo, anime, manga, proyectos, herramientas",
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
