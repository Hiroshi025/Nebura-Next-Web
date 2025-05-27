"use client";

import { motion } from "framer-motion";
import { Briefcase, Code, GraduationCap, Rocket } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaNodeJs, FaPython, FaReact } from "react-icons/fa";
import {
  FiAward,
  FiCode,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiUser,
} from "react-icons/fi";
import { SiExpress, SiMongodb, SiTypescript } from "react-icons/si";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  created_at: string;
  license: { name: string } | null;
  homepage: string | null;
  owner: { login: string };
  language: string | null;
  stargazers_count: number;
}

const experiences = [
  {
    id: 1,
    year: "2025",
    title: "Desarrollador Full Stack",
    company: "Autónomo/Freelance",
    description:
      "Desarrollo de aplicaciones web completas con React, Node.js y bases de datos modernas. Especialización en arquitecturas escalables y buenas prácticas de código.",
    icon: <Code className="text-purple-500" size={24} />,
    tags: ["React", "TypeScript", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    year: "2022 - 2023",
    title: "Contribuidor Open Source",
    company: "Proyectos GitHub",
    description:
      "Contribuciones significativas a proyectos de código abierto, mejorando documentación, resolviendo issues y añadiendo nuevas funcionalidades.",
    icon: <Rocket className="text-blue-500" size={24} />,
    tags: ["Open Source", "Git", "Comunidad"],
  },
  {
    id: 3,
    year: "2021 - 2022",
    title: "Bootcamp Intensivo",
    company: "Full Stack Development",
    description:
      "Formación intensiva en desarrollo web moderno, abarcando fundamentos, frameworks frontend, backend y despliegue de aplicaciones.",
    icon: <GraduationCap className="text-green-500" size={24} />,
    tags: ["Bootcamp", "Formación", "Proyectos"],
  },
  {
    id: 4,
    year: "2020 - 2021",
    title: "Primeros Proyectos",
    company: "Aprendizaje Autodidacta",
    description:
      "Exploración de tecnologías web mediante la creación de proyectos personales y pequeños trabajos freelance.",
    icon: <Briefcase className="text-yellow-500" size={24} />,
    tags: ["HTML/CSS", "JavaScript", "PHP", "WordPress"],
  },
];

const PortfolioPage = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("featured");

  // Datos de tecnologías con niveles de habilidad
  const technologies = [
    { name: "React", icon: <FaReact className="text-blue-400" />, level: 85 },
    {
      name: "TypeScript",
      icon: <SiTypescript className="text-blue-600" />,
      level: 80,
    },
    {
      name: "Node.js",
      icon: <FaNodeJs className="text-green-500" />,
      level: 75,
    },
    {
      name: "Python",
      icon: <FaPython className="text-yellow-400" />,
      level: 70,
    },
    {
      name: "MongoDB",
      icon: <SiMongodb className="text-green-400" />,
      level: 65,
    },
    {
      name: "Express",
      icon: <SiExpress className="text-gray-400" />,
      level: 70,
    },
    { name: "HTML5", icon: <FiCode className="text-orange-500" />, level: 90 },
    { name: "CSS3", icon: <FiCode className="text-blue-500" />, level: 85 },
  ];

  // Obtener repositorios de GitHub
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/Hiroshi025/repos"
        );
        const data = await response.json();
        setRepos(data);
      } catch (error) {
        console.error("Error fetching repos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  // Filtros para proyectos
  const featuredRepos = repos.filter((repo) => repo.stargazers_count > 0);
  const recentRepos = [...repos]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 6);

  // Animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Head>
        <title>Hiroshi025 | Desarrollador Full Stack</title>
        <meta
          name="description"
          content="Portafolio profesional de Hiroshi025, desarrollador full stack especializado en React, Node.js y TypeScript"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navegación */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-purple-900/30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold text-white">Hiroshi025</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#about"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Sobre mí
            </Link>
            <Link
              href="#skills"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Habilidades
            </Link>
            <Link
              href="#projects"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Proyectos
            </Link>
            <Link
              href="#experience"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Experiencia
            </Link>
            <Button
              asChild
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              <Link href="/nebura">Ir a Nebura</Link>
            </Button>
          </div>

          {/* Menú móvil */}
          <Button variant="ghost" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Hiroshi025
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-8">
              Desarrollador Full Stack | Especialista en Backend y
              Microcontroladores
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Creo soluciones digitales innovadoras con tecnologías modernas y
              código limpio.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                size="lg"
              >
                <Link href="#projects">Ver mis proyectos</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-900/50"
                size="lg"
              >
                <Link href="#contact">Contacto</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sobre Mí */}
      <section id="about" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-purple-500/30">
                <Image
                  src="/placeholder-user.jpg"
                  alt="Foto de Hiroshi025"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Sobre Mí
                </span>
              </h2>

              <p className="text-gray-300 mb-6 text-lg">
                Soy un desarrollador full stack con más de 3 años de experiencia
                creando aplicaciones web modernas. Me especializo en JavaScript,
                TypeScript y el ecosistema React/Node.js.
              </p>

              <p className="text-gray-400 mb-8">
                Mi pasión por la programación comenzó cuando descubrí cómo crear
                mis propias soluciones tecnológicas. Desde entonces, he
                trabajado en diversos proyectos, desde pequeñas aplicaciones
                hasta sistemas complejos, siempre buscando aprender y mejorar
                mis habilidades.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                  <FiUser className="text-purple-400" />
                  <span>Full Stack Developer</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                  <FiCode className="text-purple-400" />
                  <span>+20 Proyectos</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
                  <FiAward className="text-purple-400" />
                  <span>Open Source Contributor</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Habilidades */}
      <section id="skills" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Mis Habilidades
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-6">
                  Tecnologías Principales
                </h3>
                <div className="space-y-6">
                  {technologies.map((tech, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {tech.icon}
                          <span className="text-gray-300">{tech.name}</span>
                        </div>
                        <span className="text-gray-400">{tech.level}%</span>
                      </div>
                      <Progress
                        value={tech.level}
                        className="h-2 bg-gray-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-6">
                  Otras Tecnologías
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    "Bootstrap",
                    "Tailwind CSS",
                    "Next.js",
                    "GraphQL",
                    "PostgreSQL",
                    "Docker",
                    "Git",
                    "Jest",
                    "Redux",
                    "AWS",
                    "Firebase",
                    "REST APIs",
                  ].map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-800/50 hover:bg-gray-700/50"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-gray-300 mt-8 mb-4">
                  Idiomas
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Español</span>
                      <span className="text-gray-400">Nativo</span>
                    </div>
                    <Progress value={100} className="h-2 bg-gray-800" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">Inglés</span>
                      <span className="text-gray-400">Avanzado (B2)</span>
                    </div>
                    <Progress value={80} className="h-2 bg-gray-800" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proyectos */}
      <section id="projects" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Mis Proyectos
              </span>
            </h2>

            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto bg-gray-800">
                <TabsTrigger
                  value="featured"
                  className="data-[state=active]:bg-purple-900/50"
                >
                  Destacados
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="data-[state=active]:bg-purple-900/50"
                >
                  Recientes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="featured">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card
                        key={i}
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-700/30 h-64 animate-pulse rounded-xl"
                      ></Card>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {featuredRepos.map((repo) => (
                      <motion.div key={repo.id} variants={item}>
                        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-700/30 hover:border-purple-500/70 transition-colors h-full flex flex-col rounded-xl shadow-lg">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl text-white font-bold">
                                {repo.name}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="text-xs border border-purple-700 text-purple-300 bg-gray-800/70"
                              >
                                {repo.language || "Multi"}
                              </Badge>
                            </div>
                            <CardDescription className="text-gray-300 line-clamp-2">
                              {repo.description || "Sin descripción disponible"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                              <span>
                                Creado:{" "}
                                {new Date(repo.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {repo.stargazers_count > 0 && (
                              <div className="flex items-center gap-1 text-yellow-400">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                <span>{repo.stargazers_count}</span>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter>
                            <Button
                              asChild
                              variant="outline"
                              className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg font-semibold"
                            >
                              <Link href={repo.html_url} target="_blank">
                                <FiGithub className="mr-2" /> Ver en GitHub
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="recent">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card
                        key={i}
                        className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-700/30 h-64 animate-pulse rounded-xl"
                      ></Card>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {recentRepos.map((repo) => (
                      <motion.div key={repo.id} variants={item}>
                        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-700/30 hover:border-purple-500/70 transition-colors h-full flex flex-col rounded-xl shadow-lg">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl text-white font-bold">
                                {repo.name}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="text-xs border border-purple-700 text-purple-300 bg-gray-800/70"
                              >
                                {repo.language || "Multi"}
                              </Badge>
                            </div>
                            <CardDescription className="text-gray-300 line-clamp-2">
                              {repo.description || "Sin descripción disponible"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                              <span>
                                Creado:{" "}
                                {new Date(repo.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              asChild
                              variant="outline"
                              className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg font-semibold"
                            >
                              <Link href={repo.html_url} target="_blank">
                                <FiGithub className="mr-2" /> Ver en GitHub
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Experiencia */}
      <section id="experience" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Trayectoria Profesional
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Mi camino en el desarrollo de software, desde los primeros pasos
              hasta los proyectos más complejos.
            </p>
          </motion.div>

          <div className="relative">
            {/* Línea de tiempo vertical */}
            <div className="absolute left-1/2 hidden md:block h-full w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-transparent transform -translate-x-1/2 rounded-full"></div>

            <div className="space-y-12 md:space-y-0">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex flex-col md:flex-row items-center md:items-start gap-8"
                >
                  {/* Contenido para móvil */}
                  <div className="md:hidden w-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl shadow-lg p-6 border border-purple-700/30">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg border-2 border-purple-400">
                        {exp.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-purple-400">
                          {exp.company} • {exp.year}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs rounded-full bg-gray-800/70 text-purple-300 border border-purple-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Desktop: Cuadro a la izquierda, icono en el centro, año a la derecha */}
                  <div className="hidden md:flex md:w-1/2 flex-col items-end pr-12 text-right">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-purple-700/30 p-6 shadow-lg w-full max-w-lg">
                      <h3 className="text-2xl font-bold text-white">
                        {exp.title}
                      </h3>
                      <p className="text-lg text-purple-400 mb-2">
                        {exp.company}
                      </p>
                      <p className="text-gray-300 mb-4">{exp.description}</p>
                      <div className="flex flex-wrap justify-end gap-2">
                        {exp.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs rounded-full bg-gray-800/70 text-purple-300 border border-purple-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 border-4 border-purple-400 items-center justify-center shadow-xl z-10">
                    {exp.icon}
                  </div>

                  <div className="hidden md:flex md:w-1/2 pl-12 items-center">
                    <div className="text-left">
                      <p className="text-xl font-semibold text-purple-300">
                        {exp.year}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Llamado a la acción */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Listo para trabajar juntos?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Tengo experiencia creando soluciones digitales a medida.
              Contáctame para discutir tu proyecto.
            </p>
            <Button
              asChild
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-medium shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
              size="lg"
            >
              <a href="#contact">Contactar Ahora</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contact" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Contacto
              </span>
            </h2>

            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              ¿Interesado en trabajar juntos o tienes alguna pregunta? No dudes
              en contactarme.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <Button
                asChild
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
              >
                <Link href="mailto:hiroshi@example.com">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Enviar Email
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Link href="https://github.com/Hiroshi025" target="_blank">
                  <FiGithub className="mr-2" /> GitHub
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
              >
                <Link href="https://linkedin.com/in/Hiroshi025" target="_blank">
                  <FiLinkedin className="mr-2" /> LinkedIn
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white"
              >
                <Link href="https://twitter.com/Hiroshi025" target="_blank">
                  <FiTwitter className="mr-2" /> Twitter
                </Link>
              </Button>
            </div>

            <div className="text-gray-500 text-sm">
              <p>
                © {new Date().getFullYear()} Hiroshi025. Todos los derechos
                reservados.
              </p>
              <p className="mt-2">
                Diseñado y desarrollado con ❤️ por mí mismo
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
