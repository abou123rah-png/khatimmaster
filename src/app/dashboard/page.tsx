'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, Trash2, Calendar, Tag, Shield, Search, RefreshCcw, 
  Sparkles, BookOpen, User, Flame, Wind, Droplets, Mountain, 
  ChevronRight, Lock, Fingerprint, Star, Plus, CheckCircle2, X,
  Clock, Key, Wand2, Zap, ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { calculateSpiritualProfile, NATURES } from '@/lib/spiritual';
import Link from 'next/link';

interface SavedSecret {
  id: number;
  title: string;
  type: string;
  data: any;
  pm_total: number;
  asma: string;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'khatim': 'amber', 'thalsam': 'violet', 'oracle': 'indigo',
  'zikr': 'emerald', 'profil': 'blue'
};

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [secrets, setSecrets] = useState<SavedSecret[]>([]);
  const [zikrs, setZikrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [spiritualName, setSpiritualName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const fetchUserData = async (userId: string) => {
    setLoading(true);
    try {
      // Fetch Profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      setProfile(prof);
      if (prof) setSpiritualName(prof.spiritual_name || '');

      // Fetch Secrets
      const { data: sec } = await supabase
        .from('saved_secrets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      setSecrets(sec || []);

      // Fetch Zikrs
      const { data: z } = await supabase
        .from('zikr_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_activity', { ascending: false });
      setZikrs(z || []);

    } catch (error) {
      console.error("Erreur de chargement des données", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!session || !spiritualName) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: session.user.id, 
          spiritual_name: spiritualName,
          updated_at: new Date().toISOString()
        });
      
      if (!error) {
        setIsProfileModalOpen(false);
        fetchUserData(session.user.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateZikr = async (zikrId: number, newCount: number) => {
    const { error } = await supabase
      .from('zikr_progress')
      .update({ current_count: newCount })
      .eq('id', zikrId);
    
    if (!error) {
      setZikrs(prev => prev.map(z => z.id === zikrId ? { ...z, current_count: newCount } : z));
    }
  };

  const spiritualData = profile?.spiritual_name ? calculateSpiritualProfile(profile.spiritual_name) : null;

  if (loading && !session) {
    return (
      <div className="min-h-screen bg-[#050709] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6" />
        <p className="text-neutral-600 font-black uppercase tracking-widest text-xs">Ouverture du Sanctuaire...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#050709] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center backdrop-blur-xl shadow-2xl">
          <Lock className="w-16 h-16 mx-auto mb-6 text-amber-500/40" />
          <h2 className="text-3xl font-black mb-4 text-white">Accès Réservé</h2>
          <p className="text-neutral-500 mb-8 font-medium">Vous devez être initié pour accéder à votre sanctuaire personnel.</p>
          <div className="space-y-4">
            <Link href="/login" className="block w-full py-4 bg-amber-500 text-black font-black rounded-2xl hover:scale-105 transition-all">
              SE CONNECTER
            </Link>
            <Link href="/signup" className="block w-full py-4 border border-white/10 text-white font-black rounded-2xl hover:bg-white/5 transition-all">
              CRÉER UN COMPTE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden pb-24">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-4">
              <Shield className="w-4 h-4" /> Sanctuaire de l'Initié
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              Salam, <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">{profile?.spiritual_name || session.user.email.split('@')[0]}</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <User className="w-4 h-4" /> Profil
            </button>
            <button 
              onClick={() => fetchUserData(session.user.id)}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl text-neutral-500 hover:text-white transition-all"
            >
              <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-10 relative overflow-hidden group">
             {spiritualData ? (
               <>
                 <div className={`absolute top-0 right-0 p-8 text-[180px] font-amiri opacity-5 pointer-events-none rotate-12`}>
                   {spiritualData.dominant.arabic}
                 </div>
                 <div className="relative z-10">
                   <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-3xl bg-gradient-to-br ${spiritualData.dominant.gradient} shadow-lg shadow-amber-500/10`}>
                            {spiritualData.dominant.name === 'Feu' && <Flame className="w-8 h-8 text-white" />}
                            {spiritualData.dominant.name === 'Air' && <Wind className="w-8 h-8 text-white" />}
                            {spiritualData.dominant.name === 'Eau' && <Droplets className="w-8 h-8 text-white" />}
                            {spiritualData.dominant.name === 'Terre' && <Mountain className="w-8 h-8 text-white" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Nature Dominante</p>
                          <h3 className="text-3xl font-black text-white">Élément {spiritualData.dominant.name}</h3>
                        </div>
                      </div>
                      
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest">Nom Divin Harmonique</p>
                          <p className="text-lg font-black text-amber-200">{spiritualData.divineName?.name}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-amiri font-bold text-xl">
                          {spiritualData.divineName?.arabic?.charAt(0)}
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                     <div>
                       <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                         Votre vibration numérique est de <span className="text-amber-500 font-bold">{spiritualData.total}</span>. 
                       </p>
                     </div>
                     <div className="bg-black/40 rounded-3xl p-6 border border-white/5 flex justify-between items-center">
                        <div className="space-y-4">
                          <div>
                            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Signe (Bourdj)</span>
                            <span className="text-amber-500 font-black text-sm">{spiritualData.star}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Poids Mystique</span>
                            <span className="text-white font-black text-sm">{spiritualData.total}</span>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Ange Gardien</div>
                           <div className="text-xl font-black text-white">{spiritualData.angel}</div>
                        </div>
                     </div>
                   </div>
                 </div>
               </>
             ) : (
               <div className="h-full flex flex-col items-center justify-center py-12">
                 <Sparkles className="w-12 h-12 text-amber-500/20 mb-6" />
                 <h3 className="text-xl font-bold mb-2">Profil non initialisé</h3>
                 <p className="text-neutral-500 text-sm mb-8">Découvrez votre identité spirituelle unique.</p>
                 <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-8 py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-full"
                 >
                   Initialiser mon Profil
                 </button>
               </div>
             )}
          </div>

          <div className="space-y-6">
            <Link href="/zikr" className="block bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 rounded-[2.5rem] p-8 group hover:scale-[1.02] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Star className="w-6 h-6" />
                </div>
                <Plus className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">Nouveau Zikr</h3>
              <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Lancer une session</p>
            </Link>

            <Link href="/khatims" className="block bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 rounded-[2.5rem] p-8 group hover:scale-[1.02] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <Star className="w-6 h-6" />
                </div>
                <Plus className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">Tracer un Khatim</h3>
              <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">Ouvrir le générateur</p>
            </Link>
          </div>
        </div>

        {/* Zikr Progress Widget */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-black text-neutral-500 uppercase tracking-[0.4em] flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-emerald-500" /> Vos Disciplines (Zikrs)
            </h2>
            <Link href="/zikr-compteur" className="text-[10px] font-black text-neutral-600 hover:text-white uppercase tracking-widest transition-colors">Voir tout</Link>
          </div>
          
          {zikrs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {zikrs.slice(0, 3).map((z) => (
                <div key={z.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-white font-amiri">{z.asma}</h3>
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Cible : {z.target_count}</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateZikr(z.id, z.current_count, z.target_count)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${z.current_count >= z.target_count ? 'bg-emerald-500 text-black' : 'bg-white/5 hover:bg-emerald-500/20 text-emerald-500'}`}
                    >
                      {z.current_count >= z.target_count ? <CheckCircle2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-neutral-600 uppercase">{z.current_count} / {z.target_count}</span>
                    <span className="text-[10px] font-black text-emerald-500">{Math.round((z.current_count / z.target_count) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(z.current_count / z.target_count) * 100}%` }}
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 bg-white/[0.02] border border-dashed border-white/5 rounded-[2.5rem] text-center">
               <Fingerprint className="w-12 h-12 mx-auto mb-4 text-neutral-800" />
               <p className="text-xs font-black text-neutral-600 uppercase tracking-widest">Aucun Zikr actif dans le registre</p>
            </div>
          )}
        </div>

        {/* Archives Section */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div>
              <h2 className="text-xs font-black text-neutral-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                <Book className="w-4 h-4 text-amber-500" /> Vos Archives Mystiques
              </h2>
              <p className="text-neutral-600 text-sm font-medium">Accédez à vos travaux et secrets sauvegardés.</p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input 
                type="text" 
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>
          </div>

          {secrets.length === 0 ? (
            <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/5 rounded-[3rem]">
              <BookOpen className="w-16 h-16 mx-auto mb-6 text-neutral-800" />
              <h3 className="text-xl font-bold text-neutral-600 mb-2">Archives Vierges</h3>
              <p className="text-sm text-neutral-700 max-w-xs mx-auto">Utilisez le bouton d'archivage dans les outils pour sauvegarder vos découvertes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secrets.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())).map((secret) => {
                const color = CATEGORY_COLORS[secret.type] || 'blue';
                return (
                  <motion.div 
                    key={secret.id}
                    layout
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 group hover:border-amber-500/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className={`px-3 py-1 bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 text-[9px] font-black uppercase tracking-widest rounded-full`}>
                        {secret.type}
                      </span>
                      <p className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">
                        {new Date(secret.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <h3 className="text-lg font-black text-white mb-4 group-hover:text-amber-500 transition-colors">{secret.title}</h3>
                    {secret.asma && <p className="text-amber-500/60 font-amiri text-lg mb-4">{secret.asma}</p>}
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                       <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">PM: {secret.pm_total || '-'}</span>
                       <button className="text-[10px] font-black text-amber-500 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-all">
                         Détails <ChevronRight className="w-3 h-3" />
                       </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      {/* End of max-w-7xl wrapper should NOT be here if we have more sections */}


      {/* Profile Update Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsProfileModalOpen(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-lg bg-[#0B0E14] border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-transparent" />
                <h2 className="text-3xl font-black mb-2 text-white">Profil de l'Initié</h2>
                <p className="text-neutral-500 text-sm mb-10 font-medium">Configurez votre identité spirituelle pour activer les outils de résonance.</p>
                
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 block">Nom Spirituel ou Usuel</label>
                    <input 
                      type="text" 
                      value={spiritualName}
                      onChange={(e) => setSpiritualName(e.target.value)}
                      placeholder="Ex: Abdallah, Jean, etc."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
                    />
                    <p className="text-[9px] text-neutral-600 mt-2 italic">Ce nom sera utilisé pour calculer votre PM et votre élément.</p>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsProfileModalOpen(false)}
                      className="flex-1 py-4 border border-white/10 text-neutral-500 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={handleUpdateProfile}
                      className="flex-1 py-4 bg-amber-500 text-black font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                    >
                      Valider
                    </button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
        {/* Active Zikr Section - Pro Max Exclusive */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-rose-500/10 rounded-xl">
               <Zap className="w-5 h-5 text-rose-500" />
             </div>
             <h2 className="text-2xl font-black tracking-tight uppercase">Pratique en Cours</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {zikrs.length > 0 ? (
              zikrs.filter(z => z.status === 'active').map(zikr => (
                <div key={zikr.id} className="relative group bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Fingerprint className="w-12 h-12 text-rose-500" />
                  </div>
                  
                  <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{zikr.title}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-4xl font-black text-white">{zikr.current}</span>
                      <span className="text-neutral-600 font-bold uppercase tracking-widest text-xs">sur {zikr.target}</span>
                    </div>
                    
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(zikr.current / zikr.target) * 100}%` }}
                        className="h-full bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                       <button 
                        onClick={() => handleUpdateZikr(zikr.id, zikr.current + 1)}
                        className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-rose-500/10 hover:border-rose-500/30 transition-all font-black text-[10px] uppercase tracking-widest"
                       >
                         +1 Invoquer
                       </button>
                       <Link 
                        href="/zikr-compteur"
                        className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                       >
                         <ArrowRight className="w-4 h-4" />
                       </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="lg:col-span-3 py-16 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/5 rounded-[3rem]">
                <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center mb-6">
                  <Fingerprint className="w-8 h-8 text-neutral-700" />
                </div>
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-6">Aucun Zikr actif dans votre sanctuaire</p>
                <Link 
                  href="/zikr-compteur"
                  className="px-8 py-4 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  Commencer une Invocaton
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-blue-500/10 rounded-xl">
               <Star className="w-5 h-5 text-blue-500" />
             </div>
             <h2 className="text-2xl font-black tracking-tight uppercase">Outils du Maître</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Oracle Ismou-Allah", desc: "Trouvez votre Nom Divin", href: "/oracle-ismou-allah", icon: Sparkles, color: "amber" },
              { title: "Horloge Sacrée", desc: "Heures Planétaires", href: "/heures-sacrees", icon: Clock, color: "blue" },
              { title: "Bibliothèque Asrar", desc: "Recettes & Secrets", href: "/asrar", icon: Key, color: "purple" },
              { title: "Générateur Khatim", desc: "Carrés Magiques", href: "/khatims", icon: Wand2, color: "emerald" }
            ].map((tool, i) => (
              <Link 
                key={i} 
                href={tool.href}
                className="group p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.05] hover:border-amber-500/30 transition-all duration-500"
              >
                <div className={`w-12 h-12 rounded-2xl bg-${tool.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <tool.icon className={`w-6 h-6 text-${tool.color}-500`} />
                </div>
                <h3 className="text-lg font-black mb-2 group-hover:text-white transition-colors">{tool.title}</h3>
                <p className="text-neutral-600 text-xs font-bold uppercase tracking-widest leading-relaxed">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>


      {/* Profile Initialization Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0B0E14] border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-400" />
              
              <div className="text-center mb-10">
                 <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                   <User className="w-8 h-8 text-amber-500" />
                 </div>
                 <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Configuration Spirituelle</h2>
                 <p className="text-neutral-500 text-sm font-medium italic">Initiez votre identité pour débloquer les calculs de maître.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-4">Votre Prénom de Naissance</label>
                   <input 
                    type="text" 
                    value={formData.spiritual_name}
                    onChange={(e) => setFormData({...formData, spiritual_name: e.target.value})}
                    placeholder="Ex: Abdoulaye"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-4">Prénom de votre Mère</label>
                   <input 
                    type="text" 
                    value={formData.mother_name}
                    onChange={(e) => setFormData({...formData, mother_name: e.target.value})}
                    placeholder="Ex: Fatoumata"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                   />
                </div>
                
                <button 
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="w-full py-5 bg-amber-500 text-black font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : "ACTIVER LE PROFIL SACRÉ"}
                </button>
              </div>

              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}

