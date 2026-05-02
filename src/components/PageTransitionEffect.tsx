"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransitionEffect() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Déclenche l'effet mystique à chaque changement de route
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, 1500); // L'effet dure 1.5s pour bien s'estomper

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="mystic-transition"
          className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* Flash type "Éclair doré" en fond */}
          <motion.div
            initial={{ opacity: 0.8, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent mix-blend-screen"
          />
          
          {/* Géométrie sacrée filigrane */}
          <motion.div
            initial={{ scale: 0.8, rotate: -45, opacity: 0 }}
            animate={{ scale: 1.1, rotate: 0, opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Rub El Hizb / Etoile Islamique à 8 branches */}
            <svg viewBox="0 0 100 100" className="w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] text-amber-500/[0.03] drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]">
               <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="2" />
               <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(45 50 50)" />
               <circle cx="50" cy="50" r="10" fill="currentColor" className="opacity-50" />
            </svg>

            {/* Bismillah en calligraphie luminescente */}
            <motion.div 
               className="absolute text-5xl md:text-8xl text-amber-500/20 font-arabic tracking-widest drop-shadow-[0_0_40px_rgba(245,158,11,0.5)]"
               initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.9 }}
               animate={{ opacity: [0, 0.5, 0], filter: ['blur(20px)', 'blur(0px)', 'blur(10px)'], scale: [0.9, 1, 1.1] }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
            >
               بسم الله الرحمن الرحيم
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
