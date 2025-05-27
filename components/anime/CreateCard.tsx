// components/CreatorCard.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CreatorCardProps {
  person: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    favorites: number;
    positions: string[];
  };
}

export default function CreatorCard({ person }: CreatorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <div className="bg-gray-800/60 border-green-900/50 rounded-lg overflow-hidden h-full flex flex-col">
        <div className="relative h-64">
          <Image
            src={person.images?.jpg?.image_url || "/placeholder-creator.jpg"}
            alt={person.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <h3 className="font-bold text-white line-clamp-1">{person.name}</h3>
          </div>
        </div>
        
        <div className="p-4 flex-grow">
          <div className="flex flex-wrap gap-1 mb-2">
            {person.positions.slice(0, 3).map((position, index) => (
              <span
                key={index}
                className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded"
              >
                {position}
              </span>
            ))}
            {person.favorites && (
              <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                ♥ {person.favorites.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="px-4 pb-4">
          <Link
            href={`https://myanimelist.net/people/${person.mal_id}`}
            target="_blank"
            className="text-sm text-green-400 hover:text-green-300"
          >
            Ver perfil →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}