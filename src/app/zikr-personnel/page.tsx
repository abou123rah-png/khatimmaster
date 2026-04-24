'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Sparkles, Hash, Search } from 'lucide-react';

const ARABIC_NUMS: Record<string, string> = { '0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩' };
const toAr = (n: number) => String(n).split('').map(d => ARABIC_NUMS[d]??d).join('');

const ALLAH_NAMES = [
  { value: 66,   name: "الله" }, { value: 298, name: "الرحمن" }, { value: 258, name: "الرحيم" },
  { value: 90,   name: "الملك" }, { value: 170, name: "القدوس" }, { value: 131, name: "السلام" },
  { value: 136,  name: "المؤمن" }, { value: 145, name: "المهيمن" }, { value: 94,  name: "العزيز" },
  { value: 206,  name: "الجبار" }, { value: 731, name: "الخالق" }, { value: 213, name: "البارئ" },
  { value: 306,  name: "القهار" }, { value: 308, name: "الرزاق" }, { value: 489, name: "الفتاح" },
  { value: 150,  name: "العليم" }, { value: 180, name: "السميع" }, { value: 302, name: "البصير" },
  { value: 129,  name: "اللطيف" }, { value: 812, name: "الخبير" }, { value: 88,  name: "الحليم" },
  { value: 1020, name: "العظيم" }, { value: 526, name: "الشكور" }, { value: 110, name: "العلي" },
  { value: 270,  name: "الكريم" }, { value: 78,  name: "الحكيم" }, { value: 20,  name: "الودود" },
  { value: 319,  name: "الشهيد" }, { value: 108, name: "الحق" },  { value: 116, name: "القوي" },
  { value: 46,   name: "الولي" },  { value: 62,  name: "الحميد" }, { value: 18,  name: "الحي" },
  { value: 19,   name: "الواحد" }, { value: 13,  name: "الأحد" }, { value: 134, name: "الصمد" },
  { value: 305,  name: "القادر" }, { value: 402, name: "التواب" }, { value: 287, name: "الرؤوف" },
  { value: 256,  name: "النور" },  { value: 514, name: "الرشيد" },{ value: 201, name: "النافع" },
];

interface Combination {
  names: { name: string; value: number }[];
  total: number;
}

export default function ZikrPersonnelPage() {
  const [target, setTarget] = useState<number | ''>('');
  const [results, setResults] = useState<Combination[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  const findCombinations = () => {
    if (typeof target !== 'number' || target <= 0) return;
    setLoading(true);
    setTimeout(() => {
      const sorted = [...ALLAH_NAMES].sort((a, b) => b.value - a.value);
      const res: Combination[] = [];

      const search = (sum = 0, combo: { name: string; value: number }[] = [], index = 0) => {
        if (sum === target) { res.push({ names: [...combo], total: sum }); return; }
        if (sum > target || combo.length > 5 || res.length >= 30) return;
        for (let i = index; i < sorted.length; i++) {
          const item = sorted[i];
          if (sum + item.value <= target) {
            combo.push({ name: item.name, value: item.value });
            search(sum + item.value, combo, i + 1);
            combo.pop();
            if (res.length >= 30) break;
          }
        }
      };

      search();
      setResults(res);
      setLoading(false);
    }, 100);
  };

  const saveCombo = async (combo: Combination, index: number) => {
    try {
      await fetch('/api/save-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Zikr Personnel · Cible ${target}`,
          content: `Noms : ${combo.names.map(n => n.name).join(' + ')}\nValeur totale : ${combo.total}`,
          category: 'Zikr'
        })
      });
      setSaved(s => ({ ...s, [index]: true }));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-rose-900/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <Hash className="w-4 h-4" /> Combinatoire Sacrée
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
            Zikr <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-400 to-orange-500 italic">Personnel</span>
          </h1>
          <p className="text-neutral-500 text-xl font-medium font-amiri max-w-2xl mx-auto leading-relaxed">
            Entrez votre Poids Mystique pour découvrir les combinaisons exactes des Noms d'Allah qui vous correspondent.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl mb-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500" />
          <div className="absolute -right-8 -bottom-8 text-[12rem] opacity-5 font-reem-kufi text-rose-500 pointer-events-none leading-none">ذكر</div>

          <div className="space-y-8 relative z-10">
            <div>
              <label className="text-[10px] font-black text-rose-400/60 uppercase tracking-[0.3em] block mb-4">
                Votre Poids Mystique (PM) Cible
              </label>
              <input
                type="number"
                value={target}
                onChange={e => setTarget(e.target.value ? parseInt(e.target.value) : '')}
                onKeyDown={e => e.key === 'Enter' && findCombinations()}
                className="w-full bg-black/40 border-2 border-white/5 focus:border-rose-500/40 rounded-[2rem] p-8 text-5xl md:text-7xl font-black text-white focus:outline-none transition-all text-center tracking-widest shadow-inner"
                placeholder="66"
              />
            </div>

            <button
              onClick={findCombinations}
              disabled={loading || !target}
              className="w-full py-6 bg-rose-500 hover:bg-white text-black font-black text-xl rounded-[1.5rem] shadow-[0_10px_30px_rgba(244,63,94,0.2)] hover:shadow-rose-500/30 transition-all active:scale-[0.99] disabled:opacity-30 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
            >
              {loading ? (
                <div className="w-7 h-7 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <><Search className="w-6 h-6" /> Trouver les Combinaisons</>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em]">
                  {results.length} combinaison{results.length > 1 ? 's' : ''} trouvée{results.length > 1 ? 's' : ''}
                </p>
                <div className="text-4xl font-black text-rose-500 font-amiri">∑ = {toAr(Number(target))}</div>
              </div>

              {results.map((combo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative bg-white/5 border border-white/5 rounded-[2.5rem] p-8 hover:border-rose-500/20 hover:bg-rose-500/5 transition-all duration-500 flex flex-col md:flex-row items-center gap-6 justify-between overflow-hidden"
                >
                  <div className="absolute -right-4 -bottom-4 text-[5rem] font-amiri opacity-[0.04] text-rose-500 pointer-events-none leading-none">
                    {toAr(i+1)}
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-end gap-3 flex-1 relative z-10" dir="rtl">
                    {combo.names.map((n, idx) => (
                      <span key={idx} className="text-2xl font-amiri text-white bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-2xl">
                        {n.name}
                        <span className="text-xs text-neutral-500 font-sans ml-2">({n.value})</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 relative z-10 shrink-0">
                    <div className="text-3xl font-black text-rose-400 font-amiri">{toAr(combo.total)}</div>
                    <button
                      onClick={() => saveCombo(combo, i)}
                      disabled={saved[i]}
                      className={`p-3 rounded-full border transition-all ${
                        saved[i]
                          ? 'bg-green-500/20 border-green-500/30 text-green-400'
                          : 'bg-white/5 border-white/10 hover:bg-rose-500/20 hover:border-rose-500/30 text-neutral-500 hover:text-rose-400'
                      }`}
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && results.length === 0 && target && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 rounded-[3rem] border border-dashed border-white/5">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-neutral-700" />
              <p className="text-neutral-600 font-black uppercase tracking-widest text-sm">Aucune combinaison simple trouvée pour cette valeur.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
