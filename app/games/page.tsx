"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	FaBook, FaCalendar, FaChess, FaDungeon, FaFile, FaGamepad, FaGithub, FaSearch, FaSkull, FaStar,
	FaTwitch
} from "react-icons/fa";
import { FiGithub, FiMail, FiTwitter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog } from "@headlessui/react";

const backgroundImages = [
  "https://i.pinimg.com/736x/d5/5b/6c/d55b6c725a66bd51dde099652c95cda4.jpg",
  "https://i.pinimg.com/736x/7e/4a/71/7e4a71b6f79187f77289beaa1e1d476c.jpg",
  "https://i.pinimg.com/736x/ac/f6/79/acf679c008fc6233bfc94a129f1be54f.jpg",
];

interface Anime {
  mal_id: number;
  title: string;
  images: {
    webp: {
      image_url: string;
    };
  };
  score: number;
  type: string;
  episodes?: number;
  status?: string;
  season?: string;
  year?: number;
  genres?: Array<{
    name: string;
  }>;
}

// Tipos para jugadores de ajedrez
interface ChessPlayer {
  username: string;
  player_id: number;
  title?: string;
  avatar?: string;
  url: string;
  followers: number;
  twitch_url?: string;
  is_streamer: boolean;
}

// Tipos para anime/manga
interface AnimeManga {
  mal_id: number;
  title: string;
  images: {
    webp: {
      image_url: string;
    };
  };
  score: number;
  type: string;
}

// Agrega esta interfaz al inicio con las demás interfaces
interface DungeonGameState {
  player: {
    x: number;
    y: number;
    health: number;
    attack: number;
    direction: "up" | "down" | "left" | "right";
    attacking: boolean;
  };
  enemies: Array<{
    id: number;
    x: number;
    y: number;
    health: number;
    type: "goblin" | "skeleton" | "slime";
  }>;
  doors: Array<{
    id: number;
    x: number;
    y: number;
    locked: boolean;
  }>;
  items: Array<{
    id: number;
    x: number;
    y: number;
    type: "health" | "key" | "treasure";
  }>;
  level: number;
  gameStarted: boolean;
  gameOver: boolean;
  victory: boolean;
  message: string | null;
}

export default function EntertainmentPage() {
  // Estados para ajedrez
  const [chessPlayer, setChessPlayer] = useState<ChessPlayer | null>(null);
  const [chessSearch, setChessSearch] = useState("");
  const [chessStreamers, setChessStreamers] = useState<ChessPlayer[]>([]);
  const [chessLoading, setChessLoading] = useState(false);

  // Estados para anime/manga
  const [animeRecs, setAnimeRecs] = useState<any[]>([]);
  const [mangaRecs, setMangaRecs] = useState<any[]>([]);
  const [recLoading, setRecLoading] = useState(false);

  // Estado para modal de detalles
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [modalType, setModalType] = useState<"game" | "anime" | "manga" | null>(
    null
  );

  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [seasonNow, setSeasonNow] = useState<Anime[]>([]);
  const [animeLoading, setAnimeLoading] = useState({
    top: false,
    season: false,
  });

  // Estado para notificaciones
  const [notification, setNotification] = useState<string | null>(null);

  // Scroll to top
  const [showScroll, setShowScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mostrar notificación temporal
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Animación extra para tarjetas (rebote)
  const cardHover = {
    whileHover: { scale: 1.06, rotate: 1 },
    transition: { type: "spring", stiffness: 300, damping: 15 },
  };

  // Función para abrir modal
  const openModal = (item: any, type: "game" | "anime" | "manga") => {
    setModalContent(item);
    setModalType(type);
    setModalOpen(true);
  };

  // Función para cerrar modal
  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setModalType(null);
  };

  const fetchTopAnime = async () => {
    setAnimeLoading((prev) => ({ ...prev, top: true }));
    try {
      const res = await fetch("https://api.jikan.moe/v4/top/anime");
      const data = await res.json();
      setTopAnime(data.data.slice(0, 20));
    } catch (error) {
      console.error("Error fetching top anime:", error);
      setTopAnime([]);
      showNotification("No se pudieron cargar los animes más populares.");
    }
    setAnimeLoading((prev) => ({ ...prev, top: false }));
  };

  const fetchSeasonNow = async () => {
    setAnimeLoading((prev) => ({ ...prev, season: true }));
    try {
      const res = await fetch("https://api.jikan.moe/v4/seasons/now");
      const data = await res.json();
      setSeasonNow(data.data.slice(0, 20));
    } catch (error) {
      console.error("Error fetching current season anime:", error);
      setSeasonNow([]);
      showNotification("No se pudieron cargar los animes de esta temporada.");
    }
    setAnimeLoading((prev) => ({ ...prev, season: false }));
  };

  // Buscar jugador de ajedrez
  const searchChessPlayer = async () => {
    if (!chessSearch.trim()) return;

    setChessLoading(true);
    try {
      const res = await fetch(
        `https://api.chess.com/pub/player/${chessSearch.toLowerCase()}`
      );
      const data = await res.json();
      setChessPlayer(data);
    } catch (error) {
      console.error("Error fetching chess player:", error);
      setChessPlayer(null);
    }
    setChessLoading(false);
  };

  // Obtener streamers de ajedrez
  const fetchChessStreamers = async () => {
    setChessLoading(true);
    try {
      const res = await fetch("https://api.chess.com/pub/streamers");
      const data = await res.json();
      setChessStreamers(data.streamers);
    } catch (error) {
      console.error("Error fetching chess streamers:", error);
    }
    setChessLoading(false);
  };

  // Obtener recomendaciones de anime/manga
  const fetchRecommendations = async () => {
    setRecLoading(true);
    try {
      // Anime recomendados
      const animeRes = await fetch(
        "https://api.jikan.moe/v4/top/anime?filter=bypopularity"
      );
      const animeData = await animeRes.json();
      setAnimeRecs(
        Array.isArray(animeData.data) ? animeData.data.slice(0, 20) : []
      );

      // Manga recomendados
      const mangaRes = await fetch(
        "https://api.jikan.moe/v4/top/manga?filter=bypopularity"
      );
      const mangaData = await mangaRes.json();
      setMangaRecs(
        Array.isArray(mangaData.data) ? mangaData.data.slice(0, 20) : []
      );
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setAnimeRecs([]);
      setMangaRecs([]);
    }
    setRecLoading(false);
  };

  // Efectos iniciales
  useEffect(() => {
    fetchChessStreamers();
    fetchRecommendations();
    fetchTopAnime();
    fetchSeasonNow();
  }, []);

  function ParticleBurst() {
    const [particles, setParticles] = useState<
      { x: number; y: number; id: number }[]
    >([]);
    const idRef = useRef(0);

    const handleClick = (e: React.MouseEvent) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setParticles((prev) => [
        ...prev,
        {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          id: idRef.current++,
        },
      ]);
    };

    return (
      <div
        className="fixed inset-0 pointer-events-none z-[999]"
        onClick={handleClick}
        style={{ position: "fixed", inset: 0 }}
      >
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
            animate={{
              opacity: 0,
              scale: 2,
              x: p.x + (Math.random() - 0.5) * 100,
              y: p.y + (Math.random() - 0.5) * 100,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: "absolute", left: 0, top: 0 }}
            onAnimationComplete={() =>
              setParticles((prev) => prev.filter((part) => part.id !== p.id))
            }
          >
            {Math.random() > 0.5 ? (
              <FaStar className="text-yellow-400 text-2xl drop-shadow" />
            ) : (
              <FaGamepad className="text-blue-400 text-2xl drop-shadow" />
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  function MiniGame() {
    const [show, setShow] = useState(false);
    const [score, setScore] = useState(0);
    const [playerY, setPlayerY] = useState(0); // 0 = suelo, 1 = saltando
    const [jumping, setJumping] = useState(false);
    const [obstacles, setObstacles] = useState<{ id: number; x: number }[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [speed, setSpeed] = useState(6);
    const gameRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const nextObsId = useRef(0);

    // Animación de aparición del botón
    const buttonVariants = {
      initial: { scale: 1, rotate: 0 },
      hover: { scale: 1.08, rotate: -2, boxShadow: "0 0 0 4px #ffe066" },
      tap: { scale: 0.97, rotate: 2 },
    };

    // Estilo tipo mazmorra para el botón
    const dungeonButtonStyle =
      "relative px-5 py-2 font-bold text-yellow-200 bg-gradient-to-br from-yellow-800 via-yellow-700 to-yellow-900 border-4 border-yellow-600 rounded-none shadow-lg transition-all duration-200 outline outline-2 outline-yellow-900 hover:bg-yellow-700 hover:text-yellow-100 before:absolute before:inset-0 before:border-4 before:border-yellow-900 before:pointer-events-none before:rounded-none";

    // Iniciar juego
    const startGame = () => {
      setShow(true);
      setScore(0);
      setPlayerY(0);
      setJumping(false);
      setObstacles([]);
      setGameOver(false);
      setSpeed(6);
    };

    // Lógica del juego tipo runner
    useEffect(() => {
      if (!show || gameOver) return;
      intervalRef.current && clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setObstacles((prev) =>
          prev
            .map((obs) => ({ ...obs, x: obs.x - speed }))
            .filter((obs) => obs.x > -40)
        );
        // Añadir obstáculo aleatorio
        if (Math.random() < 0.025 + score * 0.0008) {
          setObstacles((prev) => [
            ...prev,
            { id: nextObsId.current++, x: 400 },
          ]);
        }
      }, 16);

      return () => {
        intervalRef.current && clearInterval(intervalRef.current);
      };
    }, [show, speed, score, gameOver]);

    // Colisiones y puntaje
    useEffect(() => {
      if (!show || gameOver) return;
      for (const obs of obstacles) {
        // Si el obstáculo está cerca del jugador
        if (obs.x < 60 && obs.x > 20 && playerY === 0) {
          setGameOver(true);
          setTimeout(() => setShow(false), 1200);
          return;
        }
        // Puntaje por esquivar
        if (obs.x === 19) setScore((s) => s + 1);
      }
      // Aumentar velocidad cada 10 puntos
      if (score > 0 && score % 10 === 0) setSpeed(6 + Math.floor(score / 10));
    }, [obstacles, playerY, show, gameOver, score, speed]);

    // Saltar
    const jump = () => {
      if (jumping || gameOver) return;
      setJumping(true);
      setPlayerY(1);
      setTimeout(() => {
        setPlayerY(0);
        setJumping(false);
      }, 420);
    };

    // Tecla espacio para saltar
    useEffect(() => {
      if (!show || gameOver) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.code === "Space") jump();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [show, jumping, gameOver]);

    // Reiniciar al cerrar
    useEffect(() => {
      if (!show) {
        setTimeout(() => {
          setScore(0);
          setObstacles([]);
          setGameOver(false);
          setPlayerY(0);
          setSpeed(6);
        }, 400);
      }
    }, [show]);

    return (
      <>
        <motion.button
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className={dungeonButtonStyle + " text-xs flex items-center gap-2"}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            borderImage: "linear-gradient(90deg,#ffe066,#a67c00) 1",
            minWidth: 180,
            marginTop: 8,
            marginBottom: 8,
            letterSpacing: 1,
          }}
          onClick={startGame}
        >
          <FaDungeon className="text-yellow-300 drop-shadow" />
          {show ? "Mazmorra en curso..." : "Mini-juego Mazmorra"}
        </motion.button>
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                className="bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-950 rounded-lg p-6 shadow-2xl border-4 border-yellow-700 relative"
                style={{ minWidth: 380, minHeight: 320, maxWidth: 420 }}
              >
                <button
                  className="absolute top-2 right-2 text-yellow-200 hover:text-yellow-100 text-lg"
                  onClick={() => setShow(false)}
                  tabIndex={-1}
                >
                  <IoMdClose />
                </button>
                <h3 className="text-lg font-bold mb-2 text-yellow-100 flex items-center gap-2">
                  <FaDungeon className="text-yellow-300" /> Mazmorra Runner
                </h3>
                <div className="mb-2 text-yellow-200 text-xs">
                  Salta los obstáculos (barra espaciadora o clic). ¡Llega lo más
                  lejos posible!
                </div>
                <div
                  ref={gameRef}
                  className="relative bg-yellow-950 border-2 border-yellow-700 rounded-md overflow-hidden mx-auto"
                  style={{
                    width: 360,
                    height: 120,
                    marginBottom: 12,
                    boxShadow: "0 0 24px #ffe06655",
                  }}
                  onClick={jump}
                  tabIndex={0}
                >
                  {/* Suelo */}
                  <div className="absolute left-0 right-0 bottom-0 h-8 bg-yellow-800 border-t-2 border-yellow-700" />
                  {/* Jugador */}
                  <motion.div
                    animate={{
                      y: playerY === 0 ? 0 : -50,
                      // Cambia la animación de scale para usar solo dos keyframes
                      scale: gameOver ? 1.2 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="absolute left-10 bottom-8"
                    style={{ width: 32, height: 32 }}
                  >
                    {gameOver ? (
                      <FaSkull className="text-red-600 text-3xl drop-shadow" />
                    ) : (
                      <FaGamepad className="text-yellow-300 text-3xl drop-shadow" />
                    )}
                  </motion.div>
                  {/* Obstáculos */}
                  {obstacles.map((obs) => (
                    <motion.div
                      key={obs.id}
                      initial={false}
                      animate={{ x: obs.x }}
                      transition={{ type: "tween", duration: 0.016 }}
                      className="absolute bottom-8"
                      style={{ left: 0, width: 24, height: 32 }}
                    >
                      <FaDungeon className="text-yellow-700 text-2xl drop-shadow" />
                    </motion.div>
                  ))}
                  {/* Efecto Game Over */}
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/80"
                    >
                      <span className="text-red-400 text-lg font-bold">
                        ¡Game Over!
                      </span>
                    </motion.div>
                  )}
                </div>
                <div className="mb-2 text-yellow-100 text-sm">
                  Puntaje: <span className="font-bold">{score}</span>
                </div>
                {gameOver && (
                  <motion.button
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={dungeonButtonStyle + " mt-2"}
                    onClick={startGame}
                  >
                    Reiniciar
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  const [dungeonGame, setDungeonGame] = useState<DungeonGameState>({
    player: {
      x: 2,
      y: 2,
      health: 100,
      attack: 20,
      direction: "right",
      attacking: false,
    },
    enemies: [],
    doors: [],
    items: [],
    level: 1,
    gameStarted: false,
    gameOver: false,
    victory: false,
    message: null,
  });

  const initializeDungeon = (level: number) => {
    // Configuración básica del nivel
    const enemyCount = Math.min(3 + level, 8);
    const enemies = [];
    const doors = [];
    const items = [];

    // Añadir enemigos
    for (let i = 0; i < enemyCount; i++) {
      const types: Array<"goblin" | "skeleton" | "slime"> = [
        "goblin",
        "skeleton",
        "slime",
      ];
      const type = types[Math.floor(Math.random() * types.length)];
      enemies.push({
        id: i + 1,
        x: Math.floor(Math.random() * 5) + 5,
        y: Math.floor(Math.random() * 5) + 1,
        health: 30 + level * 10,
        type,
      });
    }

    // Añadir puertas
    if (level < 3) {
      doors.push({
        id: 1,
        x: 8,
        y: 5,
        locked: level > 1,
      });
    }

    // Añadir items
    items.push({
      id: 1,
      x: Math.floor(Math.random() * 5) + 1,
      y: Math.floor(Math.random() * 3) + 1,
      type: "health" as "health",
    });

    if (level > 1) {
      items.push({
        id: 2,
        x: Math.floor(Math.random() * 5) + 1,
        y: Math.floor(Math.random() * 3) + 1,
        type: "key" as "key",
      });
    }

    setDungeonGame({
      player: {
        x: 2,
        y: 2,
        health: 100,
        attack: 20 + level * 5,
        direction: "right",
        attacking: false,
      },
      enemies,
      doors,
      items,
      level,
      gameStarted: true,
      gameOver: false,
      victory: false,
      message: `Nivel ${level} - Encuentra la salida!`,
    });

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setDungeonGame((prev) => ({ ...prev, message: null }));
    }, 3000);
  };

  const movePlayer = (dx: number, dy: number) => {
    if (dungeonGame.gameOver || !dungeonGame.gameStarted) return;

    const newX = dungeonGame.player.x + dx;
    const newY = dungeonGame.player.y + dy;

    // Verificar límites del mapa
    if (newX < 0 || newX > 9 || newY < 0 || newY > 5) return;

    // Verificar colisión con enemigos
    const enemyCollision = dungeonGame.enemies.find(
      (e) => e.x === newX && e.y === newY
    );
    if (enemyCollision) {
      setDungeonGame((prev) => ({
        ...prev,
        message: `¡Enemigo encontrado! Presiona ESPACIO para atacar.`,
      }));
      return;
    }

    // Verificar colisión con puertas
    const doorCollision = dungeonGame.doors.find(
      (d) => d.x === newX && d.y === newY
    );
    if (doorCollision) {
      if (doorCollision.locked) {
        const hasKey = dungeonGame.items.some(
          (i) => i.type === "key" && i.x === -1
        );
        if (hasKey) {
          // Abrir puerta con llave
          setDungeonGame((prev) => {
            const updatedDoors = prev.doors.map((d) =>
              d.id === doorCollision.id ? { ...d, locked: false } : d
            );
            return {
              ...prev,
              doors: updatedDoors,
              message: `¡Has abierto la puerta con la llave!`,
            };
          });
          // Limpiar mensaje después de 2 segundos
          setTimeout(() => {
            setDungeonGame((prev) => ({ ...prev, message: null }));
          }, 2000);
        } else {
          setDungeonGame((prev) => ({
            ...prev,
            message: `¡La puerta está cerrada! Encuentra una llave.`,
          }));
          return;
        }
      } else {
        // Pasar al siguiente nivel
        setDungeonGame((prev) => ({
          ...prev,
          victory: true,
          message: `¡Has completado el nivel ${prev.level}!`,
        }));
        // Avanzar al siguiente nivel después de 2 segundos
        setTimeout(() => {
          initializeDungeon(dungeonGame.level + 1);
        }, 2000);
        return;
      }
    }

    // Verificar colisión con items
    const itemCollision = dungeonGame.items.find(
      (i) => i.x === newX && i.y === newY
    );
    if (itemCollision) {
      setDungeonGame((prev) => {
        const updatedItems = prev.items.map((i) =>
          i.id === itemCollision.id ? { ...i, x: -1, y: -1 } : i
        );
        let message = "";
        let updatedPlayer = { ...prev.player };
        if (itemCollision.type === "health") {
          updatedPlayer.health = Math.min(100, updatedPlayer.health + 30);
          message = "¡+30 de salud!";
        } else if (itemCollision.type === "key") {
          message = "¡Has obtenido una llave!";
        } else if (itemCollision.type === "treasure") {
          message = "¡Tesoro encontrado!";
        }
        return {
          ...prev,
          player: updatedPlayer,
          items: updatedItems,
          message,
        };
      });
      // Limpiar mensaje después de 2 segundos
      setTimeout(() => {
        setDungeonGame((prev) => ({ ...prev, message: null }));
      }, 2000);
    }

    // Actualizar dirección del jugador
    let direction = dungeonGame.player.direction;
    if (dx > 0) direction = "right";
    if (dx < 0) direction = "left";
    if (dy > 0) direction = "down";
    if (dy < 0) direction = "up";

    // Mover jugador
    setDungeonGame((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        x: newX,
        y: newY,
        direction,
      },
    }));
  };

  const attack = () => {
    if (
      dungeonGame.gameOver ||
      !dungeonGame.gameStarted ||
      dungeonGame.player.attacking
    )
      return;

    // Marcar que el jugador está atacando
    setDungeonGame((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        attacking: true,
      },
    }));

    // Determinar la posición del ataque basado en la dirección
    let attackX = dungeonGame.player.x;
    let attackY = dungeonGame.player.y;
    switch (dungeonGame.player.direction) {
      case "up":
        attackY -= 1;
        break;
      case "down":
        attackY += 1;
        break;
      case "left":
        attackX -= 1;
        break;
      case "right":
        attackX += 1;
        break;
    }

    // Buscar enemigo en la posición de ataque
    const enemyIndex = dungeonGame.enemies.findIndex(
      (e) => e.x === attackX && e.y === attackY
    );
    if (enemyIndex >= 0) {
      setDungeonGame((prev) => {
        const updatedEnemies = [...prev.enemies];
        const enemy = updatedEnemies[enemyIndex];
        // Aplicar daño
        enemy.health -= prev.player.attack;
        let message = `¡Has golpeado al enemigo por ${prev.player.attack} de daño!`;
        // Verificar si el enemigo murió
        if (enemy.health <= 0) {
          updatedEnemies.splice(enemyIndex, 1);
          message = "¡Has derrotado al enemigo!";
        }
        return {
          ...prev,
          enemies: updatedEnemies,
          message,
        };
      });
    } else {
      setDungeonGame((prev) => ({
        ...prev,
        message: "¡No hay enemigos para atacar!",
      }));
    }

    // Terminar animación de ataque después de 300ms
    setTimeout(() => {
      setDungeonGame((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          attacking: false,
        },
      }));
    }, 300);

    // Limpiar mensaje después de 2 segundos
    setTimeout(() => {
      setDungeonGame((prev) => ({ ...prev, message: null }));
    }, 2000);
  };

  // Efecto para manejar controles de teclado
  useEffect(() => {
    if (!dungeonGame.gameStarted || dungeonGame.gameOver || dungeonGame.victory)
      return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1);
          break;
        case "ArrowDown":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
          movePlayer(1, 0);
          break;
        case " ":
          attack();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dungeonGame.gameStarted, dungeonGame.gameOver, dungeonGame.victory]);

  // Efecto para verificar si el jugador perdió
  useEffect(() => {
    if (dungeonGame.player.health <= 0 && !dungeonGame.gameOver) {
      setDungeonGame((prev) => ({
        ...prev,
        gameOver: true,
        message: "¡Game Over! Inténtalo de nuevo.",
      }));
    }
  }, [dungeonGame.player.health, dungeonGame.gameOver]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white"
      >
        {/* Notificación */}
        {notification && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-6 left-1/2 z-[100] -translate-x-1/2 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {notification}
          </motion.div>
        )}

        {/* Modal de detalles */}
        <Dialog
          open={modalOpen}
          onClose={closeModal}
          className="fixed z-[200] inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-2">
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full mx-auto z-10"
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <IoMdClose size={28} />
              </button>
              <div className="p-6">
                {modalType === "game" && modalContent && (
                  <>
                    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={modalContent.thumbnail}
                        alt={modalContent.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {modalContent.title}
                    </h2>
                    <p className="text-gray-300 mb-2">
                      {modalContent.short_description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs">
                        {modalContent.genre}
                      </span>
                      <span className="bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded text-xs">
                        {modalContent.platform}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      Desarrollador: {modalContent.developer}
                    </p>
                    <p className="text-sm text-gray-400 mb-2">
                      Publicador: {modalContent.publisher}
                    </p>
                    <p className="text-sm text-gray-400 mb-2">
                      Lanzamiento: {modalContent.release_date}
                    </p>
                    <Button
                      asChild
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      <Link href={modalContent.game_url} target="_blank">
                        Jugar ahora
                      </Link>
                    </Button>
                  </>
                )}
                {modalType === "anime" && modalContent && (
                  <>
                    <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={modalContent.images.webp.image_url}
                        alt={modalContent.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {modalContent.title}
                    </h2>
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs">
                        {modalContent.type}
                      </span>
                      <span className="text-yellow-400 font-bold">
                        ★ {modalContent.score || "N/A"}
                      </span>
                    </div>
                    <Button
                      asChild
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      <Link
                        href={`https://myanimelist.net/anime/${modalContent.mal_id}`}
                        target="_blank"
                      >
                        Ver en MyAnimeList
                      </Link>
                    </Button>
                  </>
                )}
                {modalType === "manga" && modalContent && (
                  <>
                    <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={modalContent.images.webp.image_url}
                        alt={modalContent.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {modalContent.title}
                    </h2>
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded text-xs">
                        {modalContent.type}
                      </span>
                      <span className="text-yellow-400 font-bold">
                        ★ {modalContent.score || "N/A"}
                      </span>
                    </div>
                    <Button
                      asChild
                      className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Link
                        href={`https://myanimelist.net/manga/${modalContent.mal_id}`}
                        target="_blank"
                      >
                        Ver en MyAnimeList
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </Dialog>

        {/* Botón scroll-to-top */}
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-800 text-white p-3 rounded-full shadow-lg transition"
            aria-label="Volver arriba"
          >
            ↑
          </motion.button>
        )}

        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-blue-900/30">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <FaGamepad className="text-blue-400 text-2xl" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                Nebura
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" passHref legacyBehavior>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  Inicio
                </Button>
              </Link>
              <Link href="#games" passHref legacyBehavior>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  Juegos
                </Button>
              </Link>
              <Link href="#chess" passHref legacyBehavior>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  Ajedrez
                </Button>
              </Link>
              <Link href="#anime" passHref legacyBehavior>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  Anime/Manga
                </Button>
              </Link>
              <Link
                href="https://github.com/hiroshi025"
                target="_blank"
                passHref
                legacyBehavior
              >
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <FaGithub className="mr-2" /> GitHub
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[70vh] flex flex-col justify-center items-center text-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={backgroundImages[0]}
              alt="Hero Background"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 px-4"
          >
            <h1 className="text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                Centro de Entretenimiento
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Descubre los mejores juegos gratuitos, perfiles de ajedrez y
              recomendaciones de anime y manga.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                className="border-indigo-400 text-indigo-400 hover:bg-indigo-900/50"
                size="lg"
              >
                <FaSearch className="mr-2" /> Explorar
              </Button>
            </div>
          </motion.div>
        </section>

        <section
          id="anime-season"
          className="py-16 bg-gradient-to-br from-indigo-950 to-gray-900"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Anime: Top Popular y Temporada Actual
            </h2>

            <Tabs defaultValue="top" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/70">
                <TabsTrigger
                  value="top"
                  className="data-[state=active]:bg-indigo-900/50"
                >
                  <FaFile className="mr-2" /> Top Anime
                </TabsTrigger>
                <TabsTrigger
                  value="season"
                  className="data-[state=active]:bg-purple-900/50"
                >
                  <FaCalendar className="mr-2" /> Temporada Actual
                </TabsTrigger>
              </TabsList>

              <TabsContent value="top">
                {animeLoading.top ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : topAnime.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                    {topAnime.map((anime) => (
                      <motion.div
                        key={`top-${anime.mal_id}`}
                        whileHover="hover"
                        variants={cardHover}
                      >
                        <Card
                          className="bg-gray-800/60 border-indigo-900/50 h-full cursor-pointer"
                          onClick={() => openModal(anime, "anime")}
                        >
                          <CardContent className="p-0">
                            <div className="relative h-64 w-full">
                              <Image
                                src={anime.images.webp.image_url}
                                alt={anime.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                                <div className="flex items-center justify-between">
                                  <span className="bg-indigo-900/70 text-indigo-300 px-2 py-1 rounded text-xs">
                                    {anime.type}
                                  </span>
                                  <div className="flex items-center bg-black/70 px-2 py-1 rounded">
                                    <span className="text-yellow-400 mr-1 text-sm">
                                      ★
                                    </span>
                                    <span className="text-sm font-medium">
                                      {anime.score?.toFixed(1) || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3
                                className="font-bold line-clamp-2"
                                title={anime.title}
                              >
                                {anime.title}
                              </h3>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    No se pudieron cargar los animes más populares
                    <Button
                      onClick={fetchTopAnime}
                      variant="outline"
                      className="mt-4 border-indigo-400 text-indigo-400 hover:bg-indigo-900/50"
                    >
                      Reintentar
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="season">
                {animeLoading.season ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : seasonNow.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                    {seasonNow.map((anime, idx) => (
                      <motion.div
                        key={`season-${anime.mal_id}-${idx}`}
                        whileHover="hover"
                        variants={cardHover}
                      >
                        <Card
                          className="bg-gray-800/60 border-purple-900/50 h-full cursor-pointer"
                          onClick={() => openModal(anime, "anime")}
                        >
                          <CardContent className="p-0">
                            <div className="relative h-64 w-full">
                              <Image
                                src={anime.images.webp.image_url}
                                alt={anime.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                                <div className="flex items-center justify-between">
                                  <span className="bg-purple-900/70 text-purple-300 px-2 py-1 rounded text-xs">
                                    {anime.type}
                                  </span>
                                  {anime.episodes && (
                                    <span className="bg-black/70 text-gray-300 px-2 py-1 rounded text-xs">
                                      Episodios: {anime.episodes}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3
                                className="font-bold line-clamp-2"
                                title={anime.title}
                              >
                                {anime.title}
                              </h3>
                              {anime.genres && anime.genres.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {anime.genres.slice(0, 2).map((genre) => (
                                    <span
                                      key={genre.name}
                                      className="bg-gray-700/60 text-gray-300 px-2 py-0.5 rounded-full text-xs"
                                    >
                                      {genre.name}
                                    </span>
                                  ))}
                                  {anime.genres.length > 2 && (
                                    <span className="bg-gray-700/60 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                                      +{anime.genres.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    No se pudieron cargar los animes de esta temporada
                    <Button
                      onClick={fetchSeasonNow}
                      variant="outline"
                      className="mt-4 border-purple-400 text-purple-400 hover:bg-purple-900/50"
                    >
                      Reintentar
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="text-center mt-8">
              <Button
                asChild
                variant="outline"
                className="border-indigo-400 text-indigo-400 hover:bg-indigo-900/50"
              >
                <Link href="https://myanimelist.net/" target="_blank">
                  Ver más en MyAnimeList
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="dungeon-game"
          className="py-16 bg-gradient-to-br from-gray-900 via-purple-950/80 to-indigo-950"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Juego de Mazmorra
            </h2>

            <div className="max-w-2xl mx-auto bg-gray-800/70 rounded-xl shadow-lg p-6 mb-8 border border-purple-900/40">
              <div className="flex flex-col items-center">
                {!dungeonGame.gameStarted &&
                  !dungeonGame.gameOver &&
                  !dungeonGame.victory && (
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        ¡Explora la mazmorra!
                      </h3>
                      <p className="text-gray-300 mb-6">
                        Usa las flechas para moverte, ESPACIO para atacar.
                        Encuentra la salida y derrota a los enemigos para
                        avanzar al siguiente nivel.
                      </p>
                      <Button
                        onClick={() => initializeDungeon(1)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        <FaDungeon className="mr-2" /> Comenzar Aventura
                      </Button>
                    </div>
                  )}

                {dungeonGame.gameOver && (
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-4 text-red-400">
                      ¡Game Over!
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Has llegado al nivel {dungeonGame.level}. Inténtalo de
                      nuevo.
                    </p>
                    <Button
                      onClick={() => initializeDungeon(1)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <FaDungeon className="mr-2" /> Reintentar
                    </Button>
                  </div>
                )}

                {dungeonGame.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-900/70 text-purple-100 px-4 py-2 rounded-lg mb-4"
                  >
                    {dungeonGame.message}
                  </motion.div>
                )}

                {(dungeonGame.gameStarted ||
                  dungeonGame.gameOver ||
                  dungeonGame.victory) && (
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-lg mr-2">
                          Nivel: {dungeonGame.level}
                        </span>
                        <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded-lg">
                          Salud: {dungeonGame.player.health}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-lg">
                          Enemigos: {dungeonGame.enemies.length}
                        </span>
                      </div>
                    </div>

                    {/* Tablero del juego */}
                    <div
                      className="relative bg-gray-900 border-2 border-purple-900 rounded-lg overflow-hidden mx-auto"
                      style={{ width: "400px", height: "240px" }}
                    >
                      {/* Grid de la mazmorra */}
                      <div className="absolute inset-0 grid grid-cols-10 grid-rows-6">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <div
                            key={i}
                            className="border border-gray-800/50"
                          ></div>
                        ))}
                      </div>

                      {/* Renderizar elementos del juego */}
                      {dungeonGame.items.map(
                        (item) =>
                          item.x >= 0 &&
                          item.y >= 0 && (
                            <motion.div
                              key={item.id}
                              className={`absolute w-8 h-8 flex items-center justify-center`}
                              style={{
                                left: `${item.x * 40}px`,
                                top: `${item.y * 40}px`,
                              }}
                              animate={{
                                y: [0, -5, 0],
                                opacity: [0.8, 1, 0.8],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut",
                              }}
                            >
                              {item.type === "health" && (
                                <div className="text-green-400 text-xl">❤️</div>
                              )}
                              {item.type === "key" && (
                                <div className="text-yellow-400 text-xl">
                                  🔑
                                </div>
                              )}
                              {item.type === "treasure" && (
                                <div className="text-yellow-300 text-xl">
                                  💰
                                </div>
                              )}
                            </motion.div>
                          )
                      )}

                      {dungeonGame.doors.map((door) => (
                        <div
                          key={door.id}
                          className={`absolute w-8 h-8 flex items-center justify-center ${
                            door.locked
                              ? "bg-yellow-900/80"
                              : "bg-yellow-700/80"
                          } border-2 ${
                            door.locked
                              ? "border-yellow-600"
                              : "border-yellow-400"
                          }`}
                          style={{
                            left: `${door.x * 40}px`,
                            top: `${door.y * 40}px`,
                          }}
                        >
                          {door.locked ? "🔒" : "🚪"}
                        </div>
                      ))}

                      {dungeonGame.enemies.map((enemy) => (
                        <motion.div
                          key={enemy.id}
                          className="absolute w-8 h-8 flex items-center justify-center"
                          style={{
                            left: `${enemy.x * 40}px`,
                            top: `${enemy.y * 40}px`,
                          }}
                          animate={{
                            scale: [1, 1.15, 1],
                            y: [0, -6, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.6 + enemy.id * 0.1,
                            ease: "easeInOut",
                          }}
                        >
                          {enemy.type === "goblin" && (
                            <span
                              className="text-green-400 text-2xl"
                              title="Goblin"
                            >
                              👺
                            </span>
                          )}
                          {enemy.type === "skeleton" && (
                            <span
                              className="text-gray-300 text-2xl"
                              title="Esqueleto"
                            >
                              💀
                            </span>
                          )}
                          {enemy.type === "slime" && (
                            <span
                              className="text-blue-400 text-2xl"
                              title="Slime"
                            >
                              🟦
                            </span>
                          )}
                        </motion.div>
                      ))}

                      {/* Jugador */}
                      <motion.div
                        className="absolute w-8 h-8 flex items-center justify-center z-10"
                        style={{
                          left: `${dungeonGame.player.x * 40}px`,
                          top: `${dungeonGame.player.y * 40}px`,
                        }}
                        animate={{
                          scale: dungeonGame.player.attacking ? [1, 1.2, 1] : 1,
                          rotate:
                            dungeonGame.player.direction === "left"
                              ? -10
                              : dungeonGame.player.direction === "right"
                              ? 10
                              : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <span
                          className={`text-purple-300 text-2xl ${
                            dungeonGame.player.attacking ? "animate-pulse" : ""
                          }`}
                          title="Jugador"
                        >
                          🧙
                        </span>
                      </motion.div>
                    </div>

                    {/* Controles visuales */}
                    <div className="flex justify-center mt-6 gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-400 mb-1">
                          Mover
                        </span>
                        <div className="flex flex-col items-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="mb-1"
                            onClick={() => movePlayer(0, -1)}
                          >
                            ↑
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => movePlayer(-1, 0)}
                            >
                              ←
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => movePlayer(1, 0)}
                            >
                              →
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="mt-1"
                            onClick={() => movePlayer(0, 1)}
                          >
                            ↓
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-400 mb-1">
                          Atacar
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-lg border-purple-400 text-purple-300"
                          onClick={attack}
                          disabled={dungeonGame.player.attacking}
                        >
                          ⚔️
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center text-gray-400 text-xs mt-6">
              Usa las flechas del teclado o los botones para moverte. ESPACIO o
              ⚔️ para atacar.
            </div>
          </div>
        </section>

        {/* Chess Section */}
        <section
          id="chess"
          className="py-16 bg-gradient-to-br from-gray-900 via-blue-950/80 to-indigo-950"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Ajedrez</h2>

            {/* Buscador de ugadores */}
            <div className="max-w-2xl mx-auto bg-gray-800/70 rounded-xl shadow-lg p-6 mb-8 border border-blue-900/40">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Buscar jugador de ajedrez
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Nombre de usuario en Chess.com"
                      className="bg-gray-800/80 border-blue-700"
                      value={chessSearch}
                      onChange={(e) => setChessSearch(e.target.value)}
                    />
                    <Button
                      onClick={searchChessPlayer}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    >
                      <FaSearch className="mr-2" /> Buscar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Resultado del jugador */}
            {chessLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : chessPlayer ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-gray-800/60 rounded-xl shadow-lg overflow-hidden border border-blue-900/40"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-blue-500">
                        {chessPlayer.avatar ? (
                          <Image
                            src={chessPlayer.avatar}
                            alt={chessPlayer.username}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-blue-900/50 flex items-center justify-center">
                            <FaChess className="text-4xl text-blue-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">
                          {chessPlayer.username}
                        </h3>
                        {chessPlayer.title && (
                          <span className="bg-yellow-500/80 text-yellow-100 px-2 py-1 rounded text-xs font-bold">
                            {chessPlayer.title.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-4">
                        {chessPlayer.followers} seguidores
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          asChild
                          variant="outline"
                          className="border-blue-400 text-blue-400 hover:bg-blue-900/50"
                        >
                          <Link href={chessPlayer.url} target="_blank">
                            <FaChess className="mr-2" /> Perfil en Chess.com
                          </Link>
                        </Button>
                        {chessPlayer.twitch_url && (
                          <Button
                            asChild
                            variant="outline"
                            className="border-purple-400 text-purple-400 hover:bg-purple-900/50"
                          >
                            <Link href={chessPlayer.twitch_url} target="_blank">
                              <FaTwitch className="mr-2" /> Twitch
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              chessSearch && (
                <div className="text-center py-12 text-gray-400">
                  No se encontró el jugador "{chessSearch}"
                </div>
              )
            )}

            {/* Streamers de ajedrez */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Streamers de Ajedrez Populares
              </h3>
              {chessLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : chessStreamers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chessStreamers.slice(0, 9).map((streamer) => (
                    <motion.div
                      key={streamer.player_id || streamer.username}
                      whileHover="hover"
                      variants={cardHover}
                    >
                      <Card className="bg-gray-800/60 border-blue-900/50 h-full cursor-pointer hover:border-blue-400 transition-colors">
                        <CardContent className="p-0">
                          <div className="relative h-48 w-full">
                            {streamer.avatar ? (
                              <Image
                                src={streamer.avatar}
                                alt={streamer.username}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                              />
                            ) : (
                              <div className="h-full w-full bg-blue-900/50 flex items-center justify-center">
                                <FaChess className="text-4xl text-blue-400" />
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                              <div className="flex items-center justify-between">
                                {streamer.title && (
                                  <span className="bg-yellow-500/80 text-yellow-100 px-2 py-1 rounded text-xs font-bold">
                                    {streamer.title.toUpperCase()}
                                  </span>
                                )}
                                <div className="flex items-center bg-black/70 px-2 py-1 rounded">
                                  <FaTwitch className="text-purple-400 mr-1" />
                                  <span className="text-sm font-medium">
                                    {typeof streamer.followers === "number"
                                      ? streamer.followers.toLocaleString()
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3
                              className="font-bold line-clamp-1"
                              title={streamer.username}
                            >
                              {streamer.username}
                            </h3>
                            <div className="mt-4 flex justify-center">
                              <Button
                                asChild
                                variant="outline"
                                className={
                                  "w-11/12 max-w-xs flex items-center justify-center gap-2 font-semibold text-base shadow-md transition-all duration-200 " +
                                  (streamer.twitch_url
                                    ? "border-purple-400 text-purple-400 hover:bg-purple-900/40"
                                    : "border-blue-400 text-blue-400 hover:bg-blue-900/40")
                                }
                                style={{
                                  letterSpacing: "0.5px",
                                  borderRadius: "0.75rem",
                                }}
                              >
                                <Link
                                  href={streamer.twitch_url || streamer.url}
                                  target="_blank"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {streamer.twitch_url ? (
                                    <>
                                      <FaTwitch className="mr-2 text-lg" /> Ver
                                      en Twitch
                                    </>
                                  ) : (
                                    <>
                                      <FaChess className="mr-2 text-lg" /> Ver
                                      perfil
                                    </>
                                  )}
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No se pudieron cargar los streamers
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Anime/Manga Section */}
        <section id="anime" className="py-16 bg-gray-900/70">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Recomendaciones de Anime y Manga
            </h2>

            <Tabs defaultValue="anime" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/70">
                <TabsTrigger
                  value="anime"
                  className="data-[state=active]:bg-blue-900/50"
                >
                  <FaFile className="mr-2" /> Anime
                </TabsTrigger>
                <TabsTrigger
                  value="manga"
                  className="data-[state=active]:bg-indigo-900/50"
                >
                  <FaBook className="mr-2" /> Manga
                </TabsTrigger>
              </TabsList>

              <TabsContent value="anime">
                {recLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : animeRecs.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                      640: { slidesPerView: 4 },
                      1024: { slidesPerView: 6 },
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    className="py-6"
                  >
                    {animeRecs.map((anime) => (
                      <SwiperSlide key={anime.mal_id}>
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Card className="bg-gray-800/60 border-blue-900/50 h-full">
                            <CardContent className="p-0">
                              <div className="relative h-64 w-full">
                                <Image
                                  src={anime.images.webp.image_url}
                                  alt={anime.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="text-xl font-bold mb-2 line-clamp-1">
                                  {anime.title}
                                </h3>
                                <div className="flex justify-between items-center">
                                  <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs">
                                    {anime.type}
                                  </span>
                                  <div className="flex items-center">
                                    <span className="text-yellow-400 mr-1">
                                      ★
                                    </span>
                                    <span>{anime.score || "N/A"}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    No se pudieron cargar las recomendaciones de anime
                  </div>
                )}
              </TabsContent>

              <TabsContent value="manga">
                {recLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : mangaRecs.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                      640: { slidesPerView: 4 },
                      1024: { slidesPerView: 6 },
                    }}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    className="py-6"
                  >
                    {mangaRecs.map((manga) => (
                      <SwiperSlide key={manga.mal_id}>
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Card className="bg-gray-800/60 border-indigo-900/50 h-full">
                            <CardContent className="p-0">
                              <div className="relative h-64 w-full">
                                <Image
                                  src={manga.images.webp.image_url}
                                  alt={manga.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="text-xl font-bold mb-2 line-clamp-1">
                                  {manga.title}
                                </h3>
                                <div className="flex justify-between items-center">
                                  <span className="bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded text-xs">
                                    {manga.type}
                                  </span>
                                  <div className="flex items-center">
                                    <span className="text-yellow-400 mr-1">
                                      ★
                                    </span>
                                    <span>{manga.score || "N/A"}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    No se pudieron cargar las recomendaciones de manga
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Animaciones Temáticas */}
        <section className= "py-16 bg-gradient-to-br from-blue-950 via-indigo-950/80 to-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Animaciones Temáticas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Videojuegos */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 2 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                viewport={{ once: true }}
                className="flex flex-col items-center bg-gray-800/60 rounded-xl p-8 shadow-lg border border-blue-900/40"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  className="mb-4"
                >
                  <FaGamepad className="text-6xl text-blue-400 drop-shadow-lg" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Videojuegos</h3>
                <p className="text-gray-300 text-center">
                  Explora el mundo de los videojuegos con efectos y animaciones
                  que te sumergen en la acción.
                </p>
              </motion.div>
              {/* Anime */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: -2 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                  delay: 0.2,
                }}
                viewport={{ once: true }}
                className="flex flex-col items-center bg-gray-800/60 rounded-xl p-8 shadow-lg border border-indigo-900/40"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "easeInOut",
                  }}
                  className="mb-4"
                >
                  <FaBook className="text-6xl text-indigo-400 drop-shadow-lg" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Anime & Manga</h3>
                <p className="text-gray-300 text-center">
                  Disfruta de animaciones inspiradas en el arte y la fantasía
                  del anime y manga.
                </p>
              </motion.div>
              {/* Ajedrez */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 2 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                  delay: 0.4,
                }}
                viewport={{ once: true }}
                className="flex flex-col items-center bg-gray-800/60 rounded-xl p-8 shadow-lg border border-purple-900/40"
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut",
                  }}
                  className="mb-4"
                >
                  <FaChess className="text-6xl text-purple-400 drop-shadow-lg" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Ajedrez</h3>
                <p className="text-gray-300 text-center">
                  Siente la estrategia y elegancia del ajedrez con animaciones
                  dinámicas.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="recursos"
          className="py-16 bg-gradient-to-br from-blue-950 via-indigo-950/80 to-gray-900"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Recursos y Tutoriales Recomendados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tutoriales de Ajedrez */}
              <div className="bg-gray-800/70 rounded-xl p-6 shadow-lg border border-blue-900/40 flex flex-col">
                <div className="flex items-center mb-4">
                  <FaChess className="text-3xl text-blue-400 mr-3" />
                  <h3 className="text-xl font-bold">Ajedrez</h3>
                </div>
                <ul className="space-y-3 flex-1">
                  <li>
                    <a
                      href="https://www.chess.com/lessons"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline flex items-center"
                    >
                      <FaBook className="mr-2" /> Lecciones interactivas en
                      Chess.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://lichess.org/learn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline flex items-center"
                    >
                      <FaBook className="mr-2" /> Tutoriales y ejercicios en
                      Lichess
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@Elrincondelajedrez"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline flex items-center"
                    >
                      <FaBook className="mr-2" /> Canal de YouTube: El Rincón
                      del Ajedrez
                    </a>
                  </li>
                </ul>
              </div>
              {/* Tutoriales de Programación */}
              <div className="bg-gray-800/70 rounded-xl p-6 shadow-lg border border-indigo-900/40 flex flex-col">
                <div className="flex items-center mb-4">
                  <FaGithub className="text-3xl text-indigo-400 mr-3" />
                  <h3 className="text-xl font-bold">Programación</h3>
                </div>
                <ul className="space-y-3 flex-1">
                  <li>
                    <a
                      href="https://www.freecodecamp.org/espanol/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-300 hover:underline flex items-center"
                    >
                      <FaBook className="mr-2" /> FreeCodeCamp en Español
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@midulive"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-300 hover:underline flex items-center"
                    >
                      <FaBook className="mr-2" /> YouTube: midudev (JavaScript y
                      más)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://roadmap.sh/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-300 hover:underline flex items-center"
                    >
                      <FaBook className="mr-2" /> Roadmaps para desarrolladores
                    </a>
                  </li>
                </ul>
              </div>
              {/* Anime/Manga */}
              <div className="bg-gray-800/70 rounded-xl p-6 shadow-lg border border-purple-900/40 flex flex-col">
                <div className="flex items-center mb-4">
                  <FaBook className="text-3xl text-purple-400 mr-3" />
                  <h3 className="text-xl font-bold">Anime & Manga</h3>
                </div>
                <ul className="space-y-3 flex-1">
                  <li>
                    <a
                      href="https://myanimelist.net/anime/season"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:underline flex items-center"
                    >
                      <FaBook className="mr-2" /> Guía de temporadas en
                      MyAnimeList
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.anime-planet.com/anime/watch-online/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:underline flex items-center"
                    >
                      <FaBook className="mr-2" /> Dónde ver anime legalmente
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@RaziVideos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:underline flex items-center"
                    >
                      <FaBook className="mr-2" /> YouTube: Razi (guías y cultura
                      anime)
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/90 border-t border-blue-900/30 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <Link href="/" className="flex items-center space-x-2">
                  <FaGamepad className="text-blue-400 text-xl" />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    Nebura
                  </span>
                </Link>
                <p className="text-gray-400 text-sm mt-2">
                  Centro de Entretenimiento - Todos los derechos reservados
                </p>
              </div>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://github.com/hiroshi025" target="_blank">
                    <FiGithub className="text-xl text-gray-400 hover:text-white" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="mailto:contacto@example.com" target="_blank">
                    <FiMail className="text-xl text-gray-400 hover:text-white" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://twitter.com/example" target="_blank">
                    <FiTwitter className="text-xl text-gray-400 hover:text-white" />
                  </Link>
                </Button>
                <MiniGame />
              </div>
            </div>
          </div>
        </footer>
        <ParticleBurst />
      </motion.div>
    </AnimatePresence>
  );
}
