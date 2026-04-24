'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  Info
} from 'lucide-react';

// Ordre traditionnel du 3x3 (Positions row, col)
const order3x3 = [
  [0, 1], // 1
  [2, 2], // 2
  [1, 0], // 3
  [2, 0], // 4
  [1, 1], // 5
  [0, 2], // 6
  [1, 2], // 7
  [0, 0], // 8
  [2, 1]  // 9
];

export default function TraceSacrePage() {
  const [targetValue, setTargetValue] = useState(66);
  const [grid, setGrid] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const calculate3x3 = (total: number) => {
    // Calcul classique du 3x3 : (Poids - 12) / 3
    const base = Math.floor((total - 12) / 3);
    const remainder = (total - 12) % 3;

    let cells = Array(3).fill(null).map(() => Array(3).fill(0));
    
    // Remplissage selon l'ordre Abjad avec gestion du surplus (Kasr)
    order3x3.forEach(([r, c], i) => {
      let val = base + i;
      if (remainder === 1 && i >= 6) val += 1;
      if (remainder === 2 && i >= 3) val += 1;
      cells[r][c] = val;
    });

    return cells;
  };

  const handleStart = () => {
    const newGrid = calculate3x3(targetValue);
    setGrid(newGrid);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && currentStep < 9) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep === 9) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, speed]);

  const reset = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
    setGrid(null);
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#050709]">
      {/* Mystic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/papyree.png')] pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-20 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-6"
          >
            <PenTool className="w-4 h-4" /> La Science du Tracé · Sirr al-Kitab
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
            Le Tracé <span className="text-amber-500">Sacré</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto italic">
            "Apprenez l'ordre ésotérique dans lequel l'esprit habite les demeures du carré."
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 mb-12 flex flex-col md:flex-row gap-8 items-end justify-center">
          <div className="space-y-3 w-full md:w-auto">
            <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest ml-4">Poids Mystique Cible</label>
            <input 
              type="number" 
              value={targetValue}
              onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
              className="w-full md:w-48 bg-black/40 border border-white/10 focus:border-amber-500/50 rounded-2xl px-6 py-4 text-white text-2xl font-black outline-none transition-all"
            />
          </div>
          <div className="space-y-3 w-full md:w-auto">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-4">Vitesse du Tracé</label>
            <select 
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full md:w-48 bg-black/40 border border-white/10 focus:border-amber-500/50 rounded-2xl px-6 py-4 text-white font-bold outline-none transition-all appearance-none"
            >
              <option value={2000}>Méditatif (Lent)</option>
              <option value={1000}>Normal</option>
              <option value={400}>Rapide</option>
            </select>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            {!grid ? (
              <button 
                onClick={handleStart}
                className="flex-1 md:flex-none px-8 py-4 bg-amber-500 hover:bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3"
              >
                Lancer <Play className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button 
                onClick={reset}
                className="flex-1 md:flex-none px-8 py-4 border border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3"
              >
                Réinitialiser <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Animation Area */}
        <div className="relative">
          {/* Legend */}
          <div className="absolute -left-32 top-0 hidden lg:block space-y-6">
            <div className="flex items-center gap-4 text-neutral-500">
              <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black">1</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Entrée</span>
            </div>
            <div className="w-px h-20 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
            <div className="flex items-center gap-4 text-neutral-500">
              <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black">5</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Le Cœur</span>
            </div>
            <div className="w-px h-20 bg-gradient-to-b from-white/10 to-transparent mx-auto" />
            <div className="flex items-center gap-4 text-neutral-500">
              <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black">9</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Sortie</span>
            </div>
          </div>

          {/* The Grid */}
          <div className="aspect-square max-w-[500px] mx-auto grid grid-cols-3 gap-4 p-4 bg-white/5 border border-white/10 rounded-[3rem] shadow-2xl relative backdrop-blur-md">
            {grid && Array(3).fill(0).map((_, r) => 
              Array(3).fill(0).map((_, c) => {
                const stepIndex = order3x3.findIndex(([or, oc]) => or === r && oc === c);
                const isRevealed = stepIndex < currentStep;
                const isCurrent = stepIndex === currentStep;

                return (
                  <motion.div
                    key={`${r}-${c}`}
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.05 : 1,
                      backgroundColor: isCurrent ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0,0,0,0.3)',
                      borderColor: isCurrent ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255,255,255,0.05)'
                    }}
                    className="relative border flex items-center justify-center rounded-[1.5rem] overflow-hidden"
                  >
                    <AnimatePresence>
                      {isRevealed && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="text-3xl md:text-5xl font-black text-white font-serif"
                        >
                          {grid[r][c]}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Step Number Badge */}
                    <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black text-neutral-500">
                      {stepIndex + 1}
                    </div>

                    {/* Current Indicator */}
                    {isCurrent && (
                      <motion.div 
                        className="absolute inset-0 bg-amber-500/20"
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                );
              })
            )}

            {!grid && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600 space-y-4">
                <PenTool className="w-16 h-16 opacity-20" />
                <p className="font-black text-[10px] uppercase tracking-[0.3em]">En attente du poids mystique</p>
              </div>
            )}
          </div>
        </div>

        {/* Legend / Info */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "L'Ordre Abjad", desc: "Le remplissage suit l'ordre des lettres arabes de 1 à 9." },
            { icon: ShieldCheck, title: "La Règle d'Or", desc: "Ne jamais lever la main entre deux chiffres pour garder le lien." },
            { icon: Sparkles, title: "L'Intention", desc: "Récitez votre vœu à chaque case remplie par l'outil." }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <item.icon className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-start">
          <Info className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
          <p className="text-neutral-400 text-xs italic leading-relaxed">
            Note technique : Ce simulateur utilise le tracé dit "de Ghazali". Pour le 4x4 (Mourabba), la marche est différente. Cet outil est conçu pour vous aider à visualiser le rythme d'écriture correct.
          </p>
        </div>
      </div>
    </div>
  );
}
