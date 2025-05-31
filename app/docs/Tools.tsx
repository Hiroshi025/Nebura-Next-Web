import { useEffect, useState } from "react";
import {
	FaCodeBranch, FaDiscord, FaHistory, FaPlay, FaSave, FaTrash, FaWhatsapp
} from "react-icons/fa";
import { FiCopy, FiExternalLink, FiSettings } from "react-icons/fi";

import { useNotification } from "@/components/NotificationContext";

// Tipos para TypeScript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type RequestHistoryItem = {
  id: string;
  method: HttpMethod;
  url: string;
  code: string;
  timestamp: number;
  response?: string;
};

// Ejemplos de código según método
const codeExamples: Record<HttpMethod, string> = {
  GET: `// Ejemplo: Petición HTTP GET
try {
  const response = await fetch(url, { 
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Agrega más headers si es necesario
    }
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const data = await response.json();
  console.log(data);
  return data;
} catch (error) {
  console.error('Error en la petición:', error);
  throw error;
}`,
  POST: `// Ejemplo: Petición HTTP POST
try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      // Agrega más headers si es necesario
    },
    body: JSON.stringify({ 
      title: 'foo',
      body: 'bar',
      userId: 1
    })
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const data = await response.json();
  console.log(data);
  return data;
} catch (error) {
  console.error('Error en la petición:', error);
  throw error;
}`,
  PUT: `// Ejemplo: Petición HTTP PUT
try {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      // Agrega más headers si es necesario
    },
    body: JSON.stringify({ 
      id: 1,
      title: 'foo',
      body: 'bar',
      userId: 1
    })
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const data = await response.json();
  console.log(data);
  return data;
} catch (error) {
  console.error('Error en la petición:', error);
  throw error;
}`,
  DELETE: `// Ejemplo: Petición HTTP DELETE
try {
  const response = await fetch(url, { 
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // Agrega más headers si es necesario
    }
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  // DELETE a menudo no devuelve contenido
  if (response.status !== 204) {
    const data = await response.json();
    console.log(data);
    return data;
  }
  
  console.log('Eliminado exitosamente');
  return { status: 'success', code: response.status };
} catch (error) {
  console.error('Error en la petición:', error);
  throw error;
}`,
  PATCH: `// Ejemplo: Petición HTTP PATCH
try {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      // Agrega más headers si es necesario
    },
    body: JSON.stringify({ 
      title: 'foo actualizado'
    })
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const data = await response.json();
  console.log(data);
  return data;
} catch (error) {
  console.error('Error en la petición:', error);
  throw error;
}`,
};

export const CodePlayground = () => {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  const [code, setCode] = useState(codeExamples["GET"]);
  const [headers, setHeaders] = useState<Record<string, string>>({
    "Content-Type": "application/json",
  });
  const [showHeaders, setShowHeaders] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [settings, setSettings] = useState({
    autoSave: true,
    timeout: 5000,
    showLineNumbers: true,
  });
  const [activeTab, setActiveTab] = useState<"editor" | "response">("editor");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  const notify = useNotification();

  // Cargar historial desde localStorage al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem("apiPlaygroundHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedSettings = localStorage.getItem("apiPlaygroundSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Guardar historial cuando cambia
  useEffect(() => {
    if (settings.autoSave) {
      localStorage.setItem("apiPlaygroundHistory", JSON.stringify(history));
    }
  }, [history, settings.autoSave]);

  // Actualizar el código de ejemplo al cambiar el método
  useEffect(() => {
    setCode(codeExamples[method]);
  }, [method]);

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value as HttpMethod);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleHeaderChange = (key: string, value: string) => {
    setHeaders((prev) => {
      const newHeaders = { ...prev };
      if (value === "") {
        delete newHeaders[key];
      } else {
        newHeaders[key] = value;
      }
      return newHeaders;
    });
  };

  const addNewHeader = () => {
    setHeaders((prev) => ({ ...prev, "": "" }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    notify({ message: "¡Código copiado!", type: "success" });
  };

  const saveRequestToHistory = (responseData?: string) => {
    const newHistoryItem: RequestHistoryItem = {
      id: Date.now().toString(),
      method,
      url,
      code,
      timestamp: Date.now(),
      response: responseData,
    };

    setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]); // Limitar a 50 items
  };

  const loadRequestFromHistory = (item: RequestHistoryItem) => {
    setMethod(item.method);
    setUrl(item.url);
    setCode(item.code);
    setOutput(item.response || "");
    setShowHistory(false);
    notify({ message: "Petición cargada del historial", type: "info" });
  };

  const clearHistory = () => {
    setHistory([]);
    notify({ message: "Historial borrado", type: "info" });
  };

  const executeCode = async () => {
    setIsLoading(true);
    setOutput("");
    setResponseTime(null);
    setResponseStatus(null);

    try {
      const startTime = performance.now();

      // Crear función asíncrona con el código
      const asyncFunction = new Function(
        "fetch",
        "url",
        "method",
        "headers",
        `
        return (async () => {
          ${code}
        })()
      `
      );

      // Implementación segura de fetch con timeout
      const safeFetch = async (input: RequestInfo, init?: RequestInit) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          settings.timeout
        );

        try {
          const finalInit = {
            ...init,
            method: method,
            headers: {
              ...headers,
              ...init?.headers,
            },
            signal: controller.signal,
          };

          const response = await fetch(input, finalInit);
          clearTimeout(timeoutId);

          setResponseStatus(response.status);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          throw new Error(
            `Fetch error: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      };

      const result = await asyncFunction(safeFetch, url, method, headers);
      const endTime = performance.now();
      setResponseTime(endTime - startTime);

      // Formatear la salida
      const formattedOutput =
        typeof result === "undefined"
          ? "Sin resultado. ¿Olvidaste retornar o imprimir algo?"
          : typeof result === "string"
          ? result
          : JSON.stringify(result, null, 2);

      setOutput(formattedOutput);

      // Guardar en historial si autoSave está activado
      if (settings.autoSave) {
        saveRequestToHistory(formattedOutput);
      }
    } catch (error) {
      let errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes("Failed to fetch")) {
        errorMsg +=
          "\n\nPosibles causas:\n- La URL no es válida o el servidor no responde.\n- Restricciones de CORS: El servidor no permite peticiones desde este origen.\n- Problemas de red o conexión.\n\nSolución: Verifica la URL, revisa la consola del navegador para más detalles o prueba con otra API pública.";
      }
      setOutput(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const prettifyCode = () => {
    try {
      // Esto es una simplificación - en una app real usarías una librería como prettier
      const formatted = code
        .replace(/\;\s+/g, ";\n")
        .replace(/\{\s+/g, "{\n")
        .replace(/\}\s+/g, "\n}\n")
        .replace(/\n\s+\n/g, "\n");

      setCode(formatted);
      notify({ message: "Código formateado", type: "success" });
    } catch (error) {
      notify({ message: "Error al formatear el código", type: "error" });
    }
  };

  const exportRequest = () => {
    const data = {
      method,
      url,
      code,
      headers,
      createdAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `api-request-${method}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FaCodeBranch className="text-purple-400" /> API Playground
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1 bg-gray-700 text-gray-200 rounded-lg flex items-center gap-1 text-sm"
          >
            <FaHistory /> Historial
          </button>
          <button
            onClick={() => setShowHeaders(!showHeaders)}
            className="px-3 py-1 bg-gray-700 text-gray-200 rounded-lg flex items-center gap-1 text-sm"
          >
            <FiSettings /> Headers
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="mb-4 bg-gray-900/80 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-white">Historial de Peticiones</h4>
            <button
              onClick={clearHistory}
              className="px-2 py-1 bg-red-600/30 text-red-300 rounded text-xs flex items-center gap-1"
            >
              <FaTrash size={12} /> Limpiar
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay historial guardado</p>
            ) : (
              <ul className="space-y-2">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="bg-gray-800/50 p-2 rounded cursor-pointer hover:bg-gray-700/50"
                    onClick={() => loadRequestFromHistory(item)}
                  >
                    <div className="flex justify-between">
                      <span
                        className={`font-mono text-xs ${
                          item.method === "GET"
                            ? "text-green-400"
                            : item.method === "POST"
                            ? "text-yellow-400"
                            : item.method === "PUT"
                            ? "text-blue-400"
                            : item.method === "DELETE"
                            ? "text-red-400"
                            : "text-purple-400"
                        }`}
                      >
                        {item.method}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm truncate">
                      {item.url}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {showHeaders && (
        <div className="mb-4 bg-gray-900/80 rounded-lg p-4">
          <h4 className="font-bold text-white mb-2">Headers de la Petición</h4>
          <div className="space-y-2">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => handleHeaderChange(key, e.target.value)}
                  placeholder="Header name"
                  className="flex-1 px-2 py-1 bg-gray-700 text-gray-200 rounded text-sm"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleHeaderChange(key, e.target.value)}
                  placeholder="Header value"
                  className="flex-1 px-2 py-1 bg-gray-700 text-gray-200 rounded text-sm"
                />
              </div>
            ))}
            <button
              onClick={addNewHeader}
              className="px-2 py-1 bg-gray-700 text-gray-200 rounded text-sm flex items-center gap-1"
            >
              + Añadir Header
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-2">
        <select
          value={method}
          onChange={handleMethodChange}
          className="px-3 py-2 bg-gray-700 text-gray-200 rounded-lg"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>

        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg"
          placeholder="https://api.example.com/endpoint"
        />

        <button
          onClick={executeCode}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">↻</span> Ejecutando...
            </>
          ) : (
            <>
              <FaPlay /> Ejecutar
            </>
          )}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-300 font-medium">Código JavaScript</label>
          <div className="flex gap-2">
            <button
              onClick={prettifyCode}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs flex items-center gap-1"
            >
              Formatear
            </button>
            <button
              onClick={exportRequest}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs flex items-center gap-1"
            >
              <FaSave size={12} /> Exportar
            </button>
            <button
              onClick={copyToClipboard}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs flex items-center gap-1"
            >
              <FiCopy size={12} /> Copiar
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 px-4 py-2 rounded-lg bg-gray-900 text-gray-200 font-mono text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none resize-none"
          spellCheck={false}
        />
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 ${
              activeTab === "editor"
                ? "bg-gray-800 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("editor")}
          >
            Editor
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "response"
                ? "bg-gray-800 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("response")}
          >
            Respuesta
          </button>
        </div>

        {activeTab === "editor" ? (
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-gray-300 font-medium">
                Previsualización del Código
              </h4>
              <button
                onClick={() => {
                  setCode(codeExamples[method]);
                  notify({
                    message: "Código de ejemplo cargado",
                    type: "info",
                  });
                }}
                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
              >
                Resetear Ejemplo
              </button>
            </div>
            <pre className="w-full h-32 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 font-mono text-sm overflow-auto">
              {code || "// Escribe tu código aquí..."}
            </pre>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-gray-300 font-medium">Respuesta</h4>
              <div className="flex gap-2">
                {responseStatus && (
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      responseStatus >= 200 && responseStatus < 300
                        ? "bg-green-900/50 text-green-400"
                        : responseStatus >= 400
                        ? "bg-red-900/50 text-red-400"
                        : "bg-blue-900/50 text-blue-400"
                    }`}
                  >
                    Status: {responseStatus}
                  </span>
                )}
                {responseTime && (
                  <span className="text-gray-400 text-xs">
                    Tiempo: {responseTime.toFixed(2)}ms
                  </span>
                )}
              </div>
            </div>
            <pre className="w-full max-h-96 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 font-mono text-sm overflow-auto whitespace-pre-wrap">
              {output || "Los resultados aparecerán aquí..."}
            </pre>
            {output && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(output);
                    notify({ message: "Respuesta copiada", type: "success" });
                  }}
                  className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs flex items-center gap-1"
                >
                  <FiCopy size={12} /> Copiar Respuesta
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <p>
              <b>Nota:</b> Este playground ejecuta código JavaScript en un
              entorno seguro.
            </p>
            <p className="mt-1">
              Ejemplos: fetch(), async/await, manejo de respuestas JSON.
            </p>
          </div>
          <button
            onClick={() => window.open(url, "_blank")}
            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs flex items-center gap-1"
          >
            <FiExternalLink size={12} /> Abrir URL
          </button>
        </div>
      </div>
    </div>
  );
};

// Live Editor para probar comandos de Discord/WhatsApp
export const CommandLiveEditor = () => {
  const [platform, setPlatform] = useState<"discord" | "whatsapp">("discord");
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<
    Array<{ command: string; response: string }>
  >([]);
  const notify = useNotification();

  // Simulador de comandos
  const simulateCommand = async () => {
    if (!command.trim()) {
      notify({ message: "Introduce un comando", type: "warning" });
      return;
    }

    setIsLoading(true);
    setResponse("");

    try {
      // Simular retraso de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      let simulatedResponse = "";

      if (platform === "discord") {
        // Simular respuestas de Discord
        if (command.startsWith("!help")) {
          simulatedResponse =
            "📝 **Lista de comandos disponibles:**\n- !help: Muestra esta ayuda\n- !status: Estado del servidor\n- !userinfo [usuario]: Información del usuario";
        } else if (command.startsWith("!status")) {
          simulatedResponse =
            "🟢 **Estado del servidor:** Operativo\n👥 Usuarios conectados: 42\n📶 Latencia: 28ms";
        } else if (command.startsWith("!userinfo")) {
          simulatedResponse =
            "👤 **Información de usuario:**\nNombre: UsuarioEjemplo\nID: 123456789\nRegistrado: 15/10/2023\nRoles: Miembro, Premium";
        } else {
          simulatedResponse =
            "❌ Comando no reconocido. Escribe !help para ver los comandos disponibles.";
        }
      } else {
        // Simular respuestas de WhatsApp
        if (command.startsWith("/ayuda")) {
          simulatedResponse =
            "📌 *Comandos disponibles:*\n- /ayuda: Muestra esta ayuda\n- /estado: Estado del servicio\n- /info: Información del grupo";
        } else if (command.startsWith("/estado")) {
          simulatedResponse =
            "✅ *Estado del servicio:* Funcionando normalmente\n🕒 Última actualización: Ahora mismo";
        } else if (command.startsWith("/info")) {
          simulatedResponse =
            "📋 *Información del grupo:*\nNombre: Grupo de Prueba\nCreado: 01/01/2023\nMiembros: 25\nAdministradores: 3";
        } else {
          simulatedResponse =
            "⚠️ Comando no reconocido. Envía /ayuda para ver los comandos disponibles.";
        }
      }

      setResponse(simulatedResponse);
      setHistory((prev) => [
        ...prev.slice(-4),
        { command, response: simulatedResponse },
      ]);
    } catch (error) {
      setResponse(
        `Error al procesar el comando: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      notify({ message: "Respuesta copiada!", type: "success" });
    }
  };

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-2 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaCodeBranch className="text-purple-400" /> Live Editor de Comandos
      </h3>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setPlatform("discord")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            platform === "discord"
              ? "bg-purple-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          <FaDiscord /> Discord
        </button>
        <button
          onClick={() => setPlatform("whatsapp")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            platform === "whatsapp"
              ? "bg-green-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
        >
          <FaWhatsapp /> WhatsApp
        </button>
      </div>

      <div className="mb-4">
        <label className="text-gray-300 font-medium mb-2 block">
          Comando {platform === "discord" ? "de Discord" : "de WhatsApp"}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg"
            placeholder={platform === "discord" ? "!help" : "/ayuda"}
            onKeyPress={(e) => e.key === "Enter" && simulateCommand()}
          />
          <button
            onClick={simulateCommand}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
          >
            {isLoading ? "..." : "Enviar"}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-300 font-medium">
            Respuesta simulada
          </label>
          <button
            onClick={copyResponse}
            disabled={!response}
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs flex items-center gap-1 disabled:opacity-50"
          >
            <FiCopy /> Copiar
          </button>
        </div>
        <div className="w-full min-h-32 px-4 py-2 rounded-lg bg-gray-900 text-gray-200 whitespace-pre-wrap">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <span className="animate-spin">↻</span>
            </div>
          ) : response ? (
            response
          ) : (
            "La respuesta aparecerá aquí..."
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-4">
          <label className="text-gray-300 font-medium mb-2 block">
            Historial
          </label>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-purple-400 font-mono">{item.command}</div>
                <div className="text-gray-300 mt-1 whitespace-pre-wrap">
                  {item.response}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 mt-2">
        <p>
          <b>Nota:</b> Este simulador muestra respuestas predefinidas para
          comandos comunes.
          {platform === "discord"
            ? " Los comandos de Discord suelen comenzar con ! o /."
            : " Los comandos de WhatsApp suelen comenzar con /."}
        </p>
      </div>
    </div>
  );
};
