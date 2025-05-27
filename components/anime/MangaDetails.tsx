"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export default function MangaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [manga, setManga] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/manga/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setManga(data.data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!manga) {
    return <div className="text-center py-20">No se encontró el manga.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        ← Volver
      </Button>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <Image
            src={manga.images?.webp?.image_url || manga.images?.jpg?.image_url}
            alt={manga.title}
            width={350}
            height={500}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{manga.title}</h1>
          {manga.title_english && (
            <h2 className="text-xl text-gray-400 mb-2 italic">
              {manga.title_english}
            </h2>
          )}
          <div className="mb-4">
            <span className="font-semibold">Sinopsis:</span>
            <p className="text-gray-300">
              {manga.synopsis || "No disponible."}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <div>
              <span className="font-semibold">Tipo:</span> {manga.type}
            </div>
            <div>
              <span className="font-semibold">Capítulos:</span>{" "}
              {manga.chapters || "?"}
            </div>
            <div>
              <span className="font-semibold">Volúmenes:</span>{" "}
              {manga.volumes || "?"}
            </div>
            <div>
              <span className="font-semibold">Estado:</span> {manga.status}
            </div>
            <div>
              <span className="font-semibold">Puntaje:</span>{" "}
              {manga.score || "?"}
            </div>
            <div>
              <span className="font-semibold">Popularidad:</span> #
              {manga.popularity}
            </div>
            <div>
              <span className="font-semibold">Miembros:</span> {manga.members}
            </div>
            <div>
              <span className="font-semibold">Favoritos:</span>{" "}
              {manga.favorites}
            </div>
            <div>
              <span className="font-semibold">Fecha de Publicación:</span>{" "}
              {manga.published?.string || "?"}
            </div>
            <div>
              <span className="font-semibold">Autores:</span>{" "}
              {manga.authors?.map((a: any) => a.name).join(", ") || "?"}
            </div>
            <div>
              <span className="font-semibold">Serialización:</span>{" "}
              {manga.serializations?.map((s: any) => s.name).join(", ") || "?"}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Géneros:</span>{" "}
            {manga.genres?.map((g: any) => g.name).join(", ") || "?"}
          </div>
          {manga.themes && manga.themes.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Temas:</span>{" "}
              {manga.themes.map((t: any) => t.name).join(", ")}
            </div>
          )}
          {manga.demographics && manga.demographics.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Demografía:</span>{" "}
              {manga.demographics.map((d: any) => d.name).join(", ")}
            </div>
          )}
          {manga.background && (
            <div className="mt-4 text-gray-400">
              <span className="font-semibold">Información adicional:</span>
              <p>{manga.background}</p>
            </div>
          )}
          <div className="mt-6">
            <a
              href={manga.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 underline hover:text-purple-200"
            >
              Ver en MyAnimeList
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
