"use client";

import { Geist, Geist_Mono, Amiri, Reem_Kufi } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Moon, Menu, X, UserPlus, User, LogOut, Sparkles, Play, Mail, Fingerprint } from 'lucide-react';
import { useState, useEffect } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const amiri = Amiri({
  variable: '--font-amiri',
  weight: ['400', '700'],
  subsets: ['arabic'],
});

const reemKufi = Reem_Kufi({
  variable: '--font-reem-kufi',
  subsets: ['arabic'],
});

import Sidebar from '@/components/Sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ logged_in: boolean; username?: string } | null>(null);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(setUser)
      .catch(() => setUser({ logged_in: false }));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Soutenir', href: '/soutenir' },
    { name: 'Abjad', href: '/khatims/1' },
    { name: 'Zikr', href: '/zikr-compteur' },
    { name: 'Khatims', href: '/khatims' },
    { name: 'Clavier', href: '/clavier' },
    { name: 'Coran', href: '/coran' },
    { name: 'Recettes', href: '/recettes-mystiques' },
    { name: 'Ramli', href: '/ramli' },
    { name: 'Rêves', href: '/reve' },
    { name: 'Vidéos', href: '/videos' },
  ];

  return (
    <html lang="fr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${reemKufi.variable} antialiased bg-[#050709] text-[var(--foreground)] min-h-screen flex flex-col`}
      >
        <Sidebar />
        
        <nav className="sticky top-0 z-50 w-full border-b border-[var(--card-border)] bg-[rgba(5,7,9,0.8)] backdrop-blur-xl transition-all h-16 flex items-center xl:pl-20">
          <div className="container mx-auto px-4 md:px-8 flex items-center justify-between pointer-events-auto">
            <Link href="/" className="flex items-center gap-2 group xl:hidden">
              <div className="bg-gradient-to-tr from-[#D4AF37] to-[#FDE08B] p-1.5 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all">
                <Moon className="w-5 h-5 text-[#0B0E14]" />
              </div>
              <span className="font-bold text-xl tracking-wide text-white">Khatim<span className="text-[#D4AF37]">Master</span></span>
            </Link>

            <div className="hidden xl:block">
               <span className="text-sm font-medium text-neutral-500 italic">KhatimMaster Pro Max — <span className="text-amber-500 font-bold">© M. Cissé</span> · Idée Originale &amp; Exclusive</span>
            </div>
            
            <div className="flex items-center gap-3 ml-auto">
              {/* Desktop Auth */}
              <div className="hidden lg:flex items-center gap-3 mr-2">
                {user?.logged_in ? (
                   <>
                     <Link href="/profile" className="flex items-center gap-2 text-sm text-neutral-300 hover:text-[#D4AF37] px-3 py-1.5 rounded-full hover:bg-[rgba(212,175,55,0.1)] transition-all">
                       <User className="w-4 h-4" />
                       <span>{user.username}</span>
                     </Link>
                     <button onClick={handleLogout} className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors">
                       <LogOut className="w-4 h-4" />
                     </button>
                   </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm text-neutral-300 hover:text-[#D4AF37] px-4 py-1.5 transition-colors font-medium">
                      Connexion
                    </Link>
                    <Link href="/signup" className="flex items-center gap-2 bg-[var(--primary)] text-[#0B0E14] px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                      <UserPlus className="w-4 h-4" />
                      <span>S'inscrire</span>
                    </Link>
                  </>
                )}
              </div>

              <Link href="/zikr-compteur" className="hidden sm:flex items-center gap-2 bg-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.2)] border border-[rgba(212,175,55,0.3)] text-[#D4AF37] px-4 py-1.5 rounded-full text-sm font-medium transition-all">
                <Fingerprint className="w-4 h-4" />
                Compteur de Zikr
              </Link>

              <button 
                className="xl:hidden p-2 text-neutral-300 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
        
        <aside className={`fixed inset-0 z-[60] xl:hidden pointer-events-none transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
          <div className={`absolute top-0 right-0 w-[280px] h-full bg-[#050709] border-l border-[var(--card-border)] shadow-2xl p-6 pointer-events-auto transition-transform duration-500 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-end mb-8">
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-neutral-400 hover:text-white">
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="flex flex-col gap-1 mb-8">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 px-3">Navigation</span>
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="flex items-center px-3 py-3 rounded-xl text-neutral-300 hover:text-[var(--primary)] hover:bg-[rgba(212,175,55,0.05)] transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-[var(--card-border)] pt-8 mt-auto">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 block px-3">Compte</span>
              {user?.logged_in ? (
                <div className="space-y-2">
                  <div className="px-3 py-3 text-white font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-[var(--primary)]" />
                    {user.username}
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-3 text-red-400 hover:text-red-300 flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-1">
                  <Link 
                    href="/login" 
                    className="flex items-center justify-center p-3 rounded-xl border border-[var(--card-border)] text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="flex items-center justify-center p-3 rounded-xl bg-[var(--primary)] text-[#0B0E14] font-bold shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>
        
        <div className="flex-1 flex flex-col xl:pl-20 overflow-hidden relative">
          {children}
        </div>
        
        <footer className="border-t border-[var(--card-border)] bg-[#050709] pt-20 pb-10 xl:pl-20">
          <div className="container mx-auto px-4 md:px-8">

            {/* === SIGNATURE OFFICIELLE DE M. CISSÉ === */}
            <div className="relative mb-16 overflow-hidden rounded-[3rem] bg-gradient-to-br from-amber-950/40 via-amber-900/20 to-transparent border border-amber-500/30 p-10 md:p-16 shadow-[0_0_80px_rgba(234,179,8,0.07)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />
              <div className="absolute -right-8 -bottom-8 text-[14rem] opacity-5 font-amiri text-amber-500 pointer-events-none leading-none select-none">✦</div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Colonne gauche : Identité */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase">
                    <Sparkles className="w-4 h-4" /> Propriété Intellectuelle Protégée
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-amber-500/50 uppercase tracking-[0.4em] mb-3">Créateur &amp; Concepteur Exclusif</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                      Mr. <span className="text-amber-500">Cissé</span>
                    </h2>
                    <p className="text-xl font-bold text-amber-400/60 font-amiri italic mt-2">
                      Professeur de Sciences Physiques
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      <span className="text-amber-500 font-black">KhatimMaster</span> est une idée{' '}
                      <span className="text-white font-bold">originale et exclusive</span>, conçue et développée
                      intégralement par M. Cissé, de la première ligne de code jusqu'au dernier pixel.
                      Toute ressemblance avec d'autres plateformes résulte d'une imitation illicite.
                    </p>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      Toute personne se réclamant auteur de cette application ou republiant ses idées
                      sans autorisation écrite engage sa responsabilité légale et morale.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a href="mailto:cissdoro@gmail.com" className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
                      <Mail className="w-4 h-4" /> Contacter l'auteur
                    </a>
                    <a href="https://www.youtube.com/channel/UCBRvEs_CeqKtAHTZHCWe3sg" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full font-black text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-all">
                      <Play className="w-4 h-4" /> Chaîne YouTube
                    </a>
                  </div>
                </div>

                {/* Colonne droite : Anti-Plagiat */}
                <div className="space-y-4">
                  <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20">
                    <p className="text-[10px] font-black text-red-500/70 uppercase tracking-[0.3em] mb-3">⚠ Avertissement Anti-Plagiat</p>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      Des individus mal intentionnés, notamment sur <span className="text-white font-bold">Facebook</span> et
                      les réseaux sociaux, s'approprient frauduleusement les idées, les outils et le contenu de
                      cette plateforme. <span className="text-white font-bold">KhatimMaster est l'œuvre exclusive de M. Cissé.</span>{' '}
                      Ces actes constituent une violation de la propriété intellectuelle.
                    </p>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20">
                    <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] mb-4">✦ Preuve d'Antériorité</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-neutral-500 font-medium">Conception initiale</span>
                        <span className="text-amber-400 font-black">2022</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-neutral-500 font-medium">Version Pro Max</span>
                        <span className="text-amber-400 font-black">2025–2026</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500 font-medium">Contact officiel</span>
                        <span className="text-white font-black text-xs">cissdoro@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-lg font-amiri text-amber-500/60 mb-1" dir="rtl">
                      "من جحد حق أخيه فقد ظلم نفسه"
                    </p>
                    <p className="text-[10px] text-neutral-700 font-black uppercase tracking-widest">
                      Celui qui nie le droit de son frère s'est injustifié envers lui-même.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liens du footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {/* Brand */}
              <div className="space-y-6">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="bg-gradient-to-tr from-[#D4AF37] to-[#FDE08B] p-1.5 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                    <Moon className="w-5 h-5 text-[#0B0E14]" />
                  </div>
                  <span className="font-bold text-xl tracking-wide text-white">Khatim<span className="text-[#D4AF37]">Master</span></span>
                </Link>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  L'excellence technologique au service des sciences ancestrales. Idée originale de M. Cissé, Prof. de Sciences Physiques.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.youtube.com/channel/UCBRvEs_CeqKtAHTZHCWe3sg" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-white/5 bg-white/5 hover:bg-[var(--primary)] hover:text-black transition-all">
                    <Play className="w-4 h-4" />
                  </a>
                  <a href="mailto:cissdoro@gmail.com" className="p-2 rounded-full border border-white/5 bg-white/5 hover:bg-[var(--primary)] hover:text-black transition-all">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Outils */}
              <div className="space-y-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Outils Sacrés</h4>
                <ul className="space-y-3">
                  <li><Link href="/khatims/1" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Abjad &amp; Éléments Pro</Link></li>
                  <li><Link href="/khatims" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Générateur de Khatim</Link></li>
                  <li><Link href="/ramli" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Géomancie Traditionnelle</Link></li>
                  <li><Link href="/zikr-compteur" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Compteur de Zikr</Link></li>
                </ul>
              </div>

              {/* Savoir */}
              <div className="space-y-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Savoir &amp; Études</h4>
                <ul className="space-y-3">
                  <li><Link href="/recettes-mystiques" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Bibliothèque Mystique</Link></li>
                  <li><Link href="/videos" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Vidéos &amp; Tutoriels</Link></li>
                  <li><Link href="/coran" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Secrets du Coran</Link></li>
                  <li><Link href="/reve" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Interprétation des Rêves</Link></li>
                </ul>
              </div>

              {/* Communauté */}
              <div className="space-y-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Communauté</h4>
                <ul className="space-y-3">
                  <li><Link href="/soutenir" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Soutenir le Projet</Link></li>
                  <li><Link href="/signup" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Devenir Initié</Link></li>
                  <li><a href="mailto:cissdoro@gmail.com" className="text-neutral-500 hover:text-[var(--primary)] transition-colors text-sm">Contacter l'Auteur</a></li>
                </ul>
              </div>
            </div>

            {/* Barre de copyright */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-neutral-500 text-[10px] uppercase font-black tracking-widest">
                  © {new Date().getFullYear()} KhatimMaster — Œuvre Originale &amp; Exclusive
                </p>
                <p className="text-amber-600/50 text-[10px] font-black uppercase tracking-widest">
                  Conçu intégralement par <span className="text-amber-500">M. Cissé, Professeur de Sciences Physiques</span> · cissdoro@gmail.com
                </p>
              </div>
              <div className="flex gap-4 text-[10px] uppercase font-black tracking-widest">
                <span className="text-amber-600/40">Propriété Intellectuelle Protégée</span>
                <span className="text-neutral-700">·</span>
                <span className="text-amber-600/40">Tout Plagiat Sera Signalé</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
