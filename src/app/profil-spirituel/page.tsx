'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserRoundSearch, 
  Sparkles, 
  ArrowRight, 
  Fingerprint, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  Star,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function ProfilSpirituelPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simuler un calcul mystique complexe
    setTimeout(() => {
      setResult({
        element: 'Feu',
        elementIcon: Flame,
        elementColor: 'text-orange-500',
        elementDesc: 'Votre tempérament est passionné, dynamique et protecteur. Vous possédez une grande force de volonté.',
        star: 'Lion (Asad)',
        angel: 'Jibril (a.s)',
        asma: 'Ya Aziz (Le Tout Puissant)',
        sadaqa: 'Viande rouge ou dattes',
        luck: 'Dimanche'
      });
      setIsCalculating(false);
      setStep(3);
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#050709]">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-20 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8"
          >
            <UserRoundSearch className="w-4 h-4" /> Analyse Identitaire · Ma'rifa
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">Votre Profil <span className="text-amber-500 italic">Spirituel</span></h1>
          <p className="text-neutral-400 text-lg">Découvrez les secrets cachés derrière les vibrations de votre nom.</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <Fingerprint className="w-16 h-16 text-amber-500 mx-auto opacity-50" />
                  <h2 className="text-3xl font-bold text-white">Commencez l'initiation</h2>
                  <p className="text-neutral-500">Pour une analyse précise, nous utilisons la science des lettres (Abjad).</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest ml-4">Votre Prénom</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Amadou"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-2xl px-6 py-4 text-white text-xl outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest ml-4">Prénom de votre Mère</label>
                    <input 
                      type="text" 
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Ex: Fatoumata"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-2xl px-6 py-4 text-white text-xl outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!name || !motherName}
                  className="w-full py-5 rounded-2xl bg-amber-500 text-black font-black text-lg uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  Continuer <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-8"
              >
                {!isCalculating ? (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-white">Prêt pour la révélation ?</h2>
                    <p className="text-neutral-400 max-w-md mx-auto">Nous allons calculer votre poids mystique (Adad) et le confronter aux éléments universels.</p>
                    <button 
                      onClick={handleCalculate}
                      className="px-12 py-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black text-xl uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_50px_rgba(245,158,11,0.2)]"
                    >
                      Lancer le Calcul
                    </button>
                    <button onClick={() => setStep(1)} className="block mx-auto text-neutral-500 hover:text-white text-sm font-bold uppercase tracking-widest">Retour</button>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-t-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                      />
                      <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-amber-500 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-white animate-pulse">Calcul des vibrations...</h3>
                      <div className="flex justify-center gap-4">
                        <Flame className="w-6 h-6 text-orange-500 animate-bounce delay-75" />
                        <Wind className="w-6 h-6 text-blue-400 animate-bounce delay-150" />
                        <Droplets className="w-6 h-6 text-teal-400 animate-bounce delay-300" />
                        <Mountain className="w-6 h-6 text-emerald-500 animate-bounce delay-500" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && result && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 mb-6">
                    <result.elementIcon className={`w-16 h-16 ${result.elementColor}`} />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-2">Élément : {result.element}</h2>
                  <p className="text-neutral-400 leading-relaxed max-w-lg mx-auto italic">
                    "{result.elementDesc}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Étoile (Bourdj)', value: result.star, icon: Star, color: 'text-yellow-400' },
                    { label: 'Nom de Dieu (Asma)', value: result.asma, icon: Zap, color: 'text-indigo-400' },
                    { label: 'Ange Gardien', value: result.angel, icon: ShieldCheck, color: 'text-emerald-400' },
                    { label: 'Jour de Chance', value: result.luck, icon: Sparkles, color: 'text-amber-400' }
                  ].map((item, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 rounded-3xl p-6 flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center`}>
                        <item.icon className={`w-7 h-7 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-xl font-bold text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Aumône Recommandée (Sadaqa)</p>
                  <p className="text-2xl font-black text-white mb-2">{result.sadaqa}</p>
                  <p className="text-neutral-500 text-sm italic">Faire ce sacrifice le matin de votre jour de chance pour ouvrir vos portes.</p>
                </div>

                <button 
                  onClick={() => { setStep(1); setName(''); setMotherName(''); }}
                  className="w-full py-5 rounded-2xl border border-white/10 text-neutral-400 font-bold hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                >
                  <RotateCcw className="w-5 h-5" /> Recommencer l'analyse
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
