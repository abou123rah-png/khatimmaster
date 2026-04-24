'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Hash, Copy, Check, RotateCcw } from 'lucide-react';

const ARABIC_KEYS = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', 'ذ'],
];

const ARABIC_NUMS: Record<string, string> = { '0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩' };
const toAr = (n: number) => String(n).split('').map(d => ARABIC_NUMS[d]??d).join('');

export default function ClavierPage() {
  const [text, setText] = useState('');
  const [pm, setPm] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const calculatePm = async (val: string) => {
    if (!val.trim()) { setPm(0); return; }
    try {
      const res = await fetch('/api/code_mystique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase: val }),
      });
      const data = await res.json();
      setPm(data.mystical_weight || 0);
    } catch {}
  };

  const addChar = (char: string) => {
    const newText = text + char;
    setText(newText);
    calculatePm(newText);
  };

  const backspace = () => {
    const newText = text.slice(0, -1);
    setText(newText);
    calculatePm(newText);
  };

  const clear = () => { setText(''); setPm(0); };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Rough PM score color
  const pmColor = pm === 0 ? '#D4AF37' : pm < 100 ? '#10b981' : pm < 500 ? '#D4AF37' : pm < 1000 ? '#f97316' : '#ef4444';

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
            <Hash className="w-4 h-4" /> Saisie & Calcul
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            Clavier <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-500">Arabe</span>
          </h1>
          <p className="text-neutral-500 text-lg font-medium">Saisie universelle et calcul instantané du Poids Mystique</p>
        </motion.div>

        {/* Display + PM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 md:p-10 shadow-2xl mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Text Area */}
            <div className="flex-1 relative">
              <div className="absolute top-3 left-3 flex gap-2">
                <button onClick={copyText} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-neutral-500 hover:text-white'}`}>
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
              <textarea
                value={text}
                readOnly
                dir="rtl"
                className="w-full bg-transparent border-none text-4xl md:text-6xl font-amiri text-white focus:outline-none min-h-[160px] resize-none leading-[1.6] pt-10 pr-4 placeholder:text-neutral-800"
                placeholder="..."
              />
            </div>

            {/* PM Display */}
            <div className="lg:w-64 flex flex-col items-center justify-center bg-black/30 rounded-[2rem] p-8 border border-white/5 gap-4">
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Poids Mystique</p>
              <motion.div
                key={pm}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl md:text-8xl font-black font-amiri leading-none"
                style={{ color: pmColor }}
              >
                {toAr(pm)}
              </motion.div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${pmColor}66, ${pmColor})` }}
                  animate={{ width: `${Math.min((pm / 2000) * 100, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <button onClick={clear} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-red-500/20">
                <RotateCcw className="w-3 h-3" /> Effacer tout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Keyboard */}
        <div className="bg-black/40 border border-white/10 rounded-[3rem] p-6 md:p-10 shadow-inner">
          <div className="space-y-4">
            {ARABIC_KEYS.map((row, i) => (
              <div key={i} className="flex justify-center flex-wrap gap-2 md:gap-3">
                {row.map((key) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addChar(key)}
                    className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-xl md:text-3xl font-amiri hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all shadow-lg active:bg-emerald-500/20"
                  >
                    {key}
                  </motion.button>
                ))}
              </div>
            ))}

            {/* Action row */}
            <div className="flex justify-center flex-wrap gap-3 pt-4 border-t border-white/5">
              {['،', '؟', '!', '.'].map(key => (
                <motion.button key={key} whileTap={{ scale: 0.9 }} onClick={() => addChar(key)}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-xl hover:bg-white/10 transition-all">
                  {key}
                </motion.button>
              ))}
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => addChar(' ')}
                className="h-12 px-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                Espace
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={backspace}
                className="w-14 h-12 bg-red-500/20 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center hover:bg-red-500/40 transition-all">
                <Delete className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { t: 'Calcul en Temps Réel', d: 'Le PM est mis à jour immédiatement à chaque lettre. Aucune action supplémentaire nécessaire.', c: 'emerald' },
            { t: 'Polices Calligraphiques', d: 'Rendu authentique avec la police Amiri, standard de référence pour l\'arabe digital.', c: 'amber' },
            { t: 'Copie Universelle', d: 'Copiez votre texte en un clic pour l\'utiliser dans vos khatims ou vos invocations.', c: 'blue' },
          ].map((card, i) => (
            <div key={i} className={`p-6 bg-${card.c}-500/5 border border-${card.c}-500/10 rounded-[2rem]`}>
              <h3 className={`text-${card.c}-400 font-black mb-2 uppercase tracking-wider text-sm`}>{card.t}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-medium">{card.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
