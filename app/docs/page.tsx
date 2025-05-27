"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaCodeBranch,
  FaDiscord,
  FaGithub,
  FaGoogle,
  FaHistory,
  FaKey,
  FaLink,
  FaRandom,
  FaSearch,
  FaServer,
  FaShieldAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { FiCheck, FiCopy } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
const DocSearch = ({ features }: { features: FeatureAdv[] }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(features);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [stackFilter, setStackFilter] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Sugerencias rápidas
  const allStacks = Array.from(new Set(features.flatMap((f) => f.stack)));
  const allTypes = Array.from(new Set(features.map((f) => f.type)));

  useEffect(() => {
    let filtered = features.filter((f) => {
      // Filtro por tipo
      if (typeFilter && f.type !== typeFilter) return false;
      // Filtro por stack
      if (stackFilter && !(f.stack as string[]).includes(stackFilter))
        return false;
      // Búsqueda avanzada
      const inTitle = fuzzyMatch(f.title, query);
      const inDesc =
        typeof f.description === "string"
          ? fuzzyMatch(f.description, query)
          : false;
      const inStack = (f.stack as string[]).some((s) => fuzzyMatch(s, query));
      return inTitle || inDesc || inStack;
    });
    setResults(filtered);

    // Sugerencias de autocompletado
    if (query.length > 1) {
      const sug = features
        .map((f) => f.title)
        .filter((t) => t.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 3);
      setSuggestions(sug);
    } else {
      setSuggestions([]);
    }
    // eslint-disable-next-line
  }, [query, typeFilter, stackFilter, features]);

  return (
    <div className="mb-10">
      <div className="relative w-full md:w-2/3 mx-auto">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-lg pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar módulo, stack, tipo..."
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
      {(query || typeFilter || stackFilter) && (
        <div className="mt-6">
          <h4 className="text-gray-400 mb-3 font-semibold text-lg flex items-center gap-2">
            <FaSearch className="text-purple-400" /> Resultados:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.length > 0 ? (
              results.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-gray-800/80 border border-purple-900/40 hover:border-purple-500/70 transition-all duration-300 shadow-lg group h-full">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center mb-2 gap-2">
                        {feature.icon}
                        <span className="font-bold text-white text-lg">
                          {feature.title}
                        </span>
                        <span className="ml-auto px-2 py-1 rounded-full text-xs bg-gray-900 border border-gray-700 text-gray-400 font-mono">
                          {feature.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(feature.stack as string[]).map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-purple-900/30 text-purple-300 text-xs font-mono"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="text-gray-400">{feature.description}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
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
    <div className="bg-gray-800/60 rounded-xl p-6 mb-10 shadow-lg border border-purple-700/20 max-w-xl mx-auto">
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

export default function DocumentationPage() {
  const router = useRouter();
  const [isKeyGeneratorOpen, setIsKeyGeneratorOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [keyType, setKeyType] = useState("license");
  const [keyLength, setKeyLength] = useState(32);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("features");
  const [selectedSecurityVersion, setSelectedSecurityVersion] = useState(
    securityVersions[0]
  );

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
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    generateKey();
    // eslint-disable-next-line
  }, [keyType, keyLength, pwOptions, jwtPayload]);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200 overflow-x-hidden">
      {/* Header animado */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-20 px-4 bg-gradient-to-br from-gray-900 to-purple-900/70 relative"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: ["-50%", "150%"],
              y: ["-50%", "50%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-[200%] h-[200%] bg-gradient-radial from-purple-500/10 to-transparent opacity-20"
          />
        </div>

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

            <button
              onClick={() => setIsKeyGeneratorOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <FaKey className="inline mr-2" /> Generador de Claves
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* Estado del sistema y buscador */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <SystemStatus />
          <UnixDateConverter /> {/* <-- Agrega esta línea aquí */}
          <DocSearch features={features} />
        </div>
      </section>

      {/* Main Content */}
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

      {/* Dialogo Generador de Claves */}
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
    </main>
  );
}
