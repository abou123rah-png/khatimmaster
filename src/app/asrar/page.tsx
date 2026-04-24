'use client';

import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Coins, 
  Heart, 
  Zap, 
  Sparkles, 
  Lock, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  ArrowRight,
  Star
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    id: 'richesse',
    title: 'Richesse & Ouverture',
    arabic: 'الرزق و الغنى',
    icon: Coins,
    color: 'from-amber-400 to-orange-600',
    description: 'Secrets pour attirer l\'abondance, le succès dans les affaires et l\'ouverture des portes de la subsistance.',
    count: '12 Secrets'
  },
  {
    id: 'sante',
    title: 'Santé & Guérison',
    arabic: 'الشفاء و الصحة',
    icon: Droplets,
    color: 'from-emerald-400 to-teal-600',
    description: 'Recettes spirituelles pour la guérison des maux physiques et occultes, et le renforcement de la vitalité.',
    count: '8 Secrets'
  },
  {
    id: 'protection',
    title: 'Protection & Blindage',
    arabic: 'الحفظ و الحماية',
    icon: ShieldCheck,
    color: 'from-blue-400 to-indigo-600',
    description: 'Blindage contre le mauvais œil, l\'envie (Hassidi) et les attaques mystiques. Sécurisez votre demeure.',
    count: '15 Secrets'
  },
  {
    id: 'amour',
    title: 'Amour & Affection',
    arabic: 'المحبة و القبول',
    icon: Heart,
    color: 'from-rose-400 to-red-600',
    description: 'Secrets pour l\'harmonie dans le couple, le mariage et l\'obtention du respect et de l\'affection (Mahabba).',
    count: '10 Secrets'
  },
  {
    id: 'paix',
    title: 'Paix & Sérénité',
    arabic: 'السكينة و الراحة',
    icon: Wind,
    color: 'from-cyan-400 to-blue-500',
    description: 'Pour apaiser l\'esprit, éloigner le stress et instaurer la paix dans le foyer et au travail.',
    count: '6 Secrets'
  },
  {
    id: 'intelligence',
    title: 'Intelligence & Mémoire',
    arabic: 'الحفظ و الذكاء',
    icon: Zap,
    color: 'from-purple-400 to-fuchsia-600',
    description: 'Développement des facultés intellectuelles, réussite aux examens et mémorisation du Saint Coran.',
    count: '9 Secrets'
  }
];

export default function AsrarPage() {
  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#050709]">
      {/* Mystical Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="relative pt-20 pb-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8"
        >
          <Sparkles className="w-4 h-4" /> Les Trésors de l'Héritage Mystique
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter"
        >
          Les <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-500 to-orange-600">Secrets</span> Sacrés
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-medium"
        >
          Accédez à la connaissance ancestrale pour transformer votre vie. Chaque secret est une clé vers une porte de bien-être.
        </motion.p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <Link href={`/asrar/${cat.id}`}>
                  <div className="h-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 group-hover:bg-white/[0.05] group-hover:border-white/20 overflow-hidden relative">
                    {/* Decorative Background Icon */}
                    <Icon className="absolute -right-8 -top-8 w-40 h-40 opacity-[0.03] group-hover:opacity-[0.05] transition-all duration-500 -rotate-12 group-hover:rotate-0" />
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} p-4 mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-full h-full text-black" />
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] mb-1">{cat.arabic}</p>
                        <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">{cat.title}</h3>
                      </div>
                      
                      <p className="text-neutral-400 text-sm leading-relaxed mb-8 group-hover:text-neutral-300 transition-colors">
                        {cat.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{cat.count}</span>
                        <div className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm">
                          Explorer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Special Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30 p-10 md:p-20 text-center"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
          <Star className="w-12 h-12 text-amber-500 mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Le Secret Ultime de M. Cissé</h2>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto mb-10 italic">
            "La science n'est rien sans la foi et la pureté du cœur. Utilisez ces secrets pour le bien, et l'univers conspirera à votre réussite."
          </p>
          <Link 
            href="/recettes-mystiques"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Voir la Bibliothèque <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
