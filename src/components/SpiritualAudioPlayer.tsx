"use client";

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube, { YouTubeProps } from 'react-youtube';

// TODO: Replace with the actual video ID from KhatimMaster channel containing "Salat 'ala Nabi"
const YOUTUBE_VIDEO_ID = 'ckhuxglkJTE'; 

export default function SpiritualAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    // Auto-hide tooltip after 10 seconds
    const timer = setTimeout(() => setShowTooltip(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    // Optionally set volume to a reasonable level
    event.target.setVolume(50);
  };

  const togglePlay = () => {
    if (!player) return;
    
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
    setShowTooltip(false);
  };

  const toggleMute = () => {
    if (!player) return;
    
    if (isMuted) {
      player.unMute();
    } else {
      player.mute();
    }
    setIsMuted(!isMuted);
  };

  const opts: YouTubeProps['opts'] = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      loop: 1,
      playlist: YOUTUBE_VIDEO_ID, // required for loop to work on single videos
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {/* Hidden YouTube Player */}
      <div className="hidden pointer-events-none">
        <YouTube 
          videoId={YOUTUBE_VIDEO_ID} 
          opts={opts} 
          onReady={onPlayerReady} 
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

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
