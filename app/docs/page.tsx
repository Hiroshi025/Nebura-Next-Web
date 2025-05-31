"use client";

import { AnimatePresence, motion } from "framer-motion";
import yaml from "js-yaml"; // npm install js-yaml
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
	FaCodeBranch, FaDiscord, FaExpand, FaGithub, FaGoogle, FaHistory, FaKey, FaLink, FaPalette,
	FaRandom, FaRegListAlt, FaSearch, FaSearchMinus, FaSearchPlus, FaServer, FaShieldAlt, FaWhatsapp
} from "react-icons/fa";
import { FiCheck, FiCopy } from "react-icons/fi";

import { useNotification } from "@/components/NotificationContext";
import { QrGenerator } from "@/components/QrGenerator";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
	DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { WebhookTester } from "../../components/WebhookTester";
import { CodePlayground, CommandLiveEditor } from "./Tools";

// Define the Feature type for documentation features
type Feature = {
  title: string;
  icon: React.ReactNode;
  description: React.ReactNode;
  docs: { name: string; url: string }[];
};

// NUEVO: Actualización de features según la nueva documentación
const features = [
  {
    title: "API Server",
    icon: <FaServer className="text-blue-400 text-2xl" />,
    type: "Core",
    stack: ["Express", "Socket.IO", "Swagger", "i18next", "Prisma"],
    description: (
      <>
        <strong>Servidor HTTP modular:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>Express + Socket.IO para APIs y WebSockets en tiempo real.</li>
          <li>Swagger UI, seguridad avanzada, métricas y localización.</li>
          <li>
            Soporte para archivos estáticos, bloqueo de IP y rate limiting.
          </li>
          <li>Integración con módulos y monitoreo robusto.</li>
        </ul>
      </>
    ),
    docs: [
      { name: "Swagger UI", url: "http://localhost:PORT/docs" },
      {
        name: "API Reference",
        url: "https://help.hiroshi-dev.me/proyectos/nebura-client/api/routes-api",
      },
    ],
  },
  {
    title: "Discord Module",
    icon: <FaDiscord className="text-purple-400 text-2xl" />,
    type: "Integración",
    stack: ["discord.js", "TypeScript"],
    description: (
      <>
        <strong>Bot avanzado para Discord:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>Carga dinámica de comandos, eventos y componentes.</li>
          <li>Hot-reload, alias, gestión de emojis y errores.</li>
          <li>Extensible para bots y automatizaciones.</li>
        </ul>
      </>
    ),
    docs: [
      { name: "Discord.js Docs", url: "https://discord.js.org/#/docs" },
      {
        name: "Guía Discord",
        url: "https://help.hiroshi-dev.me/proyectos/nebura-client/modulos/discord-client",
      },
    ],
  },
  {
    title: "WhatsApp Module",
    icon: <FaWhatsapp className="text-green-400 text-2xl" />,
    type: "Integración",
    stack: ["whatsapp-web.js", "ExcelJS"],
    description: (
      <>
        <strong>Cliente WhatsApp Web.js:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>Registro de mensajes en Excel, backups automáticos.</li>
          <li>
            Comando <code>/status</code> para estadísticas y monitoreo.
          </li>
          <li>Autenticación QR y manejo robusto de sesiones.</li>
        </ul>
      </>
    ),
    docs: [
      { name: "WhatsApp Web.js Docs", url: "https://wwebjs.dev/guide/" },
      {
        name: "Guía WhatsApp",
        url: "https://host.hiroshi-dev.me/documentation/modules/modules_whatsapp.html",
      },
    ],
  },
  {
    title: "Google AI & Gemini",
    icon: <FaGoogle className="text-red-400 text-2xl" />,
    type: "IA",
    stack: ["Google Gemini", "API HTTP"],
    description: (
      <>
        <strong>Integración con IA de Google:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>Procesamiento de texto, imágenes y audio.</li>
          <li>Soporte multi-modelo y análisis avanzado.</li>
        </ul>
      </>
    ),
    docs: [
      {
        name: "Modelos Disponibles",
        url: "https://help.hiroshi-dev.me/proyectos/nebura-client/modulos",
      },
    ],
  },
  {
    title: "Arquitectura & Orquestador",
    icon: <FaCodeBranch className="text-yellow-400 text-2xl" />,
    type: "Core",
    stack: ["Node.js", "TypeScript", "Prisma", "PM2"],
    description: (
      <>
        <strong>Engine principal y arquitectura modular:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>Orquestación de módulos y servicios.</li>
          <li>Gestión de procesos, backups y monitoreo.</li>
          <li>Integración con Sentry y herramientas DevOps.</li>
        </ul>
      </>
    ),
    docs: [
      {
        name: "Diagrama Arquitectura",
        url: "https://help.hiroshi-dev.me/proyectos/nebura-client",
      },
    ],
  },
  // NUEVO: Cuadro de funciones para la documentación (TypeDoc)
  {
    title: "Documentación Técnica (TypeDoc)",
    icon: <FaLink className="text-cyan-400 text-2xl" />,
    type: "Documentación",
    stack: ["TypeDoc", "Markdown", "HTML"],
    description: (
      <>
        <strong>Documentación generada automáticamente:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>
            Generación de documentación técnica a partir del código fuente con
            TypeDoc.
          </li>
          <li>
            Explora clases, métodos, interfaces y tipos de todo el proyecto.
          </li>
          <li>Acceso rápido a referencias y ejemplos de uso.</li>
          <li>Formato navegable en HTML y Markdown.</li>
        </ul>
      </>
    ),
    docs: [
      {
        name: "TypeDoc Online",
        url: "https://help.hiroshi-dev.me/proyectos/nebura-client/typedoc",
      },
      {
        name: "Guía de Documentación",
        url: "https://typedoc.org/guides/doccomments/",
      },
    ],
  },
];

const securityVersions = [
  {
    version: "1.0.0",
    date: "15/10/2025",
    changes: [
      "Implementación de autenticación JWT mejorada",
      "Protección contra ataques CSRF",
      "Actualización de dependencias críticas",
    ],
    status: "stable",
  },
  {
    version: "0.9.5",
    date: "01/10/2025",
    changes: [
      "Parche para vulnerabilidad XSS en panel de administración",
      "Mejoras en el sistema de rate limiting",
    ],
    status: "deprecated",
  },
  {
    version: "0.9.0",
    date: "15/09/2025",
    changes: [
      "Primera versión pública del security.md",
      "Configuración básica de CORS",
      "Políticas de contraseñas",
    ],
    status: "deprecated",
  },
];

// NUEVO: Control de versiones para la documentación
const documentationVersions = [
  {
    version: "1.0.0",
    date: "15/10/2025",
    deprecated: false,
    label: "Estable",
    color: "green",
    // Aquí puedes agregar más campos si necesitas más versiones en el futuro
  },
  {
    version: "0.9.5",
    date: "01/10/2025",
    deprecated: true,
    label: "Deprecada",
    color: "yellow",
  },
];

// Componente contador animado para uptime y memoria
const AnimatedNumber = ({
  value,
  decimals = 0,
  duration = 1,
}: {
  value: number;
  decimals?: number;
  duration?: number;
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    let startTime: number | null = null;
    interface AnimateTimestamp {
      (timestamp: number): void;
    }

    const animate: AnimateTimestamp = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setDisplay(start + (value - start) * progress);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);

  return (
    <span ref={nodeRef}>
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
};

// Componente de estado del sistema
type SystemStatusType = {
  uptime: number;
  status: string;
  meta: {
    apiVersion: string;
    environment: string;
  };
  database: {
    status: string;
    responseTime: string;
  };
  system: {
    memoryUsage: {
      heapUsed: number;
    };
    totalMemory: number;
  };
};

const SystemStatus = () => {
  const [status, setStatus] = useState<SystemStatusType | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://host.hiroshi-dev.me/api/v1/public/status")
      .then((res) => {
        if (!res.ok)
          throw new Error("No se pudo obtener el estado del sistema");
        return res.json();
      })
      .then((data) => {
        setStatus(data);
        setError("");
      })
      .catch(() => setError("No se pudo obtener el estado del sistema"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-purple-400 mb-8">
        <span className="animate-spin h-5 w-5 border-2 border-purple-400 border-t-transparent rounded-full"></span>
        Cargando estado del sistema...
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="text-red-400 mb-8">
        <FaShieldAlt className="inline mr-2" />
        {error || "No se pudo obtener el estado del sistema"}
      </div>
    );
  }

  const uptimeHours = status.uptime / 3600;
  const usedMem = status.system.memoryUsage.heapUsed / (1024 * 1024);
  const totalMem = status.system.totalMemory / (1024 * 1024 * 1024);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 bg-gray-800/60 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between shadow-lg border border-purple-700/20"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FaServer className="text-purple-400" />
          <span className="font-bold text-white">Estado:</span>
          <span
            className={`ml-2 px-3 py-1 rounded-full text-xs ${
              status.status === "Operational"
                ? "bg-green-700 text-green-200"
                : "bg-yellow-700 text-yellow-200"
            }`}
          >
            {status.status}
          </span>
        </div>
        <div className="text-gray-400 text-sm">
          <b>API:</b> v{status.meta.apiVersion} | <b>Entorno:</b>{" "}
          {status.meta.environment}
        </div>
        <div className="text-gray-400 text-sm">
          <b>Base de datos:</b>{" "}
          <span
            className={
              status.database.status === "healthy"
                ? "text-green-400"
                : "text-yellow-400"
            }
          >
            {status.database.status}
          </span>{" "}
          <span className="ml-2">({status.database.responseTime})</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="text-center">
          <div className="text-xs text-gray-400">Uptime (horas)</div>
          <div className="text-2xl font-bold text-purple-400">
            <AnimatedNumber value={uptimeHours} decimals={2} />
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Memoria usada (MB)</div>
          <div className="text-2xl font-bold text-purple-400">
            <AnimatedNumber value={usedMem} decimals={1} />
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Memoria total (GB)</div>
          <div className="text-2xl font-bold text-purple-400">
            <AnimatedNumber value={totalMem} decimals={1} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// NUEVO: Tipos para búsqueda avanzada
type FeatureAdv = (typeof features)[number] & { [key: string]: any };

// NUEVO: Utilidad de búsqueda fuzzy simple
function fuzzyMatch(text: string, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    text.toLowerCase().includes(q) ||
    q.split(" ").every((w) => text.toLowerCase().includes(w))
  );
}

// NUEVO: Buscador avanzado con filtros y sugerencias
// Define documentationSections type and value before using it
type DocumentationSection = {
  id: string;
  title: string;
  content: string[];
};

const documentationSections: DocumentationSection[] = [
  {
    id: "overview",
    title: "Visión General",
    content: [
      "Nebura Works es una plataforma API modular diseñada para integrar múltiples servicios con arquitectura escalable y seguridad avanzada.",
      "Componentes independientes que se integran fácilmente.",
      "WebSockets y eventos para interacciones instantáneas.",
      "JWT, rate limiting, CORS y protección contra ataques.",
      "Métricas, logs y alertas en tiempo real.",
    ],
  },
  {
    id: "architecture",
    title: "Arquitectura",
    content: [
      "La arquitectura sigue un patrón modular con un orquestador central que gestiona los diferentes servicios y sus interacciones.",
      "Orquestador Principal: Gestiona el ciclo de vida de todos los módulos y servicios.",
      "Módulos: Componentes independientes que pueden activarse/desactivarse.",
      "Recursos Compartidos: Funcionalidades comunes reutilables entre módulos.",
    ],
  },
  {
    id: "modules",
    title: "Módulos",
    content: [
      "API Server: Servidor HTTP/WebSocket con Express y Socket.IO para APIs REST y comunicación en tiempo real.",
      "Discord Bot: Bot de Discord con carga dinámica de comandos y eventos.",
      "WhatsApp Client: Cliente WhatsApp con registro de mensajes y comandos.",
    ],
  },
  {
    id: "configuration",
    title: "Configuración",
    content: [
      "Configuración flexible mediante archivos YAML/JSON.",
      "Soporte para variables de entorno y perfiles de despliegue.",
    ],
  },
  {
    id: "examples",
    title: "Ejemplos",
    content: [
      "Ejemplo de uso de API Server.",
      "Ejemplo de integración con Discord Bot.",
      "Ejemplo de autenticación JWT.",
    ],
  },
  {
    id: "development",
    title: "Desarrollo",
    content: [
      "Guía para contribuir al proyecto.",
      "Buenas prácticas de desarrollo y pruebas.",
      "Integración continua y despliegue.",
    ],
  },
  {
    id: "support",
    title: "Soporte",
    content: [
      "Enlaces a Discord, GitHub Issues y documentación oficial.",
      "Canales de soporte técnico y comunidad.",
    ],
  },
];

const DocSearch = ({
  features,
  documentationSections,
}: {
  features: FeatureAdv[];
  documentationSections: DocumentationSection[];
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { type: "feature" | "doc"; item: any }[]
  >([]);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [stackFilter, setStackFilter] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Sugerencias rápidas
  const allStacks = Array.from(new Set(features.flatMap((f) => f.stack)));
  const allTypes = Array.from(new Set(features.map((f) => f.type)));

  useEffect(() => {
    // Filtra features
    let filteredFeatures = features.filter((f) => {
      if (typeFilter && f.type !== typeFilter) return false;
      if (stackFilter && !(f.stack as string[]).includes(stackFilter))
        return false;
      const inTitle = fuzzyMatch(f.title, query);
      const inDesc =
        typeof f.description === "string"
          ? fuzzyMatch(f.description, query)
          : false;
      const inStack = (f.stack as string[]).some((s) => fuzzyMatch(s, query));
      return inTitle || inDesc || inStack;
    });

    // Filtra secciones de documentación
    let filteredDocs: typeof results = [];
    if (query) {
      filteredDocs = documentationSections
        .filter(
          (section) =>
            fuzzyMatch(section.title, query) ||
            section.content.some((c) => fuzzyMatch(c, query))
        )
        .map((section) => ({ type: "doc", item: section }));
    }

    // Junta ambos resultados
    const featureResults = filteredFeatures.map((f) => ({
      type: "feature" as const,
      item: f,
    }));
    // Ensure all .type are "feature" or "doc"
    const mergedResults: { type: "feature" | "doc"; item: any }[] = [
      ...featureResults,
      ...filteredDocs.map((doc) => ({ type: "doc" as const, item: doc.item })),
    ];
    setResults(mergedResults);

    // Sugerencias de autocompletado (features + docs)
    if (query.length > 1) {
      const featureTitles = features
        .map((f) => f.title)
        .filter((t) => t.toLowerCase().startsWith(query.toLowerCase()));
      const docTitles = documentationSections
        .map((s) => s.title)
        .filter((t) => t.toLowerCase().startsWith(query.toLowerCase()));
      setSuggestions([...featureTitles, ...docTitles].slice(0, 3));
    } else {
      setSuggestions([]);
    }
    // eslint-disable-next-line
  }, [query, typeFilter, stackFilter, features, documentationSections]);

  return (
    <div className="mb-10 max-w-2xl mx-auto">
      <div className="relative w-full mx-auto">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar módulo, sección, stack, tipo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 border border-purple-700/40 text-gray-200 focus:outline-none focus:border-purple-500 transition-all shadow-md placeholder-gray-400"
          autoComplete="off"
        />
        {/* Sugerencias rápidas */}
        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full bg-gray-900 border border-purple-700/30 rounded-b-xl z-10">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="px-4 py-2 hover:bg-purple-800/30 cursor-pointer text-gray-200"
                onClick={() => setQuery(s)}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 justify-center mt-4 mb-6">
        <span className="text-xs text-gray-400">Filtrar por:</span>
        {allTypes.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(typeFilter === type ? null : type)}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
              typeFilter === type
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-purple-900/30"
            }`}
          >
            {type}
          </button>
        ))}
        {allStacks.map((stack) => (
          <button
            key={stack}
            onClick={() => setStackFilter(stackFilter === stack ? null : stack)}
            className={`px-3 py-1 rounded-full text-xs border font-mono transition ${
              stackFilter === stack
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-pink-900/30"
            }`}
          >
            {stack}
          </button>
        ))}
        {(typeFilter || stackFilter) && (
          <button
            onClick={() => {
              setTypeFilter(null);
              setStackFilter(null);
            }}
            className="px-3 py-1 rounded-full text-xs border border-gray-700 bg-gray-700 text-gray-200 ml-2"
          >
            Limpiar filtros
          </button>
        )}
      </div>
      {/* Resultados */}
      {query && (
        <div className="mt-6">
          <h4 className="text-gray-400 mb-3 font-semibold text-lg flex items-center gap-2">
            <FaSearch className="text-purple-400" /> Resultados:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.length > 0 ? (
              results.map((result, index) =>
                result.type === "feature" ? (
                  <motion.div
                    key={`feature-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-gray-800/80 border border-purple-900/40 hover:border-purple-500/70 transition-all duration-300 shadow-lg group h-full">
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex items-center mb-2 gap-2">
                          {result.item.icon}
                          <span className="font-bold text-white text-lg">
                            {result.item.title}
                          </span>
                          <span className="ml-auto px-2 py-1 rounded-full text-xs bg-gray-900 border border-gray-700 text-gray-400 font-mono">
                            {result.item.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(result.item.stack as string[]).map(
                            (s: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-purple-900/30 text-purple-300 text-xs font-mono"
                              >
                                {s}
                              </span>
                            )
                          )}
                        </div>
                        <div className="text-gray-400">
                          {result.item.description}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`doc-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-gray-900/80 border border-blue-900/40 hover:border-blue-500/70 transition-all duration-300 shadow-lg group h-full">
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex items-center mb-2 gap-2">
                          <FaLink className="text-blue-400 text-2xl" />
                          <span className="font-bold text-white text-lg">
                            {result.item.title}
                          </span>
                          <span className="ml-auto px-2 py-1 rounded-full text-xs bg-gray-900 border border-gray-700 text-blue-400 font-mono">
                            Documentación
                          </span>
                        </div>
                        <div className="text-gray-400">
                          {result.item.content.slice(0, 3).join(" · ")}
                        </div>
                        <a
                          href={`#${result.item.id}`}
                          className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition self-end text-xs"
                        >
                          Ir a sección
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )
            ) : (
              <div className="text-red-400 col-span-full text-center py-8 bg-gray-800/60 rounded-xl border border-red-400/30">
                No se encontraron resultados.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Conversor de Fechas Unix
const UnixDateConverter = () => {
  const [unix, setUnix] = useState(Math.floor(Date.now() / 1000));
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  });

  // Actualiza la fecha cuando cambia el unix
  useEffect(() => {
    const d = new Date(unix * 1000);
    setDate(d.toISOString().slice(0, 16));
  }, [unix]);

  // Actualiza el unix cuando cambia la fecha
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    const d = new Date(e.target.value);
    setUnix(Math.floor(d.getTime() / 1000));
  };

  const handleUnixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setUnix(val);
  };

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-10 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaHistory className="text-purple-400" /> Conversor de Fechas Unix
      </h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-gray-300 mb-2 font-medium">
            Timestamp Unix (segundos)
          </label>
          <input
            type="number"
            value={unix}
            onChange={handleUnixChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-300 mb-2 font-medium">
            Fecha legible (UTC)
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={handleDateChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

// Extiende el tipo Window para incluir 'mermaid'
declare global {
  interface Window {
    mermaid?: {
      initialize: (config: any) => void;
      run: () => void;
    };
  }
}

const FullDocumentation = ({
  version,
  versionLabel,
  versionColor,
}: {
  version: string;
  versionLabel: string;
  versionColor: string;
}) => {
  const mermaidContainerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);

  // Funciones de zoom y reset
  const handleZoom = (factor: number) => {
    if (!mermaidContainerRef.current) return;
    zoomRef.current = Math.max(0.5, Math.min(zoomRef.current * factor, 3));
    mermaidContainerRef.current.style.transform = `scale(${zoomRef.current})`;
    mermaidContainerRef.current.style.transformOrigin = "0 0";
  };
  const handleReset = () => {
    if (!mermaidContainerRef.current) return;
    zoomRef.current = 1;
    mermaidContainerRef.current.style.transform = `scale(1)`;
  };

  // Mermaid code extraído del prompt
  const mermaidCode = `
graph TD

    28044["User<br>External Actor"]
    28045["Main Orchestrator<br>Node.js"]
    28046["WhatsApp Client<br>whatsapp-web.js"]
    subgraph 28005["External Services & Actors"]
        28020["End User<br>External Actor"]
        28021["Discord Platform<br>Discord API"]
        28022["WhatsApp Platform<br>WhatsApp API"]
        28023["AI APIs<br>Google Gemini, etc."]
        28024["Developer &amp; Ops APIs<br>GitHub, PM2, etc."]
        28025["Application Database<br>SQL/SQLite"]
    end
    subgraph 28006["Nebura Client Application"]
        28007["Shared Infrastructure"]
        28008["WhatsApp Integration"]
        28009["Discord Bot"]
        28010["API Server"]
        28011["Main Orchestrator<br>Node.js"]
        %% Edges at this level (grouped by source)
        28008["WhatsApp Integration"] -->|uses| 28007["Shared Infrastructure"]
        28009["Discord Bot"] -->|uses| 28007["Shared Infrastructure"]
        28010["API Server"] -->|uses| 28007["Shared Infrastructure"]
        28011["Main Orchestrator<br>Node.js"] -->|initializes| 28010["API Server"]
        28011["Main Orchestrator<br>Node.js"] -->|initializes| 28009["Discord Bot"]
        28011["Main Orchestrator<br>Node.js"] -->|initializes| 28008["WhatsApp Integration"]
        28011["Main Orchestrator<br>Node.js"] -->|uses| 28007["Shared Infrastructure"]
    end
    subgraph 28026["External Systems"]
        28039["Chat Platforms<br>Discord, WhatsApp APIs"]
        28040["AI APIs<br>Google Gemini, etc."]
        28041["Version Control APIs<br>GitHub API, etc."]
        28042["Databases<br>Prisma, SQLite"]
        28043["Process Management<br>PM2"]
    end
    subgraph 28027["Shared Libraries"]
        28036["Shared Utilities &amp; Classes<br>TypeScript"]
        28037["Data Management &amp; Structure<br>TypeScript/Prisma"]
        28038["App Configuration<br>YAML/JSON"]
        %% Edges at this level (grouped by source)
        28036["Shared Utilities &amp; Classes<br>TypeScript"] -->|reads| 28038["App Configuration<br>YAML/JSON"]
    end
    subgraph 28028["Nebura Discord Bot<br>Discord.js"]
        28033["Discord Client Entry<br>TypeScript"]
        28034["Core Event &amp; Command Handlers<br>TypeScript"]
        28035["Bot Features &amp; Addons<br>TypeScript"]
        %% Edges at this level (grouped by source)
        28033["Discord Client Entry<br>TypeScript"] -->|loads| 28034["Core Event &amp; Command Handlers<br>TypeScript"]
        28034["Core Event &amp; Command Handlers<br>TypeScript"] -->|route to| 28035["Bot Features &amp; Addons<br>TypeScript"]
    end
    subgraph 28029["Nebura API Server<br>Node.js/Express"]
        28030["API Server Entry<br>TypeScript"]
        28031["HTTP Routes<br>TypeScript"]
        28032["Domain Services<br>TypeScript"]
        %% Edges at this level (grouped by source)
        28030["API Server Entry<br>TypeScript"] -->|sets up| 28031["HTTP Routes<br>TypeScript"]
        28031["HTTP Routes<br>TypeScript"] -->|invoke| 28032["Domain Services<br>TypeScript"]
    end
    %% Edges at this level (grouped by source)
    28044["User<br>External Actor"] -->|interacts via API| 28029["Nebura API Server<br>Node.js/Express"]
    28044["User<br>External Actor"] -->|interacts via Discord| 28028["Nebura Discord Bot<br>Discord.js"]
    28044["User<br>External Actor"] -->|interacts via WhatsApp| 28046["WhatsApp Client<br>whatsapp-web.js"]
    28045["Main Orchestrator<br>Node.js"] -->|initializes| 28029["Nebura API Server<br>Node.js/Express"]
    28045["Main Orchestrator<br>Node.js"] -->|initializes| 28028["Nebura Discord Bot<br>Discord.js"]
    28045["Main Orchestrator<br>Node.js"] -->|initializes| 28046["WhatsApp Client<br>whatsapp-web.js"]
    28045["Main Orchestrator<br>Node.js"] -->|uses| 28036["Shared Utilities &amp; Classes<br>TypeScript"]
    28045["Main Orchestrator<br>Node.js"] -->|uses for backups| 28037["Data Management &amp; Structure<br>TypeScript/Prisma"]
    28033["Discord Client Entry<br>TypeScript"] -->|uses| 28036["Shared Utilities &amp; Classes<br>TypeScript"]
    28035["Bot Features &amp; Addons<br>TypeScript"] -->|interact with| 28039["Chat Platforms<br>Discord, WhatsApp APIs"]
    28035["Bot Features &amp; Addons<br>TypeScript"] -->|use| 28036["Shared Utilities &amp; Classes<br>TypeScript"]
    28035["Bot Features &amp; Addons<br>TypeScript"] -->|access data via| 28037["Data Management &amp; Structure<br>TypeScript/Prisma"]
    28035["Bot Features &amp; Addons<br>TypeScript"] -->|managed by| 28043["Process Management<br>PM2"]
    28046["WhatsApp Client<br>whatsapp-web.js"] -->|uses| 28036["Shared Utilities &amp; Classes<br>TypeScript"]
    28046["WhatsApp Client<br>whatsapp-web.js"] -->|interacts with| 28039["Chat Platforms<br>Discord, WhatsApp APIs"]
    28037["Data Management &amp; Structure<br>TypeScript/Prisma"] -->|persists to| 28042["Databases<br>Prisma, SQLite"]
    28008["WhatsApp Integration"] -->|connects to| 28022["WhatsApp Platform<br>WhatsApp API"]
    28009["Discord Bot"] -->|connects to| 28021["Discord Platform<br>Discord API"]
    28009["Discord Bot"] -->|manages processes via| 28024["Developer &amp; Ops APIs<br>GitHub, PM2, etc."]
    28010["API Server"] -->|calls| 28023["AI APIs<br>Google Gemini, etc."]
    28010["API Server"] -->|integrates with| 28024["Developer &amp; Ops APIs<br>GitHub, PM2, etc."]
    28020["End User<br>External Actor"] -->|interacts via HTTP| 28010["API Server"]
    28020["End User<br>External Actor"] -->|interacts via Discord| 28009["Discord Bot"]
    28020["End User<br>External Actor"] -->|interacts via WhatsApp| 28008["WhatsApp Integration"]
    28007["Shared Infrastructure"] -->|persists to/reads from| 28025["Application Database<br>SQL/SQLite"]
    28007["Shared Infrastructure"] -->|sends notifications to| 28021["Discord Platform<br>Discord API"]
    28007["Shared Infrastructure"] -->|interacts with| 28024["Developer &amp; Ops APIs<br>GitHub, PM2, etc."]
    28032["Domain Services<br>TypeScript"] -->|use| 28036["Shared Utilities &amp; Classes<br>TypeScript"]
    28032["Domain Services<br>TypeScript"] -->|access data via| 28037["Data Management &amp; Structure<br>TypeScript/Prisma"]
    28032["Domain Services<br>TypeScript"] -->|calls| 28040["AI APIs<br>Google Gemini, etc."]
    28032["Domain Services<br>TypeScript"] -->|calls| 28041["Version Control APIs<br>GitHub API, etc."]
`;

  // Cargar Mermaid solo una vez al montar
  useEffect(() => {
    // Cargar script de Mermaid si no está presente
    if (!window.mermaid) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js";
      script.async = true;
      script.onload = () => {
        if (window.mermaid) {
          window.mermaid.initialize({ startOnLoad: false, theme: "dark" });
          window.mermaid.run();
        }
      };
      document.body.appendChild(script);
    } else {
      window.mermaid.initialize({ startOnLoad: false, theme: "dark" });
      window.mermaid.run();
    }
  }, []);

  return (
    <section className="mb-20">
      <div className="bg-gray-900/80 rounded-2xl p-8 shadow-xl border border-purple-900/30 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Documentación Completa
              </span>
            </h2>
            <p className="text-lg text-purple-200">
              Plataforma API modular para integración de servicios
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold bg-${versionColor}-900 text-${versionColor}-200 border border-${versionColor}-500`}
            >
              v{version} - {versionLabel}
            </span>
            <div className="flex gap-2">
              <a
                href="https://github.com/Hiroshi025/Nebura-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-1"
              >
                <FaGithub /> Repositorio
              </a>
              <a
                href="https://help.hiroshi-dev.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-900/50 hover:bg-blue-800/50 rounded-lg text-sm flex items-center gap-1"
              >
                <FaLink /> Help Center
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de navegación */}
          <div className="lg:col-span-1 bg-gray-800/50 rounded-xl p-4 border border-gray-700 h-fit sticky top-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaCodeBranch className="text-purple-400" />
              Contenidos
            </h3>
            <nav className="space-y-2">
              {[
                { id: "overview", label: "Visión General", icon: <FaSearch /> },
                {
                  id: "architecture",
                  label: "Arquitectura",
                  icon: <FaServer />,
                },
                { id: "modules", label: "Módulos", icon: <FaCodeBranch /> },
                {
                  id: "configuration",
                  label: "Configuración",
                  icon: <FaKey />,
                },
                { id: "examples", label: "Ejemplos", icon: <FaHistory /> },
                { id: "development", label: "Desarrollo", icon: <FaGithub /> },
                { id: "support", label: "Soporte", icon: <FaDiscord /> },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white"
                >
                  <span className="text-purple-400">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Sección Visión General */}
            <section id="overview" className="mb-12 scroll-mt-20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaSearch className="text-purple-400" />
                Visión General del Proyecto
              </h3>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-300 mb-4">
                  Nebura Works es una plataforma API modular diseñada para
                  integrar múltiples servicios con arquitectura escalable y
                  seguridad avanzada.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Arquitectura Modular",
                      desc: "Componentes independientes que se integran fácilmente",
                      icon: <FaCodeBranch className="text-blue-400 text-xl" />,
                    },
                    {
                      title: "Comunicación en Tiempo Real",
                      desc: "WebSockets y eventos para interacciones instantáneas",
                      icon: <FaServer className="text-green-400 text-xl" />,
                    },
                    {
                      title: "Seguridad Avanzada",
                      desc: "JWT, rate limiting, CORS y protección contra ataques",
                      icon: <FaShieldAlt className="text-yellow-400 text-xl" />,
                    },
                    {
                      title: "Monitoreo Integrado",
                      desc: "Métricas, logs y alertas en tiempo real",
                      icon: <FaHistory className="text-purple-400 text-xl" />,
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 flex items-start gap-3"
                    >
                      {feature.icon}
                      <div>
                        <h4 className="font-bold text-white">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Sección Arquitectura */}
            <section id="architecture" className="mb-12 scroll-mt-20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaServer className="text-purple-400" />
                Arquitectura del Sistema
              </h3>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-300 mb-6">
                  La arquitectura sigue un patrón modular con un orquestador
                  central que gestiona los diferentes servicios y sus
                  interacciones.
                </p>

                {/* Diagrama Mermaid Mejorado */}
                <div className="bg-gray-900 rounded-xl p-4 my-6 border border-purple-800/30 overflow-x-auto relative">
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button
                      onClick={() => handleZoom(1.2)}
                      className="p-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-xs"
                      title="Acercar"
                    >
                      <FaSearchPlus />
                    </button>
                    <button
                      onClick={() => handleZoom(1 / 1.2)}
                      className="p-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-xs"
                      title="Alejar"
                    >
                      <FaSearchMinus />
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
                      title="Resetear zoom"
                    >
                      <FaExpand />
                    </button>
                  </div>

                  <div
                    ref={mermaidContainerRef}
                    className="mermaid"
                    style={{
                      minWidth: "800px",
                      minHeight: "600px",
                      transition: "transform 0.2s",
                      cursor: "grab",
                    }}
                  >
                    {`
flowchart TD
    subgraph External["Servicios Externos"]
        DiscordAPI["Discord API"]
        WhatsAppAPI["WhatsApp API"]
        GeminiAPI["Google Gemini API"]
        GitHubAPI["GitHub API"]
        Database["Base de Datos"]
    end
    
    subgraph Core["Núcleo Nebura"]
        Orchestrator[("Orquestador Principal<br><small>Node.js/TypeScript</small>")]
        
        subgraph Modules["Módulos"]
            APIServer["API Server<br><small>Express/Socket.IO</small>"]
            DiscordBot["Bot Discord<br><small>discord.js</small>"]
            WhatsAppClient["Cliente WhatsApp<br><small>whatsapp-web.js</small>"]
        end
        
        subgraph Shared["Recursos Compartidos"]
            Utilities["Utilidades<br><small>Logger, Config</small>"]
            DataLayer["Capa de Datos<br><small>Prisma/ORM</small>"]
            Security["Seguridad<br><small>JWT, Rate Limiting</small>"]
        end
    end
    
    %% Conexiones
    Orchestrator --> APIServer
    Orchestrator --> DiscordBot
    Orchestrator --> WhatsAppClient
    
    APIServer --> Utilities
    APIServer --> DataLayer
    APIServer --> Security
    
    DiscordBot --> Utilities
    DiscordBot --> DataLayer
    WhatsAppClient --> Utilities
    
    APIServer -.-> GeminiAPI
    APIServer -.-> GitHubAPI
    DiscordBot -.-> DiscordAPI
    WhatsAppClient -.-> WhatsAppAPI
    DataLayer -.-> Database
    
    %% Estilos
    classDef external fill:#2d3748,stroke:#4a5568,color:#e2e8f0;
    classDef core fill:#1a365d,stroke:#2c5282,color:#bee3f8;
    classDef modules fill:#4c1d95,stroke:#6b46c1,color:#e9d8fd;
    classDef shared fill:#5f370e,stroke:#975a16,color:#feebc8;
    
    class External external
    class Core core
    class Modules modules
    class Shared shared
                `}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-white mb-2">
                      Orquestador Principal
                    </h4>
                    <p className="text-sm text-gray-400">
                      Gestiona el ciclo de vida de todos los módulos y
                      servicios.
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-bold text-white mb-2">Módulos</h4>
                    <p className="text-sm text-gray-400">
                      Componentes independientes que pueden
                      activarse/desactivarse.
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-bold text-white mb-2">
                      Recursos Compartidos
                    </h4>
                    <p className="text-sm text-gray-400">
                      Funcionalidades comunes reutilizables entre módulos.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección Módulos */}
            <section id="modules" className="mb-12 scroll-mt-20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaCodeBranch className="text-purple-400" />
                Módulos Principales
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "API Server",
                    icon: <FaServer className="text-blue-400 text-2xl" />,
                    description:
                      "Servidor HTTP/WebSocket con Express y Socket.IO para APIs REST y comunicación en tiempo real.",
                    features: [
                      "Documentación Swagger automática",
                      "Autenticación JWT y OAuth2",
                      "Rate limiting y protección CORS",
                      "Métricas de rendimiento integradas",
                    ],
                    example: `import { APIServer } from '@nebura/core';
const server = new APIServer();
server.start();`,
                  },
                  {
                    title: "Discord Bot",
                    icon: <FaDiscord className="text-purple-400 text-2xl" />,
                    description:
                      "Bot de Discord con carga dinámica de comandos y eventos.",
                    features: [
                      "Hot-reload de comandos",
                      "Sistema de permisos avanzado",
                      "Integración con API Server",
                      "Logging detallado",
                    ],
                    example: `client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) return;
  // Manejo de comandos
});`,
                  },
                  {
                    title: "WhatsApp Client",
                    icon: <FaWhatsapp className="text-green-400 text-2xl" />,
                    description:
                      "Cliente WhatsApp con registro de mensajes y comandos.",
                    features: [
                      "Autenticación QR persistente",
                      "Backup automático de chats",
                      "Integración con base de datos",
                      "Comandos administrativos",
                    ],
                    example: `client.on('message', (msg) => {
  if (msg.body === '!status') {
    msg.reply('Sistema operativo');
  }
});`,
                  },
                ].map((module, i) => (
                  <div
                    key={i}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {module.icon}
                      <div>
                        <h4 className="text-xl font-bold text-white">
                          {module.title}
                        </h4>
                        <p className="text-gray-400">{module.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-300 mb-2">
                          Características:
                        </h5>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                          {module.features.map((feat, j) => (
                            <li key={j}>{feat}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-300 mb-2">
                          Ejemplo:
                        </h5>
                        <pre className="bg-gray-900 rounded p-3 text-xs overflow-x-auto">
                          {module.example}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Otras secciones (Configuración, Ejemplos, etc.) */}
            {/* ... (mantener estructura similar a las secciones anteriores) ... */}

            {/* Sección Soporte */}
            <section id="support" className="mb-12 scroll-mt-20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FaDiscord className="text-purple-400" />
                Soporte y Enlaces
              </h3>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">
                      Documentación Oficial
                    </h4>
                    <div className="space-y-2">
                      {[
                        {
                          name: "Documentación API",
                          url: "https://api.nebura.example/docs",
                          icon: <FaServer />,
                        },
                        {
                          name: "Guía Discord",
                          url: "https://docs.nebura.example/discord",
                          icon: <FaDiscord />,
                        },
                        {
                          name: "Guía WhatsApp",
                          url: "https://docs.nebura.example/whatsapp",
                          icon: <FaWhatsapp />,
                        },
                        {
                          name: "TypeDoc",
                          url: "https://docs.nebura.example/typedoc",
                          icon: <FaCodeBranch />,
                        },
                      ].map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <span className="text-purple-400">{doc.icon}</span>
                          <span>{doc.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-3">
                      Soporte Técnico
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h5 className="font-bold text-white mb-1">Discord</h5>
                        <p className="text-sm text-gray-400">
                          Únete a nuestro servidor para soporte en tiempo real.
                        </p>
                        <a
                          href="#"
                          className="text-blue-400 text-sm hover:underline mt-2 inline-block"
                        >
                          Unirse al servidor
                        </a>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg border-l-4 border-green-500">
                        <h5 className="font-bold text-white mb-1">
                          GitHub Issues
                        </h5>
                        <p className="text-sm text-gray-400">
                          Reporta bugs o solicita nuevas características.
                        </p>
                        <a
                          href="https://github.com/Hiroshi025/Nebura-AI/issues"
                          className="text-green-400 text-sm hover:underline mt-2 inline-block"
                        >
                          Abrir issue
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

function getJsonStats(obj: any) {
  let keys = 0,
    arrays = 0,
    objects = 0,
    maxDepth = 0;
  function walk(o: any, depth: number) {
    if (Array.isArray(o)) {
      arrays++;
      maxDepth = Math.max(maxDepth, depth);
      o.forEach((v) => walk(v, depth + 1));
    } else if (o && typeof o === "object") {
      objects++;
      maxDepth = Math.max(maxDepth, depth);
      for (const k in o) {
        keys++;
        walk(o[k], depth + 1);
      }
    }
  }
  walk(obj, 1);
  return { keys, arrays, objects, maxDepth };
}

// Utilidad para convertir JSON a CSV plano (solo arrays de objetos)
function jsonToCsv(json: any): string {
  if (!Array.isArray(json)) return "";
  if (json.length === 0) return "";
  const keys = Object.keys(json[0]);
  const csvRows = [
    keys.join(","),
    ...json.map((row) =>
      keys.map((k) => JSON.stringify(row[k] ?? "")).join(",")
    ),
  ];
  return csvRows.join("\n");
}

// Utilidad para convertir CSV a JSON (simple)
function csvToJson(csv: string): any[] {
  const [header, ...lines] = csv.trim().split(/\r?\n/);
  const keys = header.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    const obj: any = {};
    keys.forEach((k, i) => (obj[k] = JSON.parse(values[i] || '""')));
    return obj;
  });
}

// Utilidad para detectar tipos de valores en JSON
function getJsonTypes(obj: any, types = new Set<string>()) {
  if (Array.isArray(obj)) {
    types.add("array");
    obj.forEach((v) => getJsonTypes(v, types));
  } else if (obj && typeof obj === "object") {
    types.add("object");
    Object.values(obj).forEach((v) => getJsonTypes(v, types));
  } else {
    types.add(typeof obj);
  }
  return Array.from(types);
}

const JsonValidator = () => {
  const [input, setInput] = useState("{\n  \n}");
  const [result, setResult] = useState<{
    valid: boolean;
    error?: string;
    line?: number;
    suggestion?: string;
    stats?: {
      keys: number;
      arrays: number;
      objects: number;
      maxDepth: number;
      size: number;
      uniqueKeys: number;
      types: string[];
    };
    parsed?: any;
  }>({
    valid: true,
    stats: {
      keys: 0,
      arrays: 0,
      objects: 0,
      maxDepth: 0,
      size: 0,
      uniqueKeys: 0,
      types: [],
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const notify = useNotification();

  // NUEVO: Estados para conversiones y formato
  const [yamlValue, setYamlValue] = useState("");
  const [csvValue, setCsvValue] = useState("");
  const [base64Value, setBase64Value] = useState("");
  const [formatMode, setFormatMode] = useState<"pretty" | "compact">("pretty");

  // NUEVO: Estado para el convertidor activo (solo para los 3 convertidores)
  const [activeConverter, setActiveConverter] = useState<
    "yaml" | "base64" | "csv"
  >("yaml");

  // Utilidad para obtener estadísticas avanzadas
  function getJsonStatsAdv(obj: any) {
    let keys = 0,
      arrays = 0,
      objects = 0,
      maxDepth = 0;
    const keySet = new Set<string>();
    function walk(o: any, depth: number) {
      if (Array.isArray(o)) {
        arrays++;
        maxDepth = Math.max(maxDepth, depth);
        o.forEach((v) => walk(v, depth + 1));
      } else if (o && typeof o === "object") {
        objects++;
        maxDepth = Math.max(maxDepth, depth);
        for (const k in o) {
          keys++;
          keySet.add(k);
          walk(o[k], depth + 1);
        }
      }
    }
    walk(obj, 1);
    return {
      keys,
      arrays,
      objects,
      maxDepth,
      uniqueKeys: keySet.size,
      types: getJsonTypes(obj),
    };
  }

  // NUEVO: Validación y conversión
  function validateJson(str: string) {
    try {
      const parsed = JSON.parse(str);
      const stats = getJsonStatsAdv(parsed);
      const size = new Blob([str]).size;
      setResult({ valid: true, stats: { ...stats, size }, parsed });
      // Conversiones automáticas
      setYamlValue(yaml.dump(parsed));
      setBase64Value(btoa(unescape(encodeURIComponent(str))));
      setCsvValue(Array.isArray(parsed) ? jsonToCsv(parsed) : "");
    } catch (e: any) {
      // Busca línea del error
      let line = 1;
      const m = /at position (\d+)/.exec(e.message);
      if (m) {
        const pos = parseInt(m[1]);
        line = str.slice(0, pos).split("\n").length;
      }
      let suggestion =
        "Revisa la sintaxis JSON. Usa comillas dobles, separa con comas y verifica llaves/corchetes.";
      if (/Unexpected token/.test(e.message))
        suggestion =
          "Puede que falte una coma, comillas o haya un carácter inesperado.";
      if (/Unexpected end/.test(e.message))
        suggestion = "Parece que falta cerrar una llave, corchete o comillas.";
      setResult({ valid: false, error: e.message, line, suggestion });
      setYamlValue("");
      setBase64Value("");
      setCsvValue("");
    }
  }

  // NUEVO: Formatear JSON
  const handleFormat = (mode: "pretty" | "compact") => {
    if (!result.valid || !result.parsed) return;
    setInput(
      mode === "pretty"
        ? JSON.stringify(result.parsed, null, 2)
        : JSON.stringify(result.parsed)
    );
    setFormatMode(mode);
  };

  // NUEVO: Minificar/Beautify YAML
  const handleYamlFormat = (pretty: boolean) => {
    if (!result.valid || !result.parsed) return;
    setYamlValue(
      pretty
        ? yaml.dump(result.parsed)
        : yaml.dump(result.parsed, { indent: 0, flowLevel: -1 })
    );
  };

  // NUEVO: Copiar utilidades
  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    notify({ message: "¡Copiado al portapapeles!", type: "success" });
  };

  // NUEVO: Descargar archivo
  const downloadFile = (
    content: string,
    filename: string,
    type = "text/plain"
  ) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    notify({ message: `Descargado: ${filename}`, type: "info" });
  };

  // NUEVO: Importar archivo
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
      notify({ message: "Archivo importado correctamente.", type: "success" });
    };
    reader.readAsText(file);
  };

  // NUEVO: Convertir YAML/Base64/CSV a JSON
  const handleYamlToJson = () => {
    try {
      const obj = yaml.load(yamlValue);
      setInput(JSON.stringify(obj, null, 2));
      notify({ message: "YAML convertido a JSON.", type: "success" });
    } catch (e) {
      notify({ message: "YAML inválido", type: "error" });
    }
  };
  const handleBase64ToJson = () => {
    try {
      const str = decodeURIComponent(escape(atob(base64Value)));
      setInput(str);
      notify({ message: "Base64 convertido a JSON.", type: "success" });
    } catch (e) {
      notify({ message: "Base64 inválido", type: "error" });
    }
  };
  const handleCsvToJson = () => {
    try {
      const arr = csvToJson(csvValue);
      setInput(JSON.stringify(arr, null, 2));
      notify({ message: "CSV convertido a JSON.", type: "success" });
    } catch (e) {
      notify({ message: "CSV inválido", type: "error" });
    }
  };

  useEffect(() => {
    validateJson(input);
    // eslint-disable-next-line
  }, [input]);

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaCodeBranch className="text-purple-400" /> Validador y Herramientas
        JSON
      </h3>
      {/* --- Validador JSON SIEMPRE visible --- */}
      <div className="mb-4">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none resize-vertical"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Pega aquí tu código JSON..."
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleFormat("pretty")}
          className="px-3 py-1 bg-purple-700 text-white rounded text-xs"
        >
          Formatear
        </button>
        <button
          onClick={() => handleFormat("compact")}
          className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-xs"
        >
          Minificar
        </button>
        <button
          onClick={() => setInput("")}
          className="px-3 py-1 bg-red-700 text-white rounded text-xs"
        >
          Limpiar
        </button>
        <button
          onClick={() => copyToClipboard(input)}
          className="px-3 py-1 bg-blue-700 text-white rounded text-xs"
        >
          Copiar JSON
        </button>
        <button
          onClick={() => downloadFile(input, "data.json", "application/json")}
          className="px-3 py-1 bg-green-700 text-white rounded text-xs"
        >
          Descargar JSON
        </button>
        <label className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-xs cursor-pointer">
          Importar
          <input
            type="file"
            accept=".json,.txt"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
      {result.valid ? (
        <div className="bg-green-900/40 border border-green-700 rounded-lg p-4 text-green-200 mb-6">
          <b>JSON válido.</b>
          <div className="mt-2 text-sm grid grid-cols-2 gap-2">
            <span>
              Claves totales: <b>{result.stats?.keys}</b>
            </span>
            <span>
              Claves únicas: <b>{result.stats?.uniqueKeys}</b>
            </span>
            <span>
              Objetos: <b>{result.stats?.objects}</b>
            </span>
            <span>
              Arrays: <b>{result.stats?.arrays}</b>
            </span>
            <span>
              Profundidad máxima: <b>{result.stats?.maxDepth}</b>
            </span>
            <span>
              Tamaño: <b>{result.stats?.size} bytes</b>
            </span>
            <span>
              Tipos: <b>{result.stats?.types?.join(", ")}</b>
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 text-red-200 mb-6">
          <b>Error de sintaxis:</b> {result.error}
          <br />
          <span>
            Línea: <b>{result.line}</b>
          </span>
          <br />
          <span>Sugerencia: {result.suggestion}</span>
        </div>
      )}

      {/* --- Menú de paginación SOLO para los convertidores --- */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveConverter("yaml")}
          className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
            activeConverter === "yaml"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-purple-900/30"
          }`}
        >
          YAML
        </button>
        <button
          onClick={() => setActiveConverter("base64")}
          className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
            activeConverter === "base64"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-purple-900/30"
          }`}
        >
          Base64
        </button>
        <button
          onClick={() => setActiveConverter("csv")}
          className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
            activeConverter === "csv"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-purple-900/30"
          }`}
        >
          CSV
        </button>
      </div>

      {/* SOLO muestra el convertidor activo */}
      {activeConverter === "yaml" && (
        <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700 flex flex-col md:col-span-2 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-purple-300">YAML</span>
            <button
              onClick={() => handleYamlFormat(true)}
              className="px-2 py-0.5 text-xs bg-purple-700 text-white rounded"
            >
              Beautify
            </button>
            <button
              onClick={() => handleYamlFormat(false)}
              className="px-2 py-0.5 text-xs bg-gray-700 text-gray-200 rounded"
            >
              Minify
            </button>
            <button
              onClick={() => copyToClipboard(yamlValue)}
              className="px-2 py-0.5 text-xs bg-blue-700 text-white rounded"
            >
              Copiar
            </button>
            <button
              onClick={() => downloadFile(yamlValue, "data.yaml", "text/yaml")}
              className="px-2 py-0.5 text-xs bg-green-700 text-white rounded"
            >
              Descargar
            </button>
            <button
              onClick={handleYamlToJson}
              className="px-2 py-0.5 text-xs bg-pink-700 text-white rounded"
            >
              YAML → JSON
            </button>
          </div>
          <textarea
            value={yamlValue}
            onChange={(e) => setYamlValue(e.target.value)}
            className="w-full h-24 md:h-32 px-2 py-1 rounded bg-gray-800 text-gray-200 font-mono text-xs mb-1"
            spellCheck={false}
            placeholder="YAML convertido"
          />
        </div>
      )}
      {activeConverter === "base64" && (
        <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700 flex flex-col md:col-span-2 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-purple-300">Base64</span>
            <button
              onClick={() => copyToClipboard(base64Value)}
              className="px-2 py-0.5 text-xs bg-blue-700 text-white rounded"
            >
              Copiar
            </button>
            <button
              onClick={() =>
                downloadFile(base64Value, "data.b64", "text/plain")
              }
              className="px-2 py-0.5 text-xs bg-green-700 text-white rounded"
            >
              Descargar
            </button>
            <button
              onClick={handleBase64ToJson}
              className="px-2 py-0.5 text-xs bg-pink-700 text-white rounded"
            >
              Base64 → JSON
            </button>
          </div>
          <textarea
            value={base64Value}
            onChange={(e) => setBase64Value(e.target.value)}
            className="w-full h-24 md:h-32 px-2 py-1 rounded bg-gray-800 text-gray-200 font-mono text-xs mb-1"
            spellCheck={false}
            placeholder="Base64 convertido"
          />
        </div>
      )}
      {activeConverter === "csv" && (
        <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700 flex flex-col md:col-span-2 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-purple-300">CSV</span>
            <button
              onClick={() => copyToClipboard(csvValue)}
              className="px-2 py-0.5 text-xs bg-blue-700 text-white rounded"
            >
              Copiar
            </button>
            <button
              onClick={() => downloadFile(csvValue, "data.csv", "text/csv")}
              className="px-2 py-0.5 text-xs bg-green-700 text-white rounded"
            >
              Descargar
            </button>
            <button
              onClick={handleCsvToJson}
              className="px-2 py-0.5 text-xs bg-pink-700 text-white rounded"
            >
              CSV → JSON
            </button>
          </div>
          <textarea
            value={csvValue}
            onChange={(e) => setCsvValue(e.target.value)}
            className="w-full h-24 md:h-32 px-2 py-1 rounded bg-gray-800 text-gray-200 font-mono text-xs mb-1"
            spellCheck={false}
            placeholder="CSV convertido (solo arrays de objetos)"
          />
        </div>
      )}
    </div>
  );
};

// NUEVAS HERRAMIENTAS AVANZADAS

// Tester de Expresiones Regulares
const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setError(null);
      if (!pattern) {
        setMatches([]);
        return;
      }
      const regex = new RegExp(pattern, flags);
      const found = Array.from(testString.matchAll(regex)).map((m) => m[0]);
      setMatches(found);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaCodeBranch className="text-purple-400" /> Tester de Expresiones
        Regulares
      </h3>
      <div className="mb-3 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-gray-300 mb-1 font-medium">
            Expresión Regular
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            placeholder="Ej: ^[a-zA-Z0-9]+$"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1 font-medium">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
            className="w-20 px-2 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            maxLength={6}
            placeholder="gim"
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-gray-300 mb-1 font-medium">
          Texto de Prueba
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full h-24 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
          placeholder="Introduce el texto a analizar..."
        />
      </div>
      {error ? (
        <div className="bg-red-900/40 border border-red-700 rounded-lg p-3 text-red-200 mb-2">
          <b>Error:</b> {error}
        </div>
      ) : (
        <div className="bg-green-900/40 border border-green-700 rounded-lg p-3 text-green-200 mb-2">
          <b>Coincidencias encontradas:</b> {matches.length}
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {matches.map((m, i) => (
              <span
                key={i}
                className="bg-gray-900 px-2 py-1 rounded text-purple-300 font-mono break-all"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="text-xs text-gray-400 mt-2">
        Soporta flags: g (global), i (insensible a mayúsculas), m (multilínea),
        s (dotAll), u (unicode), y (sticky).
      </div>
    </div>
  );
};

// Conversor de Color (HEX, RGB, HSL, Copiar, Vista previa)
const ColorConverter = () => {
  const [hex, setHex] = useState("#4f46e5");
  const [rgb, setRgb] = useState("79,70,229");
  const [hsl, setHsl] = useState("241,75%,59%");
  const [inputMode, setInputMode] = useState<"hex" | "rgb" | "hsl">("hex");
  const notify = useNotification();

  // Utilidades de conversión
  function hexToRgb(hex: string) {
    let c = hex.replace("#", "");
    if (c.length === 3)
      c = c
        .split("")
        .map((x) => x + x)
        .join("");
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  function rgbToHex(r: number, g: number, b: number) {
    return (
      "#" +
      [r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  }
  function rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }
  function hslToRgb(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
    ];
  }

  // Sincroniza valores al cambiar input
  useEffect(() => {
    try {
      if (inputMode === "hex") {
        const rgbArr = hexToRgb(hex);
        setRgb(rgbArr.join(","));
        if (rgbArr.length === 3) {
          setHsl(rgbToHsl(rgbArr[0], rgbArr[1], rgbArr[2]).join(",") + "%");
        }
      } else if (inputMode === "rgb") {
        const rgbArr = rgb.split(",").map(Number);
        if (rgbArr.length === 3 && rgbArr.every((n) => !isNaN(n))) {
          setHex(rgbToHex(rgbArr[0], rgbArr[1], rgbArr[2]));
          setHsl(rgbToHsl(rgbArr[0], rgbArr[1], rgbArr[2]).join(",") + "%");
        }
      } else if (inputMode === "hsl") {
        const [h, s, l] = hsl.replace("%", "").split(",").map(Number);
        const rgbArr = hslToRgb(h, s, l);
        setRgb(rgbArr.join(","));
        setHex(rgbToHex(...(rgbArr as [number, number, number])));
      }
    } catch {
      // ignore errors
    }
    // eslint-disable-next-line
  }, [hex, rgb, hsl, inputMode]);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    notify({ message: "¡Copiado al portapapeles!", type: "success" });
  };

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaPalette className="text-purple-400" /> Conversor de Color
      </h3>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setInputMode("hex")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            inputMode === "hex"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          HEX
        </button>
        <button
          onClick={() => setInputMode("rgb")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            inputMode === "rgb"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          RGB
        </button>
        <button
          onClick={() => setInputMode("hsl")}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
            inputMode === "hsl"
              ? "bg-purple-700 text-white border-purple-700"
              : "bg-gray-700 text-gray-300 border-gray-700"
          }`}
        >
          HSL
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-300 mb-1 font-medium">HEX</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => {
              setHex(e.target.value);
              setInputMode("hex");
            }}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            maxLength={7}
          />
          <button
            onClick={() => copy(hex)}
            className="mt-1 text-xs text-blue-400 hover:underline"
          >
            Copiar
          </button>
        </div>
        <div>
          <label className="block text-gray-300 mb-1 font-medium">RGB</label>
          <input
            type="text"
            value={rgb}
            onChange={(e) => {
              setRgb(e.target.value);
              setInputMode("rgb");
            }}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            placeholder="Ej: 79,70,229"
          />
          <button
            onClick={() => copy(`rgb(${rgb})`)}
            className="mt-1 text-xs text-blue-400 hover:underline"
          >
            Copiar
          </button>
        </div>
        <div>
          <label className="block text-gray-300 mb-1 font-medium">HSL</label>
          <input
            type="text"
            value={hsl}
            onChange={(e) => {
              setHsl(e.target.value);
              setInputMode("hsl");
            }}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            placeholder="Ej: 241,75%,59%"
          />
          <button
            onClick={() => copy(`hsl(${hsl})`)}
            className="mt-1 text-xs text-blue-400 hover:underline"
          >
            Copiar
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div
          className="w-16 h-16 rounded-lg border-2 border-purple-700"
          style={{ background: hex }}
          title={hex}
        ></div>
        <span className="text-gray-400 text-xs">Vista previa</span>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Convierte entre HEX, RGB y HSL. Copia cualquier formato y visualiza el
        color.
      </div>
    </div>
  );
};

// Analizador de Headers HTTP
const HttpHeadersAnalyzer = () => {
  const [rawHeaders, setRawHeaders] = useState("");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [summary, setSummary] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    const lines = rawHeaders.split(/\r?\n/).filter(Boolean);
    const parsed: { key: string; value: string }[] = [];
    lines.forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > 0) {
        parsed.push({
          key: line.slice(0, idx).trim(),
          value: line.slice(idx + 1).trim(),
        });
      }
    });
    setHeaders(parsed);

    // Resumen avanzado
    const sum: { [k: string]: string } = {};
    parsed.forEach(({ key, value }) => {
      const k = key.toLowerCase();
      if (k === "content-type") sum["Tipo de Contenido"] = value;
      if (k === "content-length") sum["Tamaño"] = value + " bytes";
      if (k === "server") sum["Servidor"] = value;
      if (k === "set-cookie") sum["Cookies"] = value;
      if (k === "x-powered-by") sum["X-Powered-By"] = value;
      if (k === "date") sum["Fecha"] = value;
      if (k === "cache-control") sum["Cache"] = value;
      if (k === "location") sum["Redirección"] = value;
      if (k === "strict-transport-security") sum["HSTS"] = value;
    });
    setSummary(sum);
  }, [rawHeaders]);

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaRegListAlt className="text-purple-400" /> Analizador de Headers HTTP
      </h3>
      <div className="mb-3">
        <label className="block text-gray-300 mb-1 font-medium">
          Headers HTTP (pega aquí)
        </label>
        <textarea
          value={rawHeaders}
          onChange={(e) => setRawHeaders(e.target.value)}
          className="w-full h-32 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
          placeholder={`Ejemplo:\nContent-Type: application/json\nServer: nginx\nSet-Cookie: sessionid=abc123; Path=/`}
        />
      </div>
      {headers.length > 0 && (
        <div className="mb-3">
          <h4 className="font-bold text-gray-200 mb-2">Headers Analizados:</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs bg-gray-900 rounded-lg">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left text-purple-400">Clave</th>
                  <th className="px-2 py-1 text-left text-purple-400">Valor</th>
                </tr>
              </thead>
              <tbody>
                {headers.map((h, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1 text-gray-300 font-mono">
                      {h.key}
                    </td>
                    <td className="px-2 py-1 text-gray-400 font-mono break-all">
                      {h.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {Object.keys(summary).length > 0 && (
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700 mt-2">
          <h5 className="font-bold text-gray-300 mb-1">Resumen:</h5>
          <ul className="list-disc list-inside text-gray-400">
            {Object.entries(summary).map(([k, v], i) => (
              <li key={i}>
                <b>{k}:</b> {v}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="text-xs text-gray-400 mt-2">
        Analiza headers HTTP, detecta información clave y muestra resumen útil.
      </div>
    </div>
  );
};

export default function DocumentationPage() {
  const router = useRouter();
  const [isKeyGeneratorOpen, setIsKeyGeneratorOpen] = useState(false);
  const [isJsonValidatorOpen, setIsJsonValidatorOpen] = useState(false);
  // NUEVO: Estados para los nuevos diálogos de herramientas
  const [isUnixConverterOpen, setIsUnixConverterOpen] = useState(false);
  const [isQrGeneratorOpen, setIsQrGeneratorOpen] = useState(false);
  const [isWebhookTesterOpen, setIsWebhookTesterOpen] = useState(false);
  const [isRegexTesterOpen, setIsRegexTesterOpen] = useState(false);
  const [isMinecraftToolsOpen, setIsMinecraftToolsOpen] = useState(false);
  const [isColorConverterOpen, setIsColorConverterOpen] = useState(false);
  const [isHeadersAnalyzerOpen, setIsHeadersAnalyzerOpen] = useState(false);
  const [isCodePlaygroundOpen, setIsCodePlaygroundOpen] = useState(false);
  const [isCommandEditorOpen, setIsCommandEditorOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [keyType, setKeyType] = useState("license");
  const [keyLength, setKeyLength] = useState(32);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("features");
  const [selectedSecurityVersion, setSelectedSecurityVersion] = useState(
    securityVersions[0]
  );
  const notify = useNotification();

  // NUEVO: Opciones para contraseñas
  const [pwOptions, setPwOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  // NUEVO: Payload editable para JWT

  const [jwtPayload, setJwtPayload] = useState(
    JSON.stringify(
      {
        sub: "user_id",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      null,
      2
    )
  );

  // NUEVO: Estado de fuerza de contraseña
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
  }>({ score: 0, label: "Débil", color: "red" });

  // NUEVO: Función para evaluar fuerza de contraseña
  function evaluatePasswordStrength(pw: string) {
    let score = 0;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 20) score++;
    let label = "Débil",
      color = "red";
    if (score >= 5) {
      label = "Muy fuerte";
      color = "green";
    } else if (score >= 4) {
      label = "Fuerte";
      color = "limegreen";
    } else if (score >= 3) {
      label = "Media";
      color = "orange";
    }
    setPasswordStrength({ score, label, color });
  }

  // NUEVO: Generador de contraseñas
  function generatePassword(length: number, opts: typeof pwOptions) {
    let chars = "";
    if (opts.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (opts.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (opts.numbers) chars += "0123456789";
    if (opts.symbols) chars += "!@#$%^&*()-_=+[]{};:,.<>/?";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
    let pw = Array(length)
      .fill(0)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join("");
    return pw;
  }

  // MEJORADO: Generador de claves
  const generateKey = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    if (keyType === "license") {
      // Formato: XXXX-XXXX-XXXX-XXXX (personalizable)
      let groups = Math.ceil(keyLength / 4);
      let arr = [];
      for (let g = 0; g < groups; g++) {
        let part = "";
        for (let i = 0; i < 4; i++) {
          part += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        arr.push(part);
      }
      result = arr.join("-");
    } else if (keyType === "jwt") {
      // Formato JWT (header.payload.signature)
      let header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(
        /=+$/,
        ""
      );
      let payload = "";
      try {
        payload = btoa(jwtPayload).replace(/=+$/, "");
      } catch {
        payload = btoa(
          JSON.stringify({
            sub: "user_id",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
          })
        ).replace(/=+$/, "");
      }
      const signature = Array(keyLength)
        .fill(0)
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("");
      result = `${header}.${payload}.${signature}`;
    } else if (keyType === "password") {
      // NUEVO: Contraseña
      result = generatePassword(keyLength, pwOptions);
      evaluatePasswordStrength(result);
    } else {
      // API key simple
      result = Array(keyLength)
        .fill(0)
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("");
    }

    setGeneratedKey(result);
    if (keyType === "password") evaluatePasswordStrength(result);
  };

  // NUEVO: Actualiza fuerza al editar manualmente la contraseña
  useEffect(() => {
    if (keyType === "password") evaluatePasswordStrength(generatedKey);
    // eslint-disable-next-line
  }, [generatedKey]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setIsCopied(true);
    notify({ message: "¡Copiado al portapapeles!", type: "success" });
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    generateKey();
    // eslint-disable-next-line
  }, [keyType, keyLength, pwOptions, jwtPayload]);

  // NUEVO: Selección de versión de documentación (solo muestra la estable)
  const currentDocVersion =
    documentationVersions.find((v) => !v.deprecated) ||
    documentationVersions[0];

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200 overflow-x-hidden">
      {/* Header profesional */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-20 px-4 bg-gradient-to-br from-gray-900 to-purple-900/70 relative"
      >
        {/* ...existing animated background... */}
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Documentación del Proyecto
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8"
          >
            Este proyecto es una API modular que integra múltiples servicios
            como Discord, WhatsApp, GitHub, Google AI, y más.
          </motion.p>
          {/* Tabs principales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => setActiveTab("features")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "features"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              <FaServer className="inline mr-2" /> Funcionalidades
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "security"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              <FaShieldAlt className="inline mr-2" /> Seguridad
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "docs"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              <FaLink className="inline mr-2" /> Enlaces de Documentación
            </button>
            {/* Herramientas: agrupadas en un solo botón */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all flex items-center gap-2">
                  <FaCodeBranch className="inline mr-2" /> Herramientas
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem
                  onClick={() => setIsJsonValidatorOpen(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <FaCodeBranch className="mr-2" /> Validador de JSON
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsKeyGeneratorOpen(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <FaKey className="mr-2" /> Generador de Claves
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsUnixConverterOpen(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <FaHistory className="mr-2" /> Conversor Unix
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsQrGeneratorOpen(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <FaWhatsapp className="mr-2" /> Generador de QR
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsWebhookTesterOpen(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <FaLink className="mr-2" /> Tester de Webhooks
                </DropdownMenuItem>
                {/* NUEVAS HERRAMIENTAS */}
                <DropdownMenuItem
                  onClick={() => setIsRegexTesterOpen(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <FaCodeBranch className="mr-2" /> Tester de Regex
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsColorConverterOpen(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <FaPalette className="mr-2" /> Conversor de Color
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsHeadersAnalyzerOpen(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <FaRegListAlt className="mr-2" /> Analizador de Headers HTTP
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsCodePlaygroundOpen(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <FaCodeBranch className="mr-2" /> Playground de Código
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsCommandEditorOpen(true)}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <FaDiscord className="mr-2" /> Simulador de Comandos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </motion.header>
      {/* NUEVO: Sección de Herramientas profesionales */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <SystemStatus />
        </div>
      </section>
      {/* NUEVO: Sección de Documentación y Buscador */}
      <section className="py-10 px-4 bg-gray-950/80">
        <div className="container mx-auto max-w-6xl">
          <DocSearch
            features={features}
            documentationSections={documentationSections}
          />
          {/* Documentación completa siempre visible aquí */}
          <FullDocumentation
            version={currentDocVersion.version}
            versionLabel={currentDocVersion.label}
            versionColor={currentDocVersion.color}
          />
        </div>
      </section>
      {/* Main Content: Tabs para funcionalidades, seguridad y enlaces */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            {activeTab === "features" && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Funcionalidades Principales */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                      Funcionalidades Principales
                    </span>
                  </h2>
                  <p className="text-gray-400 mb-8">
                    A continuación, mostramos algunas de las principales
                    funciones del proyecto que puedes explorar:
                    <br />
                    <br />
                    <strong>Nota:</strong> Algunas funcionalidades pueden
                    requerir permisos especiales o configuraciones adicionales.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-gray-800/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/70 transition-all duration-300 overflow-hidden group h-full">
                          <CardContent className="p-6 h-full flex flex-col">
                            <div className="flex items-center mb-4">
                              {feature.icon}
                              <h3 className="text-xl font-bold text-white ml-3 group-hover:text-purple-400 transition-colors">
                                {feature.title}
                              </h3>
                            </div>

                            <div className="text-gray-400 flex-grow">
                              {feature.description}
                            </div>

                            <div className="mt-6 flex justify-between items-center">
                              <button
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                                onClick={() =>
                                  router.push(
                                    `/docs/${feature.title.toLowerCase()}`
                                  )
                                }
                              >
                                Ver más
                              </button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition">
                                    <FaLink className="inline mr-2" /> Docs
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                                  {feature.docs.map((doc, i) => (
                                    <DropdownMenuItem
                                      key={i}
                                      className="hover:bg-gray-700 cursor-pointer"
                                      onClick={() =>
                                        window.open(doc.url, "_blank")
                                      }
                                    >
                                      {doc.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Seguridad */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-600">
                      Seguridad
                    </span>
                  </h2>
                  <p className="text-gray-400 mb-8">
                    La seguridad es una prioridad en nuestro proyecto. A
                    continuación, se detallan nuestras políticas y prácticas de
                    seguridad:
                  </p>

                  {/* Selector de versiones */}
                  <div className="mb-8 bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <FaHistory className="mr-2" /> Historial de Versiones de
                      Seguridad
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      {securityVersions.map((version) => (
                        <button
                          key={version.version}
                          onClick={() => setSelectedSecurityVersion(version)}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedSecurityVersion.version === version.version
                              ? "border-purple-500 bg-gray-700/50"
                              : "border-gray-700 hover:border-gray-600"
                          }`}
                        >
                          <div className="flex items-center">
                            <FaCodeBranch
                              className={`mr-2 ${
                                version.status === "stable"
                                  ? "text-green-400"
                                  : "text-yellow-400"
                              }`}
                            />
                            <span className="font-mono font-bold">
                              {version.version}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {version.date}
                          </div>
                        </button>
                      ))}
                    </div>
                    {selectedSecurityVersion && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gray-900/50 p-6 rounded-lg border border-gray-700"
                      >
                        <h4 className="text-xl font-bold text-white mb-3 flex items-center">
                          <FaShieldAlt className="mr-2" />
                          Versión {selectedSecurityVersion.version} -{" "}
                          {selectedSecurityVersion.date}
                          <span
                            className={`ml-auto px-3 py-1 rounded-full text-xs ${
                              selectedSecurityVersion.status === "stable"
                                ? "bg-green-700 text-green-200"
                                : "bg-yellow-700 text-yellow-200"
                            }`}
                          >
                            {selectedSecurityVersion.status === "stable"
                              ? "Estable"
                              : "Deprecada"}
                          </span>
                        </h4>
                        <ul className="list-disc list-inside text-gray-300">
                          {selectedSecurityVersion.changes.map((change, i) => (
                            <li key={i}>{change}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Enlaces de Documentación */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600">
                      Enlaces de Documentación
                    </span>
                  </h2>
                  <p className="text-gray-400 mb-8">
                    Accede rápidamente a la documentación de cada módulo y
                    servicio.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className="bg-gray-800/50 border-purple-900/50 hover:border-purple-500/70 transition-all duration-300 overflow-hidden group h-full">
                          <CardContent className="p-6 h-full flex flex-col">
                            <div className="flex items-center mb-4">
                              {feature.icon}
                              <h3 className="text-xl font-bold text-white ml-3 group-hover:text-purple-400 transition-colors">
                                {feature.title}
                              </h3>
                            </div>
                            <div className="text-gray-400 flex-grow">
                              {feature.description}
                            </div>
                            <div className="mt-6 flex flex-wrap gap-2">
                              {feature.docs.map((doc, i) => (
                                <a
                                  key={i}
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                                >
                                  {doc.name}
                                </a>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 Nebura. Todos los derechos reservados.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              <FaDiscord className="inline mr-1" /> Soporte en Discord
            </a>
            <a
              href="https://github.com/Hiroshi025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              <FaGithub className="inline mr-1" /> Contribuir en GitHub
            </a>
          </div>
        </div>
      </footer>
      {/* Dialogos para herramientas */}
      <Dialog open={isKeyGeneratorOpen} onOpenChange={setIsKeyGeneratorOpen}>
        <DialogContent className="max-w-lg mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Generador de Claves
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Selecciona el tipo de clave y longitud, luego haz clic en
              "Generar".
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Clave
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setKeyType("license")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  keyType === "license"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
              >
                <FaKey className="text-xl" />
                Licencia
              </button>
              <button
                onClick={() => setKeyType("jwt")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  keyType === "jwt"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
              >
                <FaShieldAlt className="text-xl" />
                JWT
              </button>
              {/* NUEVO: Opción contraseña */}
              <button
                onClick={() => setKeyType("password")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  keyType === "password"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
              >
                <FaKey className="text-xl" />
                Contraseña
              </button>
            </div>
          </div>

          {/* NUEVO: Opciones para contraseña */}
          {keyType === "password" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Opciones de Contraseña
              </label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={pwOptions.uppercase}
                    onChange={(e) =>
                      setPwOptions((o) => ({
                        ...o,
                        uppercase: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-gray-200">Mayúsculas</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={pwOptions.lowercase}
                    onChange={(e) =>
                      setPwOptions((o) => ({
                        ...o,
                        lowercase: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-gray-200">Minúsculas</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={pwOptions.numbers}
                    onChange={(e) =>
                      setPwOptions((o) => ({ ...o, numbers: e.target.checked }))
                    }
                  />
                  <span className="text-gray-200">Números</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={pwOptions.symbols}
                    onChange={(e) =>
                      setPwOptions((o) => ({ ...o, symbols: e.target.checked }))
                    }
                  />
                  <span className="text-gray-200">Símbolos</span>
                </label>
              </div>
            </div>
          )}

          {/* NUEVO: Payload editable para JWT */}
          {keyType === "jwt" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payload (JSON)
              </label>
              <textarea
                value={jwtPayload}
                onChange={(e) => setJwtPayload(e.target.value)}
                className="w-full h-24 px-4 py-2 bg-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none resize-none"
              />
              <span className="text-xs text-gray-400">
                Puedes personalizar el contenido del payload.
              </span>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Longitud de la Clave
            </label>
            <input
              type="number"
              min={keyType === "jwt" ? 16 : 8}
              max={keyType === "jwt" ? 128 : 64}
              step="4"
              value={keyLength}
              onChange={(e) =>
                setKeyLength(
                  Math.min(
                    keyType === "jwt" ? 128 : 64,
                    Math.max(
                      keyType === "jwt" ? 16 : 8,
                      parseInt(e.target.value)
                    )
                  )
                )
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={generateKey}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <FaRandom className="text-xl" />
              Generar
            </button>

            <button
              onClick={copyToClipboard}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isCopied
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              {isCopied ? (
                <FiCheck className="text-xl" />
              ) : (
                <FiCopy className="text-xl" />
              )}
              {isCopied ? "Copiado" : "Copiar"}
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {keyType === "password"
                ? "Contraseña Generada"
                : keyType === "license"
                ? "Licencia Generada"
                : keyType === "jwt"
                ? "JWT Generado"
                : "Clave Generada"}
            </label>
            <textarea
              value={generatedKey}
              readOnly
              className="w-full h-24 px-4 py-2 bg-gray-700 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none resize-none"
            />
            {/* NUEVO: Indicador de fuerza de contraseña */}
            {keyType === "password" && (
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="h-3 w-24 rounded-full"
                  style={{
                    background: passwordStrength.color,
                    opacity: 0.7,
                  }}
                ></div>
                <span
                  className="text-sm font-bold"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {passwordStrength.score <= 2
                    ? "Recomendado: Usa más longitud, símbolos y mezcla de caracteres."
                    : passwordStrength.score === 3
                    ? "Aceptable, pero puedes mejorar la seguridad."
                    : "¡Excelente seguridad!"}
                </span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* NUEVO: Dialogo para el validador de JSON */}
      <Dialog open={isJsonValidatorOpen} onOpenChange={setIsJsonValidatorOpen}>
        <DialogContent className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Validador de JSON
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Pega tu código JSON para validarlo y obtener estadísticas.
            </DialogDescription>
          </DialogHeader>
          <JsonValidator />
        </DialogContent>
      </Dialog>
      {/* NUEVO: Dialogo para Conversor Unix */}
      <Dialog open={isUnixConverterOpen} onOpenChange={setIsUnixConverterOpen}>
        <DialogContent className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Conversor de Fechas Unix
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Convierte entre timestamp Unix y fecha legible.
            </DialogDescription>
          </DialogHeader>
          <UnixDateConverter />
        </DialogContent>
      </Dialog>
      {/* NUEVO: Dialogo para Generador de QR */}
      <Dialog open={isQrGeneratorOpen} onOpenChange={setIsQrGeneratorOpen}>
        <DialogContent className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Generador de QR
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Genera códigos QR fácilmente.
            </DialogDescription>
          </DialogHeader>
          <QrGenerator />
        </DialogContent>
      </Dialog>
      {/* NUEVO: Dialogo para Tester de Webhooks */}
      <Dialog open={isWebhookTesterOpen} onOpenChange={setIsWebhookTesterOpen}>
        <DialogContent className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Tester de Webhooks
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Prueba y depura endpoints de Webhooks.
            </DialogDescription>
          </DialogHeader>
          <WebhookTester />
        </DialogContent>
      </Dialog>
      {/* NUEVO: Dialogo para Tester de Regex */}
      <Dialog open={isRegexTesterOpen} onOpenChange={setIsRegexTesterOpen}>
        <DialogContent className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Tester de Expresiones Regulares
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Prueba y depura expresiones regulares en tiempo real.
            </DialogDescription>
          </DialogHeader>
          <RegexTester />
        </DialogContent>
      </Dialog>
      {/* NUEVO: Dialogo para Conversor de Color */}
      <Dialog
        open={isColorConverterOpen}
        onOpenChange={setIsColorConverterOpen}
      >
        <DialogContent className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Conversor de Color
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Convierte entre HEX, RGB y HSL. Copia y visualiza colores.
            </DialogDescription>
          </DialogHeader>
          <ColorConverter />
        </DialogContent>
      </Dialog>
      {/* NUEVO: Dialogo para Analizador de Headers HTTP */}
      <Dialog
        open={isHeadersAnalyzerOpen}
        onOpenChange={setIsHeadersAnalyzerOpen}
      >
        <DialogContent className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Analizador de Headers HTTP
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Analiza y resume headers HTTP de peticiones y respuestas.
            </DialogDescription>
          </DialogHeader>
          <HttpHeadersAnalyzer />
        </DialogContent>
      </Dialog>
      // Diálogo para Playground de Código
      <Dialog
        open={isCodePlaygroundOpen}
        onOpenChange={setIsCodePlaygroundOpen}
      >
        <DialogContent className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Playground de Código API
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Prueba fragmentos de código JavaScript para interactuar con APIs.
            </DialogDescription>
          </DialogHeader>
          <CodePlayground />
        </DialogContent>
      </Dialog>
      // Diálogo para Live Editor de Comandos
      <Dialog open={isCommandEditorOpen} onOpenChange={setIsCommandEditorOpen}>
        <DialogContent className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Live Editor de Comandos
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Simula y prueba comandos de Discord y WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <CommandLiveEditor />
        </DialogContent>
      </Dialog>
    </main>
  );
}
