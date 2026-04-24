"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, LayoutGrid } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Cell = { type: "number" | "arabic"; value: number | string };
type Tableau = Cell[][];

const ARABIC_DIGITS: Record<string, string> = {
  '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
  '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
};

function toArabicNumerals(n: number | string): string {
  return String(n).split('').map(d => ARABIC_DIGITS[d] ?? d).join('');
}

export default function HadakounPage() {
  const [mots, setMots] = useState({ mot_a: '', mot_b: '', mot_c: '' });
  const [tableau, setTableau] = useState<Tableau | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mots.mot_a || !mots.mot_b || !mots.mot_c) return;

    setLoading(true);
    setError('');
    setTableau(null);

    try {
      const res = await fetch('/api/hadakoun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mots)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la génération.');
      
      setTableau(data.tableau);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
      <div className="w-full mb-8">
        <Link href="/khatims" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Retour aux Khatims
        </Link>
      </div>

      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white flex items-center justify-center gap-4">
          <Sparkles className="w-10 h-10 text-[var(--primary)]" />
          Khatim Hadakoun
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Générez un carré magique Hadakoun (3x3 spécial) à partir de trois entités ou noms sacrés.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Formulaire */}
        <div className="lg:col-span-5">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 shadow-2xl backdrop-blur-md sticky top-24">
            <form onSubmit={handleGenerate} className="space-y-6">
              {['mot_a', 'mot_b', 'mot_c'].map((key) => (
                <div key={key} className="space-y-2">
                  <label className="text-neutral-300 font-medium block capitalize">
                    {key === 'mot_a' ? 'Premier Mot' : key === 'mot_b' ? 'Deuxième Mot' : 'Troisième Mot'}
                  </label>
                  <input 
                    type="text" 
                    dir="rtl"
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white text-2xl p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all text-right font-arial"
                    placeholder="...اكتب هنا"
                    value={(mots as any)[key]}
                    onChange={(e) => setMots({ ...mots, [key]: e.target.value })}
                  />
                </div>
              ))}
              
              <button 
                type="submit"
                disabled={loading || !mots.mot_a || !mots.mot_b || !mots.mot_c}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FDE08B] text-[#0B0E14] font-bold text-lg py-4 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 flex justify-center items-center gap-2 uppercase tracking-wide"
              >
                {loading ? 'Calcul matriciel...' : 'Générer le Hadakoun'}
              </button>
            </form>

            {error && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">{error}</div>}
          </div>
        </div>

        {/* Résultat */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[400px]">
          {!tableau && !loading && (
            <div className="text-center text-neutral-600">
              <LayoutGrid className="w-20 h-20 mx-auto opacity-20 mb-4" />
              <p>Remplissez les champs pour voir apparaître le carré mystique Hadakoun.</p>
            </div>
          )}

          {loading && <div className="animate-pulse text-[var(--primary)] font-bold text-xl uppercase tracking-widest">Alchimie des lettres...</div>}

          {tableau && (
            <div className="animate-in fade-in zoom-in duration-500 w-full max-w-md">
              <div className="grid grid-cols-3 gap-2 bg-[rgba(212,175,55,0.2)] p-2 rounded-2xl border border-[rgba(212,175,55,0.3)] shadow-[0_0_50px_rgba(212,175,55,0.15)]">
                {tableau.flat().map((cell, i) => (
                   <div 
                    key={i} 
                    className={`aspect-square flex items-center justify-center rounded-xl font-bold text-base sm:text-2xl transition-colors border shadow-inner ${
                      cell.type === 'arabic' 
                        ? 'bg-[rgba(212,175,55,0.2)] text-[var(--primary)] border-[rgba(212,175,55,0.4)]' 
                        : 'bg-[var(--card-bg)] text-white border-[rgba(255,255,255,0.05)] hover:text-[var(--primary)]'
                    }`}
                  >
                    {cell.type === 'arabic' ? (
                      <span className="font-arabic" style={{ fontFamily: "'Tajawal', sans-serif" }}>{cell.value}</span>
                    ) : (
                      <span className="font-mono">{toArabicNumerals(cell.value)}</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-neutral-500 mt-8 italic">
                Ce carré Hadakoun inclut les mentions sacrées "Allah" et "Kun".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
