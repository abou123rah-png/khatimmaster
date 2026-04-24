"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

import { 
  Sparkles, 
  Calculator, 
  Star, 
  Hash, 
  Moon, 
  Key, 
  LayoutGrid, 
  Wand2, 
  Play, 
  Heart, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Book,
  Navigation,
  Calendar,
  Download,
  Fingerprint
} from 'lucide-react';
import { useRef } from 'react';

const tools = [
  {
    title: "Analyse des Natures Pro",
    description: "Découverte de votre identité élémentaire : Feu, Terre, Air et Eau avec décomposition totale.",
    href: "/khatims/1",
    icon: Sparkles,
    color: "#D4AF37",
    category: "Éléments Pro Max",
    featured: true
  },
  {
    title: "Compteur de Zikr Interactif",
    description: "Un espace tactile et sacré pour vos invocations avec feedback sensoriel et PM.",
    href: "/zikr-compteur",
    icon: Fingerprint,
    color: "#D4AF37",
    category: "Nouveau",
    featured: true
  },
  {
    title: "Générateur de Khatim",
    description: "Créez vos carrés magiques personnalisés et exportez-les en haute définition.",
    href: "/khatims",
    icon: Calculator,
    color: "#D4AF37",
    category: "Export Image"
  },
  {
    title: "Oracle du Ramli",
    description: "Consultez l'oracle de sable traditionnel avec une interprétation 'Pro Max'.",
    href: "/ramli",
    icon: Star,
    color: "#D4AF37",
    category: "Divination"
  },
  {
    title: "Bibliothèque Grimoire",
    description: "Accédez aux manuscrits secrets et recettes mystiques authentiques.",
    href: "/recettes-mystiques",
    icon: BookOpen,
    color: "#6366f1",
    category: "Savoir"
  },
  {
    title: "Forge de Thalsams",
    description: "Générez des talismans ésotériques basés sur votre vibration numérique.",
    href: "/thalsam",
    icon: Wand2,
    color: "#D4AF37",
    category: "Mystique"
  },
  {
    title: "Code Mystique Coranique",
    description: "Décryptez les occurrences et secrets numériques du Livre Sacré.",
    href: "/code-mystique",
    icon: Hash,
    color: "#D4AF37",
    category: "Abjad"
  },
  {
    title: "Interprète de Rêves",
    description: "Explorez les messages de votre inconscient spirituel guidé par les anciens.",
    href: "/reve",
    icon: Moon,
    color: "#D4AF37",
    category: "Vision"
  },
  {
    title: "Mon Carnet Secret",
    description: "Consultez vos secrets, calculs et interprétations sauvegardés.",
    href: "/dashboard",
    icon: Book,
    color: "#3b82f6",
    category: "Profil"
  },
  {
    title: "Bibliothèque Vidéo",
    description: "Leçons ésotériques et secrets dévoilés en haute qualité.",
    href: "/videos",
    icon: Play,
    color: "#ef4444",
    category: "Savoir"
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050709] overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-amber-500/10 blur-[150px] rounded-full opacity-40" />
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full opacity-30" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <main className="relative z-10 pt-20 pb-40 px-4 sm:px-8 max-w-7xl mx-auto">
        
        {/* Calligraphic Header Decoration */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="flex justify-center mb-12 select-none pointer-events-none"
        >
            <span className="font-reem-kufi text-4xl md:text-6xl text-amber-500 tracking-[0.2em]">
               بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </span>
        </motion.div>

        {/* Hero Section */}
        <section className="text-center mb-24 space-y-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl mx-auto mb-4"
          >
            <div className="relative">
               <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
               <div className="absolute inset-0 blur-md bg-amber-500/50" />
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase">La Renaissance de KhatimMaster v3 — Pro Max</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] text-balance"
          >
            Maîtrisez le <br />
            <span className="font-reem-kufi italic bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-500 to-orange-700">
               Secret des Nombres
            </span>
          </motion.h1>

          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="max-w-2xl mx-auto text-xl text-neutral-500 font-medium leading-relaxed font-amiri"
          >
            L'excellence technologique alliée à la science sacrée. Analyse élémentaire totale, zikr interactif et génération de carrés magiques en haute résolution.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-10"
          >
            <Link href="/khatims" className="group relative px-10 py-5 rounded-2xl bg-amber-500 text-black font-black text-xl hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all overflow-hidden active:scale-95">
              <span className="relative z-10">Accéder au Sanctuaire</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </Link>
            <Link href="/zikr-compteur" className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xl hover:bg-white/10 transition-all backdrop-blur-md flex items-center gap-3">
              <Fingerprint className="w-6 h-6 text-amber-500" /> Compteur Zikr
            </Link>
          </motion.div>
        </section>

        {/* Feature Grid Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-12">
            <div className="space-y-4">
                <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">Outils de Grande Puissance</span>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Vivre la <span className="text-amber-500 italic">Tradition</span> au futur.</h2>
            </div>
            <p className="max-w-xs text-neutral-600 font-medium leading-relaxed">
                Une suite complète d'applications ésotériques pour vos recherches, calculs et protection spirituelle.
            </p>
        </div>

        {/* Tools Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Link 
                  href={tool.href}
                  className={`group relative block h-full p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-700 overflow-hidden shadow-2xl ${tool.featured ? 'ring-1 ring-amber-500/20 shadow-amber-500/5' : ''}`}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="mb-10 relative">
                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-xl ${tool.featured ? 'bg-amber-500 text-black' : 'bg-white/5 text-neutral-400 group-hover:bg-amber-500 group-hover:text-black'}`}>
                        <Icon strokeWidth={2} className="w-8 h-8" />
                    </div>
                    {tool.category && (
                        <span className="absolute -top-4 left-20 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-amber-500/60 group-hover:text-amber-500 transition-colors">
                            {tool.category}
                        </span>
                    )}
                  </div>

                  <h3 className="text-3xl font-black text-white mb-4 group-hover:text-amber-500 transition-colors flex items-center gap-2">
                    {tool.title}
                    <ArrowRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                  </h3>

                  <p className="text-neutral-500 text-lg font-medium leading-relaxed mb-10 group-hover:text-neutral-300 transition-colors">
                    {tool.description}
                  </p>

                  <div className="flex items-center gap-3">
                     <div className="h-1 w-12 bg-amber-500/20 group-hover:w-24 transition-all duration-700" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-700 group-hover:text-white transition-colors">Exploration</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Wisdom Banner - Centered Quote */}
        <section className="mt-48 mb-32">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative px-8 py-24 md:px-24 rounded-[5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5 overflow-hidden text-center"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 opacity-5 font-reem-kufi text-[20vw] pointer-events-none">
                    سر
                </div>
                <div className="relative z-10 space-y-10">
                    <Sparkles className="w-12 h-12 text-amber-500 mx-auto opacity-30" />
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight font-amiri italic max-w-5xl mx-auto">
                        "Celui qui connaît son âme connaît son Seigneur."
                    </h2>
                    <div className="flex justify-center gap-8">
                        <div className="space-y-1">
                            <p className="text-sm font-black text-amber-500 uppercase tracking-widest">Savoir</p>
                            <div className="h-0.5 w-12 bg-amber-500 mx-auto" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>

      </main>
    </div>
  );
}
