'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') ?? '/';

      if (code) {
        // PKCE Flow: Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('Error exchanging code:', error.message);
          router.push(`/login?error=${encodeURIComponent(error.message)}`);
          return;
        }
      }

      // Supabase client automatically handles hash fragments (#access_token=...) 
      // when it initializes. We just need to check if we have a session.
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push(next);
      } else {
        // If no session and no code, maybe the fragment is being processed
        // Wait a small bit for the listener or check if it's already there
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.push(next);
        } else {
          // Final fallback
          setTimeout(() => {
            router.push('/');
          }, 2000);
        }
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-[#d4af37] text-xl font-semibold mb-2">Finalisation de la connexion...</h2>
        <p className="text-gray-400">Veuillez patienter un instant.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#d4af37]">Chargement...</div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
