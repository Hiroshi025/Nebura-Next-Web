"use client"

import { ExternalLink, FileText, Github, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const router = useRouter()
  const [currentBanner, setCurrentBanner] = useState(0)

  // Anime-themed banner images (would be replaced with actual anime images)
  const banners = [
    {
      title: "Control de API",
      description: "Control de Licencias, Gestión de Usuarios y más",
      image: "/placeholder.jpg?height=600&width=1200&text=Anime+Control+Banner+1",
    },
    {
      title: "Clientes",
      description: "Múltiples clientes para diferentes plataformas",
      image: "/placeholder.jpg?height=600&width=1200&text=Anime+Chat+Banner+2",
    },
    {
      title: "Documentación",
      description: "Documentación de la API, Proyecto y Monitor",
      image: "/placeholder.jpg?height=600&width=1200&text=Anime+Docs+Banner+3",
    },
    {
      title: "Soporte",
      description: "Asistencia y soporte técnico",
      image: "/placeholder.jpg?height=600&width=1200&text=Anime+Support+Banner+4",
    },
    {
      title: "Novedades",
      description: "Últimas actualizaciones y noticias",
      image: "/placeholder.jpg?height=600&width=1200&text=Anime+News+Banner+5",
    },
  ]

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200 overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-purple-900/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-bold text-white">Nebura Client</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">
              Características
            </Link>
            <Link href="/docs" className="text-gray-300 hover:text-purple-400 transition-colors">
              Documentación
            </Link>
            <Link href="#services" className="text-gray-300 hover:text-purple-400 transition-colors">
              Servicios
            </Link>
            <Link href="/chat" className="text-gray-300 hover:text-purple-400 transition-colors">
              Chat
            </Link>
            <Button
              onClick={() => router.push("/auth")}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Banner with Anime Theme */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-purple-900 opacity-80"></div>

        {/* Banner images */}
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          <Image
            src={banners[currentBanner].image || "/placeholder.svg"}
            alt={banners[currentBanner].title}
            fill
            className="object-cover opacity-40"
          />
        </div>

        {/* Floating anime elements */}
        <div className="absolute top-20 right-20 animate-float-slow opacity-30">
          <div className="w-32 h-32 rounded-full bg-pink-500/20 backdrop-blur-md"></div>
        </div>
        <div className="absolute bottom-20 left-20 animate-float-medium opacity-30">
          <div className="w-24 h-24 rounded-full bg-purple-500/20 backdrop-blur-md"></div>
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              {banners[currentBanner].title}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-8 animate-fade-in-delay">
            {banners[currentBanner].description}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-delay-long">
            <Button
              onClick={() => router.push("/auth")}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
            >
              Comienza Ahora
            </Button>
            <Button
              onClick={() => router.push("#docs")}
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              Ver Documentación
            </Button>
          </div>
        </div>

        {/* Banner indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentBanner === index ? "bg-purple-500" : "bg-gray-600"
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section with Anime Style */}
      <section id="features" className="py-20 px-4 relative overflow-hidden">
        {/* Anime-style decorative elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 inline-block relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Características Clave
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600"></span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Nuestra plataforma proporciona herramientas poderosas para el control de API de anime y comunicación en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "API RESTful",
                description: "Puntos finales completos para gestionar datos de anime con documentación detallada.",
                icon: "🚀",
                animation: "animate-bounce-slow",
              },
              {
                title: "Socket.io en Tiempo Real",
                description: "Implementa características en tiempo real con nuestra integración de Socket.io para actualizaciones en vivo.",
                icon: "⚡",
                animation: "animate-pulse-slow",
              },
              {
                title: "Autenticación",
                description: "Asegura tu API con nuestro robusto sistema de autenticación y gestión de usuarios.",
                icon: "🔒",
                animation: "animate-float-slow",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/70 transition-all duration-300 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="p-6 relative">
                  <div className={`text-4xl mb-4 ${feature.animation}`}>{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" className="py-20 px-4 bg-gray-900/50 relative">
        {/* Anime-style decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-40 w-60 h-60 rounded-full bg-purple-600/30 blur-3xl"></div>
          <div className="absolute bottom-20 left-40 w-60 h-60 rounded-full bg-pink-600/30 blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 inline-block relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Documentación y Recursos
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600"></span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explora nuestra documentación completa y recursos útiles para comenzar con el Cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Documentación de la API",
                description: "Guía completa de todos los puntos finales, parámetros y respuestas de API.",
                icon: <FileText className="h-6 w-6" />,
                link: "#",
                color: "from-purple-500 to-pink-600",
              },
              {
                title: "Configuración del Proyecto",
                description: "Instrucciones paso a paso para configurar el proyecto.",
                icon: <Github className="h-6 w-6" />,
                link: "https://github.com/Hiroshi025",
                color: "from-blue-500 to-purple-600",
              },
              {
                title: "Comunidad en Discord",
                description: "Únete a nuestro servidor de Discord para conectar con otros desarrolladores y obtener ayuda.",
                icon: <MessageSquare className="h-6 w-6" />,
                link: "https://discord.gg/p6gZfY4jWm",
                color: "from-indigo-500 to-purple-600",
              },
              {
                title: "Guía de Socket.io",
                description: "Aprende a implementar características en tiempo real con nuestra integración de Socket.io.",
                icon: <ExternalLink className="h-6 w-6" />,
                link: "https://socket.io/",
                color: "from-pink-500 to-purple-600",
              },
            ].map((resource, index) => (
              <a key={index} href={resource.link} className="block group">
                <Card className="h-full bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-purple-500/70 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${resource.color} w-fit mb-4`}>
                      {resource.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{resource.description}</p>
                    <div className="mt-auto flex items-center text-purple-400 font-medium">
                      <span>Learn more</span>
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios y Productos */}
      <section id="services" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-900/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 inline-block relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Servicios y Productos
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600"></span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explora nuestras soluciones diseñadas para satisfacer tus necesidades con precios competitivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Gestión de Licencias",
                features: ["Control avanzado", "Gestión de usuarios", "Reportes detallados"],
                price: "$29/mes",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                color: "from-purple-500 to-pink-600",
              },
              {
                name: "Monitor de API",
                features: ["Estadísticas en tiempo real", "Alertas personalizadas", "Panel intuitivo"],
                price: "$49/mes",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h11M9 21V3m7 16h5M17 5h5"
                    />
                  </svg>
                ),
                color: "from-blue-500 to-purple-600",
              },
              {
                name: "Clientes Personalizados",
                features: ["Soporte multiplataforma", "Integración rápida", "Diseño adaptable"],
                price: "$99/mes",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v5h8v-5c0-2.21-1.79-4-4-4z"
                    />
                  </svg>
                ),
                color: "from-indigo-500 to-purple-600",
              },
              {
                name: "Soporte Técnico",
                features: ["Asistencia 24/7", "Resolución rápida", "Guías y tutoriales"],
                price: "$19/mes",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7 4h8a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z"
                    />
                  </svg>
                ),
                color: "from-pink-500 to-purple-600",
              },
              {
                name: "Integraciones",
                features: ["Conexión con Discord", "APIs populares", "Fácil configuración"],
                price: "$39/mes",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4l-5-5-5 5h4v4h2v-4z"
                    />
                  </svg>
                ),
                color: "from-purple-500 to-pink-600",
              },
              {
                name: "Actualizaciones Constantes",
                features: ["Nuevas funciones", "Mejoras de seguridad", "Actualizaciones automáticas"],
                price: "Incluido",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                color: "from-blue-500 to-purple-600",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/70 transition-all duration-300 overflow-hidden group"
              >
                <CardContent className="p-6 relative flex flex-col">
                  <div className={`p-3 rounded-full bg-gradient-to-br ${service.color} w-fit mb-4`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {service.name}
                  </h3>
                  <ul className="text-gray-400 mb-4 space-y-1">
                    {service.features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                  <p className="text-lg font-semibold text-purple-400 mt-auto">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-purple-900/70 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-950 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para unirte a nuestra comunidad de API de anime?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Comienza con nuestra poderosa API y conéctate con otros entusiastas del anime.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => router.push("/auth")}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
            >
              Crear Cuenta
            </Button>
            <Button
              onClick={() => router.push("/chat")}
              size="lg"
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              Probar Demo de Chat
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-950 border-t border-purple-900/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <span className="text-lg font-bold text-white">Nebura Client</span>
              </div>
              <p className="text-gray-400">
                NeburaClient es un proyecto modular que integra múltiples servicios.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Documentación de la API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Guía de Socket.io
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Configuración del Proyecto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Comunidad</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="https://discord.gg/p6gZfY4jWm" className="hover:text-purple-400 transition-colors">
                    Servidor de Discord
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/Hiroshi025" className="hover:text-purple-400 transition-colors">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Twitter
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="https://help.hiroshi-dev.me/legal/terminos-y-condiciones" className="hover:text-purple-400 transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="https://help.hiroshi-dev.me/legal/terminos-y-condiciones" className="hover:text-purple-400 transition-colors">
                    Términos de Servicio
                  </Link>
                </li>
                <li>
                  <Link href="https://help.hiroshi-dev.me/legal/terminos-y-condiciones" className="hover:text-purple-400 transition-colors">
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-900/30 mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 NeburaClient. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

