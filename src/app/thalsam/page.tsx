'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Save, Info, Copy, Check, Share2, History, RotateCcw } from 'lucide-react';
import MysticalShare from '@/components/MysticalShare';

const correspondances: Record<string, number> = {
  "ا": 1, "أ": 1, "ب": 2, "ت": 400, "ث": 500, "ج": 3, "ح": 8, "خ": 600, "د": 4,
  "ذ": 700, "ر": 200, "ز": 7, "س": 60, "ش": 300, "ص": 90, "ض": 800, "ط": 9,
  "ظ": 900, "ع": 70, "غ": 1000, "ف": 80, "ق": 100, "ك": 20, "ل": 30, "م": 40,
  "ن": 50, "ه": 5, "و": 6, "ي": 10
};

const lettersTriees = Object.entries(correspondances).sort((a, b) => b[1] - a[1]);

export default function ThalsamPage() {
  const [pmInput, setPmInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const generateThalsam = () => {
    const pm = parseInt(pmInput);
    if (isNaN(pm) || pm <= 0) return;

    setLoading(true);
    setResult("");
    
    setTimeout(() => {
        let combinaison: string[] = [];
        let reste = pm;
        let derniereLettre: string | null = null;

        while (reste > 0) {
            const candidats = lettersTriees.filter(([lettre, val]) => val <= reste && lettre !== derniereLettre);
            if (candidats.length > 0) {
                const index = Math.min(candidats.length - 1, Math.floor(Math.pow(Math.random(), 2) * 3));
                const [lettre, val] = candidats[index];
                combinaison.push(lettre);
                reste -= val;
                derniereLettre = lettre;
            } else break;
        }

        const thalsam = combinaison.join("") + " النور";
        setResult(thalsam);
        setLoading(false);
    }, 1200);
  };

  const saveToSecret = async () => {
    if (!result) return;
    try {
      const response = await fetch('/api/save-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Thalsam : ${result.slice(0, 10)}...`,
          content: `Talisman généré pour PM: ${pmInput}.\nForme : ${result}\nSignification : Protection par la décomposition Abjad et Al-Noor.`,
          category: 'Thalsams'
        }),
      });
      if (response.ok) {
        setSaveStatus("Talisman sauvegardé !");
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-6"
          >
            <Wand2 className="w-12 h-12 text-amber-500" />
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-200 to-orange-400 mb-6 font-arabic tracking-tighter">
            L'Atelier des Thalsams
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto italic">
            "Forgez une signature ésotérique unique à partir de votre vibration numérique."
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-50" />
              
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] block">Saisie du Poids Mystique</label>
                <input 
                  type="number" 
                  placeholder="Valeur PM..."
                  className="w-full bg-black/40 border border-white/10 text-white text-5xl font-black p-8 rounded-3xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all text-center placeholder:text-gray-800"
                  value={pmInput}
                  onChange={(e) => setPmInput(e.target.value)}
                />
              </div>

              <button 
                onClick={generateThalsam}
                disabled={loading || !pmInput}
                className="group w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xl py-6 rounded-3xl hover:shadow-[0_0_40px_rgba(217,119,6,0.3)] hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-30 flex justify-center items-center gap-4 uppercase tracking-widest"
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Souffler le Thalsam
                  </>
                )}
              </button>

              <div className="flex items-start gap-4 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                <Info className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Le système décompose votre PM en couches abjadiques et synthétise une structure unifiée scellée par <b>Al-Noor</b> (La Lumière).
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-black/20 border border-white/5 rounded-3xl p-6"
            >
              <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
                <History className="w-4 h-4" /> Tradition Ésotérique
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Le Thalsam n'est pas qu'un mot, c'est un condensé de force. Tracez-le avec intention ou visualisez-le lors de vos méditations Zikr.
              </p>
            </motion.div>
          </div>

          {/* Résultat visuel */}
          <div className="lg:col-span-3">
             <div className={`h-full min-h-[500px] flex flex-col items-center justify-center p-8 md:p-12 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] relative transition-all duration-700 ${result ? 'border-amber-500/30 bg-amber-500/[0.03] shadow-[0_0_80px_rgba(245,158,11,0.1)]' : ''}`}>
                
                {/* Background SVG Sacred Geometry */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <svg className="w-full h-full max-w-md animate-spin-slow" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.2" />
                    <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.2" />
                    <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.2" className="rotate-45 origin-center" />
                  </svg>
                </div>

                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="relative w-full flex flex-col items-center"
                    >
                      <div className="w-full text-center mb-12">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.5em] bg-amber-500/10 px-4 py-1 rounded-full border border-amber-500/20">Signature Manifestée</span>
                      </div>

                      <div className="text-7xl md:text-9xl text-white font-arabic leading-normal tracking-[0.2em] text-center p-10 select-all drop-shadow-[0_0_50px_rgba(255,191,36,0.3)] animate-pulse-slow">
                        {result}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-12">
                         <button 
                            onClick={copyToClipboard}
                            className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-5 rounded-3xl transition-all"
                         >
                            {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
                            <span className="text-xs uppercase tracking-widest hidden sm:inline">{copied ? 'Copié' : 'Copier'}</span>
                         </button>
                         <button 
                            onClick={saveToSecret}
                            className="flex items-center justify-center gap-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 font-bold py-5 rounded-3xl transition-all"
                         >
                            <Save className="w-6 h-6" />
                            <span className="text-xs uppercase tracking-widest hidden sm:inline">Sauver</span>
                         </button>
                         <button
                            onClick={() => setIsShareOpen(true)}
                            className="flex items-center justify-center gap-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 font-bold py-5 rounded-3xl transition-all"
                         >
                            <Share2 className="w-6 h-6" />
                            <span className="text-xs uppercase tracking-widest hidden sm:inline">Partager</span>
                         </button>
                         <button 
                            onClick={() => {setResult(""); setPmInput("");}}
                            className="flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold py-5 rounded-3xl transition-all"
                         >
                            <RotateCcw className="w-6 h-6" />
                            <span className="text-xs uppercase tracking-widest hidden sm:inline">Effacer</span>
                         </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 0.2, y: 0 }}
                      className="text-center space-y-8 select-none"
                    >
                      <Wand2 className="w-32 h-32 mx-auto text-gray-400" />
                      <p className="text-2xl font-light max-w-sm mx-auto italic text-gray-400">
                        Invoquez l'Abjad pour visualiser la forme éthérique de votre intention.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {saveStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-8 bg-green-500 text-white px-8 py-3 rounded-full font-black shadow-2xl z-50 flex items-center gap-3"
                  >
                    <Check className="w-5 h-5" /> {saveStatus}
                  </motion.div>
                )}
             </div>
          </div>
        </div>
      </div>

      <MysticalShare 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Mon Thalsam - KhatimMaster"
        text={`J'ai généré ce puissant Thalsam (${result}) pour le PM ${pmInput} sur KhatimMaster !`}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
