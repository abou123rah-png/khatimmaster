import { Metadata } from 'next';

const SECRETS_META: Record<string, any> = {
  richesse: {
    title: 'Secrets de Richesse & Ouverture Spirituelle',
    description: 'Découvrez les secrets mystiques pour attirer l\'abondance, le succès dans les affaires et l\'ouverture des portes du bonheur.',
  },
  sante: {
    title: 'Secrets de Santé & Guérison Divine',
    description: 'Recettes spirituelles et Zikrs pour la guérison des maux physiques et la protection de la santé.',
  },
  protection: {
    title: 'Secrets de Protection & Blindage Mystique',
    description: 'Protégez-vous contre le mauvais œil, l\'envie et les attaques négatives grâce au blindage spirituel.',
  },
  amour: {
    title: 'Secrets d\'Amour & Harmonie des Cœurs',
    description: 'Améliorez vos relations, attirez l\'affection et vivez en harmonie grâce aux secrets de Mahabba.',
  },
  paix: {
    title: 'Secrets de Paix & Sérénité Intérieure',
    description: 'Retrouvez le calme, éloignez l\'anxiété et instaurez la paix dans votre foyer par la lumière divine.',
  },
  intelligence: {
    title: 'Secrets d\'Intelligence & Mémoire Vive',
    description: 'Boostez vos capacités intellectuelles et facilitez l\'apprentissage des sciences et du Coran.',
  },
};

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = params.category;
  const data = SECRETS_META[category] || { title: 'Secret Mystique', description: 'Découvrez les profondeurs des sciences ancestrales.' };

  return {
    title: `${data.title} — KhatimMaster Pro Max`,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [`/asrar-${category}.png`],
    },
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
