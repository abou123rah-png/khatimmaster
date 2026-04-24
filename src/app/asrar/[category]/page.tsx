'use client';

import { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  BookOpen, 
  Zap, 
  Star, 
  Shield,
  Heart,
  Coins,
  Droplets,
  Wind,
  Key
} from 'lucide-react';
import Link from 'next/link';

// ─── DATA GENERATOR ─────────────────────────────────────────────────────────

const SECRETS_DATA: Record<string, any> = {
  richesse: {
    title: 'Richesse & Ouverture',
    arabic: 'الرزق و الغنى',
    icon: Coins,
    color: 'amber',
    intro: 'Attirez la baraka dans vos finances et ouvrez les portes closes du succès.',
    secrets: [
      {
        title: 'Le Zikr de l\'Abondance (Ya Latif)',
        desc: 'Le chiffre 16641 est le poids mystique suprême du nom "Al-Latif". Sa récitation après la prière du Maghrib attire la subsistance de sources inattendues.',
        practice: 'Réciter "Ya Latif" 129 fois ou 16641 fois pour les cas urgents.',
        type: 'Zikr'
      },
      {
        title: 'La Clé de la Sourate Al-Waqi\'ah',
        desc: 'Surnommée la "Sourate de la Richesse". Le Prophète (PSL) a dit quiconque la récite chaque nuit ne connaîtra jamais la pauvreté.',
        practice: 'Lecture quotidienne après la prière de l\'Isha.',
        type: 'Coran'
      },
      {
        title: 'Le Carré de Jupiter (4x4)',
        desc: 'Le Khatim de Jupiter régit l\'expansion, la chance et l\'autorité financière.',
        practice: 'Utiliser le générateur Mourabbah avec votre PM de nom.',
        type: 'Khatim'
      }
    ]
  },
  sante: {
    title: 'Santé & Guérison',
    arabic: 'الشفاء و الصحة',
    icon: Droplets,
    color: 'emerald',
    intro: 'Rétablissez l\'équilibre énergétique et physique par la lumière des noms divins.',
    secrets: [
      {
        title: 'Les 6 Versets de Guérison (Ash-Shifa)',
        desc: 'Ces versets extraits du Saint Coran portent une vibration de restauration cellulaire et spirituelle.',
        practice: 'Réciter sur de l\'eau pure et boire à jeun.',
        type: 'Coran'
      },
      {
        title: 'Le Secret de "Ya Shafi"',
        desc: 'Le nom divin qui guérit. Son poids mystique apporte un soulagement immédiat aux douleurs.',
        practice: 'Réciter "Ya Shafi" 391 fois sur la zone douloureuse.',
        type: 'Zikr'
      }
    ]
  },
  protection: {
    title: 'Protection & Blindage',
    arabic: 'الحفظ و الحماية',
    icon: Shield,
    color: 'blue',
    intro: 'Érigez un rempart infranchissable contre les énergies négatives et l\'envie.',
    secrets: [
      {
        title: 'Le Trône Protecteur (Ayat Al-Kursi)',
        desc: 'Le verset le plus puissant du Coran pour la protection contre les djinns et les entités malveillantes.',
        practice: 'Réciter 7 fois avant de sortir de chez soi.',
        type: 'Coran'
      },
      {
        title: 'Le Blindage des 3 Qul',
        desc: 'La protection quotidienne ultime contre le mauvais œil et la sorcellerie.',
        practice: 'Réciter les Sourates Al-Ikhlas, Al-Falaq et An-Nas 3 fois matin et soir.',
        type: 'Coran'
      },
      {
        title: 'Khatim Moussalas Fermé',
        desc: 'Un carré magique scellé qui emprisonne les énergies négatives à l\'extérieur de votre aura.',
        practice: 'Générer le 3x3 avec un PM de protection.',
        type: 'Khatim'
      }
    ]
  },
  amour: {
    title: 'Amour & Affection',
    arabic: 'المحبة و القبول',
    icon: Heart,
    color: 'rose',
    intro: 'Rayonnez d\'une lumière attractive et harmonisez vos relations.',
    secrets: [
      {
        title: 'Le Secret de "Ya Wadoud"',
        desc: 'Le nom de l\'Amour Pur. Il adoucit les cœurs les plus durs et renforce l\'affection dans le couple.',
        practice: 'Réciter "Ya Wadoud" 400 fois sur un aliment à partager.',
        type: 'Zikr'
      },
      {
        title: 'Le Charme de Yusuf',
        desc: 'Inspiré par la beauté du Prophète Yusuf (AS). Pour obtenir le respect et l\'admiration.',
        practice: 'Réciter le verset 4 de la Sourate Yusuf quotidiennement.',
        type: 'Coran'
      }
    ]
  },
  paix: {
    title: 'Paix & Sérénité',
    arabic: 'السكينة و الراحة',
    icon: Wind,
    color: 'cyan',
    intro: 'Retrouvez le calme intérieur et la paix dans votre foyer.',
    secrets: [
      {
        title: 'Le Nom de la Paix (Ya Salam)',
        desc: 'Éloigne l\'angoisse, le stress et les disputes familiales.',
        practice: 'Réciter "Ya Salam" 131 fois après chaque prière.',
        type: 'Zikr'
      },
      {
        title: 'Apaisement des Cœurs',
        desc: '"N\'est-ce pas par l\'évocation d\'Allah que les cœurs s\'apaisent ?" (Sourate Ar-Ra\'d).',
        practice: 'Méditation sur le verset 28 de la Sourate 13.',
        type: 'Coran'
      }
    ]
  },
  intelligence: {
    title: 'Intelligence & Mémoire',
    arabic: 'الحفظ و الذكاء',
    icon: Zap,
    color: 'purple',
    intro: 'Illuminez votre intellect et facilitez l\'apprentissage des sciences.',
    secrets: [
      {
        title: 'Ouverture de la Mémoire',
        desc: 'Facilite la mémorisation du Coran et des textes complexes.',
        practice: 'Réciter "Ya \'Alim, Ya Hakim" 150 fois avant d\'étudier.',
        type: 'Zikr'
      },
      {
        title: 'Le Secret de l\'Apprentissage',
        desc: '"Nous te ferons réciter, de sorte que tu n\'oublieras pas." (Sourate Al-A\'la).',
        practice: 'Réciter le verset 6 de la Sourate 87 sept fois sur une plume ou un stylo.',
        type: 'Coran'
      }
    ]
  }
};

export default function AsrarCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.category;
  const data = SECRETS_DATA[categoryId];
  const [selectedSecret, setSelectedSecret] = useState<number | null>(null);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050709] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-black mb-4">Catégorie Inconnue</h1>
        <Link href="/asrar" className="text-amber-500 underline">Retour au Hub</Link>
      </div>
    </div>
  );

  const Icon = data.icon;

  // Map color names to Tailwind classes carefully
  const colorMap: Record<string, string> = {
    amber: 'from-amber-400 to-amber-700 text-amber-500 shadow-amber-500/20 bg-amber-500/10 hover:border-amber-500/30',
    emerald: 'from-emerald-400 to-emerald-700 text-emerald-500 shadow-emerald-500/20 bg-emerald-500/10 hover:border-emerald-500/30',
    blue: 'from-blue-400 to-blue-700 text-blue-500 shadow-blue-500/20 bg-blue-500/10 hover:border-blue-500/30',
    rose: 'from-rose-400 to-rose-700 text-rose-500 shadow-rose-500/20 bg-rose-500/10 hover:border-rose-500/30',
    cyan: 'from-cyan-400 to-cyan-700 text-cyan-500 shadow-cyan-500/20 bg-cyan-500/10 hover:border-cyan-500/30',
    purple: 'from-purple-400 to-purple-700 text-purple-500 shadow-purple-500/20 bg-purple-500/10 hover:border-purple-500/30'
  };

  const currentStyles = colorMap[data.color] || colorMap.amber;

  return (
    <div className="min-h-screen pb-24 bg-[#050709] relative overflow-hidden">
      {/* Mystical Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link
            href="/asrar"
            className="group inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-all bg-white/5 px-6 py-2.5 rounded-full border border-white/5"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Retour au Hub</span>
          </Link>
        </motion.div>

        <header className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${currentStyles.split(' ').slice(0, 2).join(' ')} p-6 shadow-2xl ${currentStyles.split(' ').slice(4, 5).join(' ')}`}
          >
            <Icon className="w-full h-full text-black" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-black ${currentStyles.split(' ').slice(2, 3).join(' ')} uppercase tracking-[0.5em] mb-2`}
          >
            {data.arabic}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            {data.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg max-w-xl mx-auto italic"
          >
            "{data.intro}"
          </motion.p>
        </header>

        <div className="grid gap-6">
          {data.secrets.map((secret: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              onClick={() => setSelectedSecret(selectedSecret === idx ? null : idx)}
              className="group cursor-pointer"
            >
              <div className={`relative overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 ${currentStyles.split(' ').slice(6, 7).join(' ')} rounded-[2rem] p-8 transition-all duration-500`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${currentStyles.split(' ').slice(5, 6).join(' ')} ${currentStyles.split(' ').slice(2, 3).join(' ')} group-hover:scale-110 transition-transform`}>
                      {secret.type === 'Zikr' ? <Sparkles className="w-5 h-5" /> : secret.type === 'Coran' ? <BookOpen className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{secret.title}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{secret.type}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: selectedSecret === idx ? 180 : 0 }}
                    className="p-2 rounded-full bg-white/5"
                  >
                    <Key className="w-4 h-4 text-neutral-600" />
                  </motion.div>
                </div>

                <p className="text-neutral-400 leading-relaxed mb-4">
                  {secret.desc}
                </p>

                <AnimatePresence>
                  {selectedSecret === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-6 pt-6 border-t border-white/5`}>
                         <div className={`${currentStyles.split(' ').slice(5, 6).join(' ')} border border-white/10 p-6 rounded-2xl`}>
                            <h4 className={`text-xs font-black ${currentStyles.split(' ').slice(2, 3).join(' ')} uppercase tracking-[0.2em] mb-3 flex items-center gap-2`}>
                              <Zap className="w-4 h-4" /> La Pratique Sacrée
                            </h4>
                            <p className="text-white font-medium text-lg italic leading-relaxed">
                              "{secret.practice}"
                            </p>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] -rotate-45 translate-x-16 -translate-y-16 group-hover:bg-amber-500/5 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Signature */}
        <footer className="mt-24 text-center pb-20">
           <div className="w-12 h-px bg-white/10 mx-auto mb-8" />
           <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.5em]">
             KhatimMaster — © M. Cissé
           </p>
        </footer>
      </div>
    </div>
  );
}
