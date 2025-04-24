"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Particles from "react-tsparticles";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PortfolioPage() {
  interface Repo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    created_at: string;
    license: { name: string } | null;
    homepage: string | null;
    owner: { login: string };
  }

  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch(
        "https://api.github.com/users/Hiroshi025/repos"
      );
      const data = await response.json();
      setRepos(data);
    };
    fetchRepos();
  }, []);

  const technologies = [
    { name: "Bootstrap", logo: "https://skillicons.dev/icons?i=bootstrap" },
    { name: "HTML5", logo: "https://skillicons.dev/icons?i=html" },
    { name: "CSS3", logo: "https://skillicons.dev/icons?i=css" },
    { name: "VS Code", logo: "https://skillicons.dev/icons?i=vscode" },
    { name: "GitHub", logo: "https://skillicons.dev/icons?i=github" },
    { name: "Node.js", logo: "https://skillicons.dev/icons?i=nodejs" },
    { name: "Python", logo: "https://skillicons.dev/icons?i=python" },
    { name: "JavaScript", logo: "https://skillicons.dev/icons?i=javascript" },
    { name: "TypeScript", logo: "https://skillicons.dev/icons?i=typescript" },
    { name: "Express.js", logo: "https://skillicons.dev/icons?i=express" },
    { name: "MongoDB", logo: "https://skillicons.dev/icons?i=mongodb" },
    { name: "C", logo: "https://skillicons.dev/icons?i=c" },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200">
      <Head>
        <title>Portafolio de Hiroshi025</title>
        <meta
          name="description"
          content="Portafolio de Hiroshi025, desarrollador web y creador de soluciones tecnológicas."
        />
        <meta
          name="keywords"
          content="Hiroshi025, desarrollo web, portafolio, tecnologías, proyectos"
        />
        <meta name="author" content="Hiroshi025" />
      </Head>
      {/* Navigation */}
      <nav className="border-b border-purple-900/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold text-white">Hiroshi025</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="#technologies"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Tecnologías
            </Link>
            <Link
              href="#projects"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Proyectos
            </Link>
            <Button
              onClick={() => (window.location.href = "/proyect")}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              Ir a Nebura
            </Button>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section
        className="py-32 text-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/placeholder.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Image
            src="/placeholder-user.jpg"
            alt="Foto de perfil"
            width={150}
            height={150}
            className="rounded-full border-4 border-purple-500 mb-6"
          />
          <h1 className="text-5xl font-extrabold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Hiroshi025
            </span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto mb-8 text-xl leading-relaxed">
            Soy un desarrollador apasionado por crear proyectos innovadores y
            soluciones tecnológicas. Me especializo en desarrollo web, APIs y
            herramientas multiplataforma. Mi objetivo es ofrecer soluciones
            eficientes y creativas para los desafíos tecnológicos.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://github.com/Hiroshi025"
              target="_blank"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              <i className="fab fa-github text-2xl"></i>
            </Link>
            <Link
              href="https://linkedin.com/in/Hiroshi025"
              target="_blank"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              <i className="fab fa-linkedin text-2xl"></i>
            </Link>
            <Link
              href="https://twitter.com/Hiroshi025"
              target="_blank"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              <i className="fab fa-twitter text-2xl"></i>
            </Link>
          </div>
        </div>
        <Particles
          options={{
            particles: {
              number: { value: 50 },
              shape: { type: "star" },
              move: { speed: 1 },
              color: { value: "#ff69b4" },
            },
          }}
        />
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="py-20">
        <div className="max-w-[60%] mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Tecnologías
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-gray-800/50 p-4 rounded-lg shadow-md hover:shadow-purple-500/50 transition-shadow"
              >
                <Image
                  src={tech.logo}
                  alt={tech.name}
                  width={64}
                  height={64}
                  className="mb-2"
                />
                <span className="text-gray-300 font-semibold">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gray-950">
        <div className="max-w-[60%] mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-600">
              Mis Stats
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-white">
              <h3 className="text-5xl font-bold">3+</h3>
              <p className="text-gray-300">Años de Experiencia</p>
            </div>
            <div className="text-white">
              <h3 className="text-5xl font-bold">20+</h3>
              <p className="text-gray-300">Proyectos Completados</p>
            </div>
            <div className="text-white">
              <h3 className="text-5xl font-bold">12</h3>
              <p className="text-gray-300">Tecnologías Dominadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hobbies Section */}
      <section id="hobbies" className="py-20 bg-gray-900">
        <div className="max-w-[60%] mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Mis Intereses
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Anime y Manga",
                description:
                  "Fanático de series como Naruto, One Piece y Attack on Titan.",
              },
              {
                title: "Videojuegos",
                description: "Me encanta jugar RPGs y juegos de estrategia.",
              },
              {
                title: "Tecnología",
                description:
                  "Siempre estoy explorando nuevas herramientas y frameworks.",
              },
            ].map((hobby, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-6 rounded-lg shadow-md hover:shadow-purple-500/50 transition-shadow"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {hobby.title}
                </h3>
                <p className="text-gray-300">{hobby.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="max-w-[60%] mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Proyectos
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {repos.map((repo) => (
              <Card
                key={repo.id}
                className="bg-gray-800/50 backdrop-blur-sm border-purple-900/50 hover:border-purple-500/70 transition-all duration-300 overflow-hidden group"
              >
                <CardContent className="p-6 relative flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {repo.name}
                    </h3>
                    <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                      {repo.license?.name || "Sin Licencia"}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    {repo.description || "Sin descripción"}
                  </p>
                  <ul className="text-gray-400 text-sm space-y-1 mb-4">
                    <li>
                      <strong>Creado:</strong>{" "}
                      {new Date(repo.created_at).toLocaleDateString()}
                    </li>
                    <li>
                      <strong>Owner:</strong> {repo.owner.login}
                    </li>
                  </ul>
                  <Button
                    onClick={() => window.open(repo.html_url, "_blank")}
                    className="mt-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                  >
                    Ver Proyecto
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-900">
        <div className="max-w-[60%] mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Servicios
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Desarrollo Web",
                description: "Creación de sitios web modernos y responsivos.",
              },
              {
                title: "APIs y Backend",
                description:
                  "Diseño y desarrollo de APIs robustas y escalables.",
              },
              {
                title: "Consultoría Técnica",
                description: "Asesoramiento en proyectos tecnológicos.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-6 rounded-lg shadow-md hover:shadow-purple-500/50 transition-shadow"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 bg-gray-900">
        <div className="max-w-[60%] mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Planes Futuros
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Aprender Rust",
                description:
                  "Explorar el lenguaje Rust para desarrollo de sistemas.",
              },
              {
                title: "Contribuir a Open Source",
                description: "Participar en más proyectos de código abierto.",
              },
              {
                title: "Crear un SaaS",
                description: "Lanzar un producto como servicio (SaaS).",
              },
            ].map((plan, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-6 rounded-lg shadow-md hover:shadow-purple-500/50 transition-shadow"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {plan.title}
                </h3>
                <p className="text-gray-300">{plan.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-gray-950">
        <div className="max-w-[60%] mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Herramientas Favoritas
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: "Visual Studio Code",
                logo: "https://skillicons.dev/icons?i=vscode",
              },
              { name: "GitHub", logo: "https://skillicons.dev/icons?i=github" },
              { name: "Figma", logo: "https://skillicons.dev/icons?i=figma" },
              {
                name: "Postman",
                logo: "https://skillicons.dev/icons?i=postman",
              },
            ].map((tool, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={tool.logo}
                  alt={tool.name}
                  width={64}
                  height={64}
                  className="mb-4"
                />
                <span className="text-gray-300">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20 bg-gray-950">
        <div className="max-w-[60%] mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Mi Trayectoria
            </span>
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-500"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  year: "2020",
                  title: "Inicio en Desarrollo Web",
                  description:
                    "Comencé mi viaje aprendiendo HTML, CSS y JavaScript. Creé mis primeros proyectos personales y descubrí mi pasión por el desarrollo web.",
                },
                {
                  year: "2021",
                  title: "Primer Proyecto Freelance",
                  description:
                    "Desarrollé un sitio web para un cliente local, aplicando mis conocimientos en diseño responsivo y buenas prácticas de desarrollo.",
                },
                {
                  year: "2022",
                  title: "Contribuciones Open Source",
                  description:
                    "Participé en proyectos de código abierto en GitHub, colaborando con desarrolladores de mis mismas areas.",
                },
                {
                  year: "2023",
                  title: "Especialización en React y Node.js",
                  description:
                    "Me especialicé en el desarrollo de aplicaciones web modernas utilizando React para el frontend y Node.js para el backend.",
                },
                {
                  year: "2024",
                  title: "Lanzamiento de Nebura",
                  description:
                    "Creé y lancé Nebura, un proyecto personal que combina mis habilidades técnicas con mi pasión por la tecnología.",
                },
              ].map((event, index) => (
                <div
                  key={index}
                  className={`relative bg-gray-800/50 p-6 rounded-lg shadow-md hover:shadow-purple-500/50 transition-shadow ${
                    index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                  }`}
                >
                  <div className="absolute top-1/2 transform -translate-y-1/2 -left-4 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {event.year}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-300">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
