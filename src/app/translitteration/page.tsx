'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ArrowRight, Copy, Check, Sparkles } from 'lucide-react';

const ARABIC_NUMS: Record<string, string> = { '0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩' };
const toAr = (n: number) => String(n).split('').map(d => ARABIC_NUMS[d]??d).join('');

export default function TransliterationPage() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<{ arabic: string; pm: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const calculateTransliteration = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/tools/transliteration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      setResult({ arabic: data.arabic, pm: data.pm });
    } catch {}
    finally { setLoading(false); }
  };

  const copyArabic = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.arabic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden flex flex-col items-center py-16 px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <Languages className="w-4 h-4" /> Phonétique Sacrée
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
            Ton Nom en <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-400 to-violet-600 italic">Arabe</span>
          </h1>
          <p className="text-neutral-500 text-xl font-medium font-amiri max-w-xl mx-auto leading-relaxed">
            Découvrez votre identité spirituelle en arabe et votre Poids Mystique personnel.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl mb-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black text-blue-400/60 uppercase tracking-[0.3em] block mb-4 text-center">
                Votre Prénom (en français, anglais ou wolof)
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && calculateTransliteration()}
                className="w-full bg-black/40 border-2 border-white/5 focus:border-blue-500/40 rounded-[2rem] p-6 text-3xl md:text-4xl font-black text-white focus:outline-none transition-all text-center tracking-wider shadow-inner placeholder:text-neutral-800"
                placeholder="Abdourahamane..."
              />
            </div>

            <button
              onClick={calculateTransliteration}
              disabled={loading || !name.trim()}
              className="w-full py-6 bg-blue-600 hover:bg-white text-white hover:text-black font-black text-xl rounded-[1.5rem] shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all active:scale-[0.99] disabled:opacity-30 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ArrowRight className="w-6 h-6" /> Révéler mon Nom</>
              )}
            </button>
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Arabic Display */}
              <div className="group relative bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem] p-10 text-center hover:border-blue-400/40 transition-all overflow-hidden">
                <div className="absolute -top-4 -right-4 text-[8rem] opacity-5 text-blue-300 font-reem-kufi pointer-events-none">ع</div>
                <p className="text-[10px] font-black text-blue-400/60 uppercase tracking-[0.3em] mb-6">Votre Nom en Arabe</p>
                <div className="text-5xl md:text-7xl font-amiri text-white mb-6 leading-[1.3]" dir="rtl">
                  {result.arabic}
                </div>
                <button onClick={copyArabic}
                  className={`flex items-center gap-2 mx-auto px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 border border-white/10 text-neutral-500 hover:text-blue-400'
                  }`}>
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copié !' : 'Copier'}
                </button>
              </div>

              {/* PM Display */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[2.5rem] p-10 text-center hover:border-indigo-400/40 transition-all flex flex-col items-center justify-center">
                <p className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.3em] mb-6">Poids Mystique (PM)</p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-7xl md:text-9xl font-black text-indigo-400 font-amiri leading-none mb-6"
                >
                  {toAr(result.pm)}
                </motion.div>
                <p className="text-neutral-600 font-black uppercase tracking-widest text-[10px]">Valeur Abjad Totale</p>
                <div className="mt-6 flex items-center gap-2 text-[10px] text-indigo-400/40 font-black uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  <span>Utilisez ce PM dans d'autres outils</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
