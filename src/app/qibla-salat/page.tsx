'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Clock, MapPin, Navigation, Info, ChevronRight, Bell, BellOff, Sparkles } from 'lucide-react';
import { PrayerTimesCalculator, getQiblaDirection, methods } from 'islamic-utils';

export default function QiblaSalatPage() {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [qibla, setQibla] = useState<{ bearing: number; direction: string } | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setLocError("Veuillez autoriser la géolocalisation pour calculer les horaires et la Qibla.")
      );
    }

    // Tenter de récupérer l'orientation de l'appareil si mobile
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const handler = (e: any) => {
        if (e.webkitCompassHeading) {
          setDeviceHeading(e.webkitCompassHeading);
        } else if (e.alpha !== null) {
          setDeviceHeading(360 - e.alpha);
        }
      };
      window.addEventListener('deviceorientation', handler, true);
      return () => window.removeEventListener('deviceorientation', handler);
    }
  }, []);

  useEffect(() => {
    if (location) {
      calculateAll();
    }
  }, [location, date]);

  const calculateAll = () => {
    if (!location) return;

    // Calcul Salat
    const calc = new PrayerTimesCalculator();
    // Détection automatique simple de la méthode
    let method = methods.MWL; // Par défaut
    if (location.lat > 42 && location.lat < 51) method = methods.France; // Très approximatif
    
    const results = calc.getTimes({
      date: date,
      latitude: location.lat,
      longitude: location.lng,
      method: method
    });

    if (results.status === 'OK') {
      setPrayerTimes(results.data.timings);
    }

    // Calcul Qibla
    const qiblaData = getQiblaDirection(location.lat, location.lng);
    setQibla(qiblaData);
  };

  const toggleNotif = (name: string) => {
    setNotifications(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const salatOrder = [
    { id: 'Fajr', label: 'Fajr', icon: '🌅' },
    { id: 'Sunrise', label: 'Chourouk', icon: '☀️' },
    { id: 'Dhuhr', label: 'Dhuhr', icon: '🌞' },
    { id: 'Asr', label: 'Asr', icon: '🌤️' },
    { id: 'Maghrib', label: 'Maghrib', icon: '🌆' },
    { id: 'Isha', label: 'Isha', icon: '🌙' }
  ];

  const getNextSalat = () => {
    if (!prayerTimes) return null;
    const nowStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return salatOrder.find(s => (prayerTimes as any)[s.id] > nowStr) || salatOrder[0];
  };

  const nextSalat = getNextSalat();

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 mb-2 font-arabic">
              Salat & Qibla
            </h1>
            <p className="text-gray-400">Précision sacrée pour votre pratique quotidienne.</p>
          </motion.div>

          <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 gap-6 items-center">
            {location && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <MapPin className="w-4 h-4" /> Connecté
              </div>
            )}
            <div className="text-right">
              <div className="text-xl font-mono">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">{date.toLocaleDateString()}</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
          {/* Section Horaires */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Clock className="text-emerald-400 w-6 h-6" /> Horaires de Prière
              </h2>
              {nextSalat && (
                <div className="text-[10px] text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-tighter animate-pulse">
                  Prochaine: {nextSalat.label}
                </div>
              )}
            </div>

            {locError && <p className="text-orange-400 text-sm mb-6 bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">{locError}</p>}

            <div className="space-y-3">
              {prayerTimes ? (
                salatOrder.map((s, idx) => {
                  const time = (prayerTimes as any)[s.id];
                  const isNext = nextSalat?.id === s.id;
                  
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex justify-between items-center p-5 rounded-[1.5rem] border transition-all ${
                        isNext 
                          ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)] scale-[1.02]' 
                          : 'bg-black/20 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                          <div className={`font-bold ${isNext ? 'text-white text-lg' : 'text-gray-300'}`}>{s.label}</div>
                          {isNext && <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Actuelle / Prochaine</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className={`text-2xl font-mono ${isNext ? 'text-emerald-400' : 'text-white'}`}>{time}</div>
                        <button 
                          onClick={() => toggleNotif(s.id)}
                          className={`p-2 rounded-lg transition-colors ${notifications[s.id] ? 'text-emerald-500' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                          {notifications[s.id] ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                ))
              )}
            </div>

            <div className="mt-8 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed italic">
                Les horaires sont calculés en temps réel selon les coordonnées précises de votre appareil. 
                Une légère marge de 2-3 minutes est recommandée pour la prudence.
              </p>
            </div>
          </section>

          {/* Section Qibla */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full" />
             
             <h2 className="text-2xl font-bold flex items-center gap-3 self-start mb-10 text-teal-300">
               <Navigation className="w-6 h-6" /> Direction de la Qibla
             </h2>

             {/* Boussole SVG */}
             <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
               {/* Cercles de fond */}
               <div className="absolute inset-0 border border-white/5 rounded-full" />
               <div className="absolute inset-4 border border-white/10 rounded-full" />
               <div className="absolute inset-8 border border-white/20 rounded-full" />
               
               <motion.div 
                 animate={{ rotate: deviceHeading ? -deviceHeading : 0 }}
                 className="relative w-full h-full flex items-center justify-center"
               >
                 {/* Boussole elle-même */}
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                   {/* Graduation */}
                   {Array.from({ length: 12 }).map((_, i) => (
                     <line 
                       key={i} 
                       x1="50" y1="5" x2="50" y2="10" 
                       stroke="rgba(255,255,255,0.2)" 
                       strokeWidth="1" 
                       transform={`rotate(${i * 30} 50 50)`} 
                     />
                   ))}
                   
                   {/* Flèche Qibla */}
                   {qibla && (
                     <motion.g 
                        animate={{ rotate: qibla.bearing }}
                        className="origin-center"
                     >
                       {/* Ligne d'énergie */}
                       <line x1="50" y1="50" x2="50" y2="10" stroke="url(#qiblaLine)" strokeWidth="2" strokeDasharray="2 2" />
                       <defs>
                         <linearGradient id="qiblaLine" x1="0%" y1="0%" x2="0%" y2="100%">
                           <stop offset="0%" stopColor="#10b981" />
                           <stop offset="100%" stopColor="transparent" />
                         </linearGradient>
                       </defs>
                       
                       {/* Pointe Kaaba */}
                       <path d="M45 20 L50 10 L55 20 Z" fill="#10b981" className="drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                       <circle cx="50" cy="50" r="3" fill="#10b981" />
                     </motion.g>
                   )}
                   
                   {/* Indicateur Nord */}
                   <text x="50" y="5" textAnchor="middle" fontSize="4" fill="white" opacity="0.5">N</text>
                 </svg>

                 <div className="absolute text-center bg-[#0a0f16]/80 backdrop-blur-xl p-4 rounded-full border border-white/10 shadow-2xl">
                   {qibla ? (
                     <>
                        <div className="text-3xl font-bold text-white">{Math.round(qibla.bearing)}°</div>
                        <div className="text-[10px] text-teal-400 font-bold uppercase tracking-tighter">Vers {qibla.direction}</div>
                     </>
                   ) : (
                     <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
                   )}
                 </div>
               </motion.div>
             </div>

             <div className="w-full mt-10 space-y-4">
               {qibla && (
                 <div className="flex justify-between items-center text-sm p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="text-gray-400">Angle de la Kaaba (Makkah) :</div>
                   <div className="font-bold text-teal-400">{qibla.bearing.toFixed(2)}° N</div>
                 </div>
               )}
               <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest bg-black/30 py-2 rounded-full">
                 Alignez la boussole sur le Nord pour une précision maximale.
               </p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
