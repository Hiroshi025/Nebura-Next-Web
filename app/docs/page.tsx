"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
              A continuación, se detallan las funcionalidades, rutas, comandos y
              eventos disponibles en el proyecto.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Discord",
                  description: (
                    <>
                      <strong>Cliente personalizado (MyClient):</strong>
                      <ul className="list-disc list-inside mt-2">
                        <li>
                          Gestión de comandos, botones, menús, modales y addons.
                        </li>
                        <li>
                          Métodos personalizados como <code>getEmoji</code> para
                          obtener emojis.
                        </li>
                        <li>
                          Configuración avanzada de caché, intents y barridos
                          automáticos.
                        </li>
                        <li>Handlers para cargar y desplegar módulos.</li>
                      </ul>
                    </>
                  ),
                },
                {
                  title: "WhatsApp",
                  description: (
                    <>
                      <strong>Cliente de WhatsApp (MyApp):</strong>
                      <ul className="list-disc list-inside mt-2">
                        <li>
                          Gestión de mensajes con almacenamiento en archivos
                          Excel.
                        </li>
                        <li>Escaneo de códigos QR para autenticación.</li>
                        <li>
                          Registro de mensajes con detalles como remitente,
                          adjuntos y contenido.
                        </li>
                      </ul>
                    </>
                  ),
                },
                {
                  title: "API HTTP",
                  description: (
                    <>
                      <strong>Rutas públicas y protegidas:</strong>
                      <ul className="list-disc list-inside mt-2">
                        <li>Gestión de licencias.</li>
                        <li>Autenticación y registro de usuarios.</li>
                        <li>Bloqueo y desbloqueo de direcciones IP.</li>
                        <li>Estado del sistema y servicios como Discord.</li>
                        <li>
                          Integración con GitHub para obtener datos de usuarios
                          y repositorios.
                        </li>
                        <li>
                          Procesamiento de texto y archivos con Google AI.
                        </li>
                      </ul>
                    </>
                  ),
                },
                {
                  title: "Google AI",
                  description: (
                    <>
                      <strong>Integración con Google AI:</strong>
                      <ul className="list-disc list-inside mt-2">
                        <li>Procesamiento de texto y archivos.</li>
                        <li>Soporte para múltiples modelos de IA.</li>
                        <li>Interacción con la API de Google Gemini.</li>
                        <li>
                          Funciones de análisis de texto y generación de
                          contenido.
                        </li>
                        <li>
                          Soporte para archivos de texto, imágenes y audio.
                        </li>
                        <li>
                          Funciones de análisis de texto y generación de
                          contenido.
                        </li>
                        <li>
                          Soporte para archivos de texto, imágenes y audio.
                        </li>
                      </ul>
                    </>
                  ),
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/70 transition-all duration-300 overflow-hidden group"
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {feature.title}
                    </h3>
                    <div className="text-gray-400">{feature.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* API Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                API
              </span>
            </h2>
            <p className="text-gray-400 mb-8">
              NEBURA AI es un sistema API integral que proporciona capacidades
              avanzadas de procesamiento de IA, gestión de IP, gestión de
              licencias, autenticación y monitoreo del sistema, ahora con
              protocolos de seguridad mejorados.
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                ✨ Core Functionalities
              </h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  AI Processing con modelos Google Gemini y soporte para modelos
                  personalizados.
                </li>
                <li>IP Address Management (bloquear/desbloquear/listar).</li>
                <li>License Management System (crear/validar/actualizar).</li>
                <li>
                  JWT Authentication (registro/inicio de sesión/datos de
                  usuario).
                </li>
                <li>System Monitoring endpoints.</li>
                <li>
                  <strong>Protocolos de Seguridad Mejorados:</strong>
                  <ul className="list-disc list-inside ml-6">
                    <li>Encriptación de datos sensibles.</li>
                    <li>Validación de IP en tiempo real.</li>
                    <li>Protección contra ataques de fuerza bruta.</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Technical Specifications */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                🔧 Technical Specifications
              </h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Diseño RESTful API.</li>
                <li>Autenticación JWT.</li>
                <li>Respuestas paginadas.</li>
                <li>Manejo detallado de errores.</li>
                <li>Documentación Swagger completa.</li>
                <li>Cifrado AES-256 para datos sensibles.</li>
                <li>Rate Limiting para prevenir abuso de endpoints.</li>
              </ul>
            </div>

            {/* Key Endpoints */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Key Endpoints
              </h3>
              <table className="w-full text-left text-gray-400 border-collapse border border-gray-700">
                <thead>
                  <tr>
                    <th className="border border-gray-700 px-4 py-2">
                      Categoría
                    </th>
                    <th className="border border-gray-700 px-4 py-2">
                      Endpoints
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">
                      AI Processing
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      <code>/google/model-ai/text</code>,{" "}
                      <code>/google/model-ai/file</code>,{" "}
                      <code>/google/model-ai/combined</code>,{" "}
                      <code>/custom/model-ai/{`{modelId}`}</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">
                      IP Management
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      <code>/block-ip</code>,{" "}
                      <code>/unblock-ip/{`{ipAddress}`}</code>,{" "}
                      <code>/blocked-ips</code>,{" "}
                      <code>/validate-ip/{`{ipAddress}`}</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">
                      Licenses
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      <code>/licenses</code>, <code>/licenses/{`{id}`}</code>,{" "}
                      <code>/licenses/validate/{`{key}`}</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">
                      Authentication
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      <code>/auth/register</code>, <code>/auth/login</code>,{" "}
                      <code>/auth/{`{id}`}</code>,{" "}
                      <code>/auth/reset-password</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-2">
                      System Status
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      <code>/public/status</code>, <code>/public/uptime</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <Button
                onClick={() => router.back()}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                Regresar
              </Button>
              <Button
                onClick={() => window.open("https://docs.hiroshi-dev.me", "_blank")}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                Ir al Monitor Swagger
              </Button>
            </div>

            {/* Installation */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Installation
              </h3>
              <h4 className="text-xl font-semibold text-white mb-2">
                Prerequisites
              </h4>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Node.js v20.18.0+</li>
                <li>TypeScript</li>
                <li>MongoDB (o cualquier base de datos compatible)</li>
              </ul>

              <h4 className="text-xl font-semibold text-white mt-6 mb-2">
                Setup
              </h4>
              <ol className="list-decimal list-inside text-gray-400 space-y-2">
                <li>
                  Clona el repositorio:
                  <pre className="bg-gray-800 text-gray-300 p-4 rounded mt-2">
                    <code>
                      git clone https://github.com/your-repo/nebura-ai.git
                    </code>
                    <br />
                    <code>cd nebura-ai</code>
                  </pre>
                </li>
                <li>
                  Instala las dependencias:
                  <pre className="bg-gray-800 text-gray-300 p-4 rounded mt-2">
                    <code>npm install</code>
                  </pre>
                </li>
                <li>
                  Configura las variables de entorno:
                  <pre className="bg-gray-800 text-gray-300 p-4 rounded mt-2">
                    <code>
                      JWT_SECRET: Clave secreta para autenticación JWT
                    </code>
                    <br />
                    <code>DB_URI: URI de la base de datos</code>
                    <br />
                    <code>RATE_LIMIT: Límite de solicitudes por minuto</code>
                  </pre>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
