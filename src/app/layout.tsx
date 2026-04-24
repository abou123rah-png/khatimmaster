import { Geist, Geist_Mono, Amiri, Reem_Kufi } from 'next/font/google';
import './globals.css';
import ClientWrapper from '@/components/ClientWrapper';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const amiri = Amiri({
  variable: '--font-amiri',
  weight: ['400', '700'],
  subsets: ['arabic'],
});

const reemKufi = Reem_Kufi({
  variable: '--font-reem-kufi',
  subsets: ['arabic'],
});

export const metadata = {
  title: "KhatimMaster Pro Max — Le Sanctuaire des Sciences Mystiques",
  description: "Découvrez l'excellence technologique au service des sciences ancestrales. KhatimMaster par Mr. Cissé : Générateur de Khatims, Carrés Magiques, Géomancie (Ramli) et Secrets Spirituels (Asrar).",
  keywords: "Khatim, Carré Magique, Magie Arabe, Géomancie, Ramli, Secrets Coraniques, Asrar, Mr. Cissé, Spiritualité, Abjad, Islam, Mysticisme",
  authors: [{ name: "Mr. Cissé", url: "mailto:cissdoro@gmail.com" }],
  creator: "Mr. Cissé",
  metadataBase: new URL('https://khatimmaster.vercel.app'),
  verification: {
    google: 'psjdltU-hTgLOZWX6cH7j7DnvWAI8O0BOCSn85NBojw',
  },
  alternates: {
    canonical: 'https://khatimmaster.vercel.app',
  },
  openGraph: {
    title: "KhatimMaster Pro Max — L'Art du Tracé Sacré",
    description: "La plateforme référence pour les sciences mystiques et le tracé de Khatims automatisés.",
    url: "https://khatimmaster.vercel.app",
    siteName: "KhatimMaster",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KhatimMaster Pro Max",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KhatimMaster Pro Max",
    description: "Sciences Mystiques & Tracé de Khatims par Mr. Cissé.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "KhatimMaster Pro Max",
              "operatingSystem": "Web",
              "applicationCategory": "Spiritual/EducationalApplication",
              "description": "Plateforme d'excellence pour les sciences mystiques, le tracé de Khatims et la géomancie.",
              "author": {
                "@type": "Person",
                "name": "Mr. Cissé",
                "jobTitle": "Professeur de Sciences Physiques & Expert en Sciences Mystiques",
                "email": "mailto:cissdoro@gmail.com"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "XOF"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "ratingCount": "1000"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${reemKufi.variable} antialiased bg-[#050709] text-[var(--foreground)] min-h-screen`}
      >
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
