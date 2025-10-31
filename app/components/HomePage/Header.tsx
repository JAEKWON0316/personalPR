'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Language, translate } from '../../utils/translations'
import LanguageToggle from '../LanguageToggle'
import { useTheme } from '../../contexts/ThemeContext'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  language: Language
  onScrollTo: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void
}

export default function Header({ language, onScrollTo }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Enhanced glassmorphism header */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-b border-white/20 dark:border-gray-700/30 fixed top-0 left-0 right-0 z-50 shadow-lg shadow-black/5 dark:shadow-black/20 text-sm sm:text-base">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10" />
        
        <div className="relative max-w-screen-xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between py-2 sm:py-4">
            {/* Logo section with enhanced hover effect */}
            <div className="flex items-center">
            <Link href="/" className="group flex items-center transition-all duration-300 hover:scale-105">
  <div
    className="relative inline-flex items-center justify-center"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  >
    {/* 텍스트 */}
    <span
      className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 
                 bg-clip-text text-transparent tracking-tight relative z-10"
    >
      JACK1 AI
    </span>

    {/* Hover 배경 */}
    <div
      className="absolute inset-0 rounded-md scale-0 group-hover:scale-125 transition-all duration-300 origin-center 
                 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 opacity-10 blur-sm"
    />
  </div>
</Link>


            </div>
            
            {/* Navigation and controls */}
            <div className="flex items-center space-x-6">
              {/* Desktop navigation with enhanced hover effects */}
              <nav className="hidden md:flex items-center space-x-4 sm:space-x-8 text-xs sm:text-base">
                {[
                  { href: "#profile", key: "profile" },
                  { href: "#smart-options", key: "smartOptions" },
                  { href: "#history", key: "history" },
                  { href: "#values", key: "values" },
                  { href: "#community", key: "activities" }
                ].map((item) => (
                  <Link 
                    key={item.key}
                    href={item.href} 
                    onClick={(e) => onScrollTo(e, item.href.replace('#', ''))}
                    className="group relative px-4 py-2 font-medium text-gray-700 dark:text-gray-200 transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500"
                  >
                    {translate(item.key as keyof typeof translate, language)}
                    
                    {/* Animated underline */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full" />
                    
                    {/* Subtle background glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 rounded-lg transition-all duration-300 -z-10" />
                  </Link>
                ))}
              </nav>
              
              {/* Enhanced control buttons */}
              <div className="flex items-center space-x-3">
                {/* Modern dark mode toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="relative p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  aria-label="Toggle dark mode"
                >
                  <div className="relative">
                    {isDarkMode ? (
                      <Sun className="w-5 h-5 text-amber-500 transition-transform duration-300 group-hover:rotate-12" />
                    ) : (
                      <Moon className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:-rotate-12" />
                    )}
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 to-blue-400/0 group-hover:from-amber-400/20 group-hover:to-blue-400/20 rounded-xl transition-all duration-300 blur-sm -z-10" />
                </button>
                
                {/* Language toggle with enhanced styling */}
                <div className="relative">
                  <LanguageToggle />
                </div>
                
                {/* Enhanced mobile menu button */}
                <button 
                  className="md:hidden relative p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group" 
                  onClick={toggleMenu}
                >
                  <div className="relative">
                    {isMenuOpen ? (
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 group-hover:rotate-90" />
                    ) : (
                      <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/20 group-hover:to-cyan-400/20 rounded-xl transition-all duration-300 blur-sm -z-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced mobile menu with glassmorphism */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMenu}
            />
            
            {/* Mobile menu */}
            <motion.nav
              className="md:hidden fixed top-20 left-4 right-4 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", damping: 20 }}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10" />
              
              <div className="relative flex flex-col py-2">
                {[
                  { href: "#profile", key: "profile" },
                  { href: "#smart-options", key: "smartOptions" },
                  { href: "#history", key: "history" },
                  { href: "#values", key: "values" },
                  { href: "#community", key: "activities" }
                ].map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      href={item.href}
                      onClick={(e) => { toggleMenu(); onScrollTo(e, item.href.replace('#', '')); }}
                      className="relative block py-4 px-6 text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-white"
                    >
                      <span className="relative z-50">
                        {translate(item.key as keyof typeof translate, language)}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 