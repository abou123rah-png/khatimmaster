'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, Trash2, Calendar, Tag, Shield, Search, RefreshCcw, 
  Sparkles, BookOpen, User, Flame, Wind, Droplets, Mountain, 
  ChevronRight, Lock, Fingerprint, Star
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
  const [expandedSecret, setExpandedSecret] = useState<number | null>(null);

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
    try {
      // Fetch Profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(prof);

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

  const spiritualData = profile?.spiritual_name ? calculateSpiritualProfile(profile.spiritual_name) : null;

  if (loading) {
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
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center backdrop-blur-xl">
          <Lock className="w-16 h-16 mx-auto mb-6 text-amber-500/40" />
          <h2 className="text-3xl font-black mb-4 text-white">Accès Réservé</h2>
          <p className="text-neutral-500 mb-8 font-medium">Vous devez être initié pour accéder à votre sanctuaire personnel.</p>
          <Link href="/login" className="block w-full py-4 bg-amber-500 text-black font-black rounded-2xl hover:scale-105 transition-all">
            Se Connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden pb-24">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-4">
              <Shield className="w-4 h-4" /> Sanctuaire de l'Initié
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              Salam, <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">{profile?.spiritual_name || session.user.email.split('@')[0]}</span>
            </h1>
          </div>
          <button 
            onClick={() => fetchUserData(session.user.id)}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-neutral-500 hover:text-white transition-all"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Top Grid : Profile + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Spiritual Profile Card */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-10 relative overflow-hidden group">
             {spiritualData ? (
               <>
                 <div className={`absolute top-0 right-0 p-8 text-[180px] font-amiri opacity-5 pointer-events-none rotate-12`}>
                   {spiritualData.dominant.arabic}
                 </div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-8">
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

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                     <div>
                       <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                         Votre nom porte une vibration de <span className="text-amber-500 font-bold">{spiritualData.totalPm}</span>. 
                         Cette énergie influence votre résonance spirituelle et vos travaux mystiques.
                       </p>
                       <div className="flex gap-2">
                         {spiritualData.decomposition.map((item: any) => (
                           <div key={item.key} className="flex-1">
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${item.percentage}%` }}
                                 className={`h-full bg-gradient-to-r ${NATURES[item.key as keyof typeof NATURES].gradient}`}
                               />
                             </div>
                             <span className="text-[8px] font-black text-neutral-600 uppercase tracking-tighter">{NATURES[item.key as keyof typeof NATURES].name}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Poids Mystique</span>
                          <span className="text-amber-500 font-black text-2xl">{spiritualData.totalPm}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Indice de Nature</span>
                          <span className="text-white font-black text-lg">{spiritualData.natureIndex}</span>
                        </div>
                     </div>
                   </div>
                 </div>
               </>
             ) : (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                 <User className="w-16 h-16 text-neutral-800 mb-4" />
                 <h3 className="text-xl font-bold text-neutral-500 mb-2">Profil Incomplet</h3>
                 <p className="text-sm text-neutral-600 max-w-xs mb-6">Ajoutez votre nom spirituel pour révéler votre nature élémentaire.</p>
                 <Link href="/profil-spirituel" className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                   Compléter mon profil
                 </Link>
               </div>
             )}
          </div>

          {/* Quick Stats Column */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 group hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{secrets.length}</p>
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Secrets Archivés</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 group hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white">{zikrs.length}</p>
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Zikrs en cours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zikr Progress Widget */}
        {zikrs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xs font-black text-neutral-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-emerald-500" /> Suivi de Progression Zikr
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {zikrs.slice(0, 3).map((z) => (
                <div key={z.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-white font-amiri">{z.asma}</h3>
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Cible : {z.target_count}</p>
                    </div>
                    <span className="text-emerald-500 font-black">{Math.round((z.current_count / z.target_count) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(z.current_count / z.target_count) * 100}%` }}
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
