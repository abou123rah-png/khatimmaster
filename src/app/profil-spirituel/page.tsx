'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserRoundSearch, Sparkles, ArrowRight, Fingerprint, Flame, 
  Droplets, Wind, Mountain, Star, ShieldCheck, Zap, RotateCcw, 
  Share2, Grid3X3, Save, CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { calculateSpiritualProfile, NATURES } from '@/lib/spiritual';
import Link from 'next/link';

const ICON_MAP: Record<string, any> = {
  'Feu': Flame,
  'Terre': Mountain,
  'Air': Wind,
  'Eau': Droplets
};

export default function ProfilSpirituelPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulation d'une analyse profonde
    setTimeout(() => {
      const profileData = calculateSpiritualProfile(name, motherName);
      
      // Simulation des données asma et khatim (qui viennent normalement du backend)
      // Pour garder l'expérience riche, on garde des placeholders intelligents
      const mockResult = {
        ...profileData,
        asma: { name: "Ya Latif", pm: 129 }, // À améliorer plus tard avec une table complète
        khatim: generateKhatim(profileData?.total || 0),
        element: {
          name: profileData?.natureElement.name,
          desc: profileData?.natureElement.desc,
          color: profileData?.natureElement.name === 'Feu' ? 'text-orange-500' : 
                 profileData?.natureElement.name === 'Terre' ? 'text-emerald-500' :
                 profileData?.natureElement.name === 'Air' ? 'text-blue-400' : 'text-teal-400'
        }
      };

      setResult(mockResult);
      setIsCalculating(false);
      setStep(3);
    }, 2500);
  };

  const saveToProfile = async () => {
    if (!session || !name) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ spiritual_name: name })
        .eq('id', session.user.id);
      
      if (!error) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const generateKhatim = (total: number) => {
    const center = (total - 12) / 3 > 0 ? Math.floor((total - 12) / 3) : total;
    return [
      [center + 3, center - 4, center + 1],
      [center - 2, center, center + 2],
      [center - 1, center + 4, center - 3]
    ];
  };

  const shareProfile = () => {
    if (!result) return;
    const text = `Mon Profil Spirituel sur KhatimMaster :\nÉlément : ${result.natureElement.name}\nÉtoile : ${result.star}\nAnge : ${result.angel}\nZikr : ${result.asma.name}`;
    if (navigator.share) {
      navigator.share({ title: 'Mon Profil Spirituel', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copié dans le presse-papier !');
    }
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#050709]">
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
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
            Votre Profil <span className="text-amber-500 italic">Spirituel</span>
          </h1>
          <p className="text-neutral-400 text-lg font-serif italic">Découvrez les secrets cachés derrière les vibrations de votre nom.</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <Fingerprint className="w-16 h-16 text-amber-500 mx-auto opacity-50" />
                  <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Initiation du Nom</h2>
                  <p className="text-neutral-500">Nous utilisons la science de l'Abjad pour extraire votre quintessence énergétique.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest ml-4">Votre Prénom (en arabe si possible)</label>
                    <input 
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Votre Prénom"
                      className="w-full bg-white/5 border-2 border-white/5 focus:border-amber-500/40 rounded-2xl px-6 py-5 text-white text-2xl outline-none transition-all text-center font-arabic"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest ml-4">Prénom de votre Mère</label>
                    <input 
                      type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Prénom de la Maman"
                      className="w-full bg-white/5 border-2 border-white/5 focus:border-amber-500/40 rounded-2xl px-6 py-5 text-white text-2xl outline-none transition-all text-center font-arabic"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!name || !motherName}
                  className="w-full py-6 rounded-2xl bg-amber-500 text-black font-black text-lg uppercase tracking-widest hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl"
                >
                  Suivant <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-12"
              >
                {!isCalculating ? (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-white uppercase tracking-widest">Prêt pour la révélation ?</h2>
                    <p className="text-neutral-400 max-w-md mx-auto">L'analyse combinée de votre nom et de votre lignée maternelle va révéler votre sceau vibratoire.</p>
                    <button 
                      onClick={handleCalculate}
                      className="px-16 py-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black text-xl uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_50px_rgba(245,158,11,0.3)]"
                    >
                      Lancer l'Analyse
                    </button>
                    <button onClick={() => setStep(1)} className="block mx-auto text-neutral-500 hover:text-white text-sm font-bold uppercase tracking-widest">Retour</button>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="relative w-40 h-40 mx-auto">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-dashed border-amber-500/20 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-4 border-t-amber-500 rounded-full"
                      />
                      <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-amber-500 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-white animate-pulse tracking-[0.3em] uppercase">Extraction des Sirr...</h3>
                      <div className="flex justify-center gap-6">
                        <Flame className="w-8 h-8 text-orange-500 animate-bounce" />
                        <Wind className="w-8 h-8 text-blue-400 animate-bounce delay-100" />
                        <Droplets className="w-8 h-8 text-teal-400 animate-bounce delay-200" />
                        <Mountain className="w-8 h-8 text-emerald-500 animate-bounce delay-300" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && result && (
              <motion.div
                key="step3" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                <div className="text-center">
                  <div className="inline-block p-6 rounded-[2.5rem] bg-white/5 border border-white/10 mb-8 relative group">
                    <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                    {(() => {
                      const Icon = ICON_MAP[result.natureElement.name] || Star;
                      return <Icon className={`w-20 h-20 relative z-10 ${result.element.color}`} />;
                    })()}
                  </div>
                  <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Nature : {result.natureElement.name}</h2>
                  <p className="text-neutral-400 text-xl leading-relaxed max-w-2xl mx-auto italic font-serif">
                    "{result.natureElement.desc}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Étoile (Bourdj)', value: result.star, icon: Star, color: 'text-yellow-400' },
                    { label: 'Nom Divin (Asma)', value: result.asma.name, icon: Zap, color: 'text-indigo-400' },
                    { label: 'Ange de Garde', value: result.angel, icon: ShieldCheck, color: 'text-emerald-400' },
                    { label: 'Jour de Grâce', value: result.luckDay, icon: Sparkles, color: 'text-amber-400' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-8 flex items-center gap-6 hover:border-amber-500/30 transition-all group">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-1">{item.label}</p>
                        <p className="text-2xl font-bold text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-[0.3em] uppercase mb-4">
                      <Grid3X3 className="w-4 h-4" /> Carré de l'Âme · Moussalas
                    </div>
                    <h3 className="text-3xl font-black text-white">Votre Sceau Vibratoire</h3>
                  </div>

                  <div className="max-w-xs mx-auto grid grid-cols-3 gap-2 p-4 bg-amber-500/5 rounded-3xl border border-amber-500/20">
                    {result.khatim.flat().map((num: number, i: number) => (
                      <div key={i} className="aspect-square bg-black/40 border border-amber-500/20 rounded-xl flex items-center justify-center text-2xl font-bold text-amber-500 font-arabic">
                        {toAr(num)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-8 pt-12 border-t border-white/5">
                  {session && (
                    <div className="flex justify-center">
                      <button 
                        onClick={saveToProfile}
                        disabled={isSaving || isSaved}
                        className={`flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl ${
                          isSaved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-black hover:bg-white'
                        }`}
                      >
                        {isSaving ? <RotateCcw className="w-5 h-5 animate-spin" /> : 
                         isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {isSaved ? 'Profil Archivé !' : 'Enregistrer dans mon Sanctuaire'}
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={shareProfile} className="flex items-center gap-2 px-10 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all font-black text-xs uppercase tracking-widest border border-white/10">
                      <Share2 className="w-4 h-4" /> Partager
                    </button>
                    <button 
                      onClick={() => { setStep(1); setName(''); setMotherName(''); setResult(null); }}
                      className="flex items-center gap-2 px-10 py-4 rounded-full border border-white/10 text-neutral-500 font-bold hover:text-white transition-all uppercase text-xs tracking-widest"
                    >
                      <RotateCcw className="w-4 h-4" /> Nouvelle Analyse
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {!session && step === 1 && (
          <div className="mt-8 text-center">
            <p className="text-neutral-600 text-sm">
              Connectez-vous pour sauvegarder définitivement votre profil spirituel.
              <Link href="/login" className="text-amber-500 font-bold ml-2 underline">Se Connecter</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const toAr = (n: number) => {
  const ARABIC_NUMS: Record<string, string> = { '0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩' };
  return String(n).split('').map(d => ARABIC_NUMS[d]??d).join('');
};
