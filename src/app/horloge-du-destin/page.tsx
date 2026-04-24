'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Sun, 
  Moon, 
  Star, 
  Zap, 
  Shield, 
  Heart, 
  Coins, 
  BookOpen, 
  Sparkles,
  ArrowLeft,
  Info,
  Timer
} from 'lucide-react';
import Link from 'next/link';

// ─── PLANETARY DATA & LOGIC ─────────────────────────────────────────────────

const CHALDEAN_ORDER = ['Saturne', 'Jupiter', 'Mars', 'Soleil', 'Vénus', 'Mercure', 'Lune'];

const PLANETS_INFO: Record<string, any> = {
  'Saturne': { icon: '♄', color: 'from-gray-600 to-black', desc: 'Discipline, protection, fondations, temps.', focus: 'Blindage & Patience', influence: 'Lente mais durable.' },
  'Jupiter': { icon: '♃', color: 'from-amber-400 to-orange-600', desc: 'Expansion, richesse, justice, chance.', focus: 'Abondance & Succès', influence: 'Expansion maximale.' },
  'Mars': { icon: '♂', color: 'from-red-600 to-rose-900', desc: 'Énergie, courage, victoire, action.', focus: 'Force & Conflits', influence: 'Action rapide.' },
  'Soleil': { icon: '☉', color: 'from-yellow-400 to-amber-500', desc: 'Succès, autorité, vitalité, charisme.', focus: 'Honneurs & Éclat', influence: 'Lumière totale.' },
  'Vénus': { icon: '♀', color: 'from-rose-400 to-pink-600', desc: 'Amour, beauté, harmonie, plaisirs.', focus: 'Affection & Paix', influence: 'Douceur & Union.' },
  'Mercure': { icon: '☿', color: 'from-emerald-400 to-teal-600', desc: 'Communication, commerce, intelligence.', focus: 'Études & Business', influence: 'Fluidité mentale.' },
  'Lune': { icon: '☽', color: 'from-slate-200 to-blue-400', desc: 'Émotions, intuition, famille, rêves.', focus: 'Rêves & Intuition', influence: 'Changement & Cycle.' },
};

const DAY_START_PLANETS = [
  'Soleil', // Dimanche
  'Lune',   // Lundi
  'Mars',   // Mardi
  'Mercure',// Mercredi
  'Jupiter',// Jeudi
  'Vénus',  // Vendredi
  'Saturne' // Samedi
];

export default function HorlogeDestinPage() {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const currentDay = now.getDay(); // 0 = Dimanche
  const currentHour = now.getHours();
  
  // Calcul simplifié de l'heure planétaire (approximation standard 1h = 60min)
  // En ésotérisme réel, la durée varie selon le lever/coucher du soleil, 
  // mais l'ordre reste immuable. Ici on utilise l'ordre Chaldaïque standard.
  
  const getPlanetaryHour = (hour: number) => {
    const startPlanet = DAY_START_PLANETS[currentDay];
    const startIndex = CHALDEAN_ORDER.indexOf(startPlanet);
    // On avance dans l'ordre pour chaque heure passée depuis 6h du matin (lever théorique)
    const hoursSinceSunrise = (hour - 6 + 24) % 24;
    return CHALDEAN_ORDER[(startIndex + hoursSinceSunrise) % 7];
  };

  const currentPlanetaryPlanet = getPlanetaryHour(currentHour);
  const planet = PLANETS_INFO[currentPlanetaryPlanet];

  const fullDaySchedule = Array.from({ length: 24 }, (_, i) => {
    const h = (i + 6) % 24; // On commence à 6h
    return {
      hour: h,
      planet: getPlanetaryHour(h)
    };
  });

  return (
    <div className="min-h-screen bg-[#050709] text-white pb-40 relative overflow-hidden">
      {/* Mystical Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-${planet.color.split('-')[1]}-500/10 to-transparent blur-[120px] transition-all duration-1000`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20">
          <div>
            <Link href="/" className="group inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-all mb-6">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Retour au Sanctuaire</span>
            </Link>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              L'HORLOGE DU <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-500 to-orange-600">DESTIN</span>
            </h1>
            <p className="text-neutral-500 text-lg mt-4 max-w-xl">
              Le temps n'est pas linéaire, il est vibratoire. Découvrez la planète qui gouverne l'instant présent pour agir en harmonie avec le ciel.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl text-center min-w-[280px]">
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-2">Temps Présent</p>
            <p className="text-5xl font-black font-mono tracking-tighter">{now.toLocaleTimeString()}</p>
            <p className="text-neutral-500 mt-2 font-medium uppercase tracking-widest text-xs">
              {new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(now)}
            </p>
          </div>
        </div>

        {/* Current Planet Card - HERO */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-24 rounded-[4rem] overflow-hidden bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-12 md:p-24 group"
        >
          <div className={`absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br ${planet.color} opacity-20 blur-[100px] group-hover:scale-110 transition-transform duration-1000`} />
          
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-widest">
                <Timer className="w-4 h-4" /> Heure Planétaire Actuelle
              </div>
              
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
                {currentPlanetaryPlanet} <span className="text-amber-500 italic">{planet.icon}</span>
              </h2>
              
              <p className="text-2xl text-neutral-300 font-medium leading-relaxed italic">
                "{planet.desc}"
              </p>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Focus Idéal</p>
                  <p className="text-xl font-bold text-white">{planet.focus}</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Force</p>
                  <p className="text-xl font-bold text-white">{planet.influence}</p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                 className={`w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center p-8`}
               >
                 <div className={`w-full h-full rounded-full bg-gradient-to-br ${planet.color} shadow-[0_0_100px_rgba(234,179,8,0.2)] animate-pulse flex items-center justify-center text-8xl md:text-9xl text-black font-black`}>
                    {planet.icon}
                 </div>
               </motion.div>
            </div>
          </div>
        </motion.section>

        {/* 24H Schedule */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Cycle des <span className="text-amber-500">24 Heures</span></h2>
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-neutral-500">
               <span className="flex items-center gap-1"><Sun className="w-4 h-4" /> Jour</span>
               <span className="flex items-center gap-1"><Moon className="w-4 h-4" /> Nuit</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fullDaySchedule.map((item, idx) => {
              const itemPlanet = PLANETS_INFO[item.planet];
              const isCurrent = item.hour === currentHour;
              const isDay = item.hour >= 6 && item.hour < 18;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className={`relative p-6 rounded-[2rem] border transition-all duration-500 ${
                    isCurrent 
                      ? `bg-gradient-to-br ${itemPlanet.color} border-white/50 text-black shadow-2xl` 
                      : 'bg-white/5 border-white/5 text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xl font-black font-mono ${isCurrent ? 'text-black' : 'text-neutral-400'}`}>
                      {item.hour}h
                    </span>
                    {isDay ? <Sun className={`w-4 h-4 ${isCurrent ? 'text-black' : 'text-amber-500/40'}`} /> : <Moon className={`w-4 h-4 ${isCurrent ? 'text-black' : 'text-blue-500/40'}`} />}
                  </div>
                  
                  <p className={`text-2xl font-black mb-1 ${isCurrent ? 'text-black' : 'text-white'}`}>{itemPlanet.icon}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-black/70' : 'text-neutral-500'}`}>
                    {item.planet}
                  </p>

                  {isCurrent && (
                    <motion.div 
                      layoutId="current-marker"
                      className="absolute -top-2 -left-2 px-3 py-1 bg-white text-black text-[8px] font-black rounded-full uppercase tracking-widest shadow-xl"
                    >
                      Maintenant
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Knowledge Base */}
        <section className="grid md:grid-cols-2 gap-12">
          <div className="bg-white/5 rounded-[3rem] border border-white/10 p-12">
             <div className="flex items-center gap-4 mb-8">
               <div className="p-4 bg-amber-500/10 rounded-2xl">
                 <Info className="w-8 h-8 text-amber-500" />
               </div>
               <h3 className="text-3xl font-black">Comment ça marche ?</h3>
             </div>
             <div className="space-y-6 text-neutral-400 text-lg leading-relaxed">
                <p>
                  L'Heure Planétaire est une méthode ancienne utilisée par les sages et les alchimistes. Chaque jour de la semaine est gouverné par une planète "Maître du Jour".
                </p>
                <p>
                  Le cycle commence au lever du soleil avec le Maître du Jour, puis les planètes se succèdent selon l'Ordre Chaldéen : <span className="text-white font-bold">Saturne, Jupiter, Mars, Soleil, Vénus, Mercure, Lune.</span>
                </p>
                <p className="italic bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20 text-amber-200">
                  Astuce : Réalisez vos Khatims de richesse pendant l'heure de Jupiter et vos protections pendant l'heure de Saturne ou Mars.
                </p>
             </div>
          </div>

          <div className="bg-white/5 rounded-[3rem] border border-white/10 p-12">
             <h3 className="text-3xl font-black mb-8">Énergies Planétaires</h3>
             <div className="space-y-4">
                {Object.entries(PLANETS_INFO).map(([name, info]: [string, any]) => (
                  <div key={name} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group">
                    <span className={`text-4xl w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${info.color} text-black font-black`}>
                      {info.icon}
                    </span>
                    <div>
                      <p className="text-white font-bold">{name}</p>
                      <p className="text-neutral-500 text-sm">{info.focus}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Footer Signature */}
        <footer className="mt-40 text-center pb-20">
           <div className="w-12 h-px bg-white/10 mx-auto mb-8" />
           <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.5em]">
             Horloge du Destin — © M. Cissé · La Précision du Savoir
           </p>
        </footer>

      </main>
    </div>
  );
}
