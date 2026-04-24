'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, FileText, Video, ExternalLink, Search, Filter, Loader2, Sparkles, Flame, Shield, TrendingUp, Sun } from 'lucide-react';

interface Resource {
  title: string;
  slug?: string;
  filename?: string;
  type?: string;
  id?: string;
}

interface ResourcesData {
  articles: { title: string; slug: string; filename: string; order: number }[];
  pdfs: string[];
  videos: { type: string; id: string; title: string }[];
}

const FEATURED_SECRETS = [
  {
    title: "Le Secret de l'Ouverture (Al-Fath)",
    desc: "Une compilation de Zikrs et de Khatims pour débloquer les situations difficiles et attirer la réussite.",
    icon: <Sun className="w-8 h-8 text-amber-500" />,
    tag: "Protection & Fortune",
    color: "amber"
  },
  {
    title: "La Citadelle du Croyant (Al-Hisn)",
    desc: "Méthodes traditionnelles de protection contre les influences négatives et le mauvais œil.",
    icon: <Shield className="w-8 h-8 text-blue-500" />,
    tag: "Haute Protection",
    color: "blue"
  },
  {
    title: "L'Échelle des Decomptes (Al-Abjad)",
    desc: "Guide avancé sur l'utilisation des poids mystiques pour la personnalisation des prières.",
    icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
    tag: "Science Interne",
    color: "emerald"
  }
];

export default function RecettesMystiquesPage() {
  const [data, setData] = useState<ResourcesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'articles' | 'pdf' | 'videos'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    fetch('/api/resources')
      .then(res => {
        if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(err => {
        console.error("Erreur chargement ressources:", err);
        setError(err.message || "Impossible de joindre le serveur mystique.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="text-neutral-400 animate-pulse font-bold tracking-widest uppercase text-xs">Extraction des manuscrits...</p>
      </div>
    );
  }

  const filteredArticles = data?.articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredPdfs = data?.pdfs.filter(p => 
    p.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredVideos = data?.videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-[#050709] text-white">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-4 md:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none opacity-50" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-sm font-black tracking-widest uppercase mb-8"
          >
            <Sparkles className="w-4 h-4" /> La Grande Bibliothèque
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
            Recettes <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600 italic">Mystiques</span>
          </h1>
          
          <p className="text-neutral-500 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Entrez dans le sanctuaire du savoir ancestral. Des milliers d'années de sagesse débloqués pour votre élévation spirituelle.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8 lg:px-12 relative z-10">
        
        {/* Featured Secrets Section */}
        <div className="mb-24">
          <h2 className="text-xs font-black text-amber-500/40 uppercase tracking-[0.4em] mb-10 text-center">Manuscrits Vedettes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_SECRETS.map((secret, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all overflow-hidden"
              >
                <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
                  {secret.icon}
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-${secret.color}-500/10 flex items-center justify-center mb-6 text-${secret.color}-500 shadow-inner`}>
                  {secret.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2 block">{secret.tag}</span>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-500 transition-colors">{secret.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{secret.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-center justify-between sticky top-20 bg-[#050709]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5">
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>Tout</FilterButton>
            <FilterButton active={filter === 'articles'} onClick={() => setFilter('articles')}>Articles</FilterButton>
            <FilterButton active={filter === 'pdf'} onClick={() => setFilter('pdf')}>PDFs</FilterButton>
            <FilterButton active={filter === 'videos'} onClick={() => setFilter('videos')}>Vidéos</FilterButton>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
            <input 
              type="text"
              placeholder="Chercher un secret..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium"
            />
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {/* Articles */}
            {(filter === 'all' || filter === 'articles') && filteredArticles.map((article, idx) => (
              <ResourceCard 
                key={`art-${idx}`}
                title={article.title}
                type="Article de Fond"
                icon={<BookOpen className="w-6 h-6 text-amber-400" />}
                href={`/article/${article.slug}`}
                color="amber"
              />
            ))}

            {/* PDFs */}
            {(filter === 'all' || filter === 'pdf') && filteredPdfs.map((pdf, idx) => (
              <ResourceCard 
                key={`pdf-${idx}`}
                title={pdf.replace('.pdf', '').replace(/_/g, ' ')}
                type="Document Sacré"
                icon={<FileText className="w-6 h-6 text-red-400" />}
                href={`/api/static/uploadPDF/${pdf}`}
                color="red"
                external
              />
            ))}

            {/* Videos */}
            {(filter === 'all' || filter === 'videos') && filteredVideos.map((video, idx) => {
              let videoHref = `/api/static/uploadVIDEO/${video.id}`;
              if (video.type === 'youtube') videoHref = `https://youtube.com/watch?v=${video.id}`;
              
              return (
                <ResourceCard 
                  key={`vid-${idx}`}
                  title={video.title}
                  type="Tutoriel Vidéo"
                  icon={<Video className="w-6 h-6 text-purple-400" />}
                  href={videoHref}
                  color="purple"
                  external
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Error / Empty State */}
        {error && (
          <div className="text-center py-20 bg-red-500/5 rounded-[3rem] border border-red-500/10">
            <p className="text-red-400 font-bold mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-white bg-red-500/20 px-8 py-2 rounded-full font-bold">Réessayer</button>
          </div>
        )}

        {!error && filteredArticles.length === 0 && filteredPdfs.length === 0 && filteredVideos.length === 0 && (
          <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <p className="text-neutral-500 text-lg font-medium italic">Le savoir que vous cherchez reste encore voilé.</p>
            <button 
              onClick={() => {setSearchTerm(''); setFilter('all');}}
              className="mt-6 text-amber-500 hover:text-white font-black uppercase tracking-widest text-xs"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${
        active 
          ? 'bg-amber-500 text-black shadow-[0_10px_30px_rgba(234,179,8,0.3)]' 
          : 'text-neutral-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

function ResourceCard({ title, type, icon, href, color, external = false }: { 
  title: string; 
  type: string; 
  icon: React.ReactNode; 
  href: string;
  color: string;
  external?: boolean;
}) {
  const CardWrapper = external ? 'a' : Link;
  const props = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white/5 border border-white/5 rounded-[2.5rem] hover:border-white/20 hover:bg-white/10 transition-all duration-500 overflow-hidden"
    >
      <CardWrapper {...(props as any)} className="block p-10 h-full">
        <div className={`absolute top-0 right-0 p-8 text-${color}-400 opacity-5 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700`}>
          {icon}
        </div>
        
        <div className="flex flex-col h-full relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
             {icon}
             <span>{type}</span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-8 group-hover:text-amber-500 transition-colors leading-tight">
            {title}
          </h3>
          
          <div className="mt-auto flex items-center justify-between">
             <span className="text-xs font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors duration-500">Découvrir</span>
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                <ExternalLink className="w-4 h-4" />
             </div>
          </div>
        </div>
      </CardWrapper>
    </motion.div>
  );
}
