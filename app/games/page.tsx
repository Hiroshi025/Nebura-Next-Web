"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	FaBook, FaCalendar, FaChess, FaFile, FaGamepad, FaGithub, FaSearch, FaTwitch
} from "react-icons/fa";
import { FiGithub, FiMail, FiTwitter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      setAnimeRecs(animeData.data.slice(0, 20));

      // Manga recomendados
      const mangaRes = await fetch(
        "https://api.jikan.moe/v4/top/manga?filter=bypopularity"
      );
      const mangaData = await mangaRes.json();
      setMangaRecs(mangaData.data.slice(0, 20));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
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
                      key={streamer.player_id || streamer.username} // Usa player_id o username como key
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-gray-800/60 border-blue-900/50 hover:border-blue-400 transition-colors">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-full overflow-hidden">
                              {streamer.avatar ? (
                                <Image
                                  src={streamer.avatar}
                                  alt={streamer.username}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-blue-900/50 flex items-center justify-center">
                                  <FaChess className="text-xl text-blue-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <CardTitle>{streamer.username}</CardTitle>
                              <CardDescription>
                                {streamer.followers} seguidores
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {streamer.twitch_url && (
                            <Button
                              asChild
                              variant="outline"
                              className="w-full border-purple-400 text-purple-400 hover:bg-purple-900/50"
                            >
                              <Link href={streamer.twitch_url} target="_blank">
                                <FaTwitch className="mr-2" /> Ver en Twitch
                              </Link>
                            </Button>
                          )}
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
              </div>
            </div>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
