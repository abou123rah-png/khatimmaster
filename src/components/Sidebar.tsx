"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Hash, 
  Calculator, 
  Star, 
  Play, 
  Sparkles, 
  Moon, 
  Key, 
  LayoutGrid, 
  Library,
  Heart, 
  Info,
  Menu,
  ChevronRight,
  Zap,
  Book,
  Navigation,
  Calendar,
  Wand2,
  PenTool,
  Clock,
  ShieldCheck,
  Coins,
  UserRoundSearch,
  Scroll
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Soutenir', href: '/soutenir', icon: Heart },
  { name: 'Tracé Sacré', href: '/trace-sacre', icon: PenTool },
  { name: 'Profil Spirituel', href: '/profil-spirituel', icon: UserRoundSearch },
  { name: 'Les Secrets', href: '/asrar', icon: ShieldCheck },
  { name: 'Heures Sacrées', href: '/heures-sacrees', icon: Clock },
  { name: 'Abjad', href: '/code-mystique', icon: Hash },
  { name: 'Khatims', href: '/khatims', icon: Calculator },
  { name: 'Ramli', href: '/ramli', icon: Star },
  { name: 'Thalsams', href: '/thalsam', icon: Wand2 },
  { name: 'Noms Divins', href: '/asmaul-husna', icon: Sparkles },
  { name: 'Le Cosmos', href: '/cosmos', icon: Moon },
  { name: 'Harmonie', href: '/compatibilite', icon: Zap },
  { name: 'Zikr', href: '/zikr-personnel', icon: Key },
  { name: 'Convertisseur', href: '/convertisseur-hijri', icon: Calendar },
  { name: 'Vidéos', href: '/videos', icon: Play },
  { name: 'Bibliothèque', href: '/recettes-mystiques', icon: Library },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:flex fixed left-0 top-0 h-screen w-20 hover:w-64 bg-[rgba(11,14,20,0.8)] backdrop-blur-2xl border-r border-[var(--card-border)] z-[60] flex-col transition-all duration-500 group overflow-hidden">
      {/* Mystical Background Motif */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[var(--primary)] rotate-45" viewBox="0 0 100 100">
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" className="rotate-45" />
        </svg>
      </div>

      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 shrink-0 relative">
        <div className="bg-gradient-to-tr from-[#D4AF37] to-[#FDE08B] p-2 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
          <Moon className="w-6 h-6 text-[#0B0E14]" />
        </div>
        <span className="ml-4 font-bold text-xl tracking-tight text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Khatim<span className="text-[#D4AF37]">Master</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar relative">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`group/link relative flex items-center h-12 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-[rgba(212,175,55,0.1)] text-[var(--primary)]' 
                  : 'text-neutral-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-[var(--primary)] rounded-r-full"
                />
              )}
              
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover/link:scale-110'}`} />
              </div>

              <span className="ml-2 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {link.name}
              </span>

              {isActive && (
                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-1 bg-[var(--primary)] rounded-full shadow-[0_0_8px_var(--primary)]" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Section */}
      <div className="p-4 border-t border-[var(--card-border)] bg-[rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-4 text-neutral-500 group-hover:text-neutral-400 transition-colors">
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden whitespace-nowrap">
            <p className="text-[10px] uppercase tracking-widest font-bold">Version</p>
            <p className="text-xs font-mono text-[var(--primary)]">3.0.0-mystic</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
