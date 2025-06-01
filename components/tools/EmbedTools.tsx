"use client";

import React, { useEffect, useState } from "react";
import {
	FaCode, FaCopy, FaDiscord, FaFileExport, FaFileImport, FaImage, FaJs, FaLightbulb, FaMoon,
	FaPlus, FaPython, FaQuestionCircle, FaSun, FaTrash, FaUser
} from "react-icons/fa";
import { FiCheck } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tab, TabPanel, Tabs, TabsList } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

import { ColorPicker } from "../ui/color-picker";
import { MarkdownGuide } from "../ui/markdown-guide";
import { useNotification } from "./NotificationContext";

type EmbedField = {
  name: string;
  value: string;
  inline: boolean;
};

type EmbedAuthor = {
  name: string;
  url?: string;
  icon_url?: string;
};

type EmbedFooter = {
  text: string;
  icon_url?: string;
};

type Embed = {
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  timestamp?: string;
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  author?: EmbedAuthor;
  footer?: EmbedFooter;
  fields: EmbedField[];
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const limits = {
  title: 256,
  description: 4096,
  fieldName: 256,
  fieldValue: 1024,
  fields: 25,
  footer: 2048,
  author: 256,
  totalEmbed: 6000,
};

type CleanableEmbed = {
  [K in keyof Embed]: Embed[K] extends object ? Partial<Embed[K]> : Embed[K];
};

const defaultColors = [
  "#5865F2", // Discord blurple
  "#57F287", // Discord green
  "#FEE75C", // Discord yellow
  "#EB459E", // Discord fuchsia
  "#ED4245", // Discord red
  "#FFFFFF", // White
  "#000000", // Black
  "#1ABC9C", // Turquoise
  "#2ECC71", // Emerald
  "#3498DB", // Peter River
  "#9B59B6", // Amethyst
  "#E91E63", // Pink
  "#F1C40F", // Sunflower
  "#E67E22", // Carrot
  "#E74C3C", // Alizarin
];

export const EmbedBuilder = () => {
  // Helper functions
  const cleanEmbed = (embed: Embed): Partial<Embed> => {
    // Función recursiva para limpieza de objetos anidados
    const cleanObject = <T extends Record<string, any>>(
      obj: T
    ): Partial<T> | undefined => {
      if (!obj) return undefined;

      const cleaned: Partial<T> = {};
      let hasValues = false;

      for (const [key, value] of Object.entries(obj)) {
        if (value === "" || value === undefined || value === null) continue;

        // Limpieza recursiva de objetos anidados
        if (typeof value === "object" && !Array.isArray(value)) {
          const cleanedNested = cleanObject(value);
          if (cleanedNested) {
            cleaned[key as keyof T] = cleanedNested as any;
            hasValues = true;
          }
          continue;
        }

        // Para arrays (como fields), limpiar cada elemento
        if (Array.isArray(value)) {
          const cleanedArray = value
            .map((item) =>
              typeof item === "object" ? cleanObject(item) : item
            )
            .filter(Boolean);

          if (cleanedArray.length > 0) {
            cleaned[key as keyof T] = cleanedArray as any;
            hasValues = true;
          }
          continue;
        }

        cleaned[key as keyof T] = value;
        hasValues = true;
      }

      return hasValues ? cleaned : undefined;
    };

    // Limpieza del embed principal
    const cleaned = cleanObject(embed);

    // Eliminar propiedades específicas si están vacías
    if (cleaned?.fields?.length === 0) {
      delete cleaned.fields;
    }

    // Asegurar que el color sea un string hexadecimal válido si existe
    if (cleaned?.color && typeof cleaned.color === "string") {
      if (!/^#?([0-9A-F]{3}){1,2}$/i.test(cleaned.color)) {
        delete cleaned.color;
      } else if (!cleaned.color.startsWith("#")) {
        cleaned.color = `#${cleaned.color}`;
      }
    }

    return cleaned || {};
  };

  // State management
  const [embed, setEmbed] = useState<Embed>({
    title: "",
    description: "",
    color: "#5865F2",
    fields: [],
  });

  const [currentField, setCurrentField] = useState<EmbedField>({
    name: "",
    value: "",
    inline: false,
  });

  const [author, setAuthor] = useState<EmbedAuthor>({ name: "" });
  const [footer, setFooter] = useState<EmbedFooter>({ text: "" });
  const [isCopied, setIsCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [embeds, setEmbeds] = useState<Embed[]>([{ ...embed }]);
  const [selectedEmbed, setSelectedEmbed] = useState(0);
  const [previewDark, setPreviewDark] = useState(true);
  const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);
  const [customColor, setCustomColor] = useState("#5865F2");
  const [activeTab, setActiveTab] = useState("json");
  const notify = useNotification();

  // Calculate embed size
  const embedSize = JSON.stringify(cleanEmbed(embed)).length;
  const embedSizePercentage = Math.min(
    (embedSize / limits.totalEmbed) * 100,
    100
  );

  // Effects
  useEffect(() => {
    if (embed.color) {
      setCustomColor(embed.color);
    }
  }, [embed.color]);

  const addField = () => {
    if (currentField.name && currentField.value) {
      const newEmbed = {
        ...embed,
        fields: [...embed.fields, currentField],
      };
      updateCurrentEmbed(newEmbed);
      setCurrentField({ name: "", value: "", inline: false });
    }
  };

  const removeField = (index: number) => {
    const newFields = [...embed.fields];
    newFields.splice(index, 1);
    updateCurrentEmbed({ ...embed, fields: newFields });
  };

  const updateEmbed = (key: keyof Embed, value: any) => {
    updateCurrentEmbed({ ...embed, [key]: value });
  };

  const updateCurrentEmbed = (newEmbed: Embed) => {
    setEmbed(newEmbed);
    setEmbeds((prev) =>
      prev.map((e, i) => (i === selectedEmbed ? newEmbed : e))
    );
  };

  // Embed management
  const addNewEmbed = () => {
    const newEmbed: Embed = {
      title: "",
      description: "",
      color: "#5865F2",
      fields: [],
    };
    setEmbeds((prev) => [...prev, newEmbed]);
    setSelectedEmbed(embeds.length);
    setEmbed(newEmbed);
  };

  const selectEmbed = (idx: number) => {
    setSelectedEmbed(idx);
    setEmbed(embeds[idx]);
  };

  const removeEmbed = (idx: number) => {
    if (embeds.length === 1) return;
    const newEmbeds = embeds.filter((_, i) => i !== idx);
    setEmbeds(newEmbeds);
    setSelectedEmbed(Math.min(idx, newEmbeds.length - 1));
    setEmbed(newEmbeds[Math.min(idx, newEmbeds.length - 1)]);
  };

  // Code generation
  const getEmbedCode = () => {
    return JSON.stringify(cleanEmbed(embed), null, 2);
  };

  const getDiscordJSCode = () => {
    return (
      `const { EmbedBuilder } = require('discord.js');\n\n` +
      `const embed = new EmbedBuilder()\n` +
      (embed.title ? `  .setTitle(${JSON.stringify(embed.title)})\n` : "") +
      (embed.description
        ? `  .setDescription(${JSON.stringify(embed.description)})\n`
        : "") +
      (embed.url ? `  .setURL(${JSON.stringify(embed.url)})\n` : "") +
      (embed.color
        ? `  .setColor(${JSON.stringify(
            parseInt(embed.color.replace("#", "0x"))
          )} )\n`
        : "") +
      (embed.timestamp
        ? `  .setTimestamp(${
            embed.timestamp === "now" ? "" : JSON.stringify(embed.timestamp)
          })\n`
        : "") +
      (embed.author
        ? `  .setAuthor({\n` +
          `    name: ${JSON.stringify(embed.author.name)},\n` +
          (embed.author.icon_url
            ? `    iconURL: ${JSON.stringify(embed.author.icon_url)},\n`
            : "") +
          (embed.author.url
            ? `    url: ${JSON.stringify(embed.author.url)},\n`
            : "") +
          `  })\n`
        : "") +
      (embed.footer
        ? `  .setFooter({\n` +
          `    text: ${JSON.stringify(embed.footer.text)},\n` +
          (embed.footer.icon_url
            ? `    iconURL: ${JSON.stringify(embed.footer.icon_url)},\n`
            : "") +
          `  })\n`
        : "") +
      (embed.image?.url
        ? `  .setImage(${JSON.stringify(embed.image.url)})\n`
        : "") +
      (embed.thumbnail?.url
        ? `  .setThumbnail(${JSON.stringify(embed.thumbnail.url)})\n`
        : "") +
      (embed.fields && embed.fields.length > 0
        ? `  .addFields(\n` +
          embed.fields
            .map(
              (f) =>
                `    { name: ${JSON.stringify(f.name)}, value: ${JSON.stringify(
                  f.value
                )}, inline: ${f.inline} }`
            )
            .join(",\n") +
          `\n  )\n`
        : "") +
      `;`
    );
  };

  const getDiscordPyCode = () => {
    let code = "import discord\n";
    if (embed.timestamp) code += "import datetime\n\n";

    code += "embed = discord.Embed(\n";
    if (embed.title) code += `    title=${JSON.stringify(embed.title)},\n`;
    if (embed.description)
      code += `    description=${JSON.stringify(embed.description)},\n`;
    if (embed.color)
      code += `    color=discord.Color.from_str(${JSON.stringify(
        embed.color
      )}),\n`;
    if (embed.url) code += `    url=${JSON.stringify(embed.url)},\n`;
    if (embed.timestamp)
      code += `    timestamp=datetime.datetime.fromisoformat(${JSON.stringify(
        embed.timestamp
      )}),\n`;
    code = code.replace(/,\n$/, "\n") + ")\n";

    if (embed.author) {
      code += `embed.set_author(\n`;
      code += `    name=${JSON.stringify(embed.author.name)}\n`;
      if (embed.author.icon_url)
        code += `    icon_url=${JSON.stringify(embed.author.icon_url)},\n`;
      if (embed.author.url)
        code += `    url=${JSON.stringify(embed.author.url)},\n`;
      code = code.replace(/,\n$/, "\n") + ")\n";
    }

    if (embed.footer) {
      code += `embed.set_footer(\n`;
      code += `    text=${JSON.stringify(embed.footer.text)}\n`;
      if (embed.footer.icon_url)
        code += `    icon_url=${JSON.stringify(embed.footer.icon_url)},\n`;
      code = code.replace(/,\n$/, "\n") + ")\n";
    }

    if (embed.thumbnail?.url)
      code += `embed.set_thumbnail(url=${JSON.stringify(
        embed.thumbnail.url
      )})\n`;
    if (embed.image?.url)
      code += `embed.set_image(url=${JSON.stringify(embed.image.url)})\n`;

    if (embed.fields && embed.fields.length > 0) {
      code += embed.fields
        .map(
          (f) =>
            `embed.add_field(name=${JSON.stringify(
              f.name
            )}, value=${JSON.stringify(f.value)}, inline=${f.inline})`
        )
        .join("\n");
    }

    return code;
  };

  // Webhook functions
  const isValidWebhookUrl = (url: string) =>
    /^https:\/\/(canary\.|ptb\.)?discord(app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/i.test(
      url
    );
  const sendToWebhook = async () => {
    if (!isValidWebhookUrl(webhookUrl)) {
      notify({ message: "Invalid webhook URL", type: "error" });
      return;
    }

    console.log(cleanEmbed(embed));
    setSending(true);
    try {
      // Clean and validate the embed
      const cleanedEmbed = cleanEmbed(embed);

      // Convert hex color to decimal number
      if (
        cleanedEmbed.color &&
        typeof cleanedEmbed.color === "string" &&
        cleanedEmbed.color.startsWith("#")
      ) {
        cleanedEmbed.color = parseInt(cleanedEmbed.color.slice(1), 16).toString();
      }

      // Validate/remove author URL if invalid
      if (cleanedEmbed.author?.url && !isValidUrl(cleanedEmbed.author.url)) {
        delete cleanedEmbed.author.url;
      }

      // Send to webhook
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [cleanedEmbed],
          username: "Embed Builder",
        }),
      });

      // First try to read as text to handle non-JSON responses
      const responseText = await res.text();

      if (!res.ok) {
        // Try to parse as JSON, fallback to text if fails
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = responseText;
        }

        console.error("Discord API Error:", {
          status: res.status,
          statusText: res.statusText,
          response: errorData,
          request: {
            embeds: [cleanedEmbed],
            username: "Embed Builder",
          },
        });

        throw new Error(
          `Discord API Error ${res.status}: ${JSON.stringify(errorData)}`
        );
      }

      // Parse successful response
      return responseText ? JSON.parse(responseText) : {};
    } catch (err: any) {
      const cleanedEmbed = cleanEmbed(embed);

      notify({
        message: "Failed to send embed: " + (err.message || "Unknown error"),
        type: "error",
      });
      console.error("Webhook error:", {
        error: err,
        embed: embed,
        cleanedEmbed: cleanedEmbed,
      });
    } finally {
      setSending(false);
    }
  };

  // Import/Export functions
  const exportEmbed = (format: "json" | "discordjs" | "discordpy") => {
    let content = "";
    let extension = ".json";
    let mimeType = "application/json";

    switch (format) {
      case "json":
        content = getEmbedCode();
        extension = ".json";
        break;
      case "discordjs":
        content = getDiscordJSCode();
        extension = ".js";
        mimeType = "text/javascript";
        break;
      case "discordpy":
        content = getDiscordPyCode();
        extension = ".py";
        mimeType = "text/x-python";
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `embed${
      embeds.length > 1 ? `-${selectedEmbed + 1}` : ""
    }${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importEmbed = async (file: File) => {
    try {
      const text = await file.text();
      const imported = JSON.parse(text);

      // Handle single embed or array of embeds
      if (Array.isArray(imported)) {
        setEmbeds(imported);
        setSelectedEmbed(0);
        setEmbed(imported[0]);
      } else {
        const newEmbed = {
          ...embed,
          ...imported,
          fields: imported.fields || [],
        };
        updateCurrentEmbed(newEmbed);
      }

      notify({ message: "Embed imported successfully", type: "success" });
    } catch (err) {
      notify({ message: "Invalid JSON file", type: "error" });
    }
  };

  return (
    <TooltipProvider>
      <div className="bg-gray-800/20 rounded-xl p-6 mb-6 shadow-lg border border-purple-900/30 max-w-7xl mx-auto">
        {/* Header with embed selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <FaDiscord className="text-indigo-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Advanced Embed Builder
            </span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {embeds.map((_, i) => (
              <Button
                key={i}
                onClick={() => selectEmbed(i)}
                variant={selectedEmbed === i ? "default" : "secondary"}
                size="sm"
                className="bg-gray-700 text-white hover:bg-purple-700"
              >
                Embed {i + 1}
              </Button>
            ))}

            <Button
              onClick={addNewEmbed}
              size="sm"
              className="gap-1 bg-gray-700 text-white hover:bg-purple-700"
            >
              <FaPlus size={12} /> New
            </Button>

            {embeds.length > 1 && (
              <Button
                onClick={() => removeEmbed(selectedEmbed)}
                variant="destructive"
                size="sm"
                className="gap-1"
              >
                <FaTrash size={12} /> Remove
              </Button>
            )}
          </div>
        </div>

        {/* Size indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-400">
              Embed Size: {embedSize}/{limits.totalEmbed} characters
            </span>
            <span className="text-sm font-medium">
              {Math.round(embedSizePercentage)}% used
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                embedSizePercentage > 90
                  ? "bg-red-500"
                  : embedSizePercentage > 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${embedSizePercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaCode className="text-purple-400" /> Embed Configuration
            </h4>

            <div className="space-y-5">
              {/* Title and URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                    <span className="text-xs text-gray-500 ml-1">
                      (max {limits.title} chars)
                    </span>
                  </label>
                  <Input
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                    value={embed.title || ""}
                    onChange={(e) => updateEmbed("title", e.target.value)}
                    placeholder="Embed title"
                    maxLength={limits.title}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL
                    <Tooltip>
                      <FaQuestionCircle
                        className="ml-1 inline text-gray-400"
                        size={12}
                      />
                    </Tooltip>
                  </label>
                  <Input
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                    value={embed.url || ""}
                    onChange={(e) => updateEmbed("url", e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Description
                    <span className="text-xs text-gray-500 ml-1">
                      (max {limits.description} chars)
                    </span>
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMarkdownGuide(!showMarkdownGuide)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    {showMarkdownGuide ? "Hide" : "Show"} Markdown Guide
                  </Button>
                </div>

                {showMarkdownGuide && <MarkdownGuide />}

                <Textarea
                  className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                  value={embed.description || ""}
                  onChange={(e) => updateEmbed("description", e.target.value)}
                  placeholder="Embed description (supports Markdown)"
                  rows={4}
                  maxLength={limits.description}
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex items-center gap-4">
                  <ColorPicker
                    color={customColor}
                    onChange={(color: string) => {
                      setCustomColor(color);
                      updateEmbed("color", color);
                    }}
                  />

                  <div className="flex flex-wrap gap-1">
                    {defaultColors.map((color: string) => (
                      <Tooltip key={color}>
                        <button
                          onClick={() => {
                            setCustomColor(color);
                            updateEmbed("color", color);
                          }}
                          className="w-6 h-6 rounded-full border-2 border-transparent hover:border-white transition-all"
                          style={{ backgroundColor: color }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author Section */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FaUser /> Author
                </label>

                <div className="space-y-3">
                  <Input
                    value={author.name}
                    onChange={(e) =>
                      setAuthor({ ...author, name: e.target.value })
                    }
                    placeholder="Author name"
                    maxLength={limits.author}
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                  />

                  <Input
                    value={author.url || ""}
                    onChange={(e) =>
                      setAuthor({ ...author, url: e.target.value })
                    }
                    placeholder="Author URL"
                    type="url"
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                  />

                  <Input
                    value={author.icon_url || ""}
                    onChange={(e) =>
                      setAuthor({ ...author, icon_url: e.target.value })
                    }
                    placeholder="Author icon URL"
                    type="url"
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                  />

                  <div className="flex justify-end">
                    <Button
                      onClick={() =>
                        updateEmbed("author", author.name ? author : undefined)
                      }
                      variant={embed.author ? "default" : "outline"}
                      size="sm"
                      className="bg-gray-700 text-white hover:bg-purple-700 border-none"
                    >
                      {embed.author ? "Update Author" : "Add Author"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FaUser /> Footer
                </label>

                <div className="space-y-3">
                  <Input
                    value={footer.text}
                    onChange={(e) =>
                      setFooter({ ...footer, text: e.target.value })
                    }
                    placeholder="Footer text"
                    maxLength={limits.footer}
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                  />

                  <Input
                    value={footer.icon_url || ""}
                    onChange={(e) =>
                      setFooter({ ...footer, icon_url: e.target.value })
                    }
                    placeholder="Footer icon URL"
                    type="url"
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                  />

                  <div className="flex justify-end">
                    <Button
                      onClick={() =>
                        updateEmbed("footer", footer.text ? footer : undefined)
                      }
                      variant={embed.footer ? "default" : "outline"}
                      size="sm"
                      className="bg-gray-700 text-white hover:bg-purple-700 border-none"
                    >
                      {embed.footer ? "Update Footer" : "Add Footer"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <FaImage /> Main Image
                  </label>
                  <Input
                    value={embed.image?.url || ""}
                    onChange={(e) =>
                      updateEmbed(
                        "image",
                        e.target.value ? { url: e.target.value } : undefined
                      )
                    }
                    placeholder="Image URL"
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <FaImage /> Thumbnail
                  </label>
                  <Input
                    value={embed.thumbnail?.url || ""}
                    onChange={(e) =>
                      updateEmbed(
                        "thumbnail",
                        e.target.value ? { url: e.target.value } : undefined
                      )
                    }
                    placeholder="Thumbnail URL"
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                    type="url"
                  />
                </div>
              </div>

              {/* Fields Section */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FaPlus /> Fields
                  <span className="text-xs text-gray-500 ml-auto">
                    {embed.fields.length}/{limits.fields} fields
                  </span>
                </label>

                <div className="space-y-3">
                  {/* Existing fields */}
                  {embed.fields.map((field, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/50 p-3 rounded-lg border border-gray-700"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-300">
                          Field {index + 1}
                        </span>
                        <Button
                          onClick={() => removeField(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrash size={12} />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <span className="text-xs text-gray-400">Name</span>
                          <div className="text-sm bg-gray-800 px-2 py-1 rounded">
                            {field.name || (
                              <span className="text-gray-500">Empty</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Inline</span>
                          <div className="text-sm bg-gray-800 px-2 py-1 rounded">
                            {field.inline ? "Yes" : "No"}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs text-gray-400">Value</span>
                      <div className="text-sm bg-gray-800 px-2 py-1 rounded whitespace-pre-line">
                        {field.value || (
                          <span className="text-gray-500">Empty</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add new field */}
                  {embed.fields.length < limits.fields && (
                    <div className="bg-gray-900/70 p-3 rounded-lg border border-dashed border-gray-600">
                      <div className="space-y-3">
                        <Input
                          value={currentField.name}
                          onChange={(e) =>
                            setCurrentField({
                              ...currentField,
                              name: e.target.value,
                            })
                          }
                          placeholder="Field name"
                          className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                          maxLength={limits.fieldName}
                        />

                        <Textarea
                          value={currentField.value}
                          onChange={(e) =>
                            setCurrentField({
                              ...currentField,
                              value: e.target.value,
                            })
                          }
                          placeholder="Field value (supports Markdown)"
                          className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                          rows={3}
                          maxLength={limits.fieldValue}
                        />

                        <div className="flex justify-between items-center">
                          <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input
                              type="checkbox"
                              checked={currentField.inline}
                              onChange={(e) =>
                                setCurrentField({
                                  ...currentField,
                                  inline: e.target.checked,
                                })
                              }
                              className="rounded text-purple-500 focus:ring-purple-500"
                            />
                            Inline
                          </label>

                          <Button
                            onClick={addField}
                            disabled={!currentField.name || !currentField.value}
                            size="sm"
                            className="gap-1"
                          >
                            <FaPlus size={12} /> Add Field
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timestamp
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="datetime-local"
                    value={
                      embed.timestamp
                        ? new Date(embed.timestamp).toISOString().slice(0, 16)
                        : ""
                    }
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                    onChange={(e) =>
                      updateEmbed(
                        "timestamp",
                        e.target.value
                          ? new Date(e.target.value).toISOString()
                          : undefined
                      )
                    }
                  />

                  <Button
                    onClick={() =>
                      updateEmbed("timestamp", new Date().toISOString())
                    }
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 text-white hover:bg-purple-700 border-none"
                  >
                    Set to Now
                  </Button>

                  {embed.timestamp && (
                    <Button
                      onClick={() => updateEmbed("timestamp", undefined)}
                      variant="outline"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Webhook Section */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FaDiscord /> Send to Webhook
                </label>

                <div className="space-y-3">
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="Discord webhook URL"
                    className="bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={sendToWebhook}
                      disabled={!isValidWebhookUrl(webhookUrl) || sending}
                      variant={
                        isValidWebhookUrl(webhookUrl) ? "default" : "secondary"
                      }
                      className="gap-1"
                    >
                      {sending ? "Sending..." : "Send to Webhook"}
                    </Button>

                    <Tooltip>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-400"
                      >
                        <FaLightbulb size={14} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview and Code Panel */}
          <div className="space-y-6">
            {/* Preview Section */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaImage /> Preview
                </h4>

                <Button
                  onClick={() => setPreviewDark(!previewDark)}
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-gray-800 text-gray-200 border-gray-700 placeholder-gray-400 focus:ring-purple-500"
                >
                  {previewDark ? <FaSun size={14} /> : <FaMoon size={14} />}
                  {previewDark ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  previewDark
                    ? "bg-gray-800"
                    : "bg-white border border-gray-300"
                }`}
              >
                <div
                  className="border-l-4 p-4 rounded-r"
                  style={{
                    borderColor: embed.color || "transparent",
                    backgroundColor: previewDark
                      ? "rgba(0, 0, 0, 0.3)"
                      : "rgba(243, 244, 246, 0.7)",
                  }}
                >
                  {/* Author */}
                  {embed.author && (
                    <div className="flex items-center mb-3">
                      {embed.author.icon_url && (
                        <img
                          src={embed.author.icon_url}
                          alt=""
                          className="w-8 h-8 rounded-full mr-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <div>
                        {embed.author.url ? (
                          <a
                            href={embed.author.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-medium hover:underline ${
                              previewDark ? "text-blue-400" : "text-blue-600"
                            }`}
                          >
                            {embed.author.name}
                          </a>
                        ) : (
                          <span className="font-medium">
                            {embed.author.name}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  {embed.title && (
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        previewDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {embed.url ? (
                        <a
                          href={embed.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`hover:underline ${
                            previewDark ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          {embed.title}
                        </a>
                      ) : (
                        embed.title
                      )}
                    </h3>
                  )}

                  {/* Description */}
                  {embed.description && (
                    <p
                      className={`mb-3 whitespace-pre-line ${
                        previewDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {embed.description}
                    </p>
                  )}

                  {/* Fields */}
                  {embed.fields.length > 0 && (
                    <div
                      className={`grid gap-3 mb-3 ${
                        embed.fields.some((f) => f.inline)
                          ? "grid-cols-1 md:grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      {embed.fields.map((field, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded ${
                            previewDark
                              ? "bg-gray-900/50 text-gray-300"
                              : "bg-gray-100 text-gray-800"
                          } ${field.inline ? "" : "md:col-span-2"}`}
                        >
                          <div className="font-bold mb-1">{field.name}</div>
                          <div className="whitespace-pre-line">
                            {field.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Image */}
                  {embed.image?.url && (
                    <div className="mt-3 mb-3">
                      <img
                        src={embed.image.url}
                        alt="Embed preview"
                        className="max-w-full h-auto rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Thumbnail */}
                  {embed.thumbnail?.url && (
                    <div className="flex justify-end mt-3">
                      <img
                        src={embed.thumbnail.url}
                        alt="Thumbnail"
                        className="w-20 h-20 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Footer */}
                  {embed.footer && (
                    <div
                      className={`flex items-center mt-3 text-xs ${
                        previewDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {embed.footer.icon_url && (
                        <img
                          src={embed.footer.icon_url}
                          alt=""
                          className="w-5 h-5 rounded-full mr-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <span>{embed.footer.text}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Code Section */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
              <Tabs value={activeTab} onChange={setActiveTab}>
                <TabsList className="bg-gray-800/50 border-b border-gray-700">
                  <Tab value="json" className="flex items-center gap-1">
                    <FaFileExport size={14} /> JSON
                  </Tab>
                  <Tab value="discordjs" className="flex items-center gap-1">
                    <FaJs size={14} /> Discord.js
                  </Tab>
                  <Tab value="discordpy" className="flex items-center gap-1">
                    <FaPython size={14} /> Discord.py
                  </Tab>
                </TabsList>

                <div className="p-4">
                  <TabPanel value="json">
                    <div className="flex gap-2 mb-4">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(getEmbedCode());
                          setIsCopied(true);
                          notify({ message: "JSON copied!", type: "success" });
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        variant="default"
                        size="sm"
                        className="gap-1"
                      >
                        {isCopied ? <FiCheck /> : <FaCopy />}
                        {isCopied ? "Copied!" : "Copy JSON"}
                      </Button>

                      <Button
                        onClick={() => exportEmbed("json")}
                        variant="outline"
                        size="sm"
                        className="gap-1 bg-gray-700 text-white hover:bg-purple-700 border-none"
                      >
                        <FaFileExport size={14} /> Export JSON
                      </Button>

                      <label className="inline-flex items-center justify-center px-3 py-1 rounded text-sm bg-gray-700 hover:bg-purple-700 cursor-pointer gap-1">
                        <FaFileImport size={14} /> Import JSON
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) importEmbed(file);
                          }}
                        />
                      </label>
                    </div>

                    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-xs text-gray-300 max-h-96">
                      {getEmbedCode()}
                    </pre>
                  </TabPanel>

                  <TabPanel value="discordjs">
                    <div className="flex gap-2 mb-4">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(getDiscordJSCode());
                          setIsCopied(true);
                          notify({
                            message: "Discord.js code copied!",
                            type: "success",
                          });
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        variant="default"
                        size="sm"
                        className="gap-1"
                      >
                        {isCopied ? <FiCheck /> : <FaCopy />}
                        {isCopied ? "Copied!" : "Copy Code"}
                      </Button>

                      <Button
                        onClick={() => exportEmbed("discordjs")}
                        variant="outline"
                        size="sm"
                        className="gap-1 bg-gray-700 text-white hover:bg-purple-700 border-none"
                      >
                        <FaFileExport size={14} /> Export File
                      </Button>
                    </div>

                    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-xs text-gray-300 max-h-96">
                      {getDiscordJSCode()}
                    </pre>
                  </TabPanel>

                  <TabPanel value="discordpy">
                    <div className="flex gap-2 mb-4">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(getDiscordPyCode());
                          setIsCopied(true);
                          notify({
                            message: "Discord.py code copied!",
                            type: "success",
                          });
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        variant="default"
                        size="sm"
                        className="gap-1"
                      >
                        {isCopied ? <FiCheck /> : <FaCopy />}
                        {isCopied ? "Copied!" : "Copy Code"}
                      </Button>

                      <Button
                        onClick={() => exportEmbed("discordpy")}
                        variant="outline"
                        size="sm"
                        className="gap-1 bg-gray-700 text-white hover:bg-purple-700 border-none"
                      >
                        <FaFileExport size={14} /> Export File
                      </Button>
                    </div>

                    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-xs text-gray-300 max-h-96">
                      {getDiscordPyCode()}
                    </pre>
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
