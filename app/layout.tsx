import type { Metadata } from "next";
import "./globals.css";
import "../styles/notifications.css";

import { NotificationProvider } from "../components/tools/NotificationContext";

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
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/placeholder-logo.png" type="image/x-icon" />
      </head>
      <body>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
