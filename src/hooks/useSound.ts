"use client";

import { useCallback, useEffect, useRef } from 'react';

const SOUNDS = {
  woosh: 'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3',
  magic: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-marimba-glissando-2349.mp3',
  sparkle: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-sparkle-whoosh-2350.mp3',
  click: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3'
};

export function useSound() {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Preload sounds
    Object.entries(SOUNDS).forEach(([name, url]) => {
      const audio = new Audio(url);
      audio.load();
      audioRefs.current[name] = audio;
    });
  }, []);

  const playSound = useCallback((name: keyof typeof SOUNDS) => {
    const audio = audioRefs.current[name];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.log('Audio play blocked:', err));
    }
  }, []);

  return { playSound };
}
