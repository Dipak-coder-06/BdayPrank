'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, type KeyboardEvent, type MouseEvent } from 'react';
import { X, ChevronLeft, ChevronRight, Expand, Heart, MessageSquare, Star, Image, Loader2 } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { playCartoonBoing, playRecordScratch } from '@/utils/sound';
import { fireConfettiBurst } from '@/utils/confetti';

interface MemoriesSectionProps {
  className?: string;
}

export function MemoriesSection({ className = '' }: MemoriesSectionProps) {
  const photos = siteConfig.friendPhotos;
  const captions = siteConfig.memoryCaptions;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set(photos.map((_, i) => i)));

  const handleImageLoad = useCallback((index: number) => {
    setLoadingImages(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }, []);

  const handleImageError = useCallback((index: number) => {
    setImageErrors(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setLoadingImages(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }, []);

  const handleExpand = useCallback((index: number) => {
    playCartoonBoing();
    fireConfettiBurst(0.5, 0.5, '#BB86FC');
    setExpandedIndex(index);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleClose = useCallback(() => {
    playRecordScratch();
    setExpandedIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const handlePrev = useCallback(() => {
    playCartoonBoing();
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
  }, []);

  const handleNext = useCallback(() => {
    playCartoonBoing();
    setCurrentIndex(prev => (prev + 1) % photos.length);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleExpand(index);
    }
  }, [handleExpand]);

  const handleDotClick = useCallback((i: number) => {
    playCartoonBoing();
    setCurrentIndex(i);
  }, []);

  const placeholderSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%231E1E2E' width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='16' fill='%23666'%3EImage not found%3C/text%3E%3C/svg%3E";

  return (
    <section className={`py-20 px-6 ${className}`} id="memories">
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
          📸 THE PHOTO RECEIPTS
        </motion.h2>
        <p className="text-center text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
          Eight highly official records of Shivam being the main character. The committee reviewed every pose
          and concluded: confidence is unlimited, filter budget is thriving, and the birthday legend is under investigation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => handleExpand(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, index)}
              aria-label={`View memory ${index + 1}: ${captions[index]}`}
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-dark-card border border-dark-border shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                {loadingImages.has(index) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-card">
                    <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
                  </div>
                )}
                
                <motion.img
                  src={imageErrors.has(index) ? placeholderSrc : photo}
                  alt={`Memory ${index + 1}: ${captions[index]}`}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${loadingImages.has(index) ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                >
                  <div className="w-full">
                    <motion.p
                      className="text-sm md:text-base font-medium text-white mb-1 leading-tight"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {captions[index]}
                    </motion.p>
                    <motion.div
                      className="flex items-center gap-2 text-white/70 text-xs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Expand className="w-4 h-4" />
                      <span>Click to expand</span>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-3 left-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="px-3 py-1 bg-neon-purple/90 text-black text-xs font-bold rounded-full">
                    EXHIBIT #{index + 1}
                  </span>
                </motion.div>

                <motion.div
                  className="absolute top-3 right-3 flex gap-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-neon-pink transition-colors"
                    aria-label="React with heart"
                  >
                    <Heart className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-neon-blue transition-colors"
                    aria-label="Add comment"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-neon-yellow transition-colors"
                    aria-label="Mark as favorite"
                  >
                    <Star className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {expandedIndex !== null && (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
              onClick={handleClose}
              role="dialog"
              aria-modal="true"
              aria-label="Expanded memory view"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative max-w-5xl w-full max-h-[90vh]"
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              >
                <button
                  onClick={handleClose}
                  className="absolute -top-14 right-0 z-10 w-12 h-12 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-white hover:text-neon-pink hover:border-neon-pink transition-all duration-300"
                  aria-label="Close expanded view"
                >
                  <X className="w-6 h-6" />
                </button>

                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-white hover:text-neon-blue hover:border-neon-blue transition-all duration-300 hidden md:flex"
                  aria-label="Previous memory"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="relative aspect-[4/5] max-h-[75vh] rounded-2xl overflow-hidden">
                  {loadingImages.has(currentIndex) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-dark-card z-10">
                      <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
                    </div>
                  )}
                  <motion.img
                    key={currentIndex}
                    src={imageErrors.has(currentIndex) ? placeholderSrc : photos[currentIndex]}
                    alt={`Memory ${currentIndex + 1}: ${captions[currentIndex]}`}
                    className={`w-full h-full object-contain ${loadingImages.has(currentIndex) ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => handleImageLoad(currentIndex)}
                    onError={() => handleImageError(currentIndex)}
                  />
                </div>

                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-white hover:text-neon-blue hover:border-neon-blue transition-all duration-300 hidden md:flex"
                  aria-label="Next memory"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 p-6 bg-dark-card/80 border border-dark-border rounded-2xl backdrop-blur-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-xl font-bold text-neon-pink">
                      EXHIBIT #{currentIndex + 1} / {photos.length}
                    </span>
                    <div className="flex gap-2">
                      {photos.map((_: string, i: number) => (
                        <motion.button
                          key={i}
                          onClick={() => handleDotClick(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            i === currentIndex 
                              ? 'bg-neon-pink scale-125 shadow-[0_0_10px_rgba(255,45,149,0.8)]' 
                              : 'bg-gray-600 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to memory ${i + 1}`}
                          aria-current={i === currentIndex ? 'true' : 'false'}
                        />
                      ))}
                    </div>
                  </div>
                  <motion.p
                    key={currentIndex}
                    className="text-lg md:text-xl text-gray-200 leading-relaxed font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    "{captions[currentIndex]}"
                  </motion.p>
                  <div className="mt-4 flex items-center justify-center gap-4 text-gray-500 text-sm font-mono">
                    <span>📅 Classified</span>
                    <span>🔒 Top Secret</span>
                    <span>😂 Verified Legendary</span>
                  </div>
                </motion.div>

                <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                  <button
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-12 h-12 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
