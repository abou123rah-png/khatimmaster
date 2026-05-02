"use client";

import { useState } from "react";

import { LogIn, Mail, Lock, ArrowRight, Star, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Redirect to home or dashboard
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2rem] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--primary)] opacity-10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500 opacity-5 rounded-full blur-[80px]" />

          <div className="text-center mb-8 relative">
            <div className="bg-gradient-to-tr from-[#D4AF37] to-[#FDE08B] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <LogIn className="w-8 h-8 text-[#0B0E14]" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Bon retour</h1>
            <p className="text-neutral-400">Accédez à vos secrets mystiques personnels</p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(255,255,255,0.1)]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0B0E14] px-2 text-neutral-500 font-bold">Ou avec email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-[var(--primary)] transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all placeholder:text-neutral-600"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-500 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-[var(--primary)] transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all placeholder:text-neutral-600"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-in shake duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FDE08B] text-[#0B0E14] font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-[#0B0E14]/30 border-t-[#0B0E14] rounded-full animate-spin" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-neutral-500">
            Nouveau ici ?{" "}
            <Link href="/signup" className="text-[var(--primary)] font-bold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-neutral-600 text-xs uppercase tracking-widest font-bold">
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[var(--primary)]" /> Sécurisé</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[var(--primary)]" /> Privé</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[var(--primary)]" /> Mystique</span>
        </div>
      </div>
    </div>
  );
}
