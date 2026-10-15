'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { playCartoonBoing } from '@/utils/sound';

interface VideoItem {
  src: string;
  poster: string;
  caption: string;
}

interface VideoGalleryProps {
  videos?: VideoItem[];
  className?: string;
}

export function VideoGallery({ videos = siteConfig.friendVideos, className = '' }: VideoGalleryProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const videoElementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inViewStates = useRef<boolean[]>([]);

  const handlePlay = useCallback((index: number) => {
    playCartoonBoing();
    setPlayingIndex(index);
    setMuted(false);
    videoRefs.current[index]?.play().catch(() => {});
  }, []);

  const handlePause = useCallback((index: number) => {
    videoRefs.current[index]?.pause();
    if (playingIndex === index) {
      setPlayingIndex(null);
    }
  }, [playingIndex]);

  const handleEnded = useCallback((index: number) => {
    if (playingIndex === index) {
      setPlayingIndex(null);
      setMuted(true);
    }
  }, [playingIndex]);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
    videoRefs.current.forEach(v => { if (v) v.muted = !muted; });
  }, [muted]);

  const toggleFullscreen = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    
    if (fullscreenIndex === index) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setFullscreenIndex(null);
    } else {
      video.requestFullscreen().catch(() => {});
      setFullscreenIndex(index);
    }
  }, [fullscreenIndex]);

  // Auto-play when video comes into view
  useEffect(() => {
    if (playingIndex !== null) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement;
            video.muted = true;
            video.play().catch(() => {});
          }
        });
      },
      { threshold: 0.3 }
    );

    videoRefs.current.forEach((video) => {
      if (video && playingIndex === null) {
        observer.observe(video);
      }
    });

    return () => observer.disconnect();
  }, [playingIndex]);

  return (
    <section className={`py-20 px-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <motion.h2
          className="font-display text-4xl md:text-5xl font-bold text-center mb-4 animate-rainbow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          📹 THE VIDEO EVIDENCE ARCHIVE
        </motion.h2>
        <p className="text-center text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
          Classified footage of the birthday legend in their natural habitat. 
          Viewer discretion advised: contains excessive main character energy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, index) => {
            const ref = useRef<HTMLDivElement>(null);
            const isInView = useInView(ref, { once: true, margin: '100px' });
            
            if (!videoElementRefs.current[index]) {
              videoElementRefs.current[index] = ref.current;
            }
            
            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-dark-card border border-dark-border shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    src={video.src}
                    poster={video.poster}
                    preload="auto"
                    playsInline
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    onClick={() => playingIndex === index ? handlePause(index) : handlePlay(index)}
                    onEnded={() => handleEnded(index)}
                  />
                  
                  <AnimatePresence mode="wait">
                    {playingIndex !== index && (
                      <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                      >
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePlay(index)}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-black shadow-[0_0_30px_rgba(187,134,252,0.6)]"
                          aria-label={`Play ${video.caption}`}
                        >
                          <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {playingIndex === index && (
                      <motion.div
                        key="controls"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={toggleMute}
                            className="p-2 text-white/80 hover:text-neon-pink transition-colors"
                            aria-label={muted ? 'Unmute' : 'Mute'}
                          >
                            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </button>
                          <span className="text-sm font-mono text-neon-yellow">{video.caption}</span>
                        </div>
                        <button
                          onClick={() => toggleFullscreen(index)}
                          className="p-2 text-white/80 hover:text-neon-blue transition-colors"
                          aria-label={fullscreenIndex === index ? 'Exit fullscreen' : 'Fullscreen'}
                        >
                          {fullscreenIndex === index ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="absolute top-3 right-3"
                    animate={{ opacity: playingIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="px-2 py-1 bg-neon-pink/90 text-black text-xs font-bold rounded-full animate-pulse-glow flex items-center gap-1">
                      <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                      LIVE
                    </span>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-3 p-4 bg-dark-card/50 border border-dark-border rounded-xl text-center"
                  whileHover={{ y: -4, borderColor: 'rgba(187,134,252,0.5)' }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm text-gray-300 font-mono">{video.caption}</p>
                  <p className="text-xs text-gray-500 mt-1">Click for fullscreen ▶</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {playingIndex !== null && (
            <motion.div
              key="fullscreen-hint"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-dark-card border border-neon-purple/50 rounded-full shadow-[0_0_30px_rgba(187,134,252,0.4)] text-center text-sm text-gray-300"
            >
              Press <kbd className="px-2 py-1 bg-dark-bg border border-dark-border rounded mx-1 font-mono">ESC</kbd> or click □ to exit fullscreen
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}