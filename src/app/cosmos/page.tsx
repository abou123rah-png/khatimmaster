'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, MapPin, Calendar, Clock, Sparkles, Navigation, Info } from 'lucide-react';
import { getMoonPhaseInfo, IslamicCalendar } from 'islamic-utils';
import SunCalc from 'suncalc';

const islamicCalendar = new IslamicCalendar();

export default function CosmosPage() {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [planetaryHours, setPlanetaryHours] = useState<any[]>([]);
  const [isDay, setIsDay] = useState(true);

  // Hijri & Moon data
  const hijri: any = islamicCalendar.toHijri(date);
  const { phase, age } = getMoonPhaseInfo(date);
  const fractionalPhase = age / 29.53; // Cycle complet d'environ 29.53 jours

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setLocError("Veuillez autoriser la géolocalisation pour les Heures Planétaires.")
      );
    }
  }, []);

  useEffect(() => {
    if (location) {
      calculateSaat();
    }
  }, [location, date]);

  const calculateSaat = () => {
    if (!location) return;
    const times = SunCalc.getTimes(date, location.lat, location.lng);
    const now = new Date();
    
    // Heures de jour (Lever au Coucher)
    const dayLength = times.sunset.getTime() - times.sunrise.getTime();
    const dayHourLength = dayLength / 12;
    
    // Heures de nuit (Coucher au Lever suivant - simplifié pour le même jour)
    const nightLength = (24 * 60 * 60 * 1000) - dayLength;
    const nightHourLength = nightLength / 12;

    const currentIsDay = now >= times.sunrise && now < times.sunset;
    setIsDay(currentIsDay);

    const hours = [];
    let startTime = currentIsDay ? times.sunrise.getTime() : times.sunset.getTime();
    const interval = currentIsDay ? dayHourLength : nightHourLength;

    // Ordre des planètes (Ordre des Chaldéens)
    // Dimanche: Soleil, Lundi: Lune, Mardi: Mars, Mercredi: Mercure, Jeudi: Jupiter, Vendredi: Vénus, Samedi: Saturne
    const planetOrder = ["Soleil", "Vénus", "Mercure", "Lune", "Saturne", "Jupiter", "Mars"];
    const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const dayIndex = date.getDay();
    
    // La première heure du jour est gouvernée par la planète du jour
    const startPlanetIndex = [0, 3, 6, 2, 5, 1, 4][dayIndex]; 

    for (let i = 0; i < 12; i++) {
      const hStart = new Date(startTime + (i * interval));
      const hEnd = new Date(startTime + ((i + 1) * interval));
      const planet = planetOrder[(startPlanetIndex + i) % 7];
      
      hours.push({
        index: i + 1,
        start: hStart,
        end: hEnd,
        planet: planet,
        isActive: now >= hStart && now < hEnd
      });
    }
    setPlanetaryHours(hours);
  };

  // Rendu de la Lune en Géométrie Sacrée
  const renderSacredMoon = () => {
    const radius = 80;
    const segments = 12;
    const completion = fractionalPhase; // 0 à 1

    return (
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Cercles d'énergie arrière-plan */}
        {[1, 0.8, 0.6].map((scale, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360, scale: [scale, scale * 1.05, scale] }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
            className="absolute border border-amber-500/20 rounded-full"
            style={{ width: radius * 2 * scale, height: radius * 2 * scale }}
          />
        ))}

        {/* La Lune Géométrique */}
        <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          
          {/* Forme de base (fond sombre) */}
          <circle cx="100" cy="100" r={radius} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
          
          {/* Tracé Géométrique selon la phase */}
          <motion.path
            initial={false}
            animate={{ d: getMoonPath(radius, completion) }}
            fill="url(#moonGrad)"
            className="transition-all duration-1000 ease-in-out"
          />

          {/* Patterns de Géométrie Sacrée (Fleur de vie partielle) */}
          <g opacity="0.3" stroke="#fff" strokeWidth="0.5" fill="none">
            {Array.from({ length: 6 }).map((_, i) => (
              <circle key={i} cx={100 + 40 * Math.cos(i * Math.PI/3)} cy={100 + 40 * Math.sin(i * Math.PI/3)} r="40" />
            ))}
          </g>
        </svg>
        
        <div className="absolute -bottom-4 text-center">
          <div className="text-amber-500 font-bold uppercase tracking-widest text-xs">{phase}</div>
          <div className="text-[10px] text-gray-500 mt-1">Âge: {age.toFixed(1)} jours</div>
        </div>
      </div>
    );
  };

  const getMoonPath = (r: number, p: number) => {
    // Calcul simplifié de la forme de la lune (croissant/gibbeuse)
    const cx = 100;
    const cy = 100;
    const sweep = p > 0.5 ? 1 : 0;
    
    // Rotation de la courbure selon la phase
    const innerR = r * Math.abs(1 - 2 * p);
    const innerSweep = p < 0.5 ? 0 : 1;

    return `M ${cx} ${cy - r} 
            A ${r} ${r} 0 1 1 ${cx} ${cy + r}
            A ${innerR} ${r} 0 1 ${innerSweep} ${cx} ${cy - r} Z`;
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 mb-2 font-arabic">
              Le Cosmos Mystique
            </h1>
            <p className="text-gray-400">Harmonisez votre esprit avec les cycles célestes.</p>
          </motion.div>

          <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 gap-8 items-center">
            <div className="text-right border-r border-white/10 pr-8">
              <div className="text-amber-500 font-bold text-xl">{hijri.hijriDay} {hijri.hijriMonthName}</div>
              <div className="text-gray-500 text-sm uppercase tracking-widest">{hijri.hijriYear} AH</div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-indigo-400 w-6 h-6" />
              <div>
                <div className="text-xl font-mono">{date.toLocaleTimeString()}</div>
                <div className="text-[10px] text-gray-500 uppercase">{date.toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne 1: Lune & Énergie */}
          <section className="lg:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
             <h2 className="text-lg font-bold text-indigo-300 uppercase tracking-widest mb-10 border-b border-indigo-500/20 pb-2">Phase Lunaire</h2>
             {renderSacredMoon()}
             <div className="mt-12 w-full p-4 bg-black/30 rounded-2xl border border-white/5 italic text-sm text-gray-400 text-center">
                "La lune est le miroir des secrets du ciel. Sa phase actuelle favorise la méditation interne."
             </div>
          </section>

          {/* Colonne 2 & 3: Heures Planétaires */}
          <section className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
                {isDay ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                Les Heures Planétaires (Sa’at)
              </h2>
              {location ? (
                <div className="flex items-center gap-1 text-[10px] text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  <MapPin className="w-3 h-3" /> Localisation Active
                </div>
              ) : (
                <div className="text-[10px] text-orange-500 flex items-center gap-1 animate-pulse">
                  <Navigation className="w-3 h-3" /> En attente de position...
                </div>
              )}
            </div>

            {locError && <p className="text-orange-400 text-xs mb-4 text-center">{locError}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planetaryHours.map((h) => (
                <motion.div
                  key={h.index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: h.index * 0.05 }}
                  className={`relative p-5 rounded-2xl border transition-all ${
                    h.isActive 
                      ? 'bg-amber-500/20 border-amber-500/50 shadow-lg scale-[1.02]' 
                      : 'bg-black/20 border-white/5 hover:border-white/20'
                  }`}
                >
                  {h.isActive && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      ACTUELLE
                    </span>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        h.isActive ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-500'
                      }`}>
                        {h.index}
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${h.isActive ? 'text-white' : 'text-gray-300'}`}>{h.planet}</div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          {h.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {h.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
                       <Sparkles className="w-4 h-4 text-gray-600 group-hover:text-amber-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-[11px] text-gray-500 flex items-center gap-2 justify-center">
              <Info className="w-3 h-3" /> Calculé selon la méthode des "Heures Inégales" (système chaldéen).
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
