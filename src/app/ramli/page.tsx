"use client";

import { useState } from 'react';
import { Compass, Quote, Star, ArrowRight, Save, History, Sparkles, Wand2, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RamliResponse {
  question: string;
  juge: { name: string; meaning: string; elements: string[] };
  temoin_passe: { name: string; meaning: string; elements: string[] };
  temoin_futur: { name: string; meaning: string; elements: string[] };
  interpretation: string;
}

export default function RamliPage() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<RamliResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/ramli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la consultation');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050709] relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-8">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase">
            <Compass className="w-4 h-4" /> Science du Sable
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Oracle du <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-500 to-orange-600">Ramli</span>
          </h1>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Interrogez les figures géomantiques pour obtenir une vision claire de votre destin. Une sagesse ancestrale traduite par les nombres.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-700">
                   <Hexagon className="w-40 h-40 text-amber-500" />
                </div>

                <form onSubmit={submitQuestion} className="space-y-10 relative z-10">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-amber-500/60 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                       <Wand2 className="w-4 h-4" /> Formulez votre intention
                    </label>
                    <textarea 
                      rows={4}
                      className="w-full bg-black/40 border-2 border-white/5 text-white text-xl md:text-2xl p-6 rounded-[2rem] focus:outline-none focus:border-amber-500/40 transition-all resize-none font-serif italic placeholder:text-neutral-700 shadow-inner"
                      placeholder="Ex: Quel chemin dois-je prendre pour ma carrière ?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || !question}
                    className="w-full relative group/btn overflow-hidden py-6 bg-amber-500 text-black font-black text-lg rounded-[1.5rem] shadow-[0_20px_40px_rgba(234,179,8,0.2)] hover:shadow-amber-500/40 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale uppercase tracking-[0.2em] flex justify-center items-center gap-3"
                  >
                    <span className="relative z-10">{loading ? 'Interrogation du sable...' : 'Dévoiler les Figures'}</span>
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin relative z-10" />
                    ) : (
                      <Star className="w-5 h-5 relative z-10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                  </button>
                </form>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center text-sm font-bold"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
              
              <div className="mt-12 flex justify-center gap-6 text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                 <span className="flex items-center gap-2"><History className="w-4 h-4" /> 16 Figures Sacrées</span>
                 <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Guide Traditionnel</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="w-full space-y-12"
            >
              <div className="flex justify-between items-center bg-white/5 border border-white/10 p-2 pl-4 rounded-full">
                <button 
                  onClick={() => setResult(null)}
                  className="text-neutral-400 hover:text-amber-500 flex items-center gap-2 transition-all p-2 font-black uppercase text-[10px] tracking-widest"
                >
                  ← Nouvelle session
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/save-secret', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: `Consultation Ramli : ${result.question}`,
                            content: `Juge: ${result.juge.name} (${result.juge.meaning})\nInterprétation: ${result.interpretation}`,
                            category: 'Géomancie'
                          })
                        });
                        if (res.ok) alert('Sagesse archivée avec succès.');
                      } catch (err) {
                        console.error('Erreur sauvegarde:', err);
                      }
                    }}
                    className="px-6 py-2 bg-amber-500 text-black rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg"
                  >
                    <Save className="w-4 h-4" /> ARCHIVER
                  </button>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/20 blur-[60px] rounded-full pointer-events-none" />
                
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-12 font-reem-kufi italic text-center leading-tight">
                  <span className="text-amber-500 opacity-30 text-8xl absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none">"</span>
                  {result.question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-10">
                  <FigureCard 
                    label="L'Origine (Passé)" 
                    name={result.temoin_passe.name} 
                    meaning={result.temoin_passe.meaning} 
                    elements={result.temoin_passe.elements}
                  />
                  
                  <FigureCard 
                    label="Le Juge El-Khatit" 
                    name={result.juge.name} 
                    meaning={result.juge.meaning} 
                    elements={result.juge.elements}
                    featured
                  />

                  <FigureCard 
                    label="L'Issue (Futur)" 
                    name={result.temoin_futur.name} 
                    meaning={result.temoin_futur.meaning} 
                    elements={result.temoin_futur.elements}
                  />
                </div>

                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Quote className="absolute -top-6 -left-6 w-12 h-12 text-amber-500 opacity-20" />
                  <div className="text-xl md:text-3xl text-neutral-300 leading-relaxed whitespace-pre-wrap font-amiri font-bold pl-12 border-l-4 border-amber-500/30 py-4">
                    {result.interpretation}
                  </div>
                </div>
              </div>

              <div className="text-center">
                 <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.5em]">KhatimMaster — Vision Transcendantale</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FigureCard({ label, name, meaning, elements, featured = false }: { 
  label: string; 
  name: string; 
  meaning: string; 
  elements: string[];
  featured?: boolean;
}) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden ${
        featured 
          ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/40 shadow-[0_0_50px_rgba(234,179,8,0.1)] scale-110 md:z-20' 
          : 'bg-white/5 border-white/5 shadow-xl'
      }`}
    >
      <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
        <Sparkles className="w-24 h-24" />
      </div>
      
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] block mb-4 ${featured ? 'text-amber-400' : 'text-neutral-500'}`}>
        {label}
      </span>
      <h4 className={`text-2xl md:text-3xl font-black mb-2 ${featured ? 'text-white' : 'text-neutral-300'}`}>
        {name}
      </h4>
      <p className="text-xs text-neutral-500 font-bold mb-6 italic">{meaning}</p>
      
      <div className="flex flex-wrap gap-2">
        {elements.map((el, i) => (
          <span key={i} className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
            featured ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-neutral-600'
          }`}>
            {el}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
