import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Book } from 'lucide-react';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Generate static pages for all 114 surahs to eliminate cold starts
export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    id: (i + 1).toString()
  }));
}

export default async function SouratePage({ params }: Props) {
  const resolvedParams = await params;
  const surahNum = parseInt(resolvedParams.id, 10);
  
  if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
    notFound();
  }


  // Read the txt file
  const filePath = path.join(process.cwd(), 'public', 'coran', 'sourates', `${surahNum}.txt`);
  let verses: string[] = [];
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    verses = fileContent.split('\n').filter(line => line.trim() !== '');
  } catch (err) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center py-10 px-4 sm:px-8 max-w-4xl mx-auto w-full">
      <div className="w-full flex justify-between items-center mb-10">
        <Link 
          href="/coran"
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </Link>
        <div className="bg-[rgba(212,175,55,0.1)] text-[#D4AF37] border border-[rgba(212,175,55,0.3)] px-4 py-2 rounded-full font-bold">
          Sourate {surahNum}
        </div>
      </div>

      {surahNum !== 1 && surahNum !== 9 && (
        <div className="mb-16 mt-4 text-center">
          <p className="text-3xl sm:text-4xl text-[var(--primary)] font-serif whitespace-nowrap" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      <div className="w-full space-y-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 sm:p-12 shadow-2xl">
        {verses.map((verse, index) => (
          <div 
            key={index} 
            className="group flex flex-col md:flex-row gap-6 p-4 rounded-2xl hover:bg-[rgba(255,255,255,0.02)] transition-colors border-b border-transparent hover:border-[rgba(255,255,255,0.05)]"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(212,175,55,0.1)] text-[var(--primary)] border border-[rgba(212,175,55,0.2)] font-mono font-bold">
              {index + 1}
            </div>
            
            <div className="flex-1 text-right" dir="rtl">
              <p className="text-2xl sm:text-3xl text-white font-serif leading-loose hover:text-[var(--primary)] transition-colors duration-300 shadow-sm">
                {verse} <span className="inline-block text-[var(--primary)] opacity-50 select-none mx-2 font-mono text-xl">۝</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 w-full flex justify-between">
        {surahNum > 1 ? (
          <Link href={`/coran/${surahNum - 1}`} className="text-neutral-400 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Sourate précédente
          </Link>
        ) : <div />}
        {surahNum < 114 ? (
           <Link href={`/coran/${surahNum + 1}`} className="text-neutral-400 hover:text-white flex items-center gap-1">
            Sourate suivante <ArrowLeft className="w-4 h-4 rotate-180" />
         </Link>
        ) : <div />}
      </div>

    </div>
  );
}
