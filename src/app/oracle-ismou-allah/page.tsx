'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Fingerprint, 
  Star, 
  Wand2, 
  History,
  Scroll,
  Moon,
  Zap,
  ArrowRight,
  Flame,
  Droplets,
  Wind,
  Mountain
} from 'lucide-react';
import { calculateAbjad, findMatchingDivineName, getElementInfo } from '@/lib/spiritual';
import { supabase } from '@/lib/supabase';

export default function IsmouAllahOracle() {
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleConsult = async () => {
    if (!name || !motherName) {
      setError('Veuillez entrer les deux noms pour l\'oracle.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Numerical calculations
      const pmName = calculateAbjad(name);
      const pmMother = calculateAbjad(motherName);
      const totalPM = pmName + pmMother;
      
      // Spiritual logic
      const divineMatch = findMatchingDivineName(totalPM);
      const element = getElementInfo(totalPM);
      
      // Generate mystical prescription based on PM
      const prescriptions = [
        "Récitez ce nom 313 fois après la prière du matin pour l'ouverture des portes.",
        "Portez ce nom en zikr constant (66 fois par jour) pour une protection absolue.",
        "Écrivez ce nom sur un parchemin propre et lavez-le pour la guérison.",
        "Le PM de ce nom est votre bouclier contre les énergies négatives.",
        "Méditez sur la signification de ce nom pendant 7 minutes chaque soir."
      ];
      
      const prescription = prescriptions[totalPM % prescriptions.length];

      setResult({
        pmName,
        pmMother,
        totalPM,
        divineName: divineMatch,
        element,
        prescription,
        timestamp: new Date().toLocaleTimeString()
      });

      // Save to history if logged in (optional/silent)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('saved_secrets').insert({
          user_id: user.id,
          title: `Oracle de l'Ismou-Allah : ${divineMatch.name}`,
          content: `Poids Mystique Total: ${totalPM}. Prescription: ${prescription}`,
          type: 'oracle'
        });
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la consultation.');
    } finally {
      setLoading(false);
    }
  };

  const getElementIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'feu': return <Flame className="w-6 h-6 text-orange-500" />;
      case 'eau': return <Droplets className="w-6 h-6 text-blue-500" />;
      case 'air': return <Wind className="w-6 h-6 text-cyan-400" />;
      case 'terre': return <Mountain className="w-6 h-6 text-emerald-600" />;
      default: return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-[#050709] relative overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <ShieldCheck className="w-4 h-4" /> Oracle de l'Ismou-Allah Pro Max
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            L'ORACLE DU <span className="gold-gradient">NOM DIVIN</span>
          </h1>
          <p className="text-neutral-500 italic max-w-2xl mx-auto">
            "Fusionnez votre vibration personnelle avec les Noms Sacrés pour découvrir votre protection céleste et votre zikr de puissance."
          </p>
        </div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2">Votre Prénom (Abjad)</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Abdoulaye"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-amber-500/50 transition-all text-lg font-medium"
                />
                <Fingerprint className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-700 group-focus-within:text-amber-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-2">Prénom de votre Mère</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="Ex: Fatoumata"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-amber-500/50 transition-all text-lg font-medium"
                />
                <Moon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-700 group-focus-within:text-amber-500 transition-colors" />
              </div>
            </div>
          </div>

          <button 
            onClick={handleConsult}
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-400 text-black font-black text-lg rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>CONSULTER L'ORACLE <Wand2 className="w-5 h-5" /></>
            )}
          </button>

          {error && <p className="mt-4 text-red-400 text-center text-sm font-bold uppercase tracking-widest">{error}</p>}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              {/* Main Divine Name Card */}
              <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-amber-950/40 via-amber-900/20 to-transparent border border-amber-500/30 p-8 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 font-amiri text-amber-500 select-none pointer-events-none">
                  {result.divineName.arabic}
                </div>
                
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-amber-500/30 flex items-center justify-center bg-amber-500/5 relative group">
                    <div className="absolute inset-2 border border-dashed border-amber-500/20 rounded-full animate-spin-slow" />
                    <span className="text-4xl md:text-6xl font-amiri text-amber-500 group-hover:scale-110 transition-transform">{result.divineName.arabic}</span>
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-4">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Votre Nom de Puissance</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                      YA <span className="text-amber-500">{result.divineName.name}</span>
                    </h2>
                    <p className="text-xl text-neutral-400 font-medium italic">"{result.divineName.meaning}"</p>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
                   <div className="text-center md:text-left">
                     <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mb-1">Poids (PM)</p>
                     <p className="text-2xl font-black text-white">{result.divineName.pm}</p>
                   </div>
                   <div className="text-center md:text-left">
                     <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mb-1">Vibration</p>
                     <p className="text-2xl font-black text-amber-500">{result.totalPM}</p>
                   </div>
                   <div className="text-center md:text-left">
                     <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mb-1">Élément</p>
                     <div className="flex items-center justify-center md:justify-start gap-2">
                        {getElementIcon(result.element.name)}
                        <span className="text-xl font-black text-white uppercase tracking-tighter">{result.element.name}</span>
                     </div>
                   </div>
                   <div className="text-center md:text-left">
                     <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mb-1">Harmonie</p>
                     <p className="text-2xl font-black text-blue-400">Stable</p>
                   </div>
                </div>
              </div>

              {/* Prescription Card */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <Scroll className="w-8 h-8 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tight text-amber-500">La Prescription</h3>
                    <p className="text-neutral-400 leading-relaxed italic">{result.prescription}</p>
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tight text-blue-400">Énergie du Moment</h3>
                    <p className="text-neutral-400 leading-relaxed italic">"Le cosmos est aligné pour votre demande. Commencez dès ce soir après le coucher du soleil."</p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-8">
                 <button 
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-3 text-neutral-500 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.3em]"
                 >
                   <History className="w-4 h-4" /> ARCHIVER CETTE CONSULTATION
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
