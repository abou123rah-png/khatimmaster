'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Article {
  title: string;
  content: string;
  filename: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.slug) return;

    fetch(`/api/article/${params.slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Article introuvable");
        return res.json();
      })
      .then(setArticle)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" />
        <p className="text-white text-lg animate-pulse">Dévoilement des secrets de l'article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oups !</h2>
          <p className="text-neutral-400 mb-8">{error || "Cet article a disparu dans les limbes mystiques."}</p>
          <button 
            onClick={() => router.back()}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-bold transition-all border border-white/10"
          >
            Retourner à la bibliothèque
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Sticky Back Button for Desktop */}
      <div className="fixed top-8 left-8 z-[100] hidden xl:block">
        <Link 
          href="/recettes-mystiques"
          className="flex items-center gap-2 p-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl text-neutral-400 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all shadow-2xl group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="pr-2 font-bold text-sm">Bibliothèque</span>
        </Link>
      </div>
      {/* Hero Header */}
      <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f16]/50 to-[#0a0f16]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a0f16] to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <Link 
            href="/recettes-mystiques"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-[var(--primary)] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Bibliothèque Mystique
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-extrabold text-white mb-8 tracking-tight"
          >
            {article.title}
          </motion.h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-400 text-sm">
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <User className="w-4 h-4 text-[var(--primary)]" />
              Par KhatimMaster
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Calendar className="w-4 h-4 text-[var(--primary)]" />
              Publié récemment
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Clock className="w-4 h-4 text-[var(--primary)]" />
              ~ 5 min de lecture
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[40px] p-8 sm:p-16 shadow-2xl backdrop-blur-2xl prose prose-invert prose-gold prose-lg max-w-none"
        >
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
          
          <hr className="my-16 border-white/10" />
          
          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--primary)] to-amber-500 flex items-center justify-center font-bold text-black border-2 border-white/20">
                KM
              </div>
              <div className="text-left">
                <p className="text-white font-bold leading-none">Équipe KhatimMaster</p>
                <p className="text-neutral-500 text-sm">Conservation du savoir traditionnel</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-white font-bold transition-all border border-white/10">
                <Share2 className="w-4 h-4" /> Partager
              </button>
              <button className="flex items-center gap-2 bg-[var(--primary)] text-black px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[var(--primary)]/20">
                <Sparkles className="w-4 h-4" /> Soutenir
              </button>
            </div>
          </div>
        </motion.article>
        
        {/* Navigation Section */}
        <div className="mt-16 flex justify-between">
           <Link 
            href="/recettes-mystiques"
            className="flex items-center gap-3 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl hover:border-[var(--primary)] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Retour à la</p>
              <p className="text-sm text-white font-bold">La Bibliothèque</p>
            </div>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .markdown-content h1 { font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 2rem; border-bottom: 2px solid var(--primary); padding-bottom: 1rem; }
        .markdown-content h2 { font-size: 2rem; font-weight: 700; color: #D4AF37; margin-top: 3rem; margin-bottom: 1.5rem; }
        .markdown-content h3 { font-size: 1.5rem; font-weight: 600; color: white; margin-top: 2rem; }
        .markdown-content p { font-size: 1.125rem; line-height: 1.8; color: #cbd5e1; margin-bottom: 1.5rem; }
        .markdown-content strong { color: white; font-weight: 700; }
        .markdown-content em { color: #94a3b8; font-style: italic; }
        .markdown-content ul, .markdown-content ol { margin-bottom: 2rem; padding-left: 1.5rem; }
        .markdown-content li { margin-bottom: 0.75rem; color: #cbd5e1; }
        .markdown-content blockquote { border-left: 4px solid var(--primary); padding-left: 1.5rem; margin: 2rem 0; font-style: italic; color: #94a3b8; background: rgba(212,175,55,0.05); padding: 1.5rem; border-radius: 0 1.5rem 1.5rem 0; }
        .markdown-content code { background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 0.4rem; font-size: 0.9rem; color: #f472b6; }
        .markdown-content pre { background: #010409; padding: 1.5rem; border-radius: 1.5rem; overflow-x: auto; border: 1px solid #30363d; margin: 2rem 0; }
        .markdown-content img { border-radius: 2rem; margin: 2.5rem 0; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
      `}</style>
    </div>
  );
}
