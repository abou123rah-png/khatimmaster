'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, MessageCircle, Link, Send, Check } from 'lucide-react';
import { useState } from 'react';

interface MysticalShareProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
  url: string;
}

export default function MysticalShare({ isOpen, onClose, title, text, url }: MysticalShareProps) {
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-green-600',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
    },
    {
      name: 'Facebook',
      icon: <Link className="w-6 h-6" />,
      color: 'bg-blue-700',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
    },
    {
      name: 'X (Twitter)',
      icon: <Send className="w-6 h-6" />,
      color: 'bg-black',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    },
    {
      name: 'Copier le lien',
      icon: copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />,
      color: 'bg-neutral-700',
      action: () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  ];

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title, text, url }).catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#0D0F14] border border-amber-500/30 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(234,179,8,0.1)]"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <Share2 className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Partager le Secret</h3>
              <p className="text-neutral-500 text-sm mt-2 italic">Diffusez la lumière de KhatimMaster</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {shareOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={opt.action}
                  className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-white/10 transition-all group"
                >
                  <div className={`w-12 h-12 ${opt.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {opt.icon}
                  </div>
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{opt.name}</span>
                </button>
              ))}
            </div>

            {typeof navigator !== 'undefined' && !!navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full mt-6 py-4 rounded-2xl bg-amber-500 text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-amber-500/10"
              >
                Autres options système
              </button>
            )}
            
            <div className="mt-8 text-center">
               <p className="text-[9px] font-black text-amber-500/40 uppercase tracking-[0.3em]">© KhatimMaster · Propriété de M. Cissé</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
