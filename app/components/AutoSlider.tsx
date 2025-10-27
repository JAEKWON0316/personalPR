'use client'

import { useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface AutoSliderProps {
  children: ReactNode[];
  interval?: number;
  showProgress?: boolean;
  allowPause?: boolean;
}

export default function AutoSlider({ 
  children, 
  interval = 4000, 
  showProgress = true,
  allowPause = true 
}: AutoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [children.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [children.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / interval) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        nextSlide();
      }
    };

    const progressTimer = setInterval(updateProgress, 50);
    return () => clearInterval(progressTimer);
  }, [isPlaying, isHovered, interval, nextSlide]);

  // Auto-slide timer
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(nextSlide, interval);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interval, nextSlide, isPlaying, isHovered]);

  // Pause on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startTimeRef.current = Date.now();
  };

  return (
    <div 
      className="relative w-full h-full group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main slider container */}
      <div className="overflow-hidden relative h-full rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.7,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute inset-0"
          >
            {children[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced navigation buttons */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white/30 dark:hover:bg-gray-800/30 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="이전 슬라이드"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white drop-shadow-sm" />
      </motion.button>
      
      <motion.button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white/30 dark:hover:bg-gray-800/30 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="다음 슬라이드"
      >
        <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white drop-shadow-sm" />
      </motion.button>

      {/* Play/Pause button */}
      {allowPause && (
        <motion.button
          onClick={togglePlayPause}
          className="absolute top-4 right-4 bg-black/20 dark:bg-white/20 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-black/30 dark:hover:bg-white/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? "슬라이드 일시정지" : "슬라이드 재생"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white dark:text-gray-800 drop-shadow-sm" />
          ) : (
            <Play className="w-4 h-4 text-white dark:text-gray-800 drop-shadow-sm" />
          )}
        </motion.button>
      )}

      {/* Progress bar */}
      {showProgress && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            style={{ width: `${progress}%` }}
            initial={{ width: "0%" }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      {/* Modern indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/20 dark:bg-white/20 backdrop-blur-xl rounded-full px-4 py-2 border border-white/30 dark:border-gray-700/30">
        {children.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className="relative group"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`${index + 1}번 슬라이드로 이동`}
          >
            {/* Indicator dot */}
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white shadow-lg shadow-white/50'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
            
            {/* Active indicator ring */}
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 w-2 h-2 rounded-full border-2 border-white/60"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            {/* Hover tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              슬라이드 {index + 1}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 bg-black/20 dark:bg-white/20 backdrop-blur-xl rounded-full px-3 py-1 border border-white/30 dark:border-gray-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white dark:text-gray-800 text-sm font-medium drop-shadow-sm">
          {currentIndex + 1} / {children.length}
        </span>
      </div>

      {/* Hover overlay for better button visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
    </div>
  );
}