'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, RefreshCcw, ArrowLeftRight, Star, Moon, Clock, Info, ChevronRight, Sparkles } from 'lucide-react';
import { IslamicCalendar, getIslamicEventsForYear } from 'islamic-utils';

const islamicCalendar = new IslamicCalendar();

export default function HijriConverterPage() {
  const [gDate, setGDate] = useState(new Date().toISOString().split('T')[0]);
  const [hDate, setHDate] = useState({ year: 1446, month: 1, day: 1 });
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'g-to-h' | 'events'>('g-to-h');

  // Sync Hijri when Gregorian changes
  useEffect(() => {
    const hijri: any = islamicCalendar.toHijri(new Date(gDate));
    setHDate({
      year: hijri.hijriYear,
      month: hijri.hijriMonth,
      day: hijri.hijriDay
    });
    
    // Fetch events for that year
    const yearlyEvents = getIslamicEventsForYear(hijri.hijriYear, { lang: 'fr' });
    setEvents(yearlyEvents);
  }, [gDate]);

  const handleHijriChange = (field: string, value: number) => {
    const newH = { ...hDate, [field]: value };
    setHDate(newH);
    
    // Convert back to Gregorian
    try {
      const greg: any = islamicCalendar.toGregorian(newH.year, newH.month, newH.day);
      if (greg.date) {
        setGDate(greg.date.toISOString().split('T')[0]);
      }
    } catch (e) {
      // Possible invalid date during typing
    }
  };

  const hijriMonths = [
    "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani",
    "Jumada al-ula", "Jumada al-akhira", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
  ];

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
             className="inline-block p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6"
          >
            <Calendar className="w-10 h-10 text-indigo-400" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-400 mb-4 font-arabic">
            Passerelle des Temps
          </h1>
          <p className="text-gray-400 text-lg">Synchronisez les cycles lunaires et solaires avec précision.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Section Convertisseur */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full" />
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
                 {/* Gregorian Side */}
                 <div className="space-y-6">
                   <div className="flex items-center gap-3 text-indigo-400 uppercase tracking-widest text-xs font-bold">
                     <Clock className="w-4 h-4" /> Calendrier Grégorien
                   </div>
                   <input 
                     type="date"
                     value={gDate}
                     onChange={(e) => setGDate(e.target.value)}
                     className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-2xl font-mono text-center focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                   />
                   <div className="p-4 bg-white/5 rounded-xl text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Date de Naissance ou Événement</p>
                   </div>
                 </div>

                 {/* Icon Middle */}
                 <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-500 rounded-full items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] z-10">
                   <ArrowLeftRight className="w-6 h-6 text-white" />
                 </div>

                 {/* Hijri Side */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3 text-amber-500 uppercase tracking-widest text-xs font-bold">
                     <Moon className="w-4 h-4" /> Calendrier Hijri
                   </div>
                   
                   <div className="flex gap-2">
                     <div className="flex-1">
                        <select 
                          value={hDate.month}
                          onChange={(e) => handleHijriChange('month', parseInt(e.target.value))}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-bold appearance-none text-center focus:ring-2 focus:ring-amber-500/50 outline-none"
                        >
                          {hijriMonths.map((m, i) => (
                            <option key={i} value={i + 1} className="bg-[#0a0f16]">{m}</option>
                          ))}
                        </select>
                     </div>
                     <div className="w-20">
                        <input 
                          type="number"
                          value={hDate.day}
                          onChange={(e) => handleHijriChange('day', parseInt(e.target.value))}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-center font-bold focus:ring-2 focus:ring-amber-500/50 outline-none"
                        />
                     </div>
                   </div>
                   
                   <input 
                     type="number"
                     value={hDate.year}
                     onChange={(e) => handleHijriChange('year', parseInt(e.target.value))}
                     className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-3xl font-bold text-amber-500 text-center focus:ring-2 focus:ring-amber-500/50 outline-none"
                   />
                 </div>
               </div>

               <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Star className="text-amber-500 w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Année {hDate.year} de l'Hégire</div>
                      <div className="text-[10px] text-gray-500 uppercase">Ère prophétique</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setGDate(new Date().toISOString().split('T')[0])}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-all border border-white/10"
                  >
                    <RefreshCcw className="w-4 h-4" /> Aujourd'hui
                  </button>
               </div>
            </div>

            <div className="p-8 bg-black/20 rounded-[2rem] border border-white/5 italic text-sm text-gray-500 text-center">
              "Le temps n'est pas une ligne, mais un cercle de secrets divins. La conversion entre ces deux systèmes permet de situer nos actions dans les deux dimensions de l'existence."
            </div>
          </div>

          {/* Section Événements */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
              <Sparkles className="text-indigo-400 w-5 h-5" /> Événements Sacrés {hDate.year}
            </h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {events.length > 0 ? (
                events.map((ev, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-6 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{ev.gregorian.day} {new Date(ev.gregorian.iso).toLocaleDateString('fr-FR', { month: 'long' })}</span>
                       <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">{ev.hijri.day} {hijriMonths[ev.hijri.month - 1]}</span>
                    </div>
                    <div className="text-lg font-bold group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{ev.name}</div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center p-12 text-gray-600">Aucun événement répertorié pour cette période.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
