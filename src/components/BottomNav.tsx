'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Book, Calculator, Scroll, User } from 'lucide-react';

const navItems = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Oracle', href: '/oracle', icon: Book },
  { name: 'Khatims', href: '/khatims', icon: Calculator },
  { name: 'Zikr', href: '/zikr-or', icon: Scroll },
  { name: 'Profil', href: '/profil-spirituel', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="xl:hidden fixed bottom-0 left-0 w-full bg-[#0b0e14]/90 backdrop-blur-2xl border-t border-white/5 z-50 px-2 pb-safe-area-inset-bottom"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1"
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-amber-500' : 'text-neutral-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-amber-500' : 'text-neutral-500'}`}>
                {item.name}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-1 w-8 h-0.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
