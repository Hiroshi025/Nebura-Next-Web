import React, { useEffect, useState } from "react";
import { FaCopy, FaLink, FaServer, FaTrash } from "react-icons/fa";

type WebhookEvent = {
  id: string;
  timestamp: string;
  headers: Record<string, string>;
  body: string;
};

const WEBHOOK_ENDPOINT = "https://webhook.site/"; // Puedes usar webhook.site o tu propio backend

export const WebhookTester = () => {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Genera una URL única usando webhook.site (o tu backend)
  useEffect(() => {
    fetch("https://webhook.site/token", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setWebhookUrl(`https://webhook.site/${data.uuid}`);
        // Opcional: puedes usar WebSocket para recibir eventos en tiempo real
      });
  }, []);

  // Simulación: fetch eventos cada 5s (solo si usas webhook.site)
  useEffect(() => {
    if (!webhookUrl) return;
    const token = webhookUrl.split("/").pop();
    const interval = setInterval(() => {
      fetch(`https://webhook.site/token/${token}/requests?sorting=newest`)
        .then((res) => res.json())
        .then((data) => {
          setEvents(
            data.data.map((e: any) => ({
              id: e.uuid,
              timestamp: new Date(e.created_at).toLocaleString(),
              headers: e.headers,
              body: e.content,
            }))
          );
        });
    }, 5000);
    return () => clearInterval(interval);
  }, [webhookUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => setEvents([]);

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-10 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaServer className="text-purple-400" /> Tester de Webhooks
      </h3>
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-center">
        <div className="flex-1">
          <label className="block text-gray-300 mb-1 font-medium">
            URL de Webhook única
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={webhookUrl}
              readOnly
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-lg text-xs font-bold ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-purple-700 text-white hover:bg-purple-800"
              }`}
              title="Copiar URL"
            >
              <FaCopy />
            </button>
            <a
              href={webhookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-blue-700 text-white text-xs font-bold hover:bg-blue-800"
              title="Ver en webhook.site"
            >
              <FaLink />
            </a>
          </div>
          <span className="text-xs text-gray-400">
            Envía peticiones POST/PUT a esta URL y visualízalas abajo.
          </span>
        </div>
        <button
          onClick={handleClear}
          className="px-3 py-2 rounded-lg bg-red-700 text-white text-xs font-bold hover:bg-red-800"
          title="Limpiar eventos"
        >
          <FaTrash />
        </button>
      </div>
      <div className="mt-4">
        <h4 className="text-gray-300 font-bold mb-2">Eventos recibidos:</h4>
        {events.length === 0 ? (
          <div className="text-gray-400 text-sm">Aún no hay eventos.</div>
        ) : (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {events.map((e) => (
              <div
                key={e.id}
                className="bg-gray-900/70 rounded-lg p-3 border border-gray-700"
              >
                <div className="text-xs text-gray-400 mb-1">
                  <b>Fecha:</b> {e.timestamp}
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  <b>Headers:</b>
                  <pre className="bg-gray-800 rounded p-2 text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(e.headers, null, 2)}
                  </pre>
                </div>
                <div className="text-xs text-gray-400">
                  <b>Body:</b>
                  <pre className="bg-gray-800 rounded p-2 text-xs text-gray-300 overflow-x-auto">
                    {e.body}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};