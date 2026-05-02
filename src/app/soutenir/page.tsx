'use client';

import { motion } from 'framer-motion';
import { Heart, Gift, Share2, Users, BookOpen, Mail, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import MysticalShare from '@/components/MysticalShare';

export default function SoutenirPage() {
  const [donateAmount, setDonateAmount] = useState('10');
  const [shared, setShared] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const isPaypalInitialized = useRef(false);

  useEffect(() => {
    if (isPaypalInitialized.current) return;
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=ASiWY400m0UM4y3V7hdpwu7HaQdArgjXaYOLgzolHoyAJw3YN_ZWclFqjbeHy1Xg2o4Yj0QpShLji15-&currency=EUR";
    script.async = true;
    script.onload = () => {
      //@ts-ignore
      if (window.paypal && paypalContainerRef.current && !isPaypalInitialized.current) {
        //@ts-ignore
        window.paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'donate' },
          createOrder: (_: any, actions: any) => {
            const amount = (document.getElementById('donation-amount') as HTMLInputElement)?.value || '10';
            return actions.order.create({ purchase_units: [{ amount: { value: amount, currency_code: 'EUR' } }] });
          },
          onApprove: (_: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert(`جزاك الله خيرًا ${details.payer.name.given_name} ! Que Dieu récompense votre générosité. 🙏`);
            });
          }
        }).render('#paypal-button-container');
        isPaypalInitialized.current = true;
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleShare = () => {
    const shareData = {
      title: 'KhatimMaster Pro Max',
      text: 'Découvrez KhatimMaster, la plateforme de sciences mystiques islamiques la plus complète.',
      url: typeof window !== 'undefined' ? window.location.origin : ''
    };
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
    }
    setShared(true);
  };

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-900/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-green-900/8 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-7xl md:text-9xl mb-8 select-none"
          >
            🤲
          </motion.div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <Sparkles className="w-4 h-4" /> Sadaqa Jariya · خير لك في الآخرة
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8">
            Soutenir <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-500 to-orange-600 italic">KhatimMaster</span>
          </h1>
          <p className="text-neutral-400 text-xl font-medium font-amiri max-w-2xl mx-auto leading-relaxed">
            Votre soutien maintient ces outils <span className="text-amber-400">gratuits</span> pour toute la Oumma. Chaque contribution est une sadaqa dont les fruits vous reviennent jusqu'au Jour dernier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Donation Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500" />

            <div className="p-10 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                  <Gift className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Dons Directs</h2>
                  <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">Sénégal & International</p>
                </div>
              </div>

              {/* Wave / Orange Money */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-orange-500 inline-block" />
                  <span className="w-4 h-4 rounded bg-blue-500 inline-block" />
                  Orange Money · Wave (Sénégal)
                </p>
                <div className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-r from-amber-500 to-orange-500 rounded-[2rem] opacity-20 blur-sm group-hover:opacity-50 transition-opacity" />
                  <div className="relative p-8 rounded-[2rem] bg-black text-center text-amber-500 font-black text-4xl tracking-[0.3em] border border-amber-500/20 shadow-inner">
                    77 226 51 86
                  </div>
                </div>
                <p className="text-[10px] text-center text-neutral-600 font-black uppercase tracking-widest">Transfert au nom du développeur</p>
              </div>

              {/* PayPal */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">PayPal (International)</p>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.2em] block">Montant (EUR)</label>
                  <div className="flex gap-2">
                    {['5','10','20','50'].map(amt => (
                      <button key={amt} onClick={() => setDonateAmount(amt)}
                        className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all border ${donateAmount === amt ? 'bg-amber-500 text-black border-amber-500' : 'bg-black/30 text-neutral-400 border-white/10 hover:border-amber-500/30'}`}>
                        {amt}€
                      </button>
                    ))}
                  </div>
                  <input id="donation-amount" type="number" min="1" value={donateAmount}
                    onChange={e => setDonateAmount(e.target.value)}
                    className="w-full bg-black/40 border-2 border-white/5 focus:border-amber-500/40 rounded-2xl py-4 px-6 text-white text-2xl font-black focus:outline-none transition-all text-center" />
                </div>
                <div id="paypal-button-container" ref={paypalContainerRef} className="w-full relative z-10 min-h-[120px]" />
              </div>
            </div>
          </motion.div>

          {/* Other Ways */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Actions */}
            {[
              {
                icon: Share2, color: 'blue',
                title: 'Partager au Maximum',
                desc: 'Faites connaître KhatimMaster à votre entourage et sur les réseaux sociaux.',
                action: () => setIsShareOpen(true),
                label: shared ? '✓ Merci !' : 'Partager'
              },
              {
                icon: Users, color: 'purple',
                title: 'Inviter des Frères & Sœurs',
                desc: 'Invitez votre cercle sur WhatsApp, Telegram ou par email.',
                action: () => setIsShareOpen(true),
                label: 'Inviter'
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} whileHover={{ y: -4 }}
                  className={`group bg-${item.color}-500/5 border border-${item.color}-500/10 hover:border-${item.color}-500/30 rounded-[2.5rem] p-8 transition-all duration-300 cursor-pointer flex items-center gap-6`}
                  onClick={item.action}
                >
                  <div className={`w-14 h-14 bg-${item.color}-500/10 border border-${item.color}-500/20 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 text-${item.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-black text-lg mb-1">{item.title}</h3>
                    <p className="text-neutral-500 text-sm font-medium">{item.desc}</p>
                  </div>
                  <span className={`text-[10px] font-black text-${item.color}-400 uppercase tracking-widest whitespace-nowrap`}>{item.label}</span>
                </motion.div>
              );
            })}

            {/* Library Link */}
            <Link href="/recettes-mystiques">
              <motion.div whileHover={{ y: -4 }}
                className="group bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30 rounded-[2.5rem] p-8 transition-all duration-300 cursor-pointer flex items-center gap-6">
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-black text-lg mb-1">Explorer la Bibliothèque</h3>
                  <p className="text-neutral-500 text-sm font-medium">Accéder aux manuscrits et secrets partagés gratuitement.</p>
                </div>
                <span className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest">Accéder</span>
              </motion.div>
            </Link>

            {/* Quote */}
            <div className="p-10 bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] text-center flex flex-col items-center gap-6">
              <Heart className="w-8 h-8 text-amber-500/30" />
              <blockquote className="text-xl text-amber-200/60 italic font-amiri leading-relaxed">
                "من دل على خير فله مثل أجر فاعله"
              </blockquote>
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                Celui qui guide vers le Bien a la même récompense que celui qui l'accomplit.
              </p>
            </div>

            {/* Contact */}
            <a href="mailto:cissdoro@gmail.com"
              className="flex items-center justify-center gap-3 w-full py-5 rounded-[2.5rem] bg-gradient-to-r from-green-600 to-emerald-700 text-white font-black text-lg hover:shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] uppercase tracking-[0.2em]">
              <Mail className="w-5 h-5" />
              Partenariat & Contact
            </a>
          </motion.div>
        </div>
      </div>

      <MysticalShare 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Soutenir KhatimMaster"
        text="Découvrez KhatimMaster, la plateforme de sciences mystiques islamiques la plus complète. Soutenez l'innovation spirituelle !"
        url={typeof window !== 'undefined' ? window.location.origin : ''}
      />
    </div>
  );
}
