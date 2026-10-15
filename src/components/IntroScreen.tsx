'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { playDrumHit, playErrorBuzz, playSuccessChime } from '@/utils/sound';
import { fireConfetti, fireMassiveConfetti } from '@/utils/confetti';

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [glitch, setGlitch] = useState(false);

  const loadingMessages = siteConfig.loadingMessages;

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            setShowEnterButton(true);
            playSuccessChime();
            fireConfetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
          }, 500);
          return prev;
        }
        playErrorBuzz();
        return prev + 1;
      });
    }, 1200);

    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(glitchInterval);
    };
  }, []);

  const handleEnter = useCallback(() => {
    playDrumHit();
    fireMassiveConfetti();
    setTimeout(() => {
      onComplete();
    }, 800);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-bg overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Birthday intro screen"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-purple/10 via-transparent to-neon-pink/10" />
      
      <motion.div
        className="relative z-10 text-center px-6"
        animate={glitch ? { x: [-2, 2, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8 flex items-center justify-center gap-4"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="text-4xl md:text-6xl"
          >
            🚨
          </motion.div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider animate-rainbow">
            BREAKING NEWS
          </h1>
          <motion.div
            animate={{ rotate: [0, 5, -5, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="text-4xl md:text-6xl"
          >
            🚨
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mb-12 p-6 md:p-8 bg-dark-card/90 border-2 border-neon-purple/50 rounded-2xl max-w-2xl mx-auto shadow-[0_0_40px_rgba(187,134,252,0.3)]"
        >
          <p className="font-display text-2xl md:text-3xl font-bold text-neon-pink mb-4 animate-rainbow">
            AN ABSOLUTE LEGEND WAS BORN TODAY!
          </p>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-mono">
            Scientists have confirmed that today marks another year of this human being's existence. 
            <span className="text-neon-yellow">The world is still recovering.</span>
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loadingStep < loadingMessages.length && (
            <motion.div
              key={loadingStep}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="mb-10 min-h-[80px] flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 text-neon-blue font-mono text-lg"
              >
                <Loader2 className="w-6 h-6 animate-spin text-neon-purple" />
                <span className="typing-animation min-w-[300px] text-left">{loadingMessages[loadingStep]}</span>
              </motion.div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="w-full max-w-md h-2 bg-dark-border rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue rounded-full"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showEnterButton && (
            <motion.button
              key="enter"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -30 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 45, 149, 0.8)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              className="btn-primary text-2xl md:text-3xl px-12 py-6 animate-pulse-glow"
              style={{ boxShadow: '0 0 30px rgba(255, 45, 149, 0.6)' }}
            >
              <Zap className="inline w-8 h-8 mr-3" />
              ENTER AT YOUR OWN RISK 💀
              <Zap className="inline w-8 h-8 ml-3" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showEnterButton ? 1 : 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 flex items-center justify-center gap-4 text-neon-blue/60 font-mono text-sm"
        >
          <kbd className="px-3 py-1 bg-dark-card border border-dark-border rounded">SPACE</kbd>
          <span>or</span>
          <kbd className="px-3 py-1 bg-dark-card border border-dark-border rounded">ENTER</kbd>
          <span>to skip</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.div
          className="w-2 h-2 bg-neon-purple rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-neon-pink rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-neon-blue rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
}