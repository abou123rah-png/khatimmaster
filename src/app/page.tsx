'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  Moon, 
  Key, 
  Wand2, 
  Play, 
  ArrowRight,
  Zap,
  BookOpen,
  Fingerprint,
  Clock,
  Compass,
  ScrollText,
  Eye,
  Award,
  ChevronDown
} from 'lucide-react';

// ─── TOOLS DATA ─────────────────────────────────────────────────────────────

const tools = [
  {
    title: "Analyse des Natures Pro",
    desc: "Découvrez votre identité élémentaire : Feu, Terre, Air et Eau.",
    href: "/khatims/1",
    icon: Compass,
    color: "from-amber-400 to-orange-600",
    tag: "Fondation"
  },
  {
    title: "Moteur de Tracé Sacré",
    desc: "Simulation animée pas à pas de la création des carrés magiques.",
    href: "/khatims",
    icon: Wand2,
    color: "from-blue-400 to-indigo-600",
    tag: "Innovation",
    featured: true
  },
  {
    title: "Oracle du Ramli",
    desc: "Interprétation divinatoire par l'intelligence de la terre.",
    href: "/ramli",
    icon: Star,
    color: "from-emerald-400 to-teal-600",
    tag: "Divination"
  },
  {
    title: "Le Hub des Secrets (Asrar)",
    desc: "Bibliothèques de recettes mystiques pour chaque besoin de vie.",
    href: "/asrar",
    icon: Key,
    color: "from-purple-400 to-fuchsia-600",
    tag: "Savoir"
  },
  {
    title: "Compteur de Zikr",
    desc: "Espace méditatif pour vos invocations avec feedback sensoriel.",
    href: "/zikr-compteur",
    icon: Fingerprint,
    color: "from-rose-400 to-red-600",
    tag: "Pratique"
  },
  {
    title: "Coran Mystique",
    desc: "Exploration des miracles numériques et codes du Livre Sacré.",
    href: "/coran",
    icon: ScrollText,
    color: "from-cyan-400 to-blue-500",
    tag: "Abjad"
  }
];

export default function Home() {
  const [time, setTime] = useState(new Date());
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050709] text-white selection:bg-amber-500/30 selection:text-amber-500 overflow-hidden relative">
      
      {/* ─── MYSTICAL OVERLAYS ────────────────────────────────────────────── */}
      <div className="noise-overlay" />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 sacred-geometry opacity-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[180px] rounded-full" />
      </div>

      <main className="relative z-10">
        
        {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
        <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
          <motion.div 
            style={{ opacity, scale }}
            className="text-center space-y-12 z-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-amber-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.1)]"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">L'Héritage de M. Cissé — Pro Max</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5 }}
              className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6"
            >
              KHATIM<span className="gold-gradient text-glow">MASTER</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="max-w-xl mx-auto text-lg md:text-xl text-neutral-400 font-medium leading-relaxed italic"
            >
              "Le Portail vers la Science des Nombres et le Tracé des Anges."
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap justify-center gap-4 pt-6"
            >
              <Link 
                href="/khatims" 
                className="group relative px-8 py-4 bg-white text-black font-black text-lg rounded-full overflow-hidden hover:scale-105 transition-all shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  ENTRER DANS LE SANCTUAIRE <ArrowRight className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Sacred Cube */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotateY: [0, 360],
              rotateX: [0, 45, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] border border-white/5 rounded-full opacity-20 pointer-events-none"
          />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 flex flex-col items-center gap-2 text-neutral-500 animate-bounce"
          >
            <span className="text-[8px] font-black uppercase tracking-[0.5em]">Découvrir le Savoir</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </section>

        {/* ─── SACRED DASHBOARD ────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
             {/* Orbital Background for Dashboard */}
             <div className="absolute inset-0 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />
             
             {[
               { icon: Clock, label: "Heure Sacrée", value: time.toLocaleTimeString(), color: "amber", extra: "Vibration : Forte" },
               { icon: Moon, label: "Astre Gouvernant", value: "Vénus ♀", color: "blue", extra: "Influence : Harmonie" },
               { icon: Star, label: "Oracle du Jour", value: "Expansion", color: "emerald", extra: "Tendance : Succès" }
             ].map((stat, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="relative group p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-3xl hover:border-amber-500/30 transition-all duration-500"
               >
                 <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                   <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                 </div>
                 <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-1">{stat.label}</p>
                 <h3 className="text-2xl font-black mb-1">{stat.value}</h3>
                 <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">{stat.extra}</p>
               </motion.div>
             ))}
          </div>
        </section>

        {/* ─── WORLD EXCLUSIVE SECTION ───────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 mb-32 relative">
           <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full" />
           <div className="relative rounded-[3.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 md:p-20 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                    <Award className="w-3 h-3" /> Première Mondiale Exclusive
                  </div>
                  <Link href="/khatims" className="block group">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none group-hover:text-amber-400 transition-colors">
                      Le Tracé <br />
                      <span className="italic gold-gradient">Sacré Automatisé.</span>
                    </h2>
                  </Link>
                  <p className="text-neutral-400 text-lg leading-relaxed italic max-w-sm">
                    "Contemplez la naissance d'un Khatim. Chaque cellule se remplit selon l'ordre numérique divin."
                  </p>
                  <div className="pt-4">
                    <Link href="/khatims" className="inline-flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-base hover:bg-white/10 hover:border-amber-500/30 transition-all group">
                      TESTER LE SIMULATEUR <Play className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
                    </Link>
                  </div>
                </div>
                
                <div className="relative flex justify-center items-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-white/5 rounded-full"
                  />
                  <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] bg-black border border-amber-500/20 shadow-2xl flex items-center justify-center group overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                    <Link href="/khatims" className="relative z-10 w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                       <Play className="w-8 h-8 text-black fill-current translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
           </div>
        </section>

        {/* ─── BENTO HUB GRID ───────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">LE HUB DES <span className="gold-gradient">ASRAR</span></h2>
              <p className="text-neutral-500 text-lg max-w-xl mx-auto italic">"Le savoir n'est rien sans la clé pour l'ouvrir."</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link 
                      href={tool.href}
                      className="block h-full p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] hover:border-amber-500/40 transition-all duration-700 relative overflow-hidden group"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} p-3.5 mb-8 shadow-xl group-hover:scale-110 transition-all duration-700`}>
                        <Icon className="w-full h-full text-black" />
                      </div>
                      <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mb-3 block opacity-60 group-hover:opacity-100 transition-opacity">{tool.tag}</span>
                      <h3 className="text-2xl font-black mb-4 group-hover:text-amber-400 transition-colors tracking-tight">{tool.title}</h3>
                      <p className="text-neutral-500 text-base leading-relaxed group-hover:text-neutral-300 transition-colors">
                        {tool.desc}
                      </p>
                      
                      {/* Interactive Footer */}
                      <div className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-neutral-700 group-hover:text-white transition-colors">
                        OUVRIR LE SECRET <ArrowRight className="w-3 h-3" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
           </div>
        </section>

        {/* ─── FINAL SIGNATURE ─────────────────────────────────────────────── */}
        <section className="relative py-32 px-6 text-center border-t border-white/5 overflow-hidden">
           <div className="absolute inset-0 mystic-grid opacity-10" />
           <div className="relative z-10 max-w-5xl mx-auto space-y-12">
              <div className="w-16 h-16 mx-auto rounded-full border border-amber-500/30 flex items-center justify-center animate-breathe">
                <Eye className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter italic">
                "La science ne sert à rien si elle ne transforme pas l'âme."
              </h2>
              <div className="space-y-3">
                <p className="text-2xl font-black gold-gradient tracking-[0.2em] uppercase">M. CISSÉ</p>
                <p className="text-neutral-600 font-bold uppercase tracking-[0.5em] text-[10px]">Architecte du Savoir Mystique</p>
              </div>
           </div>
        </section>

      </main>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="py-20 px-6 text-center border-t border-white/5 relative z-20 bg-[#050709]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em]">
            KhatimMaster Pro Max — © M. Cissé · Tous Droits Réservés
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-neutral-500">
            <Link href="/protection-des-donnees" className="hover:text-amber-500 transition-colors">Protection</Link>
            <Link href="/mentions-legales" className="hover:text-amber-500 transition-colors">Mentions</Link>
            <Link href="/contact" className="hover:text-amber-500 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
