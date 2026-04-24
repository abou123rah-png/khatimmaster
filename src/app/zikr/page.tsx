'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ARABIC_WEIGHTS: Record<string, number> = {
  "ا": 1, "أ": 1, "إ": 1, "آ": 1, "ء": 1,
  "ب": 2, "ت": 400, "ث": 500, "ج": 3, "ح": 8,
  "خ": 600, "د": 4, "ذ": 700, "ر": 200, "ز": 7,
  "س": 60, "ش": 300, "ص": 90, "ض": 800, "ط": 9,
  "ظ": 900, "ع": 70, "غ": 1000, "ف": 80, "ق": 100,
  "ك": 20, "ل": 30, "م": 40, "ن": 50, "ه": 5,
  "و": 6, "ي": 10, "ى": 10, "ة": 5
};

export default function ZikrPage() {
  const [phrase, setPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    pm: number;
    count: number;
    plusN: number;
    inverse: number;
    pythagore: number;
  } | null>(null);

  const calculate = () => {
    if (!phrase.trim()) return;
    setLoading(true);

    let pm = 0;
    let count = 0;
    for (const char of phrase) {
      if (ARABIC_WEIGHTS[char]) {
        pm += ARABIC_WEIGHTS[char];
        count++;
      }
    }

    const inverse = parseInt(pm.toString().split('').reverse().join('')) || 0;
    const pythagore = pm.toString().split('').reduce((a, b) => a + parseInt(b), 0);

    setResults({
      pm,
      count,
      plusN: pm + count,
      inverse,
      pythagore
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-4 font-arabic">
            Calculateur de Zikr
          </h1>
          <p className="text-gray-400 text-lg">
            Déterminez le poids spirituel et les variations mystiques de vos invocations
          </p>
        </motion.div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wider">
                Votre Invocation / Verset
              </label>
              <textarea
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                dir="rtl"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-3xl font-arabic text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none min-h-[120px]"
                placeholder="أدخل الذكر هنا..."
              />
            </div>

            <button
              onClick={calculate}
              disabled={loading || !phrase.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Calculer les Valeurs Spirituelles'
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <ResultCard title="Poids Mystique (PM)" value={results.pm} color="purple" icon="✨" />
              <ResultCard title="PM + Nombre de Lettres" value={results.plusN} color="pink" icon="➕" />
              <ResultCard title="Inverse" value={results.inverse} color="indigo" icon="🔄" />
              <ResultCard title="Somme Pythagoricienne" value={results.pythagore} color="amber" icon="📐" />
              <ResultCard title="Nombre de Lettres" value={results.count} color="emerald" icon="📝" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) {
  const colors: Record<string, string> = {
    purple: 'from-purple-500/20 text-purple-400 border-purple-500/30',
    pink: 'from-pink-500/20 text-pink-400 border-pink-500/30',
    indigo: 'from-indigo-500/20 text-indigo-400 border-indigo-500/30',
    amber: 'from-amber-500/20 text-amber-400 border-amber-500/30',
    emerald: 'from-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-b border rounded-3xl p-6 text-center ${colors[color]}`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">{title}</p>
      <div className="text-4xl font-bold text-white tabular-nums">{value}</div>
    </motion.div>
  );
}
