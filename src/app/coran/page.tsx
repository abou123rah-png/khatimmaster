import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function CoranMenu() {
  const sourates = Array.from({ length: 114 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white flex items-center justify-center gap-4">
          <BookOpen className="w-10 h-10 text-[var(--primary)]" />
          Le Saint Coran
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Lisez et méditez les 114 Sourates du Livre Sacré dans une interface épurée propice à la spiritualité.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
        {sourates.map((num) => (
          <Link
            key={num}
            href={`/coran/${num}`}
            className="group flex flex-col items-center justify-center py-6 px-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[rgba(212,175,55,0.05)] hover:border-[rgba(212,175,55,0.4)] transition-all duration-300 relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-8 h-8 bg-[rgba(212,175,55,0.1)] rounded-bl-full pointer-events-none" />
            <span className="text-2xl font-bold text-[var(--primary)] font-serif mb-1">
              {num.toString().padStart(3, '0')}
            </span>
            <span className="text-neutral-300 font-medium text-sm tracking-wide">
              Sourate {num}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
