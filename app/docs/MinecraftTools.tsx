import mcDataRaw from "minecraft-data";
import React, { useCallback, useEffect, useState } from "react";
import { BiStats } from "react-icons/bi";
import {
	FaBook, FaCopy, FaDownload, FaGlobe, FaHistory, FaInfoCircle, FaQuestionCircle, FaRedo,
	FaSearch, FaSeedling, FaServer, FaTrash, FaUser
} from "react-icons/fa";
import { GiChest, GiMineTruck, GiPistolGun, GiSwordman } from "react-icons/gi";

import { useNotification } from "@/components/NotificationContext";

type Feature =
  | "server"
  | "skin"
  | "seed"
  | "player"
  | "stats"
  | "items"
  | "blocks"
  | "mobs";
type ServerPlatform = "java" | "bedrock";
type Dimension = "overworld" | "nether" | "end";

interface ServerResponse {
  online: boolean;
  ip: string;
  port: number;
  hostname?: string;
  version?: string;
  players?: {
    online: number;
    max: number;
    list?: string[];
  };
  motd?: {
    clean: string[];
    html?: string[];
  };
  software?: string;
  plugins?: string[];
  mods?: string[];
  icon?: string;
  gamemode?: string;
  map?: string;
}

interface PlayerSkinResponse {
  uuid: string;
  username: string;
  skin_url: string;
  avatar: string;
  render: string;
  head: string;
  body: string;
  cape_url?: string;
  isAlexModel: boolean;
}

interface SeedInfo {
  seed: string;
  biomes: {
    name: string;
    rarity: string;
    coordinates: string[];
  }[];
  structures: {
    name: string;
    coordinates: string;
    loot?: string[];
  }[];
  stronghold: {
    coordinates: string;
    eyes_needed?: number;
  };
  monuments: {
    name: string;
    coordinates: string;
  }[];
  spawn: string;
  nether_fortress?: string;
  end_city?: string;
  mineshaft?: string;
  recommended?: boolean;
}

interface PlayerNameHistory {
  name: string;
  changedToAt?: number;
}

interface PlayerStats {
  username: string;
  uuid: string;
  kills: number;
  deaths: number;
  mob_kills: {
    [mob: string]: number;
  };
  playtime: string;
  lastLogin: string;
  achievements: string[];
}

interface MinecraftItem {
  id: string;
  name: string;
  image: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  category: string;
  recipe?: string;
}

interface MinecraftBlock {
  id: string;
  name: string;
  image: string;
  blast_resistance: number;
  hardness: number;
  tool_required: string;
}

interface MinecraftMob {
  id: string;
  name: string;
  image: string;
  health: number;
  damage: number;
  spawn_biomes: string[];
  drops: string[];
}

export const MinecraftToolbox = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>("server");
  const [serverInput, setServerInput] = useState("");
  const [serverData, setServerData] = useState<ServerResponse | null>(null);
  const [serverPlatform, setServerPlatform] = useState<ServerPlatform>("java");
  const [playerInput, setPlayerInput] = useState("");
  const [playerData, setPlayerData] = useState<PlayerSkinResponse | null>(null);
  const [seedInput, setSeedInput] = useState("");
  const [seedData, setSeedData] = useState<SeedInfo | null>(null);
  const [dimension, setDimension] = useState<Dimension>("overworld");
  const [playerNameHistory, setPlayerNameHistory] = useState<
    PlayerNameHistory[] | null
  >(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [itemsData, setItemsData] = useState<MinecraftItem[]>([]);
  const [blocksData, setBlocksData] = useState<MinecraftBlock[]>([]);
  const [mobsData, setMobsData] = useState<MinecraftMob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<{ [key in Feature]?: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showMotdHtml, setShowMotdHtml] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const notify = useNotification();

  // Cargar datos iniciales y historial
  useEffect(() => {
    const savedHistory = localStorage.getItem("minecraftToolboxHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Cargar datos de items, bloques y mobs (simulados)
    loadItemsData();
    loadBlocksData();
    loadMobsData();
  }, []);

  const mcData = mcDataRaw("1.19"); // Puedes cambiar la versión según lo que quieras mostrar
  const loadItemsData = () => {
    // Usar minecraft-data para obtener items
    const items: MinecraftItem[] = Object.values(mcData.items)
      .filter((item: any) => !!item.name)
      .map((item: any) => ({
        id: item.name,
        name: item.displayName || item.name,
        image: `https://minecraft.wiki/images/${item.name.replace(
          /_/g,
          "_"
        )}.png`,
        rarity: "common" as const,
        category: item.category || "general",
        recipe: undefined,
      }));
    setItemsData(items);
  };

  const loadBlocksData = () => {
    // Usar minecraft-data para obtener bloques
    const blocks: MinecraftBlock[] = Object.values(mcData.blocks)
      .filter((block: any) => !!block.name)
      .map((block: any) => ({
        id: block.name,
        name: block.displayName || block.name,
        image: `https://minecraft.wiki/images/${block.name.replace(
          /_/g,
          "_"
        )}.png`,
        blast_resistance: block.blastResistance ?? 0,
        hardness: block.hardness ?? 0,
        tool_required: block.harvestTools
          ? Object.keys(block.harvestTools)[0]
          : "none",
      }));
    setBlocksData(blocks);
  };

  const loadMobsData = () => {
    // Usar minecraft-data para obtener mobs (entities)
    const mobs: MinecraftMob[] = Object.values(mcData.entities)
      .filter(
        (entity: any) =>
          entity.type === "mob" ||
          entity.type === "hostile" ||
          entity.type === "passive"
      )
      .map((entity: any) => ({
        id: entity.name,
        name: entity.displayName || entity.name,
        image: `https://minecraft.wiki/images/${entity.name.replace(
          /_/g,
          "_"
        )}.png`,
        health: entity.health ?? 20,
        damage: entity.damage ?? 0,
        spawn_biomes: entity.spawnBiomes || [],
        drops: entity.drops ? entity.drops.map((drop: any) => drop.name) : [],
      }));
    setMobsData(mobs);
  };
  const saveToHistory = useCallback(
    (type: string, query: string, data: any) => {
      const newEntry = {
        id: Date.now(),
        type,
        query,
        data,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [newEntry, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem(
        "minecraftToolboxHistory",
        JSON.stringify(updatedHistory)
      );
    },
    [history]
  );

  const deleteHistoryItem = (id: number) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("minecraftToolboxHistory", JSON.stringify(updated));
    notify({ message: "Entrada eliminada del historial", type: "info" });
  };

  const reloadHistoryItem = async (item: any) => {
    switch (item.type) {
      case "server":
        setServerInput(item.query);
        await lookupServer(item.query, true);
        break;
      case "player":
        setPlayerInput(item.query);
        await lookupPlayer(item.query, true);
        break;
      case "seed":
        setSeedInput(item.query);
        await lookupSeed(item.query, true);
        break;
    }
  };

  const setFeatureLoading = (feature: Feature, value: boolean) => {
    setLoading((prev) => ({ ...prev, [feature]: value }));
  };

  const lookupServer = async (input?: string, silent?: boolean) => {
    const query = input ?? serverInput;
    if (!query) return;

    setFeatureLoading("server", true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.mcsrvstat.us/${
          serverPlatform === "bedrock" ? "bedrock/" : ""
        }2/${query}`
      );

      if (!response.ok)
        throw new Error("No se pudo conectar con la API del servidor.");

      const data: ServerResponse = await response.json();

      if (data.online) {
        setServerData(data);
        if (!silent) {
          saveToHistory("server", query, data);
          notify({
            message: `Servidor ${data.hostname || data.ip} encontrado!`,
            type: "success",
          });
        }
      } else {
        setServerData(null);
        setError("Servidor offline o no encontrado");
        if (!silent)
          notify({
            message: "Servidor offline o no encontrado",
            type: "error",
          });
      }
    } catch (error: any) {
      setServerData(null);
      setError(error.message || "Error al buscar el servidor");
      if (!silent)
        notify({
          message: error.message || "Error al buscar el servidor",
          type: "error",
        });
    } finally {
      setFeatureLoading("server", false);
    }
  };

  const lookupPlayer = async (input?: string, silent?: boolean) => {
    const query = input ?? playerInput;
    if (!query) return;

    setFeatureLoading("skin", true);
    setFeatureLoading("player", true);
    setError(null);
    setPlayerNameHistory(null);
    setPlayerStats(null);

    try {
      // Primero obtenemos el UUID
      const uuidResponse = await fetch(
        `https://minecraft-api.com/api/uuid/${query}`
      );
      if (!uuidResponse.ok)
        throw new Error("No se pudo conectar con la API de UUID.");

      const uuidData = await uuidResponse.json();
      if (!uuidData.uuid) throw new Error("Jugador no encontrado");

      // Datos del jugador
      const skinData: PlayerSkinResponse = {
        uuid: uuidData.uuid,
        username: query,
        skin_url: `https://crafatar.com/skins/${uuidData.uuid}`,
        avatar: `https://crafatar.com/avatars/${uuidData.uuid}?size=100&overlay`,
        render: `https://crafatar.com/renders/body/${uuidData.uuid}?scale=4&overlay`,
        head: `https://crafatar.com/renders/head/${uuidData.uuid}?scale=4&overlay`,
        body: `https://crafatar.com/renders/body/${uuidData.uuid}?scale=4&overlay`,
        cape_url: `https://crafatar.com/capes/${uuidData.uuid}`,
        isAlexModel: Math.random() > 0.5, // Simulación de modelo Alex/Steve
      };

      setPlayerData(skinData);
      if (!silent) {
        saveToHistory("player", query, skinData);
        notify({
          message: `Datos de ${query} obtenidos!`,
          type: "success",
        });
      }

      // Historial de nombres
      try {
        const namesRes = await fetch(
          `https://api.mojang.com/user/profiles/${uuidData.uuid}/names`
        );
        if (namesRes.ok) {
          const names: PlayerNameHistory[] = await namesRes.json();
          setPlayerNameHistory(names.reverse());
        }
      } catch {
        /* opcional */
      }

      // Estadísticas simuladas más detalladas
      setPlayerStats({
        username: query,
        uuid: uuidData.uuid,
        kills: Math.floor(Math.random() * 1000),
        deaths: Math.floor(Math.random() * 1000),
        mob_kills: {
          zombie: Math.floor(Math.random() * 100),
          skeleton: Math.floor(Math.random() * 80),
          creeper: Math.floor(Math.random() * 50),
          enderman: Math.floor(Math.random() * 30),
        },
        playtime: `${Math.floor(Math.random() * 1000)} horas`,
        lastLogin: new Date(Date.now() - Math.random() * 1e10).toLocaleString(),
        achievements: [
          "¡A la aventura!",
          "Obtener arco",
          "Matar al Ender Dragon",
        ].slice(0, Math.floor(Math.random() * 3) + 1),
      });
    } catch (error: any) {
      setPlayerData(null);
      setError(error.message || "Error al buscar el jugador");
      if (!silent)
        notify({
          message: error.message || "Error al buscar el jugador",
          type: "error",
        });
    } finally {
      setFeatureLoading("skin", false);
      setFeatureLoading("player", false);
    }
  };

  const lookupSeed = async (input?: string, silent?: boolean) => {
    const query = input ?? seedInput;
    if (!query) return;

    setFeatureLoading("seed", true);
    setError(null);

    try {
      // Simulación de datos de semilla más detallados
      const mockSeedData: SeedInfo = {
        seed: query,
        biomes: [
          { name: "Plains", rarity: "common", coordinates: ["spawn"] },
          { name: "Forest", rarity: "common", coordinates: ["100, 200"] },
          {
            name: "Mushroom Fields",
            rarity: "rare",
            coordinates: ["-500, 800"],
          },
        ],
        structures: [
          {
            name: "Village",
            coordinates: "X: 100, Z: 200",
            loot: ["Iron Ingots", "Emeralds", "Books"],
          },
          {
            name: "Pillager Outpost",
            coordinates: "X: -300, Z: 400",
            loot: ["Crossbow", "Arrow", "Emerald"],
          },
        ],
        stronghold: {
          coordinates: "X: 1200, Z: -800",
          eyes_needed: 12,
        },
        monuments: [
          { name: "Desert Temple", coordinates: "X: 500, Z: -200" },
          { name: "Jungle Temple", coordinates: "X: -700, Z: 900" },
        ],
        spawn: "X: 0, Z: 0",
        nether_fortress: "X: 150, Z: -300 (Nether)",
        end_city: "X: 1000, Z: 1000 (End)",
        mineshaft: "X: -200, Z: 300 (Y: 30)",
        recommended: Math.random() > 0.7,
      };

      setSeedData(mockSeedData);
      if (!silent) {
        saveToHistory("seed", query, mockSeedData);
        notify({
          message: "Semilla analizada con éxito!",
          type: "success",
        });
      }
    } catch (error: any) {
      setSeedData(null);
      setError(error.message || "Error al analizar la semilla");
      if (!silent)
        notify({
          message: error.message || "Error al analizar la semilla",
          type: "error",
        });
    } finally {
      setFeatureLoading("seed", false);
    }
  };

  const copyToClipboard = (text: string, message?: string) => {
    navigator.clipboard.writeText(text);
    notify({
      message: message || "Copiado al portapapeles",
      type: "success",
    });
  };

  const loadFromHistory = (item: any) => {
    switch (item.type) {
      case "server":
        setActiveFeature("server");
        setServerInput(item.query);
        setServerData(item.data);
        break;
      case "player":
        setActiveFeature("skin");
        setPlayerInput(item.query);
        setPlayerData(item.data);
        break;
      case "seed":
        setActiveFeature("seed");
        setSeedInput(item.query);
        setSeedData(item.data);
        break;
    }
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("minecraftToolboxHistory");
    notify({
      message: "Historial borrado",
      type: "info",
    });
  };

  const downloadSkin = () => {
    if (!playerData) return;
    const link = document.createElement("a");
    link.href = playerData.skin_url;
    link.download = `${playerData.username}_skin.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify({
      message: "Descargando skin...",
      type: "success",
    });
  };

  const filteredItems = itemsData
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10);

  const filteredBlocks = blocksData
    .filter((block) =>
      block.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10);

  const filteredMobs = mobsData
    .filter(
      (mob) =>
        mob.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mob.spawn_biomes.some((b) =>
          b.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .slice(0, 10);

  const renderRarityBadge = (
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  ) => {
    const colors: Record<
      "common" | "uncommon" | "rare" | "epic" | "legendary",
      string
    > = {
      common: "bg-gray-500",
      uncommon: "bg-green-600",
      rare: "bg-blue-600",
      epic: "bg-purple-600",
      legendary: "bg-yellow-600",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs ${
          colors[rarity] || "bg-gray-700"
        } text-white`}
      >
        {rarity}
      </span>
    );
  };

  return (
    <div
      className="bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-green-700 max-w-6xl mx-auto relative 
      bg-[url('https://www.minecraft.net/content/dam/games/minecraft/key-art/MC_2020_Game_Clouds_1920x1080.jpg')] bg-cover bg-center bg-blend-overlay"
    >
      {/* Fondo con textura de piedra */}
      <div className="absolute inset-0 bg-[url('https://www.minecraft.net/content/dam/games/minecraft/key-art/MC_2020_Game_Clouds_1920x1080.jpg')] bg-cover bg-center opacity-20 -z-10 rounded-xl"></div>

      {/* Encabezado con estilo Minecraft */}
      <div className="flex items-center justify-between mb-6 border-b-2 border-green-700 pb-4">
        <h2 className="text-3xl font-bold text-green-400 flex items-center gap-3">
          <GiChest className="text-red-500 text-4xl" />
          <span className="text-shadow-lg shadow-green-800">
            Minecraft Toolbox
          </span>
          <GiChest className="text-yellow-500 text-3xl ml-2" />
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center gap-2 text-sm border border-gray-600"
          >
            <FaHistory /> Historial
          </button>
        </div>
      </div>

      {/* Navegación mejorada */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
        <button
          onClick={() => setActiveFeature("server")}
          className={`py-2 px-3 rounded-lg flex flex-col items-center transition-all duration-200 ${
            activeFeature === "server"
              ? "bg-green-800 text-white border-2 border-green-500"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
          }`}
          title="Información de servidores"
        >
          <FaServer className="text-xl mb-1" />
          <span className="text-xs">Servidor</span>
        </button>
        <button
          onClick={() => setActiveFeature("skin")}
          className={`py-2 px-3 rounded-lg flex flex-col items-center transition-all duration-200 ${
            activeFeature === "skin"
              ? "bg-green-800 text-white border-2 border-green-500"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
          }`}
          title="Skins de jugadores"
        >
          <FaUser className="text-xl mb-1" />
          <span className="text-xs">Skin</span>
        </button>
        <button
          onClick={() => setActiveFeature("seed")}
          className={`py-2 px-3 rounded-lg flex flex-col items-center transition-all duration-200 ${
            activeFeature === "seed"
              ? "bg-green-800 text-white border-2 border-green-500"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
          }`}
          title="Analizador de semillas"
        >
          <FaSeedling className="text-xl mb-1" />
          <span className="text-xs">Semillas</span>
        </button>
        <button
          onClick={() => setActiveFeature("player")}
          className={`py-2 px-3 rounded-lg flex flex-col items-center transition-all duration-200 ${
            activeFeature === "player"
              ? "bg-green-800 text-white border-2 border-green-500"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
          }`}
          title="Información de jugadores"
        >
          <GiSwordman className="text-xl mb-1" />
          <span className="text-xs">Jugador</span>
        </button>
        <button
          onClick={() => setActiveFeature("stats")}
          className={`py-2 px-3 rounded-lg flex flex-col items-center transition-all duration-200 ${
            activeFeature === "stats"
              ? "bg-green-800 text-white border-2 border-green-500"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
          }`}
          title="Estadísticas avanzadas"
        >
          <BiStats className="text-xl mb-1" />
          <span className="text-xs">Stats</span>
        </button>
        <button
          onClick={() => setActiveFeature("items")}
          className={`py-2 px-3 rounded-lg flex flex-col items-center transition-all duration-200 ${
            activeFeature === "items"
              ? "bg-green-800 text-white border-2 border-green-500"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
          }`}
          title="Base de datos de items"
        >
          <GiPistolGun className="text-xl mb-1" />
          <span className="text-xs">Items</span>
        </button>
        <button
          onClick={() => setActiveFeature("blocks")}
          className={`py-2 px-3 rounded-lg flex flex-col items-center transition-all duration-200 ${
            activeFeature === "blocks"
              ? "bg-green-800 text-white border-2 border-green-500"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
          }`}
          title="Base de datos de bloques"
        >
          <GiMineTruck className="text-xl mb-1" />
          <span className="text-xs">Bloques</span>
        </button>
        <button
          onClick={() => setActiveFeature("mobs")}
          className={`py-2 px-3 rounded-lg flex flex-col items-center transition-all duration-200 ${
            activeFeature === "mobs"
              ? "bg-green-800 text-white border-2 border-green-500"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
          }`}
          title="Base de datos de criaturas"
        >
          <GiSwordman className="text-xl mb-1" />
          <span className="text-xs">Mobs</span>
        </button>
      </div>

      {/* Historial */}
      {showHistory && (
        <div className="mb-6 bg-gray-800/90 rounded-lg p-4 border border-gray-600 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <FaHistory /> Historial de Búsquedas
            </h3>
            <div className="flex gap-2">
              <button
                onClick={clearHistory}
                className="px-3 py-1 bg-red-600/30 hover:bg-red-600/40 text-red-300 rounded text-sm flex items-center gap-1"
              >
                <FaTrash /> Limpiar
              </button>
              <button
                onClick={() => setShowHistory(false)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
          {history.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-2">
                No hay historial de búsquedas
              </p>
              <p className="text-gray-500 text-sm">
                Tus búsquedas aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="grid gap-2 max-h-96 overflow-y-auto pr-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-700/60 hover:bg-gray-700 rounded-lg flex justify-between items-center transition-colors border border-gray-600"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-green-300 capitalize flex items-center gap-2">
                        {item.type === "server" && <FaServer size={14} />}
                        {item.type === "player" && <FaUser size={14} />}
                        {item.type === "seed" && <FaSeedling size={14} />}
                        {item.type}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-white truncate flex items-center gap-2">
                      <span className="text-gray-400">Busqueda:</span>
                      {item.query}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      className="p-2 bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 rounded-lg transition-colors"
                      title="Recargar"
                      onClick={() => reloadHistoryItem(item)}
                    >
                      <FaRedo size={14} />
                    </button>
                    <button
                      className="p-2 bg-red-600/30 hover:bg-red-600/40 text-red-300 rounded-lg transition-colors"
                      title="Eliminar"
                      onClick={() => deleteHistoryItem(item.id)}
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 bg-red-900/60 text-red-200 rounded-lg p-3 text-sm border border-red-700 flex items-center gap-2">
          <FaQuestionCircle /> {error}
        </div>
      )}

      {/* Contenido según feature activo */}
      <div className="bg-gray-800/90 rounded-lg p-6 border border-gray-600 backdrop-blur-sm">
        {activeFeature === "server" && (
          <div>
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <FaServer /> Buscador de Servidores
            </h3>

            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={serverInput}
                  onChange={(e) => setServerInput(e.target.value)}
                  placeholder="Dirección IP o dominio del servidor"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  onKeyPress={(e) => e.key === "Enter" && lookupServer()}
                />
                {serverInput && (
                  <button
                    onClick={() => setServerInput("")}
                    className="absolute right-12 top-3 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
              <select
                value={serverPlatform}
                onChange={(e) =>
                  setServerPlatform(e.target.value as ServerPlatform)
                }
                className="px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600"
              >
                <option value="java">Java Edition</option>
                <option value="bedrock">Bedrock Edition</option>
              </select>
              <button
                onClick={() => lookupServer()}
                disabled={loading.server}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading.server ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Buscando...
                  </div>
                ) : (
                  <>
                    <FaSearch /> Buscar
                  </>
                )}
              </button>
            </div>

            {serverData && (
              <div className="mt-6 bg-gray-900 rounded-lg p-5 border border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        {serverData.hostname || serverData.ip}
                        {serverData.port &&
                          serverData.port !== 25565 &&
                          `:${serverData.port}`}
                        <button
                          className="text-green-300 hover:text-green-500 transition-colors"
                          title="Copiar IP"
                          onClick={() =>
                            copyToClipboard(
                              `${serverData.ip}${
                                serverData.port && serverData.port !== 25565
                                  ? `:${serverData.port}`
                                  : ""
                              }`,
                              "IP del servidor copiada!"
                            )
                          }
                        >
                          <FaCopy />
                        </button>
                      </h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            serverData.online
                              ? "bg-green-900/50 text-green-400"
                              : "bg-red-900/50 text-red-400"
                          }`}
                        >
                          {serverData.online ? "Online" : "Offline"}
                        </span>
                        {serverData.version && (
                          <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded text-xs">
                            v{serverData.version}
                          </span>
                        )}
                        {serverData.gamemode && (
                          <span className="bg-purple-900/50 text-purple-400 px-2 py-1 rounded text-xs">
                            {serverData.gamemode}
                          </span>
                        )}
                      </div>
                    </div>

                    {serverData.software && (
                      <p className="text-gray-300 text-sm mb-1">
                        <span className="text-gray-400">Software:</span>{" "}
                        {serverData.software}
                      </p>
                    )}
                    {serverData.map && (
                      <p className="text-gray-300 text-sm">
                        <span className="text-gray-400">Mapa:</span>{" "}
                        {serverData.map}
                      </p>
                    )}
                  </div>
                  {serverData.icon && (
                    <img
                      src={`data:image/png;base64,${serverData.icon}`}
                      alt="Server icon"
                      className="w-20 h-20 rounded-lg border border-gray-600"
                    />
                  )}
                </div>

                {serverData.motd?.clean && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-gray-400 text-sm font-medium">
                        MOTD:
                      </h5>
                      {serverData.motd.html && (
                        <button
                          onClick={() => setShowMotdHtml(!showMotdHtml)}
                          className="text-xs text-green-400 hover:text-green-300"
                        >
                          {showMotdHtml ? "Ver texto" : "Ver formato original"}
                        </button>
                      )}
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      {showMotdHtml && serverData.motd.html ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: serverData.motd.html.join("<br/>"),
                          }}
                          className="minecraft-motd"
                        />
                      ) : (
                        serverData.motd.clean.map((line, i) => (
                          <p key={i} className="text-white">
                            {line}
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {serverData.players && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <h5 className="text-gray-400 text-sm font-medium mb-2">
                        Jugadores:
                      </h5>
                      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <p className="text-white mb-3">
                          <span className="text-green-400 font-bold">
                            {serverData.players.online}
                          </span>{" "}
                          /
                          <span className="text-gray-400">
                            {" "}
                            {serverData.players.max}
                          </span>{" "}
                          jugadores conectados
                        </p>
                        {serverData.players.list &&
                          serverData.players.list.length > 0 && (
                            <div>
                              <p className="text-gray-400 text-sm font-medium mb-2">
                                Jugadores online (
                                {serverData.players.list.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {serverData.players.list.map((player, i) => (
                                  <div
                                    key={i}
                                    className="bg-gray-700 px-3 py-1 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-600 transition-colors cursor-pointer"
                                    onClick={() => {
                                      setPlayerInput(player);
                                      setActiveFeature("player");
                                      lookupPlayer(player);
                                    }}
                                  >
                                    <FaUser
                                      size={12}
                                      className="text-gray-400"
                                    />
                                    {player}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-gray-400 text-sm font-medium mb-2">
                        Información del Servidor:
                      </h5>
                      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        {serverData.software && (
                          <p className="text-white mb-2">
                            <span className="text-gray-400">Software:</span>{" "}
                            {serverData.software}
                          </p>
                        )}
                        {serverData.plugins && (
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-400 text-sm font-medium">
                                Plugins ({serverData.plugins.length}):
                              </span>
                              <button
                                onClick={() =>
                                  serverData.plugins &&
                                  copyToClipboard(
                                    serverData.plugins.join(", "),
                                    "Plugins copiados!"
                                  )
                                }
                                className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                              >
                                <FaCopy size={10} /> Copiar todos
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                              {serverData.plugins.map((plugin, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-600 transition-colors cursor-default"
                                  title={plugin}
                                >
                                  {plugin.length > 20
                                    ? `${plugin.substring(0, 20)}...`
                                    : plugin}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {serverData.mods && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-400 text-sm font-medium">
                                Mods ({serverData.mods.length}):
                              </span>
                              <button
                                onClick={() =>
                                  serverData.mods &&
                                  copyToClipboard(
                                    serverData.mods.join(", "),
                                    "Mods copiados!"
                                  )
                                }
                                className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                              >
                                <FaCopy size={10} /> Copiar todos
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                              {serverData.mods.map((mod, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-600 transition-colors cursor-default"
                                  title={mod}
                                >
                                  {mod.length > 20
                                    ? `${mod.substring(0, 20)}...`
                                    : mod}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeFeature === "skin" && (
          <div>
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <FaUser /> Buscador de Skins
            </h3>

            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={playerInput}
                  onChange={(e) => setPlayerInput(e.target.value)}
                  placeholder="Nombre de usuario Minecraft"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  onKeyPress={(e) => e.key === "Enter" && lookupPlayer()}
                />
                {playerInput && (
                  <button
                    onClick={() => setPlayerInput("")}
                    className="absolute right-12 top-3 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                onClick={() => lookupPlayer()}
                disabled={loading.skin || loading.player}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading.skin || loading.player ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Buscando...
                  </div>
                ) : (
                  <>
                    <FaSearch /> Buscar
                  </>
                )}
              </button>
            </div>

            {playerData && (
              <div className="mt-6 bg-gray-900 rounded-lg p-5 border border-gray-700">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <img
                        src={playerData.render}
                        alt="Skin render"
                        className="w-48 h-48 rounded-lg bg-gray-800 border-2 border-gray-600 hover:border-green-500 transition-colors"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <button
                          onClick={downloadSkin}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                        >
                          <FaDownload /> Descargar Skin
                        </button>
                      </div>
                    </div>
                    {playerData.cape_url && (
                      <div className="relative">
                        <img
                          src={playerData.cape_url}
                          alt="Cape"
                          className="w-32 h-20 rounded bg-gray-800 border border-gray-600"
                        />
                        <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                          Cape
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-3">
                      {playerData.username}
                      <span className="ml-2 text-sm font-normal text-gray-400">
                        (
                        {playerData.isAlexModel
                          ? "Modelo Alex"
                          : "Modelo Steve"}
                        )
                      </span>
                    </h4>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={playerData.avatar}
                          alt="Avatar"
                          className="w-12 h-12 rounded-lg border border-gray-600"
                        />
                        <div>
                          <p className="text-gray-400 text-xs">UUID:</p>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-green-300 text-sm cursor-pointer hover:text-green-200 transition-colors"
                              onClick={() =>
                                copyToClipboard(
                                  playerData.uuid,
                                  "UUID copiado!"
                                )
                              }
                              title="Copiar UUID"
                            >
                              {playerData.uuid.substring(0, 8)}...
                              {playerData.uuid.substring(28)}
                            </span>
                            <FaCopy
                              className="text-gray-400 hover:text-white cursor-pointer"
                              size={12}
                              onClick={() =>
                                copyToClipboard(
                                  playerData.uuid,
                                  "UUID copiado!"
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-gray-400 text-sm font-medium mb-1">
                          Skin URL:
                        </h5>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={playerData.skin_url}
                            readOnly
                            className="flex-1 px-3 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 truncate"
                          />
                          <button
                            className="p-1 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600"
                            onClick={() =>
                              copyToClipboard(
                                playerData.skin_url,
                                "URL de skin copiada!"
                              )
                            }
                            title="Copiar URL"
                          >
                            <FaCopy size={12} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-gray-400 text-sm font-medium mb-1">
                          Render 3D:
                        </h5>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={playerData.render}
                            readOnly
                            className="flex-1 px-3 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 truncate"
                          />
                          <button
                            className="p-1 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600"
                            onClick={() =>
                              copyToClipboard(
                                playerData.render,
                                "URL de render copiada!"
                              )
                            }
                            title="Copiar URL"
                          >
                            <FaCopy size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                        onClick={() =>
                          window.open(playerData.skin_url, "_blank")
                        }
                      >
                        <FaGlobe /> Ver Skin PNG
                      </button>
                      <button
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                        onClick={() =>
                          window.open(
                            `https://namemc.com/profile/${playerData.username}`,
                            "_blank"
                          )
                        }
                      >
                        <FaUser /> Ver en NameMC
                      </button>
                      <button
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                        onClick={downloadSkin}
                      >
                        <FaDownload /> Descargar Skin
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sección de estadísticas */}
                {playerStats && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                        <BiStats /> Estadísticas Básicas
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-xs">Kills:</p>
                          <p className="text-white font-bold">
                            {playerStats.kills}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Deaths:</p>
                          <p className="text-white font-bold">
                            {playerStats.deaths}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">K/D Ratio:</p>
                          <p className="text-white font-bold">
                            {(
                              playerStats.kills / (playerStats.deaths || 1)
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">
                            Tiempo jugado:
                          </p>
                          <p className="text-white font-bold">
                            {playerStats.playtime}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-400 text-xs">Último login:</p>
                          <p className="text-white font-bold">
                            {playerStats.lastLogin}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                        <GiSwordman /> Estadísticas de Mobs
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(playerStats.mob_kills).map(
                          ([mob, count]) => (
                            <div key={mob}>
                              <p className="text-gray-400 text-xs capitalize">
                                {mob}:
                              </p>
                              <p className="text-white font-bold">{count}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {playerStats.achievements.length > 0 && (
                      <div className="md:col-span-2 bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                          <FaBook /> Logros
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {playerStats.achievements.map((ach, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs"
                            >
                              {ach}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Historial de nombres */}
                {playerNameHistory && (
                  <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                      <FaHistory /> Historial de Nombres
                    </h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 border-b border-gray-700">
                          <tr>
                            <th className="px-4 py-2">Nombre</th>
                            <th className="px-4 py-2">Fecha de cambio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {playerNameHistory.map((n, i) => (
                            <tr
                              key={i}
                              className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium text-white">
                                {n.name}
                                {i === 0 && (
                                  <span className="ml-2 bg-green-900/30 text-green-300 px-2 py-0.5 rounded-full text-xs">
                                    Actual
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {n.changedToAt ? (
                                  new Date(n.changedToAt).toLocaleDateString()
                                ) : (
                                  <span className="text-gray-500">
                                    Original
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeFeature === "seed" && (
          <div>
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <FaSeedling /> Analizador de Semillas
            </h3>

            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  placeholder="Semilla de Minecraft (números o texto)"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  onKeyPress={(e) => e.key === "Enter" && lookupSeed()}
                />
                {seedInput && (
                  <button
                    onClick={() => setSeedInput("")}
                    className="absolute right-12 top-3 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
              <select
                value={dimension}
                onChange={(e) => setDimension(e.target.value as Dimension)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600"
              >
                <option value="overworld">Overworld</option>
                <option value="nether">Nether</option>
                <option value="end">The End</option>
              </select>
              <button
                onClick={() => lookupSeed()}
                disabled={loading.seed}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading.seed ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analizando...
                  </div>
                ) : (
                  <>
                    <FaSearch /> Analizar
                  </>
                )}
              </button>
            </div>

            {seedData && (
              <div className="mt-6 bg-gray-900 rounded-lg p-5 border border-gray-700">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-1">
                      Semilla:{" "}
                      <span className="text-green-300">{seedData.seed}</span>
                    </h4>
                    {seedData.recommended && (
                      <span className="inline-block bg-green-900/50 text-green-300 px-2 py-1 rounded text-xs mb-2">
                        ★ Semilla recomendada
                      </span>
                    )}
                    <p className="text-gray-300">
                      Dimensión:{" "}
                      <span className="text-white capitalize">{dimension}</span>
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(seedData.seed, "Semilla copiada!")
                    }
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 text-sm"
                  >
                    <FaCopy /> Copiar Semilla
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sección de spawn */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                      <FaGlobe /> Spawn Point
                    </h5>
                    <p className="text-white mb-2">{seedData.spawn}</p>
                    {dimension === "overworld" && seedData.recommended && (
                      <p className="text-green-300 text-sm">
                        Buena ubicación de spawn con recursos cercanos
                      </p>
                    )}
                  </div>

                  {/* Sección de biomas */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                      <FaSeedling /> Biomas Principales
                    </h5>
                    <div className="space-y-3">
                      {seedData.biomes.map((biome, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <p className="text-white capitalize">
                              {biome.name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {biome.rarity}
                            </p>
                          </div>
                          <div className="text-right">
                            {biome.coordinates.map((coord, j) => (
                              <p key={j} className="text-green-300 text-xs">
                                {coord}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sección de estructuras */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                      <GiChest /> Estructuras Importantes
                    </h5>
                    <div className="space-y-3">
                      {seedData.structures.map((structure, i) => (
                        <div key={i} className="mb-3">
                          <div className="flex justify-between items-start">
                            <p className="text-white capitalize font-medium">
                              {structure.name}
                            </p>
                            <p className="text-green-300 text-xs">
                              {structure.coordinates}
                            </p>
                          </div>
                          {structure.loot && (
                            <div className="mt-1">
                              <p className="text-gray-400 text-xs mb-1">
                                Botín:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {structure.loot.map((item, j) => (
                                  <span
                                    key={j}
                                    className="bg-gray-700 px-2 py-1 rounded text-xs"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fortaleza del Nether (si está en la dimensión correcta) */}
                  {dimension === "nether" && seedData.nether_fortress && (
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 col-span-full">
                      <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                        <GiSwordman /> Fortaleza del Nether
                      </h5>
                      <p className="text-white">{seedData.nether_fortress}</p>
                    </div>
                  )}

                  {/* Ciudad del End (si está en la dimensión correcta) */}
                  {dimension === "end" && seedData.end_city && (
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 col-span-full">
                      <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                        <GiSwordman /> Ciudad del End
                      </h5>
                      <p className="text-white">{seedData.end_city}</p>
                    </div>
                  )}

                  {/* Stronghold */}
                  {dimension === "overworld" && seedData.stronghold && (
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 col-span-full">
                      <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                        <GiChest /> Stronghold
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-white">
                            Ubicación: {seedData.stronghold.coordinates}
                          </p>
                          {seedData.stronghold.eyes_needed && (
                            <p className="text-white">
                              Ojos de Ender necesarios:{" "}
                              {seedData.stronghold.eyes_needed}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <button
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                            onClick={() =>
                              copyToClipboard(
                                seedData.stronghold.coordinates,
                                "Coordenadas copiadas!"
                              )
                            }
                          >
                            <FaCopy /> Copiar Coordenadas
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Monumentos adicionales */}
                  {seedData.monuments &&
                    seedData.monuments.length > 0 &&
                    dimension === "overworld" && (
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 col-span-full">
                        <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                          <GiMineTruck /> Monumentos Adicionales
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {seedData.monuments.map((monument, i) => (
                            <div
                              key={i}
                              className="bg-gray-700/50 p-3 rounded-lg"
                            >
                              <p className="text-white capitalize font-medium">
                                {monument.name}
                              </p>
                              <p className="text-green-300 text-sm">
                                {monument.coordinates}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="mt-6">
                  <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                    <FaInfoCircle /> Información Adicional
                  </h5>
                  <p className="text-gray-300 text-sm mb-2">
                    Esta semilla ha sido analizada por nuestro sistema y
                    contiene una variedad de biomas y estructuras.
                  </p>
                  <p className="text-gray-300 text-sm">
                    Puedes usar esta semilla para explorar el mundo de Minecraft
                    con recursos interesantes y ubicaciones únicas.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeFeature === "player" && (
          <div>
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <GiSwordman /> Estadísticas de Jugador
            </h3>

            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={playerInput}
                  onChange={(e) => setPlayerInput(e.target.value)}
                  placeholder="Nombre de usuario Minecraft"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  onKeyPress={(e) => e.key === "Enter" && lookupPlayer()}
                />
                {playerInput && (
                  <button
                    onClick={() => setPlayerInput("")}
                    className="absolute right-12 top-3 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                onClick={() => lookupPlayer()}
                disabled={loading.player}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading.player ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Buscando...
                  </div>
                ) : (
                  <>
                    <FaSearch /> Buscar
                  </>
                )}
              </button>
            </div>

            {playerStats && (
              <div className="mt-6 bg-gray-900 rounded-lg p-5 border border-gray-700">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                  {playerData && (
                    <div className="flex flex-col items-center">
                      <img
                        src={playerData.avatar}
                        alt="Avatar"
                        className="w-24 h-24 rounded-lg border-2 border-gray-600"
                      />
                      <h4 className="text-xl font-bold text-white mt-2">
                        {playerStats.username}
                      </h4>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Kills</p>
                      <p className="text-2xl font-bold text-green-400">
                        {playerStats.kills}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Deaths</p>
                      <p className="text-2xl font-bold text-red-400">
                        {playerStats.deaths}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">K/D Ratio</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {(
                          playerStats.kills / (playerStats.deaths || 1)
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Playtime</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {playerStats.playtime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Estadísticas de Mobs */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                      <GiSwordman /> Mobs Eliminados
                    </h5>
                    <div className="space-y-3">
                      {Object.entries(playerStats.mob_kills).map(
                        ([mob, count]) => (
                          <div
                            key={mob}
                            className="flex justify-between items-center"
                          >
                            <span className="text-white capitalize">{mob}</span>
                            <span className="text-green-300 font-bold">
                              {count}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Logros */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h5 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                      <FaBook /> Logros
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {playerStats.achievements.length > 0 ? (
                        playerStats.achievements.map((ach, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs"
                          >
                            {ach}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-400">
                          No hay logros registrados
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Último login */}
                <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h5 className="text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <FaHistory /> Actividad
                  </h5>
                  <p className="text-white">
                    Último login:{" "}
                    <span className="text-green-300">
                      {playerStats.lastLogin}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeFeature === "stats" && (
          <div>
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <BiStats /> Estadísticas Globales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-900 rounded-lg p-5 border border-green-700 text-center">
                <div className="text-5xl font-bold text-green-400 mb-2">
                  1.2B+
                </div>
                <div className="text-gray-300">Jugadores registrados</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-5 border border-blue-700 text-center">
                <div className="text-5xl font-bold text-blue-400 mb-2">
                  238M+
                </div>
                <div className="text-gray-300">Copias vendidas</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-5 border border-yellow-700 text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">
                  180+
                </div>
                <div className="text-gray-300">Países jugando</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-5 border border-gray-700 mb-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FaGlobe /> Distribución de Jugadores
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">América</p>
                  <p className="text-xl font-bold text-white">42%</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Europa</p>
                  <p className="text-xl font-bold text-white">31%</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Asia</p>
                  <p className="text-xl font-bold text-white">19%</p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Otros</p>
                  <p className="text-xl font-bold text-white">8%</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-5 border border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <GiChest /> Datos Curiosos
              </h4>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h5 className="text-green-400 font-medium mb-2">
                    Bloque más común
                  </h5>
                  <p className="text-white">
                    Piedra - 25% de todos los bloques colocados
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h5 className="text-green-400 font-medium mb-2">
                    Mob más eliminado
                  </h5>
                  <p className="text-white">
                    Zombie - Más de 1 billón eliminados diariamente
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h5 className="text-green-400 font-medium mb-2">
                    Estructura más buscada
                  </h5>
                  <p className="text-white">
                    Aldeas - 68% de los jugadores las buscan primero
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeFeature === "items" && (
          <div>
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <GiPistolGun /> Base de Datos de Items
            </h3>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar items por nombre o categoría..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2"
              >
                {viewMode === "grid" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0  011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Lista
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid
                  </>
                )}
              </button>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-900 rounded-lg p-3 border border-gray-700 hover:border-green-500 transition-colors cursor-pointer group"
                  >
                    <div className="relative mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-24 object-contain"
                      />
                      <div className="absolute bottom-1 right-1">
                        {renderRarityBadge(item.rarity)}
                      </div>
                    </div>
                    <h4 className="text-white font-medium text-center group-hover:text-green-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-gray-400 text-xs text-center capitalize">
                      {item.category}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Categoría</th>
                      <th className="px-4 py-3">Rareza</th>
                      <th className="px-4 py-3">Receta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-white flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8"
                          />
                          {item.name}
                        </td>
                        <td className="px-4 py-3 capitalize">
                          {item.category}
                        </td>
                        <td className="px-4 py-3">
                          {renderRarityBadge(item.rarity)}
                        </td>
                        <td className="px-4 py-3">
                          {item.recipe ? (
                            <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                              {item.recipe}
                            </span>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400">No se encontraron items</p>
                <p className="text-gray-500 text-sm mt-1">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            )}
          </div>
        )}

        {activeFeature === "blocks" && (
          <div>
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <GiMineTruck /> Base de Datos de Bloques
            </h3>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar bloques por nombre..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredBlocks.map((block) => (
                <div
                  key={block.id}
                  className="bg-gray-900 rounded-lg p-3 border border-gray-700 hover:border-green-500 transition-colors cursor-pointer group"
                >
                  <div className="relative mb-3">
                    <img
                      src={block.image}
                      alt={block.name}
                      className="w-full h-24 object-contain"
                    />
                  </div>
                  <h4 className="text-white font-medium text-center group-hover:text-green-400 transition-colors">
                    {block.name}
                  </h4>
                  <div className="mt-2 flex justify-center gap-2">
                    <span
                      className="text-xs bg-gray-700 px-2 py-1 rounded"
                      title="Resistencia a explosiones"
                    >
                      💥 {block.blast_resistance}
                    </span>
                    <span
                      className="text-xs bg-gray-700 px-2 py-1 rounded"
                      title="Dureza"
                    >
                      ⛏️ {block.hardness}
                    </span>
                  </div>
                  {block.tool_required && (
                    <p className="text-gray-400 text-xs text-center mt-1">
                      Herramienta:{" "}
                      <span className="text-yellow-300">
                        {block.tool_required}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {filteredBlocks.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400">No se encontraron bloques</p>
                <p className="text-gray-500 text-sm mt-1">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            )}
          </div>
        )}

        {activeFeature === "mobs" && (
          <div>
            <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <GiSwordman /> Base de Datos de Mobs
            </h3>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar mobs por nombre o bioma..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMobs.map((mob) => (
                <div
                  key={mob.id}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-red-500 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={mob.image}
                      alt={mob.name}
                      className="w-20 h-20 object-contain rounded-lg border border-gray-600"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg">
                        {mob.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 mb-2">
                        <span className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">
                          ❤️ {mob.health} HP
                        </span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                          ⚔️ {mob.damage} daño
                        </span>
                      </div>

                      <div className="mb-2">
                        <p className="text-gray-400 text-xs mb-1">
                          Aparece en:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {mob.spawn_biomes.map((biome, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-700 px-2 py-1 rounded capitalize"
                            >
                              {biome}
                            </span>
                          ))}
                        </div>
                      </div>

                      {mob.drops.length > 0 && (
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Drops:</p>
                          <div className="flex flex-wrap gap-1">
                            {mob.drops.map((drop, i) => (
                              <span
                                key={i}
                                className="text-xs bg-gray-700 px-2 py-1 rounded"
                              >
                                {drop}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMobs.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400">No se encontraron mobs</p>
                <p className="text-gray-500 text-sm mt-1">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>
            Nebura © {new Date().getFullYear()} - No afiliado a
            Mojang o Microsoft
          </p>
          <p className="mt-1">
            Datos proporcionados por varias APIs públicas de Minecraft
          </p>
        </div>
      </div>
    </div>
  );
};
export default MinecraftToolbox;
