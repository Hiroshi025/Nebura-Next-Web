"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Particles from "react-tsparticles";

import { EmbedBuilder } from "@/components/tools/EmbedTools";

export default function EmbedBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-200">
      {/* Particles Background */}
      <Particles
        options={{
          particles: {
            color: { value: "#f472b6" },
            number: { value: 60 },
            size: { value: 3 },
            move: { speed: 1 },
            opacity: { value: 0.7 },
          },
        }}
        className="absolute inset-0 -z-10"
      />

      {/* Enhanced Header with animations */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-16 px-4 bg-gradient-to-br from-gray-900 to-purple-900/70 shadow-lg"
      >
        <div className="container mx-auto max-w-6xl text-center">
          <motion.h1
            className="text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Advanced Embed Builder
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create, customize and preview Discord embeds in real-time
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4"
          >
            <a
              href="#builder"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all"
            >
              Start Building
            </a>
            <a
              href="#tutorial"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all"
            >
              How to Use
            </a>
          </motion.div>

          {/* Botón de comunidad con animación */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="flex justify-center mt-6"
          >
            <a
              href="https://discord.gg/tu-servidor" // Cambia por tu enlace real
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 group"
            >
              <svg
                className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.07.07 0 00-.073.035c-.211.375-.444.864-.608 1.249a18.524 18.524 0 00-5.487 0 12.51 12.51 0 00-.617-1.249.07.07 0 00-.073-.035A19.736 19.736 0 003.677 4.369a.064.064 0 00-.03.027C.533 9.09-.32 13.579.099 18.021a.08.08 0 00.031.056c2.052 1.507 4.042 2.422 5.992 3.029a.077.077 0 00.084-.027c.461-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.105c-.652-.247-1.27-.549-1.872-.892a.077.077 0 01-.008-.127c.126-.094.252-.192.371-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.245.197.372.291a.077.077 0 01-.006.127 12.298 12.298 0 01-1.873.892.076.076 0 00-.04.106c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028c1.95-.607 3.94-1.522 5.993-3.029a.077.077 0 00.031-.055c.5-5.177-.838-9.637-3.548-13.625a.061.061 0 00-.03-.028zM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.095 2.156 2.418 0 1.334-.955 2.419-2.156 2.419zm7.974 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.095 2.156 2.418 0 1.334-.946 2.419-2.156 2.419z" />
              </svg>
              Join our Discord
            </a>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <section id="builder" className="py-12 px-4">
        <div className="container mx-auto max-w-6x3">
          <EmbedBuilder />
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-12 px-4 bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[ // Creamos un array para mapear los bloques y animarlos
              {
                title: "Nebura",
                content: (
                  <p className="text-gray-400">
                    A powerful tool to create Discord embeds with real-time preview
                    and code generation.
                  </p>
                ),
              },
              {
                title: "Quick Links",
                content: (
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a
                        href="#builder"
                        className="hover:text-purple-400 transition-colors"
                      >
                        Builder
                      </a>
                    </li>
                    <li>
                      <a
                        href="#tutorial"
                        className="hover:text-purple-400 transition-colors"
                      >
                        Tutorial
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-purple-400 transition-colors"
                      >
                        Discord API Docs
                      </a>
                    </li>
                  </ul>
                ),
              },
              {
                title: "Resources",
                content: (
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a
                        href="#"
                        className="hover:text-purple-400 transition-colors"
                      >
                        Markdown Guide
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-purple-400 transition-colors"
                      >
                        Webhook Guide
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-purple-400 transition-colors"
                      >
                        Embed Limits
                      </a>
                    </li>
                  </ul>
                ),
              },
            ].map((block, idx) => {
              const ref = useRef(null);
              const isInView = useInView(ref, { once: true });
              return (
                <motion.div
                  key={block.title}
                  ref={ref}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: idx * 0.2 }}
                >
                  <h3 className="text-lg font-bold text-white mb-4">
                    {block.title}
                  </h3>
                  {block.content}
                </motion.div>
              );
            })}
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Nebura. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}