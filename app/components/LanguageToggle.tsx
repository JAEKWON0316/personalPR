'use client';

import { useContext, useState } from 'react';
import { LanguageContext, type Language } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const languages: { value: Language; label: string; flag: string }[] = [
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'zh', label: '中文', flag: '🇨🇳' }
];

export default function LanguageToggle() {
  const context = useContext(LanguageContext);
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!context) return null;
  const { language, setLanguage } = context;

  const currentLanguage = languages.find(lang => lang.value === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Main toggle button with glassmorphism */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        aria-label="Change language"
      >
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
            {currentLanguage?.flag}
          </span>
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/20 group-hover:to-cyan-400/20 rounded-xl transition-all duration-300 blur-sm -z-10" />
      </button>

      {/* Enhanced dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              className="absolute top-full mt-2 right-0 min-w-[160px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl z-50 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, type: "spring", damping: 20 }}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10" />
              
              <div className="relative py-2">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.value}
                    onClick={() => handleLanguageChange(lang.value)}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-all duration-300 group ${
                      language === lang.value 
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30' 
                        : 'hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 dark:hover:from-blue-500/20 dark:hover:to-cyan-500/20'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className={`font-medium text-sm ${
                        language === lang.value 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500' 
                          : 'text-gray-700 dark:text-gray-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500'
                      }`}>
                        {lang.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {lang.value.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Selection indicator */}
                    {language === lang.value && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                      />
                    )}
                    
                    {/* Left border accent */}
                    {language === lang.value && (
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
