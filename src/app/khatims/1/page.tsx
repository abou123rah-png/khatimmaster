'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Droplets, Wind, Mountain, Info, ChevronRight } from 'lucide-react';

const ARABIC_WEIGHTS: Record<string, number> = {
  "ا": 1, "أ": 1, "إ": 1, "آ": 1, "ء": 1,
  "ب": 2, "ت": 400, "ث": 500, "ج": 3, "ح": 8,
  "خ": 600, "د": 4, "ذ": 700, "ر": 200, "ز": 7,
  "س": 60, "ش": 300, "ص": 90, "ض": 800, "ط": 9,
  "ظ": 900, "ع": 70, "غ": 1000, "ف": 80, "ق": 100,
  "ك": 20, "ل": 30, "م": 40, "ن": 50, "ه": 5,
  "و": 6, "ي": 10, "ى": 10, "ة": 5
};

const ELEMENT_MAP: Record<string, 'Fire' | 'Air' | 'Water' | 'Earth'> = {
  "ا": 'Fire', "ه": 'Fire', "ط": 'Fire', "م": 'Fire', "ف": 'Fire', "ش": 'Fire', "ذ": 'Fire',
  "ب": 'Air', "و": 'Air', "ي": 'Air', "ن": 'Air', "ص": 'Air', "ت": 'Air', "ض": 'Air',
  "ج": 'Water', "ز": 'Water', "ك": 'Water', "س": 'Water', "ق": 'Water', "ث": 'Water', "ظ": 'Water',
  "د": 'Earth', "ح": 'Earth', "ل": 'Earth', "ع": 'Earth', "ر": 'Earth', "خ": 'Earth', "غ": 'Earth',
  "أ": 'Fire', "إ": 'Fire', "آ": 'Fire', "ء": 'Fire', "ى": 'Air', "ة": 'Fire'
};

const NATURES = {
  Fire: { name: 'Feu', arabic: 'نار', icon: <Flame className="w-6 h-6" />, color: '#ef4444', gradient: 'from-orange-600 to-red-600', desc: 'Action, courage, force motrice et transformation spirituelle.' },
  Air: { name: 'Air', arabic: 'هواء', icon: <Wind className="w-6 h-6" />, color: '#06b6d4', gradient: 'from-cyan-500 to-blue-500', desc: 'Intuition, communication, expansion mentale et souffle divin.' },
  Water: { name: 'Eau', arabic: 'ماء', icon: <Droplets className="w-6 h-6" />, color: '#3b82f6', gradient: 'from-blue-600 to-indigo-600', desc: 'Sagesse, calme, profondeur émotionnelle et purification.' },
  Earth: { name: 'Terre', arabic: 'أرض', icon: <Mountain className="w-6 h-6" />, color: '#10b981', gradient: 'from-emerald-600 to-teal-600', desc: 'Stabilité, patience, croissance matérielle et enracinement.' },
};

export default function Khatim1Page() {
  const [phrase, setPhrase] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const analysis = useMemo(() => {
    if (!phrase.trim()) return null;

    let totalPm = 0;
    const decomposition = {
      Fire: 0,
      Air: 0,
      Water: 0,
      Earth: 0
    };

    for (const char of phrase) {
      const weight = ARABIC_WEIGHTS[char] || 0;
      const element = ELEMENT_MAP[char];
      if (weight > 0) {
        totalPm += weight;
        if (element) {
          decomposition[element] += weight;
        }
      }
    }

    const sortedElements = Object.entries(decomposition)
      .map(([key, value]) => ({ 
        key: key as keyof typeof NATURES, 
        value, 
        percentage: totalPm > 0 ? (value / totalPm) * 100 : 0 
      }))
      .sort((a, b) => b.value - a.value);

    return {
      totalPm,
      decomposition: sortedElements,
      dominant: NATURES[sortedElements[0].key],
      natureIndex: totalPm % 4
    };
  }, [phrase]);

  return (
    <div className="min-h-screen bg-[#060a0f] text-white selection:bg-amber-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-sm font-bold tracking-widest uppercase mb-6">
            <Sparkles className="w-4 h-4" /> Analyseur de Nature
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Abjad & Éléments
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Décomposez n'importe quel nom ou phrase en ses composants élémentaires fondamentaux pour en révéler les secrets invisibles.
          </p>
        </motion.div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden transition-all hover:border-amber-500/30"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="space-y-8">
              <div className="relative">
                <label className="block text-xs font-bold text-amber-500 uppercase tracking-[0.2em] mb-4">
                  Saisie Mystique (Texte Arabe)
                </label>
                <textarea
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  dir="rtl"
                  placeholder="أدخل الاسم أو العبارة هنا..."
                  className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-4xl md:text-5xl font-arabic text-white placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all resize-none h-40 leading-relaxed text-center"
                />
              </div>

              <button
                onClick={() => setShowAnalysis(true)}
                disabled={!phrase.trim()}
                className="w-full group/btn relative py-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xl rounded-full shadow-[0_20px_40px_rgba(234,179,8,0.2)] hover:shadow-[0_20px_50px_rgba(234,179,8,0.4)] transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  RÉVÉLER LES SECRETS <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:animate-shimmer" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {showAnalysis && analysis && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Primary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total PM */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-amber-500/60 text-xs font-black uppercase tracking-widest mb-4">Poids Mystique (PM)</span>
                  <div className="text-7xl font-black text-white mb-2">{analysis.totalPm}</div>
                  <div className="text-3xl font-arabic text-amber-500/40">{(analysis.totalPm).toLocaleString('ar-EG')}</div>
                </div>

                {/* Dominant Element Card */}
                <div className={`md:col-span-2 bg-gradient-to-br ${analysis.dominant.gradient} border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 p-8 text-[120px] text-white/10 pointer-events-none rotate-12 leading-none font-arabic">
                    {analysis.dominant.arabic}
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                          {analysis.dominant.icon}
                        </div>
                        <span className="text-white/80 font-bold uppercase tracking-wider">Nature Dominante</span>
                      </div>
                      <h3 className="text-5xl font-black text-white mb-4">
                        Élément {analysis.dominant.name}
                      </h3>
                      <p className="text-white/80 text-lg max-w-md leading-relaxed">
                        {analysis.dominant.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elemental Breakdown */}
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Décomposition Élémentaire</h2>
                    <p className="text-gray-400">Répartition des forces énergétiques internes</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {analysis.decomposition.map((item, idx) => (
                    <div key={item.key} className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{NATURES[item.key].icon}</span>
                          <span className="font-bold text-gray-300 uppercase text-sm tracking-widest">{NATURES[item.key].name}</span>
                        </div>
                        <span className="text-2xl font-black text-white">{Math.round(item.percentage)}%</span>
                      </div>
                      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                          className={`h-full rounded-full bg-gradient-to-r ${NATURES[item.key].gradient}`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                        <span>Valeur : {item.value}</span>
                        <span>{NATURES[item.key].arabic}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex gap-6 items-start group hover:bg-white/10 transition-colors">
                  <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Cycle Créateur</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      L'élément dominant influence votre résonance spirituelle. Pour équilibrer un excès de {analysis.dominant.name}, il est conseillé de méditer sur les propriétés de l'élément inverse dans le cycle de vie.
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex gap-6 items-start group hover:bg-white/10 transition-colors">
                  <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Utilisation Pratique</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Ce PM de <span className="text-white font-bold">{analysis.totalPm}</span> peut servir de base pour la construction d'un Khatim personnalisé (Carré Magique) adapté à votre nature élémentaire.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
