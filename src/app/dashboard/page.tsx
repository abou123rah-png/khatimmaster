'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Trash2, Calendar, Tag, Shield, Search, RefreshCcw, Sparkles, BookOpen } from 'lucide-react';

interface SavedSecret {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Khatims': 'amber', 'Asmaul Husna': 'yellow', 'Ramli': 'orange',
  'Rêves': 'indigo', 'Compatibilité': 'red', 'Zikr': 'emerald',
  'Invocations': 'amber',
};

export default function DashboardPage() {
  const [secrets, setSecrets] = useState<SavedSecret[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchSecrets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/saved-secrets');
      const data = await response.json();
      setSecrets(data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSecrets(); }, []);

  const deleteSecret = async (id: number) => {
    if (!confirm("Supprimer ce secret de votre carnet ?")) return;
    try {
      await fetch(`/api/delete-secret/${id}`, { method: 'DELETE' });
      setSecrets(s => s.filter(x => x.id !== id));
    } catch {}
  };

  const categories = ['Tous', ...new Set(secrets.map(s => s.category))];

  const filteredSecrets = secrets.filter(s =>
    (filter === 'Tous' || s.category === filter) &&
    (s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/8 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
              <Shield className="w-4 h-4" /> Espace Sécurisé & Chiffré
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
              Mon Carnet <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 italic">Secret</span>
            </h1>
            <p className="text-neutral-500 text-lg font-medium mt-4 font-amiri">
              Vos révélations mystiques archivées en toute sécurité.
            </p>
          </div>
          <button onClick={fetchSecrets}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all hover:border-blue-500/30">
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </motion.div>

        {/* Stats Banner */}
        {secrets.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Total Archivé', value: secrets.length, color: 'blue' },
              { label: 'Catégories', value: categories.length - 1, color: 'amber' },
              { label: 'Ce Mois', value: secrets.filter(s => new Date(s.created_at).getMonth() === new Date().getMonth()).length, color: 'emerald' },
              { label: 'Sélection', value: filteredSecrets.length, color: 'indigo' },
            ].map((stat, i) => (
              <div key={i} className={`p-6 rounded-[2rem] bg-${stat.color}-500/5 border border-${stat.color}-500/10`}>
                <p className={`text-4xl font-black text-${stat.color}-500 mb-1`}>{stat.value}</p>
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 w-5 h-5" />
            <input type="text" placeholder="Chercher dans mes archives..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => {
              const color = CATEGORY_COLORS[cat] || 'blue';
              return (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`px-5 py-3 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === cat ? `bg-${color}-500 text-black` : 'bg-white/5 border border-white/10 text-neutral-500 hover:text-white'
                  }`}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6" />
            <p className="text-neutral-600 font-black uppercase tracking-widest text-xs">Ouverture des Archives...</p>
          </div>
        ) : filteredSecrets.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-40 rounded-[3rem] border border-dashed border-white/5 bg-white/[0.02]">
            <BookOpen className="w-20 h-20 mx-auto mb-8 text-neutral-800" />
            <h3 className="text-3xl font-black text-neutral-600 mb-4">Carnet Vierge</h3>
            <p className="text-neutral-700 font-medium max-w-sm mx-auto">
              Utilisez les boutons "Archiver" dans les outils mystiques pour remplir votre carnet secret.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSecrets.map((secret) => {
                const color = CATEGORY_COLORS[secret.category] || 'blue';
                const isExpanded = expanded === secret.id;
                return (
                  <motion.div
                    key={secret.id} layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    className={`group relative bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-${color}-500/20`}
                  >
                    {/* Accent line */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${color}-600 to-${color}-400`} />

                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <span className={`bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5`}>
                          <Tag className="w-3 h-3" /> {secret.category}
                        </span>
                        <button onClick={() => deleteSecret(secret.id)}
                          className="p-2 text-neutral-700 hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className={`text-xl font-black mb-4 text-white group-hover:text-${color}-400 transition-colors leading-tight`}>
                        {secret.title}
                      </h3>

                      <div className="bg-black/30 rounded-[1.5rem] p-5 mb-6 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : secret.id)}>
                        <p className={`text-neutral-400 text-sm leading-relaxed font-medium whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-4'}`}>
                          {secret.content}
                        </p>
                        {!isExpanded && (
                          <span className={`text-[9px] font-black text-${color}-500/40 uppercase tracking-widest mt-2 block`}>
                            Cliquer pour lire la suite ↓
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-black text-neutral-700 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(secret.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </span>
                        <span className={`flex items-center gap-1 text-${color}-500/40`}>
                          <Sparkles className="w-3 h-3" /> Vérifié
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
