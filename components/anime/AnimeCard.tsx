// components/AnimeCard.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaPlayCircle, FaStar } from "react-icons/fa";

interface AnimeCardProps {
  anime: {
    mal_id: number;
    title: string;
    images: {
      webp: {
        image_url: string;
      };
    };
    score: number;
    type: string;
    episodes: number;
    genres: Array<{ name: string }>;
    synopsis: string;
    year: number;
  };
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <div className="bg-gray-800/60 border-blue-900/50 rounded-lg overflow-hidden h-full flex flex-col">
        <div className="relative h-64">
          <Image
            src={anime.images?.webp?.image_url || "/placeholder-anime.jpg"}
            alt={anime.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <h3 className="font-bold text-white line-clamp-1">{anime.title}</h3>
          </div>
          <div className="absolute top-2 left-2 bg-blue-600/90 text-white text-xs px-2 py-1 rounded">
            {anime.type}
          </div>
          <div className="absolute top-2 right-2 flex items-center bg-black/70 text-yellow-400 px-2 py-1 rounded">
            <FaStar className="mr-1" />
            {anime.score || "N/A"}
          </div>
        </div>
        
        <div className="p-4 flex-grow">
          <div className="flex flex-wrap gap-1 mb-2">
            {anime.genres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded"
              >
                {genre.name}
              </span>
            ))}
            {anime.episodes && (
              <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                {anime.episodes} eps.
              </span>
            )}
            {anime.year && (
              <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                {anime.year}
              </span>
            )}
          </div>
          
          <p className="text-gray-300 text-sm line-clamp-3 mb-4">
            {anime.synopsis || "Sin sinopsis disponible."}
          </p>
        </div>
        
        <div className="px-4 pb-4 flex justify-between items-center">
          <Link
            href={`https://myanimelist.net/anime/${anime.mal_id}`}
            target="_blank"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Ver en MyAnimeList →
          </Link>
          <FaPlayCircle className="text-blue-400 text-lg" />
        </div>
      </div>
    </motion.div>
  );
}