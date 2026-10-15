'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Heart, Sparkles } from 'lucide-react';
import { IntroScreen } from './components/IntroScreen';
import { HeroSection } from './components/HeroSection';
import { VideoGallery } from './components/VideoGallery';
import { MemoriesSection } from './components/MemoriesSection';
import { siteConfig } from './config/siteConfig';
import { playDrumHit, playSuccessChime, soundManager } from './utils/sound';
import { fireMassiveConfetti, fireHeartConfetti } from './utils/confetti';
import './index.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [muted, setMuted] = useState(true);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    soundManager.init();
    if (!muted) {
      soundManager.playBgMusic();
    }
  }, [muted]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    playSuccessChime();
    fireMassiveConfetti();
    soundManager.playBgMusic();
    setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const newMuted = !prev;
      soundManager.toggleMute();
      return newMuted;
    });
  }, []);

  const handleFinalReveal = useCallback(() => {
    playDrumHit();
    fireHeartConfetti();
    setShowFinalMessage(true);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroScreen key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5, delay: showIntro ? 0 : 0.5 }}
        className="min-h-screen"
      >
        <button
          onClick={toggleMute}
          className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-dark-card border border-dark-border backdrop-blur-md flex items-center justify-center text-white hover:border-neon-purple hover:text-neon-pink transition-all duration-300 shadow-lg"
          aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        <HeroSection key="hero" onRoastClick={() => {}} />

        <VideoGallery key="videos" />

        <MemoriesSection key="memories" />

        <FinalMessageSection 
          key="final" 
          onReveal={handleFinalReveal}
          showFinalMessage={showFinalMessage}
        />
      </motion.div>
    </>
  );
}

function FinalMessageSection({ onReveal, showFinalMessage }: { onReveal: () => void; showFinalMessage: boolean }) {
  const [showHeartfelt, setShowHeartfelt] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);

  useEffect(() => {
    if (showFinalMessage) {
      const timer = setTimeout(() => {
        setShowHeartfelt(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showFinalMessage]);

  useEffect(() => {
    if (showHeartfelt) {
      const timer = setTimeout(() => {
        setShowPunchline(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showHeartfelt]);

  const message = siteConfig.birthdayMessage.replace('{friendName}', siteConfig.friendName);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-purple/5 via-transparent to-neon-pink/5" />
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      >
        {[...Array(30)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: ['#BB86FC', '#FF2D95', '#00FFFF', '#FFEB3B', '#00FF88'][Math.floor(Math.random() * 5)],
              opacity: 0.3,
            }}
            animate={{
              y: [-100, 100],
              opacity: [0, 0.3, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              delay: Math.random() * 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ✨
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <motion.div
          className="inline-flex items-center gap-3 px-6 py-3 bg-dark-card/80 border border-neon-pink/30 rounded-full mb-8 backdrop-blur-md"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(255,45,149,0.2)',
              '0 0 40px rgba(187,134,252,0.4)',
              '0 0 20px rgba(255,45,149,0.2)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            💖
          </motion.span>
          <span className="font-display text-lg font-bold bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
            JOKES ASIDE, YOU'RE ACTUALLY SPECIAL
          </span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          >
            💖
          </motion.span>
        </motion.div>

        <AnimatePresence mode="wait">
          {showHeartfelt && (
            <motion.div
              key="heartfelt"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-dark-card/60 border border-dark-border/50 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.4)]"
            >
              <motion.div
                className="flex items-center justify-center gap-4 mb-8"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-8 h-8 text-neon-pink" />
                <span className="font-display text-2xl font-bold bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
                  A MESSAGE FOR THE LEGEND
                </span>
                <Heart className="w-8 h-8 text-neon-pink" />
              </motion.div>

              <motion.div
                className="prose prose-invert max-w-none text-lg leading-relaxed whitespace-pre-line text-gray-200"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {message.split('\n').map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                    className="mb-4 last:mb-0"
                  >
                    {line}
                  </motion.p>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="mt-8 pt-8 border-t border-dark-border/50 flex items-center justify-center gap-4"
              >
                <span className="font-mono text-neon-yellow">— {siteConfig.senderName}</span>
                <Heart className="w-6 h-6 text-red-400 animate-pulse" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showPunchline && (
            <motion.button
              key="punchline"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -30 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReveal}
              className="mt-12 btn-primary text-xl px-10 py-5 animate-pulse-glow relative overflow-hidden"
            >
              <span className="relative z-10">ONE LAST THING... 👀</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue opacity-20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {showPunchline && (
          <motion.div
            key="punchline-reveal"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-6 text-center"
            onClick={() => window.location.reload()}
            role="dialog"
            aria-modal="true"
            aria-label="Final birthday punchline"
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <motion.span
                className="font-display text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-neon-yellow via-neon-pink to-neon-blue bg-clip-text text-transparent animate-rainbow"
              >
                {siteConfig.finalPunchline}
              </motion.span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-4"
            >
              <Heart className="w-12 h-12 text-red-400 animate-pulse" />
              <Sparkles className="w-12 h-12 text-neon-yellow animate-spin-slow" />
              <Heart className="w-12 h-12 text-neon-pink animate-pulse" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 text-lg text-gray-400 font-mono"
            >
              Click anywhere to restart the chaos 🔄
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default App;