'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Save, Hash, Keyboard } from 'lucide-react';
import ArabicKeyboard from '@/components/ArabicKeyboard';


interface AsmaName {
  id: number;
  name: string;
  transliteration: string;
  meaning: string;
  abjad: number;
}

const ARABIC_NUMS: Record<string, string> = { '0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩' };
const toAr = (n: number) => String(n).split('').map(d => ARABIC_NUMS[d]??d).join('');

export default function AsmaulHusnaPage() {
  const [names, setNames] = useState<AsmaName[]>([]);
  const [userName, setUserName] = useState('');
  const [userPM, setUserPM] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [matchingNames, setMatchingNames] = useState<AsmaName[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);


  const abjadMap: Record<string, number> = {
    'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,
    'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,
    'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,
    'ض':800,'ظ':900,'غ':1000,
    'أ':1,'إ':1,'آ':1,'ٱ':1,'ة':5,'ى':10,'ؤ':6,'ئ':10
  };

  useEffect(() => {
    fetch('/api/asmaul-husna')
      .then(res => res.json())
      .then(data => { setNames(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const calculatePM = (text: string) => {
    let sum = 0;
    const clean = text.replace(/[\u064B-\u065F]/g, '');
    for (const c of clean) sum += abjadMap[c] || 0;
    return sum;
  };

  const handleMatch = () => {
    if (!userName.trim()) return;
    setCalculating(true);
    setTimeout(() => {
      const pm = calculatePM(userName);
      setUserPM(pm);
      const matches = names.filter(n => n.abjad === pm || pm % n.abjad === 0 || n.abjad % pm === 0);
      setMatchingNames(matches.sort((a, b) => a.abjad === pm ? -1 : b.abjad === pm ? 1 : a.abjad - b.abjad));
      setCalculating(false);
    }, 1500);
  };

  const saveSecret = async (name: AsmaName) => {
    try {
      await fetch('/api/save-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Lien Divin : ${name.transliteration}`,
          content: `PM de "${userName}": ${userPM}\nNom: ${name.name}\nSens: ${name.meaning}\nAbjad: ${name.abjad}`,
          category: 'Asmaul Husna'
        })
      });
      setSaveStatus(`${name.transliteration} archivé !`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {}
  };

  const filteredNames = names.filter(n =>
    n.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.name.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/8 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-600/5 blur-[150px] rounded-full" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-black px-8 py-3 rounded-full shadow-2xl font-black text-sm uppercase tracking-widest"
          >
            {saveStatus}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <Sparkles className="w-4 h-4" /> Les Attributs de l'Absolu
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
            <span className="font-reem-kufi text-amber-500">أسماء الله الحسنى</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Les 99 Noms <span className="text-amber-500 italic">Sublimes</span>
          </h2>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto font-medium font-amiri">
            Découvrez votre résonance spirituelle avec les Attributs divins selon votre Poids Mystique personnel.
          </p>
        </motion.div>

        {/* Resonance Calculator */}
        <motion.section
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500" />
          <div className="absolute -right-10 -bottom-10 text-[15rem] opacity-[0.03] font-reem-kufi text-amber-500 pointer-events-none">
            الله
          </div>

          <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center">
              <Hash className="w-5 h-5 text-black" />
            </div>
            Calculateur de Résonance Divine
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] mb-3 block">
                  Votre Nom en Arabe
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMatch()}
                    dir="rtl"
                    placeholder="محمد, أحمد, فاطمة..."
                    className="w-full bg-black/40 border-2 border-white/5 focus:border-amber-500/40 rounded-[1.5rem] p-6 text-4xl font-amiri text-center text-white focus:outline-none transition-all shadow-inner pr-16"
                  />
                  <button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black transition-all group"
                    title="Ouvrir le clavier arabe"
                  >
                    <Keyboard className="w-5 h-5 text-neutral-500 group-hover:text-black transition-colors" />
                  </button>
                </div>

              </div>
              <button
                onClick={handleMatch}
                disabled={calculating || !userName.trim()}
                className="w-full py-5 bg-amber-500 text-black font-black text-lg rounded-[1.5rem] hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(234,179,8,0.2)]"
              >
                {calculating ? (
                  <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {calculating ? 'Synchronisation Cosmique...' : 'Trouver mes Noms Divins'}
              </button>
            </div>

            <div className="min-h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {userPM === null && !calculating && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="text-8xl mb-4 opacity-10">سر</div>
                    <p className="text-neutral-600 font-medium">Entrez votre nom pour révéler votre connexion divine.</p>
                  </motion.div>
                )}
                {calculating && (
                  <motion.div key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="text-6xl mb-4"
                    >
                      ✦
                    </motion.div>
                    <p className="text-amber-500 font-black uppercase tracking-widest text-sm">Consultation des Secrets...</p>
                  </motion.div>
                )}
                {userPM !== null && !calculating && (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-2">Poids Mystique</p>
                    <div className="text-8xl md:text-9xl font-black text-amber-500 font-amiri leading-none mb-4">{toAr(userPM)}</div>
                    <p className="text-neutral-500 font-medium text-sm">{matchingNames.length} Noms Divins en résonance</p>
                    {matchingNames.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {matchingNames.slice(0, 4).map(n => (
                          <span key={n.id} className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold px-3 py-1 rounded-full font-amiri">
                            {n.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* Search + Grid */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <h3 className="text-3xl font-black text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <span>Le Catalogue Divin</span>
          </h3>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Chercher un Nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNames.map((name) => {
              const isMatch = matchingNames.some(m => m.id === name.id);
              const isExact = userPM === name.abjad;
              return (
                <motion.div
                  key={name.id}
                  layout
                  whileHover={{ y: -6 }}
                  onClick={() => setExpanded(expanded === name.id ? null : name.id)}
                  className={`group relative p-8 rounded-[2.5rem] border cursor-pointer transition-all duration-500 overflow-hidden ${
                    isExact
                      ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_40px_rgba(234,179,8,0.15)]'
                      : isMatch
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-white/5 border-white/5 hover:border-white/15'
                  }`}
                >
                  {isExact && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[8px] font-black uppercase tracking-widest bg-amber-500 text-black px-3 py-1 rounded-full">Résonance Exacte ✦</span>
                    </div>
                  )}

                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-15 transition-opacity text-[6rem] font-amiri leading-none text-amber-500 pointer-events-none">
                    {name.name}
                  </div>

                  <div className="text-center mb-6 relative z-10">
                    <div className="text-5xl md:text-6xl font-amiri text-amber-500 mb-3 leading-tight">{name.name}</div>
                    <div className="text-sm font-black tracking-[0.2em] text-neutral-400 uppercase">{name.transliteration}</div>
                  </div>

                  <div className="relative z-10">
                    <div className="bg-black/30 rounded-2xl p-4 text-center mb-4">
                      <p className="text-neutral-300 text-sm font-medium leading-relaxed">{name.meaning}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Poids Abjad</p>
                        <p className="text-2xl font-black text-amber-500 font-amiri">{toAr(name.abjad)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); saveSecret(name); }}
                        className="p-3 rounded-full border border-white/10 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all group/save"
                      >
                        <Save className="w-4 h-4 text-neutral-500 group-hover/save:text-black transition-colors" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      <ArabicKeyboard
        isOpen={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onInput={(char) => setUserName(prev => prev + char)}
        onBackspace={() => setUserName(prev => prev.slice(0, -1))}
        onClear={() => setUserName('')}
      />
      </div>
    </div>
  );
}


