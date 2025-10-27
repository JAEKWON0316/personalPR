'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Language, translate } from '../utils/translations'
import LanguageToggle from './LanguageToggle'
import { useTheme } from '../contexts/ThemeContext'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
  language: Language;
}

export default function Navigation({ language }: NavigationProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // 모바일 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  // ESC 키로 모바일 메뉴 닫기
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [isMenuOpen])

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const path = window.location.pathname;
    if (path !== '/') {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const navigationItems = [
    { href: "/#profile", key: "profile", ariaLabel: "프로필 섹션으로 이동" },
    { href: "/#smart-options", key: "smartOptions", ariaLabel: "스마트 옵션 섹션으로 이동" },
    { href: "/#history", key: "history", ariaLabel: "히스토리 섹션으로 이동" },
    { href: "/#values", key: "values", ariaLabel: "가치관 섹션으로 이동" },
    { href: "/#community", key: "activities", ariaLabel: "커뮤니티 섹션으로 이동" }
  ];

  return (
    <>
      {/* Enhanced glassmorphism header */}
      <header 
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-b border-white/20 dark:border-gray-700/30 fixed top-0 left-0 right-0 z-50 shadow-lg shadow-black/5 dark:shadow-black/20"
        role="banner"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10" />
        
        <div className="relative max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
            {/* Logo section with enhanced hover effect */}
          <div className="flex items-center">
              <Link 
                href="/" 
                className="group flex items-center transition-all duration-300 hover:scale-105"
                aria-label="InnoCard 홈으로 이동"
                onClick={handleLogoClick}
              >
                <div className="relative">
              <Image 
                src="/logo.png" 
                    alt="InnoCard 로고" 
                width={160} 
                height={64} 
                priority
                    className="object-contain cursor-pointer transition-all duration-300 group-hover:brightness-110"
              />
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/10 group-hover:to-cyan-400/10 rounded-lg transition-all duration-300 blur-sm" />
          </div>
              </Link>
            </div>
            
            {/* Navigation and controls */}
            <div className="flex items-center space-x-6">
              {/* Desktop navigation with enhanced hover effects */}
              <nav 
                className="hidden md:flex items-center space-x-8" 
                role="navigation"
                aria-label="메인 네비게이션"
              >
                {navigationItems.map((item) => (
                  <Link 
                    key={item.key}
                    href={item.href} 
                    className="group relative px-4 py-2 font-medium text-gray-700 dark:text-gray-200 transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
                    aria-label={item.ariaLabel}
                    onClick={(e) => handleScrollTo(e, item.href.split('#')[1])}
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
              <div className="flex items-center space-x-3" role="toolbar" aria-label="페이지 컨트롤">
                {/* Modern dark mode toggle */}
            <button
              onClick={toggleDarkMode}
                  className="relative p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
                  aria-pressed={isDarkMode}
            >
                  <div className="relative">
              {isDarkMode ? (
                      <Sun className="w-5 h-5 text-amber-500 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
              ) : (
                      <Moon className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:-rotate-12" aria-hidden="true" />
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
                  ref={menuButtonRef}
                  className="md:hidden relative p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
                  onClick={toggleMenu}
                  aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  aria-haspopup="true"
                >
                  <div className="relative">
                    {isMenuOpen ? (
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 group-hover:rotate-90" aria-hidden="true" />
                    ) : (
                      <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
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
              aria-hidden="true"
            />
            
            {/* Mobile menu */}
            <motion.nav
              ref={mobileMenuRef}
              id="mobile-menu"
              className="md:hidden fixed top-20 left-4 right-4 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", damping: 20 }}
              role="navigation"
              aria-label="모바일 메인 네비게이션"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10" />
              
              <div className="relative flex flex-col py-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
              <Link 
                      href={item.href}
                      className="relative block py-4 px-6 text-gray-700 dark:text-gray-200 font-medium transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={toggleMenu}
                      aria-label={item.ariaLabel}
                      tabIndex={isMenuOpen ? 0 : -1}
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