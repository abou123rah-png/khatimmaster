'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Droplets, Wind, Mountain, RotateCcw, Save, Sparkles, Keyboard } from 'lucide-react';
import ArabicKeyboard from '@/components/ArabicKeyboard';


const ARABIC_NUMS: Record<string, string> = { '0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩' };
const toAr = (n: number) => String(n).split('').map(d => ARABIC_NUMS[d]??d).join('');

const ELEMENT_CONFIG: Record<string, { icon: any; color: string; gradient: string; label: string }> = {
  feu:   { icon: Zap,      color: 'orange', gradient: 'from-orange-600 to-red-700',    label: 'Feu ♂' },
  eau:   { icon: Droplets, color: 'blue',   gradient: 'from-blue-600 to-cyan-700',     label: 'Eau ☽' },
  air:   { icon: Wind,     color: 'indigo', gradient: 'from-indigo-500 to-violet-700', label: 'Air ☿' },
  terre: { icon: Mountain, color: 'emerald',gradient: 'from-emerald-600 to-teal-700',  label: 'Terre ♄' },
};

export default function CompatibilitePage() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeField, setActiveField] = useState<'name1' | 'name2' | null>(null);


  const abjadMap: Record<string, number> = {
    'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
    'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,
    'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
    'أ':1,'إ':1,'آ':1,'ٱ':1
  };

  const nameNatures: Record<string, string[]> = {
    feu:   ['ا','ط','م','ف','س','ذ','ه'],
    terre: ['ب','و','ي','ن','ض','ت','ظ'],
    air:   ['ج','ز','ك','ص','ق','ث','غ','ح'],
    eau:   ['د','ل','ع','ر','خ','ش']
  };

  const getPM = (text: string) => {
    let sum = 0;
    for (const c of text.replace(/[\u064B-\u065F\s]/g, '')) sum += abjadMap[c] || 0;
    return sum;
  };

  const getDominantElement = (text: string) => {
    const scores: Record<string, number> = { feu: 0, terre: 0, air: 0, eau: 0 };
    for (const c of text.replace(/[\u064B-\u065F\s]/g, '')) {
      for (const [el, chars] of Object.entries(nameNatures)) {
        if (chars.includes(c)) scores[el] += abjadMap[c] || 1;
      }
    }
    return Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  const getHarmonyDesc = (score: number) => {
    if (score > 85) return "Une union d'une puissance rare. Vos âmes se reconnaissent depuis l'éternité.";
    if (score > 70) return "Une belle harmonie naturelle, fluide et constructive. Un lien fort vous unit.";
    if (score > 50) return "Une relation équilibrée qui requiert conscience et effort mutuel. La croissance y est possible.";
    if (score > 30) return "Une dynamique complexe et stimulante. La sagesse et la patience transformeront les frictions en sagesse.";
    return "Un défi karmique. Ce lien exige de la maturité spirituelle pour s'épanouir dans la lumière.";
  };

  const calculateHarmony = () => {
    if (!name1.trim() || !name2.trim()) return;
    setLoading(true);
    setSaved(false);

    setTimeout(() => {
      const pm1 = getPM(name1), pm2 = getPM(name2);
      const el1 = getDominantElement(name1), el2 = getDominantElement(name2);

      const synergies: Record<string, string[]> = {
        feu: ['air', 'feu'], air: ['feu', 'air'], eau: ['terre', 'eau'], terre: ['eau', 'terre']
      };

      let score = 50;
      if (el1 === el2) score += 30;
      else if (synergies[el1].includes(el2)) score += 15;
      else score -= 10;
      if ((pm1 + pm2) % 7 === 0) score += 10;
      if (Math.abs(pm1 - pm2) < 10) score += 10;

      setResult({ pm1, pm2, el1, el2, score: Math.min(Math.max(score, 10), 99), description: getHarmonyDesc(score) });
      setLoading(false);
    }, 1800);
  };

  const saveResult = async () => {
    if (!result) return;
    try {
      await fetch('/api/save-secret', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Harmonie · ${name1} & ${name2}`,
          content: `Score: ${result.score}%\nNature 1: ${result.el1} (PM: ${result.pm1})\nNature 2: ${result.el2} (PM: ${result.pm2})\n\n${result.description}`,
          category: 'Compatibilité'
        })
      });
      setSaved(true);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-red-900/15 blur-[150px] rounded-full" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-900/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl md:text-9xl mb-6 select-none">❤️
          </motion.div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
            <Heart className="w-4 h-4" /> Synastrie Mystique
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
            Harmonie des <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-amber-400 italic">Âmes</span>
          </h1>
          <p className="text-neutral-500 text-xl font-medium font-amiri max-w-xl mx-auto">
            Révélez l'affinité profonde entre deux êtres par la science des éléments et des poids mystiques.
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            { label: 'Premier Être', val: name1, set: setName1, id: 'name1', placeholder: 'الاسم الأول', colorClass: 'focus:border-red-500/40 focus:ring-red-500/10' },
            { label: 'Deuxième Être', val: name2, set: setName2, id: 'name2', placeholder: 'الاسم الثاني', colorClass: 'focus:border-pink-500/40 focus:ring-pink-500/10' },
          ].map((field, i) => (
            <div key={i} className="space-y-3">
              <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em]">{field.label}</label>
              <div className="relative">
                <input
                  type="text" value={field.val} onChange={e => field.set(e.target.value)} dir="rtl"
                  onFocus={() => setActiveField(field.id as 'name1' | 'name2')}
                  className={`w-full bg-white/5 border-2 border-white/5 ${field.colorClass} rounded-[2rem] p-6 text-4xl font-amiri text-center text-white focus:outline-none transition-all shadow-inner pr-16`}
                  placeholder={field.placeholder}
                />
                <button
                  onClick={() => {
                    setActiveField(field.id as 'name1' | 'name2');
                    setShowKeyboard(true);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all group"
                >
                  <Keyboard className="w-5 h-5 text-neutral-500 group-hover:text-black" />
                </button>
              </div>
            </div>
          ))}

        </div>

        <div className="flex justify-center gap-4 mb-20">
          {result && (
            <button onClick={() => { setResult(null); setName1(''); setName2(''); setSaved(false); }}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          )}
          <button onClick={calculateHarmony} disabled={loading || !name1 || !name2}
            className="group/btn relative overflow-hidden px-16 py-5 bg-gradient-to-r from-red-600 to-pink-700 rounded-full text-xl font-black shadow-2xl hover:shadow-red-500/30 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-3">
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Sparkles className="w-6 h-6" /> Révéler l'Harmonie</>
            )}
          </button>
        </div>

        <AnimatePresence>
          {result && !loading && (
            <motion.section
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-pink-500 to-amber-500" />

              {/* Score Circle */}
              <div className="flex flex-col items-center mb-16">
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-6">Indice de Résonance Mystique</p>
                <div className="relative">
                  <svg width="220" height="220" className="-rotate-90">
                    <circle cx="110" cy="110" r="95" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <motion.circle
                      cx="110" cy="110" r="95" fill="none"
                      stroke="url(#grad)" strokeWidth="14" strokeLinecap="round"
                      initial={{ strokeDasharray: '0 600' }}
                      animate={{ strokeDasharray: `${(result.score / 100) * 597} 600` }}
                      transition={{ duration: 2.5, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <span className="text-7xl font-black text-white font-amiri">{toAr(result.score)}</span>
                    <span className="text-2xl font-black text-neutral-500">%</span>
                  </div>
                </div>
              </div>

              {/* Element Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {[
                  { name: name1, el: result.el1, pm: result.pm1 },
                  { name: name2, el: result.el2, pm: result.pm2 },
                ].map((person, i) => {
                  const cfg = ELEMENT_CONFIG[person.el];
                  const Icon = cfg.icon;
                  return (
                    <div key={i} className={`p-8 rounded-[2.5rem] bg-${cfg.color}-500/10 border border-${cfg.color}-500/20 flex flex-col items-center text-center gap-4`}>
                      <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-xl`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className={`text-4xl font-amiri text-${cfg.color}-400 font-black`}>{person.name}</div>
                      <div className={`text-[10px] font-black text-${cfg.color}-400/60 uppercase tracking-widest`}>{cfg.label}</div>
                      <div className="text-5xl font-black text-white font-amiri">{toAr(person.pm)}</div>
                      <div className="text-[10px] text-neutral-600 font-black uppercase tracking-widest">Poids Mystique</div>
                    </div>
                  );
                })}
              </div>

              {/* Description */}
              <div className="text-center p-10 bg-black/30 rounded-[2.5rem] border border-white/5 mb-8">
                <Sparkles className="w-8 h-8 text-pink-500 mx-auto mb-6 opacity-50" />
                <p className="text-2xl md:text-3xl italic text-white font-amiri leading-relaxed">
                  "{result.description}"
                </p>
              </div>

              <div className="flex justify-center">
                <button onClick={saveResult} disabled={saved}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${saved ? 'bg-green-500/20 text-green-400' : 'bg-white/5 hover:bg-amber-500 hover:text-black text-neutral-400 border border-white/10'}`}>
                  <Save className="w-4 h-4" /> {saved ? 'Archivé !' : 'Archiver dans mon Carnet'}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
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
    </div>
  );
}

