'use client';

import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Zap, 
  Sparkles, 
  Clock, 
  Calendar,
  Compass,
  Star,
  Info,
  ShieldCheck,
  Coins,
  Heart
} from 'lucide-react';
import { useState, useEffect } from 'react';

const planets = [
  { name: 'Soleil', icon: Sun, color: 'text-yellow-400', effect: 'Richesse, Pouvoir, Succès', saat: 'Shams', desc: 'Le meilleur moment pour les Khatims de richesse et pour rencontrer des autorités.' },
  { name: 'Vénus', icon: Heart, color: 'text-pink-400', effect: 'Amour, Affection, Paix', saat: 'Zouhara', desc: 'Idéal pour le Mahabba (affection) et pour résoudre les conflits conjugaux.' },
  { name: 'Mercure', icon: Zap, color: 'text-blue-400', effect: 'Commerce, Intelligence', saat: 'Outarid', desc: 'Favorable aux examens, aux écrits et aux transactions commerciales.' },
  { name: 'Lune', icon: Moon, color: 'text-neutral-300', effect: 'Voyage, Protection', saat: 'Qamar', desc: 'Bon pour la protection de la famille et pour entamer des déplacements.' },
  { name: 'Saturne', icon: ShieldCheck, color: 'text-purple-500', effect: 'Blindage, Punition', saat: 'Zouhal', desc: 'Moment puissant pour le blindage contre les ennemis et les travaux de séparation.' },
  { name: 'Jupiter', icon: Coins, color: 'text-amber-500', effect: 'Grande Fortune, Honneur', saat: 'Moushtari', desc: 'L\'heure de la bénédiction suprême. Très recherchée pour les grands Khatims.' },
  { name: 'Mars', icon: Flame, color: 'text-red-500', effect: 'Force, Combat, Victoire', saat: 'Mirikh', desc: 'Heure de feu. Utilisée pour la domination et la protection contre les agressions.' }
];

import { Flame } from 'lucide-react';

export default function HeuresSacreesPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Simplified logic for current hour's planet
  const currentPlanetIndex = currentTime.getHours() % planets.length;
  const currentPlanet = planets[currentPlanetIndex];

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#050709]">
      {/* Cosmos Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-500/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-20 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8"
          >
            <Clock className="w-4 h-4" /> Horloge Cosmique · Sa'at al-Nujum
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter">
            L'Horloge du <span className="text-[var(--primary)] text-glow">Destin</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto font-medium">
            Le temps n'est pas linéaire, il est vibratoire. Chaque heure est gouvernée par une énergie céleste spécifique qui influence la réussite de vos travaux.
          </p>
        </div>

        {/* Current Time Dashboard */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 mb-16 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="text-[10px] font-black text-amber-500/70 uppercase tracking-[0.4em] mb-4 text-center lg:text-left">Heure Actuelle (GMT)</p>
              <div className="text-7xl md:text-9xl font-black text-white font-mono mb-8 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                {formatTime(currentTime)}
              </div>
              <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span className="text-white font-bold">{currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
            </div>

            <div className="bg-black/40 rounded-[2rem] p-8 border border-amber-500/10 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/5 blur-3xl group-hover:bg-amber-500/10 transition-all" />
              <div className="flex items-center gap-6 mb-6">
                <div className={`w-20 h-20 rounded-[1.5rem] bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]`}>
                  <currentPlanet.icon className={`w-10 h-10 ${currentPlanet.color} animate-pulse`} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Planète Gouvernante</p>
                  <h3 className="text-3xl font-black text-white">{currentPlanet.name} <span className="text-amber-500 italic">({currentPlanet.saat})</span></h3>
                </div>
              </div>
              <p className="text-neutral-400 text-lg leading-relaxed mb-6 italic font-medium">
                "{currentPlanet.desc}"
              </p>
              <div className="flex items-center gap-3 py-3 px-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-amber-200 font-bold text-sm">Action recommandée : {currentPlanet.effect}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Planet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planets.map((planet, i) => {
            const Icon = planet.icon;
            return (
              <motion.div
                key={planet.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.05] transition-all group relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-[0.02] font-amiri text-amber-500 pointer-events-none group-hover:opacity-[0.05] transition-opacity">✦</div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500/10 transition-all border border-amber-500/10">
                  <Icon className={`w-6 h-6 ${planet.color}`} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{planet.name}</h4>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-4">{planet.saat}</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Favorise : <span className="text-amber-500 font-bold">{planet.effect}</span>
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer / Info */}
        <div className="mt-20 p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 text-center max-w-3xl mx-auto shadow-[0_0_30px_rgba(212,175,55,0.02)]">
          <div className="flex items-center justify-center gap-2 text-amber-500 mb-4">
            <Info className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Note aux Initiés</span>
          </div>
          <p className="text-neutral-400 text-sm italic font-medium">
            Les calculs présentés ici sont basés sur le système des heures égales (standard). Pour des travaux de haute précision nécessitant les heures inégales (calculées selon le lever et le coucher du soleil de votre localité), veuillez consulter un maître expert.
          </p>
        </div>
      </div>
    </div>
  );
}
