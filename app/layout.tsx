import type { Metadata } from 'next'
import "./globals.css";

export const metadata: Metadata = {
  title: 'Nebura Client',
  description: 'Este proyecto es una API modular que integra múltiples servicios como Discord, WhatsApp, GitHub, Google AI, y más. A continuación, se detallan las funcionalidades, rutas, comandos y eventos disponibles en el proyecto.',
  generator: 'v0.dev',
  keywords: 'API, modular, Discord, WhatsApp, GitHub, Google AI',
  authors: [
    {
      name: "Hiroshi025",
      url: "https://help.hiroshi-dev.me"
    }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
