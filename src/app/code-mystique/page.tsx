'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Search, Sparkles, BookOpen, Star } from 'lucide-react';

interface SearchResult {
  sourate: number;
  sourate_nom: string;
  verset: number;
  texte: string;
}

const ARABIC_NUMS: Record<string, string> = {
  '0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩'
};
const toAr = (n: number) => String(n).split('').map(d => ARABIC_NUMS[d]??d).join('');

export default function CodeMystiquePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const searchQuran = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setResults([]);
    setCount(null);
    try {
      const response = await fetch('/api/tools/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);
      const data = await response.json();
      setResults(data.results || []);
      setCount(data.count || 0);
    } catch (error: any) {
      setErrorMsg(error.message || 'Connexion impossible au serveur mystique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <Hash className="w-4 h-4" /> Cryptanalyse Coranique
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            Code <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-500 to-orange-700">Mystique</span>
          </h1>
          <p className="text-neutral-500 text-xl max-w-2xl mx-auto font-medium font-amiri">
            Révélez les occurrences cachées d'un mot dans le Noble Coran. Chaque répétition est un secret divin.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl mb-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Mot ou expression à rechercher
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchQuran()}
                dir="rtl"
                className="w-full bg-black/40 border-2 border-white/5 focus:border-amber-500/40 rounded-[1.5rem] p-6 text-3xl md:text-4xl font-amiri text-white focus:outline-none transition-all shadow-inner placeholder:text-neutral-700"
                placeholder="أدخل الكلمة هنا..."
              />
            </div>

            <button
              onClick={searchQuran}
              disabled={loading || !query.trim()}
              className="w-full group/btn relative overflow-hidden py-6 bg-amber-500 text-black font-black text-xl rounded-[1.5rem] shadow-[0_20px_40px_rgba(234,179,8,0.15)] hover:shadow-amber-500/30 transition-all active:scale-[0.99] disabled:opacity-30 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                  <span>Analyse des Versets...</span>
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  <span>Révéler les Occurrences</span>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 mb-10 font-bold"
            >
              {errorMsg}
            </motion.div>
          )}

          {count !== null && !errorMsg && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              {/* Count Banner */}
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2.5rem] bg-amber-500/10 border border-amber-500/30 overflow-hidden">
                <div className="absolute -right-6 -top-6 opacity-10">
                  <Sparkles className="w-40 h-40 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.4em] mb-1">Occurrences Révélées</p>
                  <p className="text-7xl md:text-9xl font-black text-amber-500 font-amiri leading-none">{toAr(count)}</p>
                  <p className="text-neutral-500 font-medium mt-2">
                    fois dans le Coran pour <span className="text-white font-amiri text-2xl px-2" dir="rtl">{query}</span>
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Star className="w-10 h-10 text-amber-500/40" />
                  <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Science des Nombres</span>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {results.map((res, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group relative bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:p-10 hover:border-amber-500/20 hover:bg-amber-500/5 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 text-[10rem] font-black text-amber-500/5 leading-none pointer-events-none select-none group-hover:text-amber-500/10 transition-colors font-amiri">
                      {toAr(i+1)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
                      <span className="bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                        {res.sourate_nom}
                      </span>
                      <span className="bg-white/5 border border-white/10 text-neutral-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                        Sourate {toAr(res.sourate)} · Verset {toAr(res.verset)}
                      </span>
                    </div>
                    <p className="text-2xl md:text-4xl font-amiri text-white leading-relaxed text-right relative z-10" dir="rtl">
                      {res.texte}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
