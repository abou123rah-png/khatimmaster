'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Sun, Moon, Zap, ShieldCheck, Heart, Coffee, Clock, Info, Share2 } from 'lucide-react';
import MysticalShare from '@/components/MysticalShare';

export default function ZikrOrPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    fetch('/api/oracle/daily-zikr')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050709]">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  const dayIcons: Record<string, any> = {
    "Lundi": <Moon className="w-8 h-8" />,
    "Mardi": <Zap className="w-8 h-8" />,
    "Mercredi": <Coffee className="w-8 h-8" />,
    "Jeudi": <ShieldCheck className="w-8 h-8" />,
    "Vendredi": <Heart className="w-8 h-8" />,
    "Samedi": <Clock className="w-8 h-8" />,
    "Dimanche": <Sun className="w-8 h-8" />
  };

  const shareText = data ? `Mon Zikr d'Or du jour sur KhatimMaster : ${data.day.asma} (${data.day.pm} fois). Vertu : ${data.day.virtue}.` : '';

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <Sparkles className="w-4 h-4" /> Guidance Spirituelle Quotidienne
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-600">
            Zikr d'<span className="italic">Or</span>
          </h1>
          <p className="text-neutral-500 text-xl font-medium font-amiri max-w-xl mx-auto italic">
            Chaque jour possède son ange, sa planète et sa vibration. Recevez votre prescription mystique personnalisée.
          </p>
        </motion.div>

        {data && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Main Card */}
            <div className="relative p-10 md:p-16 bg-white/5 border border-amber-500/30 rounded-[3rem] shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
              
              <div className="flex flex-col md:flex-row items-center gap-10">
                {/* Visual */}
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-black shadow-[0_0_50px_rgba(234,179,8,0.3)] group-hover:scale-105 transition-transform duration-700">
                    {dayIcons[data.day.name] || <Star className="w-12 h-12" />}
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-amber-500/50 animate-ping opacity-20" />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">{data.day.name} · {data.day.planet}</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{data.day.asma}</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-amber-400">
                      Réciter {data.day.pm} fois
                    </span>
                    <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-neutral-400">
                      Énergie {data.hour_energy}
                    </span>
                  </div>
                  
                  <p className="text-xl text-neutral-400 font-serif italic pt-4 border-t border-white/5">
                    "{data.day.virtue}"
                  </p>
                </div>
              </div>

              {/* Share/Action */}
              <div className="mt-12 flex justify-center md:justify-end gap-4">
                <button 
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black rounded-full font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  <Share2 className="w-4 h-4" /> Partager ce Zikr
                </button>
              </div>
            </div>

            {/* Detailed Advice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 bg-black/40 border border-white/5 rounded-[2rem] space-y-4">
                  <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4" /> Conseil du Maître
                  </h4>
                  <p className="text-neutral-400 text-sm leading-relaxed italic">
                    Pour une efficacité maximale, pratiquez ce Zikr à l'heure du lever du soleil ou juste après la prière de l'aube. Votre intention (Niyya) doit être pure et dirigée vers la Lumière.
                  </p>
               </div>
               <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] space-y-4">
                  <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Protection Sacrée
                  </h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Ce Zikr active une aura de protection spécifique à la planète {data.day.planet}. Portez du blanc ou des couleurs claires aujourd'hui pour résonner avec cette fréquence.
                  </p>
               </div>
            </div>
          </motion.div>
        )}

        <div className="mt-20 text-center">
           <p className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.5em] mb-4">M. Cissé · KhatimMaster Pro Max</p>
        </div>
      </div>

      <MysticalShare 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Mon Zikr d'Or - KhatimMaster"
        text={shareText}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
    </div>
  );
}
