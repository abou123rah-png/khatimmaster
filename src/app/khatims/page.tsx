import Link from 'next/link';
import { Calculator, Star, Sparkles, ArrowRight, Download } from 'lucide-react';

const KHATIMS = [
  { num: 1,  title: "Analyseur Élémentaire",  subtitle: "Pro Max · Feu, Terre, Air, Eau", badge: "Pro Max", color: "amber",  featured: true },
  { num: 2,  title: "Kountiyou",              subtitle: "Cœur Ouvert · Moussalas",       badge: null,  color: "amber" },
  { num: 3,  title: "Saturne ♄",              subtitle: "Carré 3×3 · Moussalas",         badge: null,  color: "slate" },
  { num: 4,  title: "Jupiter ♃",              subtitle: "Carré 4×4 · Mourabbah",         badge: null,  color: "blue"  },
  { num: 5,  title: "Mars ♂",                 subtitle: "Carré 5×5 · Moukhams",          badge: null,  color: "red"   },
  { num: 6,  title: "Soleil ☉",               subtitle: "Carré 6×6 · Moussadis",         badge: null,  color: "amber" },
  { num: 7,  title: "Vénus ♀",               subtitle: "Carré 7×7 · Moussabbi'a",       badge: null,  color: "pink"  },
  { num: 8,  title: "Mercure ☿",              subtitle: "Carré 8×8 · Mouthammin",        badge: null,  color: "emerald"},
  { num: 9,  title: "Lune ☽",                subtitle: "Carré 9×9 · Mutassi'",          badge: null,  color: "indigo"},
  { num: 10, title: "Harmonie Universelle",   subtitle: "Carré 10×10 · Mu'ashar",        badge: "Rare", color: "amber" },
];

const SPECIALS = [
  { href: "/badouhoun", title: "BADOUHOUN", subtitle: "Koun Fayakoun", desc: "Le scellement divin par les lettres isolées du Coran.", color: "violet" },
  { href: "/hadakoun",  title: "HADAKOUN",  subtitle: "Mystique Supérieur", desc: "Un carré spécial pour les intentions avancées.", color: "amber" },
];

export default function KhatimsMenu() {
  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <Calculator className="w-4 h-4" /> Carrés de Puissance
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
            Générateurs de <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-500 to-orange-600 italic">Khatims</span>
          </h1>
          <p className="text-neutral-500 text-xl font-medium font-amiri max-w-2xl mx-auto">
            Choisissez votre carré magique et générez-le avec votre Poids Mystique. Téléchargez-le en haute définition.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-[10px] font-black text-neutral-600 uppercase tracking-widest">
            <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full"><Download className="w-3 h-3 text-amber-500" /> Export Image Inclus</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full"><Star className="w-3 h-3 text-amber-500" /> Planètes & Éléments</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full"><Sparkles className="w-3 h-3 text-amber-500" /> Chiffres Arabes</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {KHATIMS.map((k) => (
            <Link
              key={k.num} href={`/khatims/${k.num}`}
              className={`group relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden hover:-translate-y-2 ${
                k.featured
                  ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_40px_rgba(234,179,8,0.08)]'
                  : 'bg-white/5 border-white/5 hover:border-amber-500/20'
              }`}
            >
              {k.badge && (
                <span className={`absolute top-4 right-4 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  k.badge === 'Pro Max' ? 'bg-amber-500 text-black' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                }`}>
                  {k.badge}
                </span>
              )}

              <div className="mb-6">
                <span className={`text-5xl md:text-6xl font-black font-amiri text-${k.color}-500 leading-none`}>
                  {k.num}
                </span>
              </div>

              <h3 className="text-xl font-black text-white mb-1 group-hover:text-amber-500 transition-colors">
                {k.title}
              </h3>
              <p className="text-[11px] font-black text-neutral-600 uppercase tracking-widest mb-6">{k.subtitle}</p>

              <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-neutral-700 group-hover:text-amber-500 uppercase tracking-widest transition-all">
                Générer <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* Specials */}
        <div className="border-t border-white/5 pt-16">
          <h2 className="text-[10px] font-black text-amber-500/40 uppercase tracking-[0.4em] mb-10 text-center">Khatims Spéciaux</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SPECIALS.map((s) => (
              <Link key={s.href} href={s.href}
                className={`group relative flex flex-col p-10 rounded-[2.5rem] bg-${s.color}-500/5 border border-${s.color}-500/20 hover:border-${s.color}-500/50 transition-all duration-500 overflow-hidden hover:-translate-y-2`}
              >
                <div className={`absolute -right-4 -bottom-4 text-[8rem] font-reem-kufi text-${s.color}-500/5 pointer-events-none`}>✦</div>
                <span className={`text-4xl font-black text-${s.color}-400 mb-2`}>{s.title}</span>
                <span className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-4">{s.subtitle}</span>
                <p className="text-neutral-500 text-sm font-medium leading-relaxed">{s.desc}</p>
                <div className={`mt-8 flex items-center gap-2 text-[10px] font-black text-${s.color}-500/60 group-hover:text-${s.color}-400 uppercase tracking-widest transition-colors`}>
                  Accéder <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
