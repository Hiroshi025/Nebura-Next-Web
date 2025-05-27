"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight, FaCode, FaExpand, FaGithub, FaRandom } from "react-icons/fa";
import { FiGithub, FiMail, FiTwitter } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
// Importa Swiper para carruseles
import { Swiper, SwiperSlide } from "swiper/react";

import { Button } from "@/components/ui/button";
import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import {
	Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@radix-ui/react-context-menu";

// Datos de imágenes
const imageData = {
  waifu4k: [
    "https://i.pinimg.com/736x/a3/2f/dc/a32fdcb8c5e3da983aed578b39208ba6.jpg",
    "https://i.pinimg.com/736x/75/0b/fa/750bfa4a60c0cf2bcfbd2b6c470cde59.jpg",
    "https://i.pinimg.com/736x/39/99/e2/3999e2c67f7ad1a4f884333f00bdfea9.jpg",
    "https://i.pinimg.com/736x/a5/ce/29/a5ce29fbef9969ec4246ddadc1ffea44.jpg",
    "https://i.pinimg.com/736x/a5/22/3b/a5223b2f2be81ace5c9c3f5a43153e6b.jpg",
    "https://i.pinimg.com/736x/5c/f4/34/5cf434104bd01b08f195cf1f5f76fa4d.jpg",
    "https://i.pinimg.com/736x/f7/47/f8/f747f85e7fa6cdab5174209c63cbce1b.jpg",
    "https://i.pinimg.com/736x/f0/92/78/f09278ccb862a6b1a8b5e29172092900.jpg",
  ],
  nsfw: [
    "https://imgs.search.brave.com/ErZtNPEuaeOaSXIt4l0cF2Fn5LA2K1SvcnB2JozaQ7c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vdWV5WlJy/WWN4MS1tY1UzSmQt/VU9sbm9yVlhxOF9Y/dElPUHFHRjZ4Rl91/RS9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/TG1WMC9jM2x6ZEdG/MGFXTXVZMjl0L0x6/RXpNelkzTnpBMUwz/SXYvYVd3dk1UWTJO/V1ZrTHpZeS9PREkx/TWpFeU56Y3ZhV3hm/L016QXdlRE13TUM0/Mk1qZ3kvTlRJeE1q/YzNYMlp1YlRndS9h/bkJu",
    "https://imgs.search.brave.com/FuitBaUG7PbIXvTmzTW9kAp57J1VLO6LuEw_3Q6pxuM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vaGd0T3hC/QWp5WDdGemFHSVpU/bVNlcVNPaFVTZFZ1/UFdMelVDT3hnSTg1/RS9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/YldGbi9aWE10ZDJs/NGJYQXRaV1F6L01H/RTRObUk0WXpSallU/ZzQvTnpjM016VTVO/R015TG5kcC9lRzF3/TG1OdmJTOW1MMkkx/L1lUSmpZV001TFRs/bU0yUXQvTkRZNVlp/MDRaREV4TFRVei9P/V1V3WWpKbFkyTTFN/aTlrL2FHMTFhRzV4/TFdVeVlqVTAvTlRZ/M0xUSXlOalV0TkRF/MC9PQzA1WW1SbUxX/VTJNbUpsL1lXUTJZ/VFkwWlM1d2JtY3Yv/ZGpFdlptbHNiQzkz/WHpFNS9NakFzYUY4/eU5UWXdMSEZmL09E/QXNjM1J5Y0M5ZllX/UnYvY0hSZlgyRnVh/VzFsWDJkcC9jbXhm/TVRoZmJuTm1kMTlm/L2JXRjRhVzExYlY5/elkyRnMvWlY5MWNG/OWZZbmxmYldGMC9k/R0Y1WVdnd1gyUm9i/WFZvL2JuRXRablZz/YkhacFpYY3UvYW5C/blAzUnZhMlZ1UFdW/NS9TakJsV0VGcFQy/bEtTMVl4L1VXbE1R/MHBvWWtkamFVOXAv/U2tsVmVra3hUbWxL/T1M1bC9lVXA2WkZk/SmFVOXBTakZqL2JU/UTJXVmhDZDA5cVpH/eE4vUjFGNFQwUm5O/VTlFU1hsTy9hbEY2/VG5wT2FFNVhXWGRh/L1JGRjRUbGRXYUUx/SFVYbE8vYlZWM1NX/bDNhV0ZZVG5wSi9h/bTlwWkZoS2RVOXRS/bmRqL1JHOHpXbFJD/YTAxVVp6UlAvVkdk/NVRXcFpNRTE2WTNw/Wi9WRlp0VFVkUk1F/MVVWbXhaL1ZFSnJU/V3BhYkUxRFNYTkov/YlRscFlXbEpObGN4/ZERkSi9ia0pvWkVk/bmFVOXBTbU5NL01s/cGpUREpKTVZsVVNt/cFovVjAwMVRGUnNi/VTB5VVhSTy9SRmsx/V1drd05GcEVSWGhN/L1ZGVjZUMWRWZDFs/cVNteFovTWsweFRX/eDNkbHBIYUhSay9W/MmgxWTFNeGJFMXRT/VEZPL1JGVXlUbmt3/ZVUxcVdURk0vVkZG/NFRrUm5kRTlYU210/YS9hVEZzVG1wS2FW/cFhSbXRPL2JVVXlU/a2RWZFdOSE5XNUov/YVhkcFlVZFdjRm95/YURCSi9hbTlwVUVR/d2VVNVVXWGRKL2FY/ZHBaREpzYTJSSFoy/bFAvYVVrNFVGUkZO/VTFxUVdsbS9WakZr/VEVOS2FHUlhVV2xQ/L2JITnBaRmhLZFU5/dVRteGovYmxwd1dU/SlZObUZYTVdoYS9N/bFYxWkRKR01GcFlT/blJaL1dFcHlTV3d3/YzBsdVpIUmgvZVVr/MlpYbEtkMWxZVW05/Si9hbTlwV0VNNU0y/SldkM1paL2FsWm9U/VzFPYUZsNmEzUlAv/VjFsNldrTXdNRTVx/YkdsTS9WR2hyVFZS/RmRFNVVUVFZhL1ZF/SnBUVzFXYWxsNlZY/bFkvUXpsMFdWaFNN/RmxZYkdoaC9SRUYw/VGtNMWQySnRZMmxN/L1EwcDJZMGRHYW1G/WVVqVkovYW04MVRs/TjNhV05JU25aai9S/emw1WkVkc2RtSnVU/V2xQL2FrRjFUa1JW/YzBsdFpIbFovV0Zw/d1pFaHJhVTlwU21w/YS9WelV3V2xoSmFX/WllNQzVUL1p6SmFR/elZRWkRsUmRVTjUv/ZUVOTU1ITmpXV1pC/VjAxRC9keTE2TVhK/RllWcHJja0oyL2NV/d3dZMkU0",
    "https://imgs.search.brave.com/yBmzdbt65lN8kIT8VrKzO1YzgPgA0tpt107Zqi080TY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vd01RR0hv/R1dmc241eG11OUw0/VV83TjRHcmpFOUx2/WUJENjU0MkRXUjMy/WS9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/TG1WMC9jM2x6ZEdG/MGFXTXVZMjl0L0x6/UTBOekV6T1RrMkwz/SXYvYVd3dk9HWTRN/RGRpTHpVdy9PRGd6/TWpnMk16VXZhV3hm/L05qQXdlRFl3TUM0/MU1EZzQvTXpJNE5q/TTFYM00wZUdjdS9h/bkJu",
  ],
  manga: [
    "https://i.pinimg.com/736x/20/bd/3a/20bd3a9de99e49792e37ddfc66909563.jpg",
    "https://i.pinimg.com/736x/a6/b0/c0/a6b0c027f7bffa306ba7ebd19f8ec732.jpg",
    "https://i.pinimg.com/736x/11/6a/e8/116ae8ba1538302466451d61cb626b2f.jpg",
  ],
  anime: [
    "https://i.pinimg.com/736x/4f/62/d2/4f62d2bc39cb6092fe4dedb978c285c5.jpg",
    "https://i.pinimg.com/736x/a5/5a/4b/a55a4b860f5399b9241ca8fa9cbaa47e.jpg",
    "https://i.pinimg.com/736x/3c/40/3d/3c403d333e24586908501a72fef5caa2.jpg",
  ],
  characters: [
    "https://i.pinimg.com/736x/53/89/c0/5389c0182d228e2d66dceb7128e7c3ac.jpg",
    "https://i.pinimg.com/736x/f3/73/c7/f373c718bde1d2e3d50163e10922b9e1.jpg",
    "https://i.pinimg.com/736x/ee/0d/16/ee0d16a860ea77455d6ead3232a00c97.jpg",
    "https://i.pinimg.com/736x/5c/3b/5e/5c3b5e5ebb798583bdcd60898d86993b.jpg",
    "https://i.pinimg.com/736x/80/d4/89/80d4894cc50a9b34ae8bf7416a475e9e.jpg",
  ],
  backgrounds: [
    "/placeholder.jpg?height=600&width=1200&text=Anime+Control+Banner+1",
    "/placeholder_1.jpg?height=600&width=1200&text=Anime+Chat+Banner+2",
    "/placeholder_2.jpg?height=600&width=1200&text=Anime+Docs+Banner+3",
    "/placeholder_3.jpg?height=600&width=1200&text=Anime+Support+Banner+4",
    "/placeholder_4.jpg?height=600&width=1200&text=Anime+News+Banner+5",
    "/placeholder_5.jpg?height=600&width=1200&text=Anime+Feedback+Banner+6",
  ],
  cosplay: [
    "https://i.pinimg.com/736x/9f/36/d9/9f36d9021e0511cfda0998acdf089af5.jpg",
    "https://i.pinimg.com/736x/78/b9/d7/78b9d74a54187f0ce37763204897cdfe.jpg",
    "https://i.pinimg.com/736x/05/5f/ec/055feca3ce3225c3507812c7ce2bd7d1.jpg",
    "https://i.pinimg.com/736x/92/33/00/92330057eb152953487b158a2b7d6c20.jpg",
    "https://i.pinimg.com/736x/dc/a1/49/dca1494328677a7d31a5eb1f7b446f52.jpg",
  ],
  gifs: [
    "https://media.tenor.com/1q5kQwQ1Ot8AAAAC/anime-girl.gif",
    "https://media.tenor.com/7v4v5p6zQw8AAAAC/anime-dance.gif",
    "https://media.tenor.com/9p5kQwQ1Ot8AAAAC/anime-smile.gif",
  ],
};

const APIExamples = [
  {
    name: "Waifu.pics API",
    description: "API gratuita para obtener imágenes SFW/NSFW de waifus",
    endpoints: {
      sfw: "https://api.waifu.pics/sfw/[category]",
      nsfw: "https://api.waifu.pics/nsfw/[category]",
    },
    categories: ["waifu", "neko", "shinobu", "megumin"],
    example: `// Obtener waifu aleatoria SFW
async function getWaifu() {
  try {
    const response = await fetch('https://api.waifu.pics/sfw/waifu');
    const data = await response.json();
    return data.url; // URL de la imagen
  } catch (error) {
    console.error('Error fetching waifu:', error);
    return null;
  }
}`,
    docs: "https://waifu.pics/docs",
  },
  {
    name: "Nekos.best API",
    description: "API para imágenes y GIFs de anime (SFW)",
    endpoints: {
      base: "https://nekos.best/api/v2/[endpoint]",
    },
    categories: ["neko", "waifu", "husbando", "kitsune"],
    example: `// Obtener imagen de neko
fetch('https://nekos.best/api/v2/neko')
  .then(response => response.json())
  .then(data => {
    const imageUrl = data.results[0].url;
    console.log(imageUrl);
  })
  .catch(error => console.error('Error:', error));`,
    docs: "https://docs.nekos.best",
  },
  {
    name: "Nekosia API",
    description: "API alternativa para imágenes de anime SFW",
    endpoints: {
      base: "https://nekosia.cat/api/v1/images/[type]",
    },
    categories: ["neko", "waifu", "husbando"],
    example: `// Obtener imagen con async/await
async function getNekoImage() {
  const response = 
     await fetch('https://nekosia.cat/api/v1/images/neko');
  const data = await response.json();
  return data.url || data.results[0]?.url;
}`,
    docs: "https://nekosia.cat/documentation",
  },
  {
    name: "Animechan API",
    description: "API para obtener citas de personajes de anime",
    endpoints: {
      random: "https://animechan.vercel.app/api/random",
      character:
        "https://animechan.vercel.app/api/quotes/character?name=[name]",
    },
    categories: ["quotes", "anime", "characters"],
    example: `// Obtener cita aleatoria
async function getRandomQuote() {
  try {
    const response = await fetch('https://animechan.vercel.app/api/random');
    const data = await response.json();
    return \`\${data.anime} - \${data.character}: \${data.quote}\`;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
}`,
    docs: "https://animechan.vercel.app/",
  },
  {
    name: "Jikan API",
    description:
      "API no oficial de MyAnimeList para obtener información de anime y manga",
    endpoints: {
      search: "https://api.jikan.moe/v4/search/anime?q=[query]",
      topAnime: "https://api.jikan.moe/v4/top/anime",
      topManga: "https://api.jikan.moe/v4/top/manga",
    },
    categories: ["anime", "manga", "characters"],
    example: `// Buscar anime por nombre
async function searchAnime(query) {
  try {
    const response = await fetch(\`https://api.jikan.moe/v4/search/anime?q=\${query}\`);
    const data = await response.json();
    return data.data; // Lista de animes encontrados
  } catch (error) {
    console.error('Error fetching anime:', error);
    return [];
  }
}`,
    docs: "https://jikan.moe/docs",
  },
  {
    name: "AniList API",
    description:
      "API oficial de AniList para obtener información de anime, manga y personajes",
    endpoints: {
      search: "https://graphql.anilist.co",
      trendingAnime: "https://graphql.anilist.co",
      trendingManga: "https://graphql.anilist.co",
    },
    categories: ["anime", "manga", "characters"],
    example: `// Buscar anime con AniList
async function searchAniList(query) {
  const queryString = \`
    query ($search: String) {
      Page {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  \`;
  const variables = { search: query };
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: queryString, variables }),
    });
    const data = await response.json();
    return data.data.Page.media; // Lista de animes encontrados
  } catch (error) {
    console.error('Error fetching AniList:', error);
    return [];
  }
}`,
    docs: "https://anilist.gitbook.io/anilist-apiv2-docs/",
  },
];

export default function AnimePage() {
  const [activeTab, setActiveTab] = useState("waifu");
  const [randomWaifu, setRandomWaifu] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Obtener waifu aleatoria
  const fetchRandomWaifu = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.waifu.pics/sfw/waifu");
      const data = await res.json();
      setRandomWaifu(data.url);
    } catch (error) {
      console.error("Error fetching waifu:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomWaifu();
  }, []);

  // Filtrar imágenes basadas en búsqueda
  const filteredImages = Object.entries(imageData).reduce(
    (acc, [category, images]) => {
      if (searchQuery === "" || category.includes(searchQuery.toLowerCase())) {
        acc[category] = images;
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

  // Abrir modal de imagen
  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-purple-900/30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
              Nebura Gallery
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Buscar waifus..."
              className="bg-gray-800/50 border-gray-700 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link href="/" passHref legacyBehavior>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Inicio
              </Button>
            </Link>
            <Link href="/anime" passHref legacyBehavior>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Galerías
              </Button>
            </Link>
            <Link href="https://help.hiroshi-dev.me" passHref legacyBehavior>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                APIs
              </Button>
            </Link>
            <Link
              href="https://github.com/hiroshi025"
              target="_blank"
              passHref
              legacyBehavior
            >
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
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
            src={imageData.waifu4k[0]}
            alt="Hero Waifu"
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
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-violet-400">
              Explora el Mundo Anime
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Descubre las mejores waifus, imágenes 4K, mangas y aprende a usar
            APIs de anime en tus proyectos.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={fetchRandomWaifu}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              size="lg"
            >
              <FaRandom className="mr-2" /> Waifu Aleatoria
            </Button>
            <Button
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-900/50"
              size="lg"
            >
              <FaCode className="mr-2" /> Ver APIs
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Random Waifu Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-gray-800/60 border-purple-900/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Waifu del Día
              </CardTitle>
              <CardDescription className="text-center text-purple-300">
                Descubre una nueva waifu cada vez que pulses el botón
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-6">
              {loading ? (
                <div className="h-64 w-64 flex items-center justify-center">
                  <div className="animate-pulse rounded-full bg-purple-900/50 h-12 w-12"></div>
                </div>
              ) : randomWaifu ? (
                <div className="relative h-64 w-64 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={randomWaifu}
                    alt="Random Waifu"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 w-64 flex items-center justify-center bg-gray-700 rounded-lg">
                  <p className="text-gray-400">No se pudo cargar la imagen</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button
                onClick={fetchRandomWaifu}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <FaRandom className="mr-2" /> Otra Waifu
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Gallery Tabs */}
      <section className="py-16 container mx-auto px-4">
        <Tabs defaultValue="waifu" className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Galerías</h2>
            <TabsList className="bg-gray-800/50 border border-purple-900/50">
              <TabsTrigger
                value="waifu"
                className="data-[state=active]:bg-purple-900/50"
              >
                Waifus
              </TabsTrigger>
              <TabsTrigger
                value="nsfw"
                className="data-[state=active]:bg-pink-900/50"
              >
                +18
              </TabsTrigger>
              <TabsTrigger
                value="manga"
                className="data-[state=active]:bg-blue-900/50"
              >
                Manga
              </TabsTrigger>
              <TabsTrigger
                value="gifs"
                className="data-[state=active]:bg-green-900/50"
              >
                GIFs
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Waifu Tab */}
          <TabsContent value="waifu">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {imageData.waifu4k.map((url, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="bg-gray-800/60 border-purple-900/50 overflow-hidden hover:border-purple-500 transition-colors">
                    <CardContent className="p-0">
                      <button
                        onClick={() => openImageModal(url)}
                        className="w-full h-64 relative block"
                      >
                        <Image
                          src={url}
                          alt={`Waifu ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <FaExpand className="text-white text-2xl" />
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* NSFW Tab */}
          <TabsContent value="nsfw">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {imageData.nsfw.map((url, index) => (
                <motion.div key={index} whileHover={{ scale: 1.03 }}>
                  <Card className="bg-gray-800/60 border-pink-900/50 overflow-hidden hover:border-pink-500 transition-colors">
                    <CardContent className="p-0">
                      <button
                        onClick={() => openImageModal(url)}
                        className="w-full h-64 relative block"
                      >
                        <Image
                          src={url}
                          alt={`NSFW ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <FaExpand className="text-white text-2xl" />
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              Nota: Estas imágenes son solo sugerentes, no contienen contenido
              explícito.
            </p>
          </TabsContent>

          {/* Manga Tab */}
          <TabsContent value="manga">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="h-[400px]"
            >
              {imageData.manga.map((url, index) => (
                <SwiperSlide key={index}>
                  <Card className="bg-gray-800/60 border-blue-900/50 h-full">
                    <CardContent className="p-0 h-full">
                      <button
                        onClick={() => openImageModal(url)}
                        className="w-full h-full relative block"
                      >
                        <Image
                          src={url}
                          alt={`Manga ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </TabsContent>

          {/* GIFs Tab */}
          <TabsContent value="gifs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {imageData.gifs.map((url, index) => (
                <Card
                  key={index}
                  className="bg-gray-800/60 border-green-900/50 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => openImageModal(url)}
                      className="w-full h-64 relative block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`GIF ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* API Examples Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">APIs de Anime</h2>
          <p className="text-gray-400 mb-12 text-center max-w-2xl mx-auto">
            Aprende a consumir estas APIs gratuitas para obtener imágenes de
            anime en tus proyectos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {APIExamples.map((api, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-gray-800/60 border-purple-900/50 h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-purple-400">
                      {api.name}
                    </CardTitle>
                    <CardDescription>{api.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        Endpoints:
                      </h4>
                      <ScrollArea className="h-24 rounded-md bg-gray-900/50 p-2 text-xs">
                        {Object.entries(api.endpoints).map(
                          ([type, endpoint]) => (
                            <div key={type} className="mb-1">
                              <span className="text-purple-300">{type}:</span>{" "}
                              <code className="text-gray-400">{endpoint}</code>
                            </div>
                          )
                        )}
                      </ScrollArea>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        Categorías:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {api.categories.map((cat) => (
                          <span
                            key={cat}
                            className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full border-purple-400 text-purple-400"
                        >
                          <FaCode className="mr-2" /> Ver Ejemplo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-purple-400">
                            {api.name} - Ejemplo de Código
                          </DialogTitle>
                          <DialogDescription>
                            Cómo consumir esta API en JavaScript/TypeScript
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <SyntaxHighlighter
                            language="javascript"
                            theme={{
                              plain: {
                                backgroundColor: "#1e1e2d",
                                color: "#e2e8f0",
                              },
                              styles: [
                                {
                                  types: ["keyword", "builtin"],
                                  style: { color: "#c792ea" },
                                },
                                {
                                  types: ["string"],
                                  style: { color: "#c3e88d" },
                                },
                                {
                                  types: ["function"],
                                  style: { color: "#82aaff" },
                                },
                                {
                                  types: ["comment"],
                                  style: {
                                    color: "#636379",
                                    fontStyle: "italic",
                                  },
                                },
                              ],
                            }}
                          >
                            {api.example}
                          </SyntaxHighlighter>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <Link
                            href={api.docs}
                            target="_blank"
                            className="text-sm text-purple-400 hover:underline"
                          >
                            Ver documentación completa
                          </Link>
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <FaGithub className="mr-2" /> Copiar Código
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More Galleries */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Más Galerías</h2>

        {/* Characters Gallery */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-pink-400">
              Personajes Populares
            </h3>
            <Button
              variant="ghost"
              className="text-pink-400 hover:bg-pink-900/20"
            >
              Ver todos <FaArrowRight className="ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imageData.characters.map((url, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="relative h-48 rounded-lg overflow-hidden"
              >
                <Image
                  src={url}
                  alt={`Character ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                  <span className="font-medium">Personaje {index + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Backgrounds Gallery */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-blue-400">Fondos 4K</h3>
            <Button
              variant="ghost"
              className="text-blue-400 hover:bg-blue-900/20"
            >
              Ver todos <FaArrowRight className="ml-2" />
            </Button>
          </div>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="h-64"
          >
            {imageData.backgrounds.map((url, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`Background ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Cosplay Gallery */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-green-400">
              Cosplay Anime
            </h3>
            <Button
              variant="ghost"
              className="text-green-400 hover:bg-green-900/20"
            >
              Ver todos <FaArrowRight className="ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {imageData.cosplay.map((url, index) => (
              <Card
                key={index}
                className="bg-gray-800/60 border-green-900/50 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative h-64">
                    <Image
                      src={url}
                      alt={`Cosplay ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <p className="text-sm text-gray-300">
                    Cosplay de personaje anime #{index + 1}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative w-full h-[80vh]">
              {selectedImage.endsWith(".gif") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedImage}
                  alt="Fullscreen"
                  className="object-contain w-full h-full"
                />
              ) : (
                <Image
                  src={selectedImage}
                  alt="Fullscreen"
                  fill
                  className="object-contain"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-12 bg-gray-900/80 border-t border-purple-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-400">
                Nebura
              </h4>
              <p className="text-gray-400 text-sm">
                El mejor lugar para explorar waifus, imágenes de anime y
                aprender sobre APIs relacionadas.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-400">
                Galerías
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    Waifus 4K
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    Mangas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    Personajes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400">
                    Fondos
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-400">
                APIs
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    href="https://waifu.pics/docs"
                    className="hover:text-purple-400"
                  >
                    Waifu.pics
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://docs.nekos.best"
                    className="hover:text-purple-400"
                  >
                    Nekos.best
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://nekosia.cat/documentation"
                    className="hover:text-purple-400"
                  >
                    Nekosia
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-400">
                Contacto
              </h4>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-purple-400"
                >
                  <Link href="mailto:contact@hiroshi-dev.me">
                    <FiMail className="h-5 w-5" />
                  </Link>
                  <span className="sr-only">Email</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-purple-400"
                >
                  <Link href="https://github.com/Hiroshi025">
                    <FiGithub className="h-5 w-5" />
                  </Link>
                  <span className="sr-only">GitHub</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-purple-400"
                >
                  <Link href="https://twitter.com/Hiroshi025">
                    <FiTwitter className="h-5 w-5" />
                  </Link>
                  <span className="sr-only">Twitter</span>
                </Button>
              </div>
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} Hiroshi025. Todos los derechos
              reservados.
            </p>
            <p className="mt-2">
              Las imágenes son propiedad de sus respectivos autores.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
