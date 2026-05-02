'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Star, Zap, Shield, Sparkles, Filter } from 'lucide-react';

const SURAHS = [
  { id: 1, name: 'Al-Fatiha', arabic: 'الفاتحة', meaning: 'L\'Ouverture', verses: 7, city: 'Makkah', property: 'Clé de tous les secrets' },
  { id: 2, name: 'Al-Baqarah', arabic: 'البقرة', meaning: 'La Vache', verses: 286, city: 'Madinah', property: 'Protection suprême de la maison' },
  { id: 3, name: 'Al-Imran', arabic: 'آل عمران', meaning: 'La Famille d\'Imran', verses: 200, city: 'Madinah', property: 'Succès et élévation' },
  { id: 4, name: 'An-Nisa', arabic: 'النساء', meaning: 'Les Femmes', verses: 176, city: 'Madinah', property: 'Harmonie familiale' },
  { id: 36, name: 'Ya-Sin', arabic: 'يس', meaning: 'Yâ-Sîn', verses: 83, city: 'Makkah', property: 'Le Cœur du Coran' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', meaning: 'Le Tout Miséricordieux', verses: 78, city: 'Madinah', property: 'Beauté et Bénédiction' },
  { id: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', meaning: 'L\'Événement', verses: 96, city: 'Makkah', property: 'Richesse et Anti-Pauvreté' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملك', meaning: 'La Royauté', verses: 30, city: 'Makkah', property: 'Protection de la Tombe' },
  { id: 110, name: 'An-Nasr', arabic: 'النصر', meaning: 'Le Secours', verses: 3, city: 'Madinah', property: 'Victoire imminente' },
  { id: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص', meaning: 'Le Monothéisme Pur', verses: 4, city: 'Makkah', property: 'Le tiers du Coran' },
  { id: 113, name: 'Al-Falaq', arabic: 'الفلق', meaning: 'L\'Aube Naissante', verses: 5, city: 'Makkah', property: 'Protection contre la sorcellerie' },
  { id: 114, name: 'An-Nas', arabic: 'الناس', meaning: 'Les Hommes', verses: 6, city: 'Makkah', property: 'Protection contre les djinns' },
];

// On complète avec les numéros manquants pour la démo, mais dans une vraie app on aurait les 114
const ALL_SURAHS = Array.from({ length: 114 }, (_, i) => {
  const existing = SURAHS.find(s => s.id === i + 1);
  if (existing) return existing;
  return { id: i + 1, name: `Sourate ${i + 1}`, arabic: 'سورة', meaning: '...', verses: 0, city: '...', property: 'Mystères sacrés' };
});

export default function CoranMenu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'makkah' | 'madinah'>('all');

  const filteredSurahs = ALL_SURAHS.filter(s => 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.id.toString() === searchTerm) &&
    (filter === 'all' || s.city.toLowerCase() === filter)
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 pt-20 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8"
          >
            <BookOpen className="w-4 h-4" /> Al-Qur'an Al-Karim
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
            Les Secrets du <span className="text-emerald-500 italic">Coran</span>
          </h1>
          <p className="text-neutral-500 text-xl max-w-2xl mx-auto font-serif italic">
            "Nous faisons descendre du Coran ce qui est une guérison et une miséricorde pour les croyants."
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl sticky top-20 shadow-2xl">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
            <input 
              type="text" placeholder="Rechercher par nom ou numéro..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'makkah', label: 'Meccoises' },
              { id: 'madinah', label: 'Médinoises' },
            ].map((f) => (
              <button
                key={f.id} onClick={() => setFilter(f.id as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f.id ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-neutral-500 hover:text-white'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSurahs.map((surah) => (
              <motion.div
                key={surah.id} layout
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="group"
              >
                <Link
                  href={`/coran/${surah.id}`}
                  className="block p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.06] transition-all relative overflow-hidden h-full shadow-xl"
                >
                  <div className="absolute -right-6 -bottom-6 text-8xl opacity-[0.03] text-emerald-500 font-arabic group-hover:opacity-[0.08] transition-all">
                    {surah.arabic}
                  </div>

                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      {surah.id}
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-arabic text-white group-hover:text-emerald-400 transition-colors">{surah.arabic}</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-1 group-hover:translate-x-1 transition-transform">{surah.name}</h3>
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-4">{surah.meaning}</p>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500/70 uppercase">
                      <Sparkles className="w-3 h-3" /> Propriété :
                    </div>
                    <p className="text-xs text-neutral-400 italic leading-relaxed">
                      {surah.property}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <BookOpen className="w-16 h-16 text-neutral-700 mx-auto mb-6" />
            <p className="text-neutral-500 text-lg italic">Aucune sourate ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}
