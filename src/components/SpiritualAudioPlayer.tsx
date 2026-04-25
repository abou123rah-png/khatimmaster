"use client";

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QURAN_URL = 'https://ia801501.us.archive.org/20/items/ZikrFayda/Zikr_Fayda_Tidjania.mp3'; // Zikr Fayda Tijania - Rhythmic Salawat with Ameen


export default function SpiritualAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(QURAN_URL);
    audioRef.current.loop = true;
    
    // Auto-hide tooltip after 10 seconds
    const timer = setTimeout(() => setShowTooltip(false), 10000);
    return () => {
        clearTimeout(timer);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log('Audio blocked:', err));
    }
    setIsPlaying(!isPlaying);
    setShowTooltip(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-amber-500 text-black px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(234,179,8,0.3)] flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-3 h-3" />
            Salawat & Zikr Sacré
          </motion.div>

        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {isPlaying && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={toggleMute}
            className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-neutral-400 hover:text-white transition-all shadow-xl"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>
        )}

        <button
          onClick={togglePlay}
          className={`
            group relative p-4 rounded-full transition-all duration-500 shadow-2xl overflow-hidden
            ${isPlaying 
              ? 'bg-amber-500 text-black scale-110' 
              : 'bg-white/5 backdrop-blur-xl border border-white/10 text-amber-500 hover:border-amber-500/50'
            }
          `}
        >
          {isPlaying ? (
            <div className="relative z-10 flex items-center gap-2">
              <Pause className="w-5 h-5 fill-current" />
              <div className="flex gap-0.5 items-end h-3">
                {[0.2, 0.5, 0.3, 0.8].map((s, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['20%', '100%', '20%'] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1 bg-black rounded-full"
                  />
                ))}
              </div>
            </div>
          ) : (
            <Play className="w-5 h-5 fill-current relative z-10" />
          )}
          
          {!isPlaying && <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors" />}
          
          {isPlaying && (
            <motion.div
              layoutId="glow"
              className="absolute inset-0 bg-white/20 blur-xl"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </button>
      </div>
    </div>
  );
}
