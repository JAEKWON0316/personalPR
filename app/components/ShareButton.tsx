'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatBot from './ChatBot/ChatBot'

interface ShareButtonProps {
  language: string
}

export default function ShareButton({ language }: ShareButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev)
  }

  return (
    <>
      <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 z-[10000]">
        {/* Chat Toggle Button */}
        <motion.button
          onClick={handleToggleChat}
          className={`relative p-3 sm:p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group ${
            isChatOpen ? 'bg-blue-500 dark:bg-blue-600' : ''
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isChatOpen ? 'Close Chat' : 'Open Chat'}
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              {isChatOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Subtle gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-2xl pointer-events-none ${
            isChatOpen ? 'opacity-0' : ''
          }`} />
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/20 group-hover:to-cyan-400/20 rounded-2xl transition-all duration-300 blur-sm -z-10 pointer-events-none" />
          
          {/* Animated ring on hover */}
          <motion.div
            className="absolute inset-0 border-2 border-blue-400/0 rounded-2xl pointer-events-none"
            whileHover={{ 
              borderColor: 'rgba(59, 130, 246, 0.3)',
              scale: 1.1
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>

      {/* ChatBot Component */}
      <ChatBot isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  )
}
