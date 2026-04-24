'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NLEPage() {
  const [phrase, setPhrase] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateNLE = async () => {
    if (!phrase.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/tools/nle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase }),
      });
      const data = await response.json();
      setResult(data.nle);
    } catch (error) {
      console.error('Error calculating NLE:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
            Calculateur NLE
          </h1>
          <p className="text-gray-400 text-lg">
            Niçab Laha Ilaha Illa Anta — Analyse ésotérique des caractères
          </p>
        </motion.div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-2 uppercase tracking-wider">
                Verset ou Phrase en Arabe
              </label>
              <textarea
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                rows={4}
                dir="rtl"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-2xl font-arabic text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                placeholder="أدخل النص هنا..."
              />
            </div>

            <button
              onClick={calculateNLE}
              disabled={loading || !phrase.trim()}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Calculer le NLE'
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center"
            >
              <p className="text-emerald-400 text-sm uppercase tracking-[0.2em] mb-2 font-semibold">
                Résultat Final
              </p>
              <div className="text-7xl font-bold text-white mb-2">
                {result}
              </div>
              <p className="text-gray-400 text-sm">
                Caractères ésotériques identifiés
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
