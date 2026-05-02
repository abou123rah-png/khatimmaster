'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, RotateCcw, Save, Sparkles, Keyboard, Info, Share2, Star } from 'lucide-react';
import ArabicKeyboard from '@/components/ArabicKeyboard';
import MysticalShare from '@/components/MysticalShare';

const ARABIC_NUMS: Record<string, string> = { '0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩' };
const toAr = (n: number) => String(n).split('').map(d => ARABIC_NUMS[d]??d).join('');

export default function CompatibilitePage() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<'name1' | 'name2' | null>(null);
  const [error, setError] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);

  const calculateHarmony = async () => {
    if (!name1.trim() || !name2.trim()) return;
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      const response = await fetch('/api/oracle/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name1, name2 }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Erreur mystique lors du calcul');
      }
    } catch (err) {
      setError('Erreur de connexion au sanctuaire');
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async () => {
    if (!result) return;
    try {
      await fetch('/api/save-secret', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Harmonie · ${name1} & ${name2}`,
          content: `Score: ${result.score}%\nStatut: ${result.status}\nPM Total: ${result.total_pm}\nDescription: ${result.description}\nRemède: ${result.remedy}`,
          category: 'Compatibilité'
        })
      });
      setSaved(true);
    } catch {}
  };

  const shareResult = () => {
    setIsShareOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
            <Heart className="w-4 h-4 fill-current" /> Synastrie Mystique Pro Max
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-amber-400">
            Harmonie des <span className="italic">Âmes</span>
          </h1>
          <p className="text-neutral-500 text-xl max-w-xl mx-auto font-serif italic">
            Révélez l'affinité profonde par le secret du Modulo 9 et la vibration des poids mystiques.
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            { label: 'Premier Nom', val: name1, set: setName1, id: 'name1', placeholder: 'الاسم الأول' },
            { label: 'Deuxième Nom', val: name2, set: setName2, id: 'name2', placeholder: 'الاسم الثاني' },
          ].map((field, i) => (
            <div key={i} className="space-y-3">
              <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] ml-4">{field.label}</label>
              <div className="relative group">
                <input
                  type="text" value={field.val} onChange={e => field.set(e.target.value)}
                  onFocus={() => setActiveField(field.id as 'name1' | 'name2')}
                  className="w-full bg-[#111] border-2 border-white/5 focus:border-red-500/40 rounded-[2rem] p-6 text-3xl font-arabic text-center text-white focus:outline-none transition-all shadow-2xl"
                  placeholder={field.placeholder}
                />
                <button
                  onClick={() => { setActiveField(field.id as 'name1' | 'name2'); setShowKeyboard(true); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all"
                >
                  <Keyboard className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6 mb-20">
          <button onClick={calculateHarmony} disabled={loading || !name1 || !name2}
            className="group relative px-16 py-5 bg-gradient-to-r from-red-600 to-pink-700 rounded-full text-xl font-black shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] active:scale-95 transition-all disabled:opacity-30 flex items-center gap-3">
            {loading ? <RotateCcw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
            {loading ? 'Calcul de l\'Harmonie...' : 'Révéler le Secret'}
          </button>
          {error && <p className="text-red-500 font-bold">{error}</p>}
        </div>

        <AnimatePresence>
          {result && !loading && (
            <motion.section
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0f0f0f] border border-amber-500/20 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-pink-500 to-amber-500" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                {/* Score */}
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg width="200" height="200" className="-rotate-90">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                      <motion.circle
                        cx="100" cy="100" r="90" fill="none"
                        stroke="url(#harmony-grad)" strokeWidth="12" strokeLinecap="round"
                        initial={{ strokeDasharray: '0 600' }}
                        animate={{ strokeDasharray: `${(result.score / 100) * 565} 600` }}
                        transition={{ duration: 2 }}
                      />
                      <defs>
                        <linearGradient id="harmony-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black text-white">{result.score}%</span>
                      <span className="text-[10px] uppercase font-black tracking-widest text-neutral-500">Harmonie</span>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <span className="text-2xl font-bold text-amber-500 uppercase tracking-widest">{result.status}</span>
                  </div>
                </div>

                {/* Info & Description */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-black/40 rounded-3xl p-8 border border-white/5">
                    <Sparkles className="w-8 h-8 text-amber-500 mb-4 opacity-50" />
                    <p className="text-2xl italic leading-relaxed text-neutral-200">
                      "{result.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <p className="text-[10px] font-black text-neutral-500 uppercase mb-1">PM {name1}</p>
                      <p className="text-2xl font-bold text-amber-200">{result.pm1}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <p className="text-[10px] font-black text-neutral-500 uppercase mb-1">PM {name2}</p>
                      <p className="text-2xl font-bold text-amber-200">{result.pm2}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-600/10 to-transparent rounded-3xl p-6 border border-amber-500/20 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-black flex-shrink-0">
                      <Star className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Remède Spirituel</p>
                      <p className="text-xl font-bold text-white">{result.remedy}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-4 border-t border-white/5 pt-8">
                <button onClick={saveResult} disabled={saved}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${saved ? 'bg-green-500/20 text-green-400' : 'bg-white/5 hover:bg-amber-500 hover:text-black text-neutral-400'}`}>
                  <Save className="w-4 h-4" /> {saved ? 'Archivé !' : 'Archiver le Secret'}
                </button>
                <button onClick={shareResult} className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 hover:bg-blue-500/20 text-neutral-400 hover:text-blue-400 transition-all font-black text-xs uppercase tracking-widest">
                  <Share2 className="w-4 h-4" /> Partager
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="mt-20 flex items-start gap-4 text-neutral-600 text-sm italic max-w-2xl mx-auto text-center px-4">
          <Info className="w-5 h-5 flex-shrink-0 mt-1" />
          <p>
            Cette synastrie est basée sur le Modulo 9, un secret ancestral permettant de mesurer la compatibilité énergétique entre deux noms. Elle offre une orientation spirituelle et non une sentence définitive.
          </p>
        </div>
      </div>

      <ArabicKeyboard
        isOpen={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onInput={(char) => {
          if (activeField === 'name1') setName1(prev => prev + char);
          if (activeField === 'name2') setName2(prev => prev + char);
        }}
        onBackspace={() => {
          if (activeField === 'name1') setName1(prev => prev.slice(0, -1));
          if (activeField === 'name2') setName2(prev => prev.slice(0, -1));
        }}
        onClear={() => {
          if (activeField === 'name1') setName1('');
          if (activeField === 'name2') setName2('');
        }}
      />

      <MysticalShare
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Harmonie des Âmes - KhatimMaster"
        text={result ? `Harmonie Spirituelle entre ${name1} et ${name2} : ${result.score}% (${result.status}). Prescription : ${result.remedy}` : ''}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
    </div>
  );
}
