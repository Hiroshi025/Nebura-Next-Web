"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaDiscord, FaGoogle, FaServer, FaWhatsapp } from "react-icons/fa";

import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Discord",
    icon: <FaDiscord className="text-purple-400 text-2xl" />,
    description: (
      <>
        <strong>Cliente personalizado (MyClient):</strong>
        <ul className="list-disc list-inside mt-2">
          <li>Gestión de comandos, botones, menús, modales y addons.</li>
          <li>
            Configuración avanzada de caché, intents y barridos automáticos.
          </li>
          <li>Handlers para cargar y desplegar módulos.</li>
        </ul>
      </>
    ),
  },
  {
    title: "WhatsApp",
    icon: <FaWhatsapp className="text-green-400 text-2xl" />,
    description: (
      <>
        <strong>Cliente de WhatsApp (MyApp):</strong>
        <ul className="list-disc list-inside mt-2">
          <li>Gestión de mensajes con almacenamiento en archivos Excel.</li>
          <li>Escaneo de códigos QR para autenticación.</li>
          <li>
            Registro de mensajes con detalles como remitente, adjuntos y
            contenido.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "API HTTP",
    icon: <FaServer className="text-blue-400 text-2xl" />,
    description: (
      <>
        <strong>Rutas públicas y protegidas:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>Gestión de licencias.</li>
          <li>Autenticación y registro de usuarios.</li>
          <li>Bloqueo y desbloqueo de direcciones IP.</li>
          <li>Estado del sistema y servicios como Discord.</li>
          <li>Procesamiento de texto y archivos con Google AI.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Google AI",
    icon: <FaGoogle className="text-red-400 text-2xl" />,
    description: (
      <>
        <strong>Integración con Google AI:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>Procesamiento de texto y archivos.</li>
          <li>Soporte para múltiples modelos de IA.</li>
          <li>Interacción con la API de Google Gemini.</li>
          <li>Funciones de análisis de texto y generación de contenido.</li>
          <li>Soporte para archivos de texto, imágenes y audio.</li>
        </ul>
      </>
    ),
  },
];

export default function DocumentationPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header className="py-20 px-4 bg-gradient-to-br from-gray-900 to-purple-900/70 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Documentación del Proyecto
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Este proyecto es una API modular que integra múltiples servicios
            como Discord, WhatsApp, GitHub, Google AI, y más.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Funcionalidades Principales */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Funcionalidades Principales
              </span>
            </h2>
            <p className="text-gray-400 mb-8">
              A continuación, mostramos algunas de las principales funciones del
              proyecto que puedes explorar:
              <br />
              <br />
              <strong>Nota:</strong> Algunas funcionalidades pueden requerir
              permisos especiales o configuraciones adicionales.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/70 transition-all duration-300 overflow-hidden group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-800/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/70 transition-all duration-300 overflow-hidden group"
                  >
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {feature.title}
                      </h3>
                      <div className="text-gray-400">{feature.description}</div>
                      <button
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                        onClick={() =>
                          router.push(`/docs/${feature.title.toLowerCase()}`)
                        }
                      >
                        Ver más
                      </button>
                    </CardContent>
                  </motion.div>
                </Card>
              ))}
            </div>
          </div>

          {/* Nueva Sección: Seguridad */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-600">
                Seguridad
              </span>
            </h2>
            <p className="text-gray-400 mb-8">
              La seguridad es una prioridad en nuestro proyecto. A continuación,
              se detallan nuestras políticas y prácticas de seguridad:
            </p>

            {/* Vulnerabilidades Críticas y Frecuencia de Actualizaciones */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Vulnerabilidades Críticas
                </h3>
                <ul className="list-disc list-inside text-gray-400">
                  <li>Prioridad máxima de resolución</li>
                  <li>Objetivo de parche en 72 horas tras confirmación</li>
                  <li>Comunicación constante con el reportero</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Frecuencia de Actualizaciones
                </h3>
                <ul className="list-disc list-inside text-gray-400">
                  <li>Actualizaciones programadas: Mensuales</li>
                  <li>Actualizaciones críticas: Según necesidad</li>
                  <li>
                    Notificación de cambios: A través de{" "}
                    <code>CHANGELOG.md</code>
                  </li>
                </ul>
              </div>
            </div>

            {/* Historial de Seguridad */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Historial de Seguridad
              </h3>
              <table className="w-full text-left text-gray-400 border-collapse border border-gray-700">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-700 px-4 py-2">
                      Versión
                    </th>
                    <th className="border border-gray-700 px-4 py-2">Fecha</th>
                    <th className="border border-gray-700 px-4 py-2">
                      Vulnerabilidades Corregidas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">0.0.9</td>
                    <td className="border border-gray-700 px-4 py-2">
                      15/08/2025
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      2 (SQLi, XSS)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">0.0.7</td>
                    <td className="border border-gray-700 px-4 py-2">
                      01/07/2025
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      1 (Auth Bypass)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-6 text-center text-gray-400">
        <p>&copy; 2025 Nebura Client. Todos los derechos reservados.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a
            href="https://help.hiroshi-dev.me/legal/terminos-y-condiciones"
            className="hover:text-white"
          >
            Términos de Uso
          </a>
          <a
            href="https://help.hiroshi-dev.me/legal/terminos-y-condiciones"
            className="hover:text-white"
          >
            Política de Privacidad
          </a>
          <a href="https://discord.gg/p6gZfY4jWm" className="hover:text-white">
            Contacto
          </a>
        </div>
      </footer>
    </main>
  );
}
