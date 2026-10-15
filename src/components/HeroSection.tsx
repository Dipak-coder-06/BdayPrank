'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useCallback, type KeyboardEvent } from 'react';
import { Sparkles, Crown, Zap, Heart, Skull } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { playCartoonBoing, playDrumHit } from '@/utils/sound';
import { fireConfetti, fireConfettiBurst } from '@/utils/confetti';

interface HeroSectionProps {
  onRoastClick: () => void;
}

export function HeroSection({ onRoastClick }: HeroSectionProps) {
  const [roastIndex, setRoastIndex] = useState(-1);
  const [avatarScale, setAvatarScale] = useState(1);
  const [showRoast, setShowRoast] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  const handleRoast = useCallback(() => {
    playDrumHit();
    fireConfetti({ particleCount: 100, spread: 60, origin: { y: 0.4 } });
    const randomIndex = Math.floor(Math.random() * siteConfig.roasts.length);
    setRoastIndex(randomIndex);
    setShowRoast(true);
    setAvatarScale(1.2);
    setTimeout(() => setAvatarScale(1), 300);
    setTimeout(() => setShowRoast(false), 5000);
  }, []);

  const handleAvatarClick = useCallback(() => {
    playCartoonBoing();
    setAvatarScale(1.3);
    fireConfettiBurst(0.5, 0.3, '#FF2D95');
    setTimeout(() => setAvatarScale(1), 400);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAvatarClick();
    }
  }, [handleAvatarClick]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-purple-900/10 to-pink-900/10" />
      
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-float"
        style={{ y }}
      />
      <motion.div
        className="absolute top-40 right-10 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-float"
        style={{ y: useTransform(scrollY, [0, 500], [0, -50]) }}
      />
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-neon-blue/10 rounded-full blur-3xl animate-float"
        style={{ y: useTransform(scrollY, [0, 500], [0, 80]) }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 text-center mb-12"
      >
        <motion.span
          className="inline-block px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent font-display text-lg font-bold mb-6"
          animate={{ letterSpacing: ['0.1em', '0.2em', '0.1em'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎂 HAPPY BIRTHDAY 🎂
        </motion.span>
        
        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            background: 'linear-gradient(90deg, #BB86FC, #FF2D95, #00FFFF, #FFEB3B, #00FF88, #BB86FC)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {siteConfig.friendName.toUpperCase()}! 🎉
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        className="relative z-10 mb-12 max-w-2xl mx-auto px-4"
      >
        <motion.p
          className="text-xl md:text-2xl text-gray-300 leading-relaxed"
          animate={{ 
            opacity: [1, 0.7, 1],
            textShadow: ['0 0 10px rgba(255,45,149,0.3)', '0 0 20px rgba(187,134,252,0.5)', '0 0 10px rgba(255,45,149,0.3)']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Another year older. Still waiting for the software update. 📱💾
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        className="relative z-10 mb-12"
        onClick={handleAvatarClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Click the birthday avatar for a surprise"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
              boxShadow: [
                '0 0 40px rgba(187,134,252,0.4)',
                '0 0 60px rgba(255,45,149,0.6)',
                '0 0 40px rgba(187,134,252,0.4)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -inset-4 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue rounded-full blur-2xl opacity-50"
          />
          
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{ transformOrigin: 'center bottom' }}
            className="relative"
          >
            <img
              src={siteConfig.friendPhotos[0]}
              alt={`${siteConfig.friendName}'s birthday avatar`}
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-3xl border-4 border-neon-purple/50 shadow-[0_0_60px_rgba(187,134,252,0.4)] object-cover"
              style={{ transform: `scale(${avatarScale})` }}
            />
            
            <motion.div
              animate={{ 
                y: [-20, -30, -20],
                rotate: [-5, 5, -5],
                opacity: [1, 0.8, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-6 left-1/2 -translate-x-1/2"
            >
              <Crown className="w-16 h-16 text-neon-yellow filter drop-shadow-[0_0_10px_rgba(255,235,59,0.8)] animate-spin-slow" />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, -15, 0],
                x: [-10, 10, -10],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-10 h-10 text-neon-pink animate-pulse-glow" />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, -20, 0],
                x: [10, -10, 10],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4"
            >
              <Zap className="w-10 h-10 text-neon-blue animate-pulse-glow" />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [5, -5, 5],
                opacity: [1, 0.8, 1]
              }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }}
              className="absolute -bottom-4 -right-4"
            >
              <Heart className="w-10 h-10 text-red-400 animate-pulse-glow" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {showRoast && roastIndex >= 0 && (
          <motion.div
            key={roastIndex}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 mb-12 px-4"
          >
            <motion.div
              className="inline-block bg-dark-card/90 border-2 border-neon-pink/50 rounded-2xl p-6 md:p-8 max-w-2xl shadow-[0_0_40px_rgba(255,45,149,0.3)]"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(255,45,149,0.3)',
                  '0 0 40px rgba(255,45,149,0.5)',
                  '0 0 20px rgba(255,45,149,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="flex items-center gap-3 text-neon-pink mb-3"
                animate={{ x: [-5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Skull className="w-6 h-6" />
                <span className="font-display font-bold text-lg">ROAST DELIVERED</span>
                <Skull className="w-6 h-6" />
              </motion.div>
              <motion.p
                className="text-xl md:text-2xl text-white font-medium leading-relaxed"
                animate={{ letterSpacing: ['0', '0.02em', '0'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                "{siteConfig.roasts[roastIndex]}"
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(187, 134, 252, 0.6)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRoast}
        className="relative z-10 btn-primary text-xl px-10 py-5"
        aria-label="Roast the birthday person"
      >
        <Skull className="inline w-6 h-6 mr-2" />
        ROAST MY FRIEND 🔥
        <Skull className="inline w-6 h-6 ml-2" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2"
      >
        <motion.div
          className="w-2 h-2 bg-neon-purple rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-neon-pink rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}
        />
        <motion.div
          className="w-2 h-2 bg-neon-blue rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
        />
      </motion.div>
    </section>
  );
}