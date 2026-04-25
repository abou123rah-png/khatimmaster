'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, X, Hash, Languages, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { useSound } from '@/hooks/useSound';


interface ArabicKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onInput: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  title?: string;
}

const LAYOUTS = {
  main: [
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
    ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط', 'ذ'],
    ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
  ],
  shift: [
    ['َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ', 'ّ', 'ْ', 'آ', 'أ', 'إ', 'ـ'],
    ['[', ']', '{', '}', '«', '»', '(', ')', '؟', '!', '،', '.'],
    ['~', '`', '|', '؛', ':', '"', '\'', '>', '<', '×', '÷'],
  ],
  nums: [
    ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ]
};

export default function ArabicKeyboard({ 
  isOpen, 
  onClose, 
  onInput, 
  onBackspace, 
  onClear,
  title = "Clavier Mystique" 
}: ArabicKeyboardProps) {
  const [layout, setLayout] = useState<'main' | 'shift' | 'nums'>('main');
  const [isMinimized, setIsMinimized] = useState(false);
  const { playSound } = useSound();


  // Prevent background scroll when keyboard is open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, isMinimized]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isMinimized ? "calc(100% - 60px)" : 0 }}
        exit={{ y: "100%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[100] bg-[#0A0D14]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] rounded-t-[2.5rem] overflow-hidden select-none"
      >
        {/* Handle / Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest">{title}</h3>
              <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-tight">Saisie Arabe Authentique</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white"
            >
              {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-neutral-400 hover:text-red-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Keys Content */}
        {!isMinimized && (
          <div className="p-4 md:p-8 space-y-3 max-w-5xl mx-auto">
            {LAYOUTS[layout].map((row, i) => (
              <div key={i} className="flex justify-center gap-1.5 md:gap-3">
                {row.map((key) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.15)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playSound('click');
                      onInput(key);
                    }}
                    className="flex-1 max-w-[64px] aspect-square min-w-[32px] md:h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-xl md:text-3xl font-amiri text-neutral-200 hover:border-amber-500/50 hover:text-amber-500 transition-all shadow-lg active:bg-amber-500/20"

                  >
                    {key}
                  </motion.button>
                ))}
              </div>
            ))}

            {/* Bottom Controls Row */}
            <div className="flex justify-center gap-2 pt-2 border-t border-white/5 mt-4">
              <button
                onClick={() => {
                  playSound('click');
                  setLayout(layout === 'main' ? 'shift' : 'main');
                }}

                className={`px-4 md:px-8 py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                  layout === 'shift' ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <Languages className="w-4 h-4" /> {layout === 'shift' ? 'Lettres' : 'Harakat'}
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setLayout(layout === 'nums' ? 'main' : 'nums');
                }}

                className={`px-4 md:px-6 py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                  layout === 'nums' ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <Hash className="w-4 h-4" />
              </button>

              <motion.button 
                whileTap={{ scale: 0.98 }} 
                onClick={() => {
                  playSound('click');
                  onInput(' ');
                }}

                className="flex-[2] py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all text-[10px] font-black tracking-[0.3em] text-neutral-500 uppercase"
              >
                Espace
              </motion.button>

              <button 
                onClick={() => {
                  playSound('click');
                  onBackspace();
                }}

                className="px-4 md:px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-all"
              >
                <Delete className="w-5 h-5" />
              </button>

              <button 
                onClick={onClear}
                className="hidden md:flex px-4 py-3 bg-neutral-800 border border-white/10 text-neutral-400 rounded-xl items-center justify-center hover:bg-neutral-700 transition-all text-[9px] font-black uppercase tracking-tighter"
              >
                Effacer
              </button>
            </div>
            
            {/* Visual Indicator for RTL */}
            <div className="text-center pt-2">
              <p className="text-[8px] text-neutral-700 font-black uppercase tracking-[0.5em]">Orientation de Droite à Gauche ⟵</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
