'use client'

import { useState, useEffect } from 'react'
import { Share2, Copy, Mail, MessageCircle, Link, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Language, translate } from '../utils/translations'

interface ShareButtonProps {
  language: Language
}

interface ShareOption {
  name: string
  icon: React.ReactNode
  action: () => void
  color: string
  bgColor: string
}

export default function ShareButton({ language }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)

  useEffect(() => {
    setCanNativeShare(!!navigator.share)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  const handleNativeShare = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: 'InnoCard - 개인 PR 사이트',
          text: '혁신적인 개인 PR 사이트를 확인해보세요!',
          url: window.location.href
        })
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  const shareOptions: ShareOption[] = [
    {
      name: '링크 복사',
      icon: copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />,
      action: handleCopyLink,
      color: copySuccess ? 'text-green-600' : 'text-blue-600',
      bgColor: copySuccess ? 'from-green-500 to-emerald-500' : 'from-blue-500 to-cyan-500'
    }
  ]

  if (canNativeShare) {
    shareOptions.unshift({
      name: '공유하기',
      icon: shareSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />,
      action: handleNativeShare,
      color: shareSuccess ? 'text-green-600' : 'text-indigo-600',
      bgColor: shareSuccess ? 'from-green-500 to-emerald-500' : 'from-indigo-500 to-purple-500'
    })
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Share options menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Share options */}
            <motion.div 
              className="absolute bottom-16 right-0 space-y-3"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 20 }}
            >
              {shareOptions.map((option, index) => (
                <motion.button
                  key={option.name}
                  onClick={option.action}
                  className={`group flex items-center space-x-3 px-4 py-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 min-w-[140px]`}
                  initial={{ opacity: 0, x: 50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", damping: 15 }}
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${option.bgColor} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    {option.icon}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500">
                    {option.name}
                  </span>
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-transparent to-cyan-50/0 group-hover:from-blue-50/30 group-hover:to-cyan-50/30 dark:group-hover:from-blue-900/10 dark:group-hover:to-cyan-900/10 rounded-2xl transition-all duration-300" />
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main share button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Share"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </motion.div>
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-2xl" />
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/20 group-hover:to-cyan-400/20 rounded-2xl transition-all duration-300 blur-sm -z-10" />
        
        {/* Animated ring on hover */}
        <motion.div
          className="absolute inset-0 border-2 border-blue-400/0 rounded-2xl"
          whileHover={{ 
            borderColor: 'rgba(59, 130, 246, 0.3)',
            scale: 1.1
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </div>
  )
} 