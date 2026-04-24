"use client";

import { useState } from "react";
import { Play, X, Video, Search, ExternalLink, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoData {
  platform: string;
  id: string;
  title: string;
  category: string;
  duration?: string;
}

const videos: VideoData[] = [
  { platform: "youtube",    id: "ckhuxglkJTE", title: "Introduction au Khatim 3×3", category: "Khatims",    duration: "12:34" },
  { platform: "dailymotion", id: "x9pnnvm",   title: "Ayat Al-Kursi : Le Bouclier Divin", category: "Coran", duration: "08:20" },
  { platform: "dailymotion", id: "x9qxw64",   title: "KhatimMaster : Révolution Mystique", category: "Application", duration: "05:15" },
  { platform: "local",      id: "video1",      title: "Technique du Zikr PM · Niveau Avancé", category: "Zikr", duration: "22:00" },
  { platform: "local",      id: "video2",      title: "Secrets des Carrés Magiques Islamiques", category: "Khatims", duration: "31:47" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Khatims: "amber", Coran: "green", Application: "blue", Zikr: "purple"
};

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");

  const categories = ["Tous", ...new Set(videos.map(v => v.category))];

  const filteredVideos = videos.filter(v =>
    (activeCategory === "Tous" || v.category === activeCategory) &&
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEmbedUrl = (v: VideoData) => {
    switch (v.platform) {
      case "youtube":    return `https://www.youtube.com/embed/${v.id}?autoplay=1`;
      case "dailymotion":return `https://www.dailymotion.com/embed/video/${v.id}?autoplay=1`;
      default: return `/api/static/videos/${v.id}.mp4`;
    }
  };

  const getThumbnail = (v: VideoData) => {
    switch (v.platform) {
      case "youtube":    return `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`;
      case "dailymotion":return `https://www.dailymotion.com/thumbnail/video/${v.id}`;
      default: return "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800";
    }
  };

  return (
    <div className="min-h-screen bg-[#050709] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8">
            <Video className="w-4 h-4" /> Enseignements Mystiques
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
            Bibliothèque <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-400 to-amber-500 italic">Vidéo</span>
          </h1>
          <p className="text-neutral-500 text-xl font-medium max-w-2xl mx-auto">
            Tutoriels, démonstrations et enseignements sur les sciences mystiques islamiques.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
            <input
              type="text"
              placeholder="Rechercher un enseignement..."
              className="w-full bg-white/5 border border-white/10 text-white pl-14 pr-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat ? 'bg-amber-500 text-black' : 'bg-white/5 border border-white/10 text-neutral-500 hover:text-white'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video, idx) => {
            const color = CATEGORY_COLORS[video.category] || "amber";
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedVideo(video)}
                className="group cursor-pointer bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-amber-500/30 transition-all duration-500 shadow-xl hover:shadow-2xl"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getThumbnail(video)}
                    alt={video.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-90"
                    onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1589556264800-08ae9e129a8e?auto=format&fit=crop&q=80&w=800"; }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_40px_rgba(234,179,8,0.4)]"
                    >
                      <Play className="w-9 h-9 text-black fill-black translate-x-0.5" />
                    </motion.div>
                  </div>
                  {/* Platform badge */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{video.platform}</span>
                  </div>
                  {/* Duration */}
                  {video.duration && (
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white">
                      {video.duration}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-8">
                  <span className={`bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block`}>
                    {video.category}
                  </span>
                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-amber-500 transition-colors leading-tight">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-neutral-700 group-hover:text-amber-500/60 uppercase tracking-widest transition-colors">
                    <Eye className="w-3 h-3" /> Visionner
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Coming Soon */}
        <div className="mt-20 text-center">
          <span className="flex items-center justify-center gap-3 text-[10px] font-black text-neutral-700 uppercase tracking-[0.4em]">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            Nouveaux enseignements en cours de préparation
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </span>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setSelectedVideo(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-6xl bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            >
              {/* Close */}
              <button onClick={() => setSelectedVideo(null)}
                className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/10 hover:bg-red-500/20 border border-white/10 rounded-full text-white flex items-center justify-center transition-all">
                <X className="w-5 h-5" />
              </button>

              {/* Video Player */}
              <div className="aspect-video w-full bg-black">
                {selectedVideo.platform === 'local' ? (
                  <video controls className="w-full h-full" autoPlay>
                    <source src={getEmbedUrl(selectedVideo)} type="video/mp4" />
                  </video>
                ) : (
                  <iframe src={getEmbedUrl(selectedVideo)} className="w-full h-full border-none"
                    allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                )}
              </div>

              {/* Footer */}
              <div className="p-8 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1">{selectedVideo.category} · {selectedVideo.platform}</p>
                  <h3 className="text-2xl font-black text-white">{selectedVideo.title}</h3>
                </div>
                <a href={getEmbedUrl(selectedVideo)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:border-amber-500/30 transition-all">
                  <ExternalLink className="w-4 h-4" /> Externe
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
