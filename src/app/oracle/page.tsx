'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Book, Hash, Star, RefreshCcw, Share2, Info } from 'lucide-react';
import MysticalShare from '@/components/MysticalShare';

interface OracleResult {
  name: string;
  name_arabe: string;
  pm: number;
  verse: {
    surah: number;
    surah_name: string;
    ayah: number;
    text: string;
    pm: number;
  };
  divine_name: {
    name: string;
    pm: number;
  };
  zikr_count: number;
}

export default function OraclePage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OracleResult | null>(null);
  const [error, setError] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);

  const fetchOracle = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion au sanctuaire');
    } finally {
      setLoading(false);
    }
  };

  const shareResult = () => {
    if (!result) return;
    const shareText = `Mon Oracle Spirituel sur KhatimMaster :\nNom : ${result.name} (PM: ${result.pm})\nVerset : ${result.verse.surah_name}, Verset ${result.verse.ayah}\nZikr suggéré : ${result.divine_name.name} (${result.zikr_count} fois)`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mon Oracle Spirituel',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Résultat copié dans le presse-papier !');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-amber-50/90 p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/img/sacred-geometry.png')] bg-repeat bg-center"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 mb-4">
            L'Oracle des Noms & Versets
          </h1>
          <p className="text-amber-200/60 max-w-2xl mx-auto text-lg italic">
            Découvrez le verset coranique qui résonne avec votre vibration numérique et recevez votre prescription spirituelle.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0f0f0f] border border-amber-500/20 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchOracle()}
                placeholder="Entrez votre nom ou un mot sacré..."
                className="w-full bg-black/40 border-2 border-amber-500/10 focus:border-amber-500/50 rounded-2xl py-4 px-6 text-xl text-amber-50 placeholder:text-amber-500/20 outline-none transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500/30">
                <Hash className="w-6 h-6" />
              </div>
            </div>
            <button
              onClick={fetchOracle}
              disabled={loading || !name.trim()}
              className={`w-full md:w-auto px-10 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                loading 
                ? 'bg-amber-500/20 text-amber-500/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95'
              }`}
            >
              {loading ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Book className="w-6 h-6" />}
              {loading ? 'Consultation...' : 'Consulter l\'Oracle'}
            </button>
          </div>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              {/* Main Result Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-[#0f0f0f] border border-amber-500/20 rounded-3xl p-6 text-center shadow-xl">
                    <h3 className="text-amber-500/60 uppercase tracking-widest text-xs mb-2">Identité Spirituelle</h3>
                    <div className="text-3xl font-arabic text-amber-100 mb-2">{result.name_arabe}</div>
                    <div className="text-5xl font-bold text-amber-500">{result.pm}</div>
                    <div className="text-amber-200/40 text-sm mt-2">Poids Mystique (PM)</div>
                  </div>

                  <div className="bg-[#0f0f0f] border border-amber-500/20 rounded-3xl p-6 text-center shadow-xl">
                    <h3 className="text-amber-500/60 uppercase tracking-widest text-xs mb-2">Nom Divin Harmonique</h3>
                    <div className="text-2xl font-bold text-amber-200 mb-1">{result.divine_name.name}</div>
                    <div className="text-amber-500/50 text-sm">Vibration : {result.divine_name.pm}</div>
                  </div>
                </div>

                {/* Verse Card */}
                <div className="lg:col-span-2 bg-[#0f0f0f] border border-amber-500/20 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Book className="w-32 h-32 text-amber-500 -mr-16 -mt-16 rotate-12" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm font-bold uppercase tracking-wider">
                        Verset de Résonance
                      </span>
                      <span className="text-amber-200/40 font-mono">PM: {result.verse.pm}</span>
                    </div>

                    <div className="text-right mb-8">
                      <p className="text-3xl md:text-4xl leading-relaxed font-arabic text-amber-50 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                        {result.verse.text}
                      </p>
                    </div>

                    <div className="border-t border-amber-500/10 pt-6 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                      <div>
                        <h4 className="text-2xl font-serif text-amber-500">{result.verse.surah_name}</h4>
                        <p className="text-amber-200/40 italic">Sourate {result.verse.surah}, Verset {result.verse.ayah}</p>
                      </div>
                      <button 
                        onClick={() => setIsShareOpen(true)}
                        className="p-4 rounded-2xl bg-amber-500/5 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 transition-all flex items-center gap-2"
                      >
                        <Share2 className="w-5 h-5" />
                        Partager le Secret
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescription Card */}
              <div className="bg-gradient-to-br from-amber-900/20 to-[#0f0f0f] border-2 border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-20 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center text-black flex-shrink-0 shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                    <Star className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-amber-100 mb-2">Prescription Spirituelle</h3>
                    <p className="text-amber-100/70 text-lg leading-relaxed mb-4">
                      Pour harmoniser votre énergie avec ce verset sacré, le Grand Maître préconise le Zikr de <span className="text-amber-400 font-bold">{result.divine_name.name}</span>.
                    </p>
                    <div className="inline-flex items-center gap-4 bg-black/40 rounded-2xl px-6 py-4 border border-amber-500/20">
                      <div className="text-amber-500/60 text-sm uppercase tracking-widest">Nombre de répétitions</div>
                      <div className="text-3xl font-bold text-amber-400">{result.zikr_count} <span className="text-sm font-normal text-amber-200/40 ml-2">fois/jour</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info section */}
              <div className="flex items-start gap-4 text-amber-200/40 text-sm italic max-w-2xl mx-auto text-center px-4">
                <Info className="w-5 h-5 flex-shrink-0 mt-1" />
                <p>
                  Note : L'Oracle des Noms est un outil d'accompagnement spirituel basé sur la numérologie sacrée. Il ne remplace en aucun cas les prescriptions religieuses obligatoires.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Welcome message if no result */}
        {!result && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex justify-center gap-4">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="w-3 h-3 rounded-full bg-amber-500/20"
                  />
                ))}
              </div>
              <p className="text-amber-500/30 text-lg">Le sanctuaire attend votre nom...</p>
            </div>
          </motion.div>
        )}
      </div>
      </div>

      {result && (
        <MysticalShare 
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          title="Mon Oracle Spirituel - KhatimMaster"
          text={`Mon Oracle Spirituel sur KhatimMaster :\nNom : ${result.name} (PM: ${result.pm})\nVerset : ${result.verse.surah_name}, Verset ${result.verse.ayah}\nZikr suggéré : ${result.divine_name.name} (${result.zikr_count} fois)`}
          url={typeof window !== 'undefined' ? window.location.href : ''}
        />
      )}
    </div>
  );
}
