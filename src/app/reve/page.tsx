"use client";

import { useState } from 'react';
import { Moon, Sparkles, Star, Save, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOON_SYMBOLS = ['☽', '☽', '◑', '○', '◐', '☾', '☾'];

export default function RevePage() {
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const submitDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'interprétation");
      setInterpretation(data.interpretation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveDream = async () => {
    if (!interpretation) return;
    try {
      const res = await fetch('/api/save-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Rêve du ${new Date().toLocaleDateString('fr-FR')}`,
          content: `Rêve:\n${dream}\n\nInterprétation:\n${interpretation}`,
          category: 'Rêves'
        })
      });
      if (res.ok) setSaved(true);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#050709] relative overflow-hidden flex flex-col items-center py-12 px-4">
      {/* Nocturnal Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-900/10 blur-[120px] rounded-full" />
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 space-y-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="text-7xl md:text-9xl select-none"
          >
            ☽
          </motion.div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-[0.3em] uppercase">
            <Star className="w-4 h-4" /> Oniromancie Sacrée
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            Rêves &amp; <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-blue-400 to-purple-500">Visions</span>
          </h1>
          <p className="text-neutral-500 text-lg max-w-xl mx-auto font-medium font-amiri leading-relaxed">
            Votre rêve est un message de l'au-delà. Confiez-le à notre oracle pour en percer les secrets selon la tradition islamique et soufi.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!interpretation ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />

                <form onSubmit={submitDream} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Décrivez votre vision nocturne
                    </label>
                    <textarea
                      rows={5}
                      className="w-full bg-black/40 border-2 border-white/5 focus:border-indigo-500/30 text-white text-xl md:text-2xl p-6 rounded-[2rem] focus:outline-none transition-all resize-none font-amiri italic placeholder:text-neutral-700 shadow-inner leading-relaxed"
                      placeholder="J'ai rêvé que je marchais dans un désert doré sous la lune..."
                      value={dream}
                      onChange={(e) => setDream(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !dream}
                    className="w-full group/btn relative overflow-hidden py-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-black text-xl rounded-[1.5rem] shadow-xl hover:shadow-indigo-500/30 transition-all active:scale-[0.99] disabled:opacity-30 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>L'oracle consulte les étoiles...</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-6 h-6" />
                        <span>Interpréter ma Vision</span>
                      </>
                    )}
                  </button>
                </form>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center font-bold"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="space-y-8"
            >
              {/* Top Controls */}
              <div className="flex justify-between items-center bg-white/5 border border-white/10 px-6 py-3 rounded-full">
                <button
                  onClick={() => { setInterpretation(null); setSaved(false); }}
                  className="text-neutral-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  ← Nouveau Rêve
                </button>
                <button
                  onClick={saveDream}
                  disabled={saved}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full transition-all ${saved ? 'bg-green-500/20 text-green-400' : 'bg-amber-500 text-black hover:bg-white'}`}
                >
                  <Save className="w-3 h-3" />
                  {saved ? 'Archivé !' : 'Archiver'}
                </button>
              </div>

              {/* Dream Display */}
              <div className="bg-white/5 border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-8 right-8 text-[8rem] opacity-5 text-indigo-300 font-amiri leading-none">☽</div>

                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] mb-4">Votre Rêve</p>
                <blockquote className="text-xl text-neutral-400 font-amiri italic leading-relaxed border-l-2 border-indigo-500/30 pl-6 mb-10">
                  "{dream}"
                </blockquote>

                <div className="flex items-center gap-4 mb-8">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-indigo-500/30" />
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Révélation de l'Oracle</span>
                  <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-indigo-500/30" />
                </div>

                <div className="text-xl md:text-2xl text-neutral-200 leading-loose font-amiri whitespace-pre-wrap">
                  {interpretation}
                </div>
              </div>

              <p className="text-center text-[10px] font-black text-neutral-700 uppercase tracking-[0.4em]">
                KhatimMaster — Visions & Mystères
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
