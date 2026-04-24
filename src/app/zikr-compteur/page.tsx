'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { RotateCcw, Target, Sparkles, Volume2, VolumeX, ChevronRight, Settings } from 'lucide-react';

const DIVINE_NAMES = [
  { name: 'Allah', pm: 66, meaning: 'Le Dieu Unique' },
  { name: 'Ar-Rahman', pm: 298, meaning: 'Le Tout-Miséricordieux' },
  { name: 'Ar-Rahim', pm: 258, meaning: 'Le Très-Miséricordieux' },
  { name: 'Al-Malik', pm: 90, meaning: 'Le Souverain' },
  { name: 'Al-Quddous', pm: 170, meaning: 'Le Pur' },
  { name: 'As-Salam', pm: 131, meaning: 'La Paix' },
  { name: 'Al-Aziz', pm: 94, meaning: 'Le Tout-Puissant' },
  { name: 'Al-Latif', pm: 129, meaning: 'Le Subtil' },
  { name: 'Ya Wahhab', pm: 14, meaning: 'Le Donateur' },
];

export default function ZikrCompteurPage() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(99);
  const [selectedName, setSelectedName] = useState(DIVINE_NAMES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  const ringControls = useAnimation();
  const beadControls = useAnimation();

  const handleIncrement = () => {
    if (count < target) {
      setCount(prev => prev + 1);
      
      // Animation trigger
      beadControls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.1 }
      });

      if (soundEnabled) {
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => {});
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    setIsComplete(false);
  };

  useEffect(() => {
    if (count >= target && target > 0) {
      setIsComplete(true);
      ringControls.start({
        scale: [1, 1.05, 1],
        boxShadow: "0 0 50px rgba(212, 175, 55, 0.5)",
        transition: { duration: 0.5 }
      });
    }
  }, [count, target, ringControls]);

  return (
    <div className="min-h-screen bg-[#060a0f] text-white flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Settings Bar */}
        <div className="flex justify-between items-center mb-8 px-4">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-500" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
          </button>
          
          <div className="flex gap-2">
             <button 
              onClick={handleReset}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Counter Display */}
        <div className="text-center mb-12">
          <motion.h2 
            key={selectedName.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-500 text-sm font-black uppercase tracking-[0.3em] mb-2"
          >
            {selectedName.name}
          </motion.h2>
          <p className="text-gray-500 text-xs mb-6 italic">{selectedName.meaning}</p>
          
          <div className="relative inline-block">
            <motion.div 
              animate={ringControls}
              className={`text-9xl font-black tabular-nums ${isComplete ? 'text-amber-500' : 'text-white'} transition-colors duration-500`}
            >
              {count}
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-gray-600 font-bold tracking-tighter">
              OBJECTIF : {target}
            </div>
          </div>
        </div>

        {/* Main Interaction Area */}
        <div className="relative flex justify-center items-center h-80 mb-12">
          {/* Outer Ring */}
          <div className="absolute w-72 h-72 border-2 border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
          
          {/* Main Bead Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            animate={beadControls}
            onClick={handleIncrement}
            className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-[0_0_80px_rgba(234,179,8,0.1)] hover:shadow-[0_0_100px_rgba(234,179,8,0.2)] transition-shadow
              ${isComplete ? 'bg-amber-500/20 border-amber-500/50' : 'bg-white/5 border-white/20'} border-[4px] backdrop-blur-3xl`}
          >
            <div className="flex flex-col items-center gap-2">
              <Sparkles className={`w-12 h-12 ${isComplete ? 'text-amber-500' : 'text-amber-500/50'}`} />
              <span className="text-xs font-black tracking-widest uppercase opacity-40">Cliquez</span>
            </div>
            
            {/* Progress Liquid fill */}
            <motion.div 
              className="absolute bottom-0 left-0 w-full bg-amber-500/10 pointer-events-none"
              animate={{ height: `${(count / target) * 100}%` }}
              transition={{ type: 'spring', bounce: 0.2 }}
            />
          </motion.button>

          {/* Completion Glow */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Premade Goals Sections */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6">
          <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2 px-4">
            <Target className="w-4 h-4" /> Sélectionner un Zikr (PM)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {DIVINE_NAMES.map((name) => (
              <button
                key={name.name}
                onClick={() => {
                  setSelectedName(name);
                  setTarget(name.pm);
                  setCount(0);
                  setIsComplete(false);
                }}
                className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all
                  ${selectedName.name === name.name 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-500' 
                    : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20'}`}
              >
                {name.name}
                <div className="opacity-50 mt-1">{name.pm}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
