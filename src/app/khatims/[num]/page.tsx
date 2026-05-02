"use client";

import { useState, use, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Table as TableIcon, Star, Download, Sparkles, Share2, PenTool } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
type Cell = { type: "number" | "arabic"; value: number | string };
type Tableau = Cell[][];

// ─── Chiffres arabes ──────────────────────────────────────────────────────────
const ARABIC_DIGITS: Record<string, string> = {
  '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
  '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
};
function toArabicNumerals(n: number): string {
  return String(n).split('').map(d => ARABIC_DIGITS[d] ?? d).join('');
}

// ─── Infos statiques ──────────────────────────────────────────────────────────
const KHATIM_NAMES: Record<number, string> = {
  2:  "Moussalas Kountiyou à Cœur Ouvert",
  3:  "Moussalas (3x3) - Carré de Saturne",
  4:  "Mourabbah (4x4) - Carré de Jupiter",
  5:  "Moukhams (5x5) - Carré de Mars",
  6:  "Moussadis (6x6) - Carré du Soleil",
  7:  "Moussabbi'a (7x7) - Carré de Vénus",
  8:  "Mouthammin (8x8) - Carré de Mercure",
  9:  "Mutassi' (9x9) - Carré de la Lune",
  10: "Mu'ashar (10x10)",
};

const KHATIM_PLANETS: Record<number, string> = {
  2: "Moussalas ♄", 3: "Saturne ♄", 4: "Jupiter ♃",
  5: "Mars ♂",      6: "Soleil ☉",   7: "Vénus ♀",
  8: "Mercure ☿",   9: "Lune ☽",    10: "Harmonie Universelle",
};

const KHATIM_SIZES: Record<number, string> = {
  2: "3×3", 3: "3×3", 4: "4×4", 5: "5×5",
  6: "6×6", 7: "7×7", 8: "8×8", 9: "9×9", 10: "10×10",
};

const KHATIM_CONDITIONS: Record<number, string> = {
  2:  "Libre (Génération simple)",
  3:  "Poids Mystique ≥ 12",
  4:  "Poids Mystique ≥ 30",
  5:  "Poids Mystique ≥ 60",
  6:  "Poids Mystique ≥ 105",
  7:  "Poids Mystique > 168",
  8:  "Poids Mystique > 252",
  9:  "Poids Mystique > 360",
  10: "Poids Mystique > 495",
};

export default function KhatimGeneratorPage({ params }: { params: Promise<{ num: string }> }) {
  const resolvedParams = use(params);
  const num = parseInt(resolvedParams.num, 10);
  const khatimRef = useRef<HTMLDivElement>(null);

  const [progression, setProgression] = useState('1');
  const [pmCible, setPmCible] = useState('');
  const [tableau, setTableau] = useState<Tableau | null>(null);
  const [khatimInfo, setKhatimInfo] = useState<{ nom?: string; planete?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  // Animation States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1000);
  const [traceOrder, setTraceOrder] = useState<{r: number, c: number, val: number}[]>([]);

  if (isNaN(num) || num < 2 || num > 10) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-10 text-white">
          <p className="text-2xl font-bold text-red-400">Khatim non disponible</p>
          <Link href="/khatims" className="mt-4 inline-block text-[var(--primary)] underline font-bold px-6 py-2 bg-white/5 rounded-full">
            ← Retour aux Khatims
          </Link>
        </div>
      </div>
    );
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progression || !pmCible) return;

    setLoading(true);
    setError('');
    setTableau(null);
    setCurrentStep(-1);
    setIsPlaying(false);

    try {
      const res = await fetch(`/api/khatim${num}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valeur_a: parseInt(progression),
          valeur_b: parseInt(pmCible)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la génération.');

      setTableau(data.tableau);
      setKhatimInfo({ nom: data.nom, planete: data.planete });
      
      // Calculate trace order based on numeric values
      const order: {r: number, c: number, val: number}[] = [];
      data.tableau.forEach((row: any, r: number) => {
        row.forEach((cell: any, c: number) => {
          if (cell.type === "number") {
             order.push({ r, c, val: Number(cell.value) });
          }
        });
      });
      order.sort((a, b) => a.val - b.val);
      setTraceOrder(order);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startTrace = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && currentStep < traceOrder.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep === traceOrder.length && traceOrder.length > 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, speed, traceOrder]);

  const handleDownload = async () => {
    if (!khatimRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(khatimRef.current, { 
        cacheBust: true,
        backgroundColor: '#050709',
        style: {
          padding: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      });
      const link = document.createElement('a');
      link.download = `Khatim-${num}-${pmCible}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erreur export:', err);
    } finally {
      setExporting(false);
    }
  };

  const name = KHATIM_NAMES[num] ?? `Khatim ${num}`;
  const size = KHATIM_SIZES[num] ?? `${num}×${num}`;
  const planet = KHATIM_PLANETS[num] ?? '';
  const condition = KHATIM_CONDITIONS[num] ?? '';

  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-8 max-w-6xl mx-auto w-full min-h-screen">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full mb-12"
      >
        <Link
          href="/khatims"
          className="group inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/20"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Catalogue des Khatims</span>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black tracking-widest uppercase">
          <Sparkles className="w-4 h-4" /> Science des Nombres
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
          {name}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-4 text-neutral-400">
           <span className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
             <Star className="w-4 h-4 text-amber-500" /> {planet}
           </span>
           <span className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 font-mono text-amber-400">
             Dimension: {size}
           </span>
           <span className="text-xs font-medium italic opacity-60">
             {condition}
           </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full relative z-10">
        {/* Sidebar Controls */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-4 space-y-8"
        >
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Paramètres Sacrés
            </h3>
            <form onSubmit={handleGenerate} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest px-2">Progression (a)</label>
                <input
                  type="number"
                  className="w-full bg-black/40 border border-white/10 text-white text-2xl p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-mono"
                  value={progression}
                  onChange={(e) => setProgression(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest px-2">Poids Mystique Cible (b)</label>
                <input
                  type="number"
                  className="w-full bg-black/40 border border-white/10 text-white text-2xl p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-mono"
                  placeholder="Ex: 66"
                  value={pmCible}
                  onChange={(e) => setPmCible(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !pmCible}
                className="w-full group/btn relative py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-30 flex justify-center items-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">{loading ? 'ALCHIMIE EN COURS...' : 'GÉNÉRER LE KHATIM'}</span>
                {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:animate-shimmer" />
              </button>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {tableau && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6"
            >
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Simulateur de Tracé</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  <span>Vitesse d'écriture</span>
                  <span className="text-amber-500">{speed === 2000 ? 'Lente' : speed === 1000 ? 'Normale' : 'Rapide'}</span>
                </div>
                <input 
                  type="range" min="400" max="2000" step="300"
                  value={2400 - speed}
                  onChange={(e) => setSpeed(2400 - parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <button 
                  onClick={startTrace}
                  disabled={isPlaying}
                  className="w-full py-4 border border-amber-500/20 hover:bg-amber-500/10 text-amber-500 font-black rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                >
                  <PenTool className="w-4 h-4" /> SIMULER LE TRACÉ
                </button>
              </div>
            </motion.div>
          )}
          
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
               <Star className="w-5 h-5" />
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              Note : Assurez-vous que le Poids Mystique (b) respecte la condition minimale de <span className="text-amber-500 font-bold">{condition}</span> pour une harmonie mathématique parfaite.
            </p>
          </div>
        </motion.div>

        {/* Result Area */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 space-y-8"
        >
          {tableau ? (
            <div className="space-y-8">
              <div className="flex flex-wrap justify-between items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black">
                      {num}
                    </div>
                    <div>
                       <h3 className="font-bold text-white uppercase tracking-wider">{khatimInfo?.nom || name}</h3>
                       <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{planet}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      disabled={exporting}
                      className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full text-sm font-bold transition-all disabled:opacity-50"
                    >
                      {exporting ? <span className="animate-spin text-amber-500">◌</span> : <Download className="w-4 h-4 text-amber-500" />}
                      {exporting ? 'Exportation...' : 'Télécharger Image'}
                    </button>
                    <button
                      onClick={() => {
                        const shareData = {
                          title: `KhatimMaster - ${khatimInfo?.nom || name}`,
                          text: `Découvrez ce Khatim mystique (${size}, ${planet}) avec un Poids Mystique de ${pmCible} généré sur KhatimMaster !`,
                          url: window.location.href
                        };
                        if (navigator.share) {
                          navigator.share(shareData).catch(err => console.error('Erreur de partage', err));
                        } else {
                          window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
                        }
                      }}
                      className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                      title="Partager"
                    >
                       <Share2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              {/* The Khatim Grid */}
              <div ref={khatimRef} className="relative flex justify-center py-10 px-4 md:px-12 bg-[#050709] rounded-[3rem] border border-white/5 shadow-inner overflow-hidden">
                {/* Decorative Pattern Background for Export */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                
                <div 
                  className="relative z-10 grid gap-1 md:gap-2 p-4 md:p-8 bg-black/40 rounded-[2.5rem] border-4 border-amber-500/20 shadow-2xl ring-1 ring-amber-500/10"
                  style={{
                    gridTemplateColumns: `repeat(${tableau[0]?.length ?? num}, minmax(0, 1fr))`
                  }}
                >
                  {tableau.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const isArabicText = cell.type === "arabic";
                      const stepIndex = traceOrder.findIndex(o => o.r === rowIndex && o.c === colIndex);
                      const isRevealed = currentStep === -1 || stepIndex < currentStep;
                      const isCurrent = stepIndex === currentStep && isPlaying;

                      return (
                        <motion.div
                          key={`${rowIndex}-${colIndex}`}
                          initial={false}
                          animate={{ 
                            scale: isCurrent ? 1.05 : 1,
                            borderColor: isCurrent ? 'rgba(245, 158, 11, 0.5)' : (isArabicText ? 'rgba(180, 83, 9, 0.5)' : 'rgba(255,255,255,0.05)'),
                            backgroundColor: isCurrent ? 'rgba(245, 158, 11, 0.1)' : (isArabicText ? 'rgb(245, 158, 11)' : 'rgb(17, 22, 29)')
                          }}
                          className={`
                            flex items-center justify-center rounded-xl md:rounded-2xl transition-all duration-300 border
                            ${isArabicText && isRevealed ? 'shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] text-black' : 'text-white'}
                            shadow-[0_4px_10px_rgba(0,0,0,0.3)]
                          `}
                          style={{
                            width: num >= 7 ? '55px' : '85px',
                            height: num >= 7 ? '55px' : '85px',
                            maxWidth: '100vw'
                          }}
                        >
                          <AnimatePresence>
                            {isRevealed && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-center"
                              >
                                {isArabicText ? (
                                  <span
                                    className="text-xl md:text-3xl font-black font-reem-kufi"
                                    style={{ direction: 'rtl' }}
                                  >
                                    {String(cell.value)}
                                  </span>
                                ) : (
                                  <span className="font-amiri font-bold text-2xl md:text-4xl text-amber-500/90 leading-none">
                                    {toArabicNumerals(Number(cell.value))}
                                  </span>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {/* Trace Step Indicator */}
                          {isPlaying && stepIndex !== -1 && (
                            <div className="absolute top-1 right-1 text-[7px] font-black opacity-30 text-amber-500">
                              {stepIndex + 1}
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-neutral-600 font-bold uppercase tracking-[0.2em] px-4">
                 <span>Source: KhatimMaster Al-Israr</span>
                 <span>Poids Cible: {pmCible}</span>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-12 text-center group">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <TableIcon className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white/40 mb-2 italic">En attente de calcul...</h3>
              <p className="text-gray-600 max-w-[280px] text-sm italic py-4">
                Saisissez les valeurs sacrées et lancez l'alchimie pour révéler la structure énergétique demandée.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
