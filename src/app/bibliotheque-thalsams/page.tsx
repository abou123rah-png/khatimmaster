'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, Zap, Star, Lock, Eye, Sparkles, ArrowRight, BookOpen, Download } from 'lucide-react';
import PageTransitionEffect from '@/components/PageTransitionEffect';

const thalsams = [
  {
    title: "Thalsam de Protection Absolue",
    asma: "الحفيظ المنيع",
    desc: "Pour se prémunir contre les énergies négatives et les obstacles invisibles.",
    pm: 1290,
    icon: Shield,
    color: "from-blue-600 to-indigo-900"
  },
  {
    title: "Thalsam de l'Ouverture (Fath)",
    asma: "الفتاح الوهاب",
    desc: "Attirer les opportunités, la prospérité et débloquer les situations complexes.",
    pm: 1512,
    icon: Star,
    color: "from-amber-400 to-orange-700"
  },
  {
    title: "Thalsam de l'Amour & Harmonie",
    asma: "الودود الجامع",
    desc: "Favoriser l'affection, la paix dans le foyer et les relations sociales.",
    pm: 1144,
    icon: Heart,
    color: "from-rose-500 to-purple-800"
  },
  {
    title: "Thalsam de la Force Vive",
    asma: "القوي المتين",
    desc: "Renforcer la vitalité physique et la détermination mentale.",
    pm: 1616,
    icon: Zap,
    color: "from-emerald-500 to-teal-900"
  }
];

export default function BibliothequeThalsamsPage() {
  const [selected, setSelected] = useState(thalsams[0]);

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <header className="text-center mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-500/30 text-amber-500 text-[10px] font-black tracking-[0.4em] uppercase"
          >
            <BookOpen className="w-4 h-4" /> Archives Secrètes
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
            BIBLIOTHÈQUE DES <span className="gold-gradient">THALSAMS</span>
          </h1>
          <p className="text-neutral-500 text-xl font-medium font-amiri max-w-2xl mx-auto italic">
            "Les signatures des Anges et les sceaux de la Lumière, conservés pour les initiés."
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* List */}
          <div className="lg:col-span-5 space-y-4">
            {thalsams.map((t, idx) => (
              <motion.button
                key={idx}
                onClick={() => setSelected(t)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-500 flex items-center gap-6 group
                  ${selected.title === t.title 
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_30px_rgba(212,175,55,0.1)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                  <t.icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg mb-1 group-hover:text-amber-400 transition-colors">{t.title}</h3>
                  <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Poids : {t.pm}</p>
                </div>
                <ArrowRight className={`w-5 h-5 transition-transform ${selected.title === t.title ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
              </motion.button>
            ))}
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 md:p-16 relative overflow-hidden backdrop-blur-3xl min-h-[600px] flex flex-col"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                
                <div className="flex-1 space-y-12">
                  <div className="text-center space-y-4">
                    <div className="text-8xl md:text-9xl font-arabic text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] animate-pulse">
                      {selected.asma}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black gold-gradient tracking-tight">{selected.title}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                      <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Nature du Secret
                      </h4>
                      <p className="text-neutral-400 text-sm leading-relaxed italic">
                        {selected.desc}
                      </p>
                    </div>
                    <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                      <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Utilisation
                      </h4>
                      <p className="text-neutral-400 text-sm leading-relaxed">
                        Tracez ce thalsam sur un parchemin propre, ou récitez les noms {selected.pm} fois pour activer la vibration.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-white/5 flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest leading-none mb-1">Authentifié par</p>
                      <p className="text-sm font-black gold-gradient">MAÎTRE CISSÉ</p>
                    </div>
                  </div>
                  
                  <button className="px-8 py-4 bg-amber-500 text-black font-black rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20">
                    <Download className="w-5 h-5" /> TÉLÉCHARGER LE SCEAU
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 border border-white/5 rounded-full opacity-20" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
