import { QRCodeSVG } from "qrcode.react"; // npm install qrcode.react
import React, { useRef, useState } from "react";
import { FaCopy, FaDownload, FaQrcode } from "react-icons/fa";

export const QrGenerator = () => {
  const [text, setText] = useState("https://nebura.example");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    a.click();
  };

  return (
    <div className="bg-gray-800/60 rounded-xl p-6 mb-10 shadow-lg border border-purple-700/20 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FaQrcode className="text-purple-400" /> Generador de Códigos QR
      </h3>
      <div className="mb-4">
        <label className="block text-gray-300 mb-2 font-medium">
          Texto o URL para el QR
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 font-mono"
            placeholder="Introduce texto, URL, etc."
          />
          <button
            onClick={handleCopy}
            className={`px-3 py-2 rounded-lg text-xs font-bold ${
              copied
                ? "bg-green-600 text-white"
                : "bg-purple-700 text-white hover:bg-purple-800"
            }`}
            title="Copiar texto"
          >
            <FaCopy />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div ref={qrRef} className="bg-white p-3 rounded-lg">
          <QRCodeSVG value={text} size={180} level="H" />
        </div>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 flex items-center gap-2"
        >
          <FaDownload /> Descargar PNG
        </button>
      </div>
    </div>
  );
};
