'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const ARABIC_LETTERS = ['ا', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'];

export default function PageTransitionEffect({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    setShowOverlay(true);
    const timer = setTimeout(() => setShowOverlay(false), 1800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="mystical-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
          >
            {/* Éclairs Mystiques (Lightning) */}
            <motion.div
              animate={{ opacity: [0, 0.8, 0, 1, 0, 0.5, 0] }}
              transition={{ duration: 0.6, times: [0, 0.1, 0.15, 0.2, 0.3, 0.4, 1] }}
              className="absolute inset-0 bg-white"
            />
            
            <motion.div
              animate={{ opacity: [0, 0.4, 0, 0.6, 0] }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="absolute inset-0 bg-amber-500/20"
            />

            {/* Floating Arabic Letters (Asrar) */}
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ 
                  opacity: 0, 
                  x: Math.random() * 1200 - 600, 
                  y: Math.random() * 1000 - 500,
                  scale: 0.5,
                  rotate: Math.random() * 360
                }}
                animate={{ 
                  opacity: [0, 0.6, 0], 
                  scale: [0.5, 2.5, 0.5],
                  y: (Math.random() * -600) - 200,
                  rotate: Math.random() * 720
                }}
                transition={{ duration: 1.6, delay: Math.random() * 0.4, ease: "easeOut" }}
                className="absolute text-amber-500/30 font-arabic text-7xl select-none filter blur-[1px]"
              >
                {ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)]}
              </motion.span>
            ))}

            {/* Signature Centrale Flottante */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: [0.8, 1.1, 1], opacity: [0, 0.4, 0], filter: ["blur(10px)", "blur(0px)", "blur(20px)"] }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="relative"
            >
              <div className="text-amber-500/40 text-[12vw] font-black font-amiri italic tracking-[0.5em] select-none text-center">
                السر العظيم
              </div>
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="absolute inset-0 bg-amber-200 blur-3xl opacity-20"
              />
            </motion.div>

            {/* Cadre de Lumière Sacré */}
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: [0, 0.3, 0], scale: [1.1, 1, 0.9] }}
              transition={{ duration: 1.5 }}
              className="absolute inset-8 border-[1px] border-amber-500/40 rounded-[4rem] shadow-[inset_0_0_100px_rgba(245,158,11,0.1)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
