'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trash2, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../hooks/useLanguage'
import { translate } from '../utils/translations'
import ChatInput, { Message } from '../components/ChatBot/ChatInput'
import ChatMessage from '../components/ChatBot/ChatMessage'
import Navigation from '../components/Navigation'
import { useTheme } from '../contexts/ThemeContext'
import { storage } from '../utils/storage'

const initialMessages = {
  ko: "안녕하세요! 저는 이재권 입니다. 무엇을 도와드릴까요?",
  en: "Hello! I'm Jeong Ino's Clone. How can I help you?",
  ja: "こんにちは！イノ's Cloneです。どのようにお手伝いできますか？",
  zh: "你好！我是Jeong Ino's Clone。我能为您做些什么？"
};

export default function ChatPage() {
  const { language } = useLanguage()
  const { isDarkMode } = useTheme()
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: initialMessages[language as keyof typeof initialMessages] || initialMessages.ko,
    id: crypto.randomUUID()
  }]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced CSS animations
  const enhancedStyles = useMemo(() => `
    @keyframes messageSlide {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes thinking {
      0%, 60%, 100% { 
        transform: translateY(0);
        opacity: 0.4; 
      }
      30% { 
        transform: translateY(-10px);
        opacity: 1; 
      }
    }
    
    .thinking-dots {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
    }
    
    .thinking-dots span {
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: 50%;
      animation: thinking 1.4s ease-in-out infinite;
    }
    
    .thinking-dots span:nth-child(1) { animation-delay: 0s; }
    .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
    .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
    
    .message-appear {
      animation: messageSlide 0.4s ease-out;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .upload-shimmer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: shimmer 1.5s infinite;
    }
  `, []);

  // Memoize initial message to prevent recreation
  const initialMessage = useMemo(() => ({
    role: 'assistant' as const,
    content: initialMessages[language as keyof typeof initialMessages] || initialMessages.ko,
    id: crypto.randomUUID()
  }), [language]);

  // localStorage에서 메시지 불러오기
  useEffect(() => {
    const savedMessages = storage.get('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error('메시지 파싱 오류:', error);
        // Fallback to initial message if parsing fails
        setMessages([initialMessage]);
      }
    } else {
      // Set initial message if no saved messages
      setMessages([initialMessage]);
    }
  }, [initialMessage]);

  // 언어 변경 시 첫 메시지 업데이트
  useEffect(() => {
    setMessages(prevMessages => {
      if (prevMessages.length === 0) {
        return [initialMessage];
      }
      // Update first message if it's the initial assistant message
      if (prevMessages[0]?.role === 'assistant' && prevMessages.length === 1) {
        return [initialMessage];
      }
      return prevMessages;
    });
  }, [initialMessage]);

  // 메시지가 변경될 때마다 localStorage 업데이트 (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      storage.set('chatMessages', JSON.stringify(messages));
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Enhanced error handling for API calls
  const handleApiError = useCallback((error: unknown): string => {
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('Failed to fetch')) {
        return translate('networkError', language) || '네트워크 연결을 확인해주세요.';
      }
      if (error.message.includes('timeout')) {
        return translate('timeoutError', language) || '요청 시간이 초과되었습니다.';
      }
      return error.message;
    }
    return translate('unknownError', language) || '알 수 없는 오류가 발생했습니다.';
  }, [language]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return; // Prevent empty messages

    const userMessage: Message = { 
      role: 'user', 
      content: content.trim(),
      id: crypto.randomUUID()
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content.trim() // <-- 수정: 단일 메시지 string만 보냄
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error (${response.status}): ${errorData || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.response) {
        throw new Error('No response from AI');
      }

      const aiMessage: Message = { 
        role: 'assistant', 
        content: data.response,
        id: crypto.randomUUID()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: handleApiError(error),
        id: crypto.randomUUID()
      };
      setMessages(prev => [...prev, errorMessage])
    }
    finally {
      setIsLoading(false);
    }
  }, [messages, handleApiError]);

  const clearMessages = useCallback(() => {
    try {
      setMessages([initialMessage]);
      storage.set('chatMessages', JSON.stringify([initialMessage]));
    } catch (error) {
      console.error('Failed to clear messages:', error);
      // Even if storage fails, still clear the UI
      setMessages([initialMessage]);
    }
  }, [initialMessage]);

  const getMessageKey = useCallback((message: Message, index: number) => {
    return `${index}-${message.role}-${isDarkMode ? 'dark' : 'light'}`;
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/50 flex flex-col relative overflow-hidden">
      <style>{enhancedStyles}</style>
      
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Navigation */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 dark:border-gray-700/30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl"
      >
        <Navigation language={language} />
      </motion.div>

      {/* Main Chat Container */}
      <div className="fixed inset-0 top-[80px] bottom-[100px] max-w-4xl mx-auto w-full px-4">
        
        {/* Enhanced Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-0 left-0 right-0 z-40 mx-4"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl p-3 mb-3">
            <div className="flex items-center justify-between">
              
              {/* Back Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/" 
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                  aria-label="Go back to home page"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Back</span>
                </Link>
              </motion.div>

              {/* Profile Section */}
              <div className="flex flex-col items-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                  className="relative"
                >
                  <div className="w-14 h-14 relative rounded-2xl overflow-hidden mb-2 shadow-lg ring-2 ring-white/50 dark:ring-gray-700/50 mt-4">
                    <Image
                      src="/pr_img3.jpg"
                      alt={`${translate('name', language)} profile picture`}
                      fill
                      sizes="56px"
                      className="rounded-2xl object-cover object-top" 
                      priority
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mt-1">
                    {translate('name', language)}{translate('cloneTitle', language)}
                  </h1>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                
                {/* Voice Chat Button - Hidden for now */}
                {false && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link
                      href="/voice-chat"
                      className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      title={translate('voiceChat', language)}
                      aria-label="Start voice chat"
                    >
                      {/* <WaveformIcon className="w-5 h-5" /> */}
                    </Link>
                  </motion.div>
                )}

                {/* File Upload Button - Hidden for now */}
                {false && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <button
                      disabled
                      className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-50 cursor-not-allowed"
                      title="Upload PDF (Coming Soon)"
                      aria-label="Upload PDF file - Feature coming soon"
                    >
                      {/* <Upload className="w-5 h-5" /> */}
                    </button>
                  </motion.div>
                )}

                {/* Clear Chat Button */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <button
                    onClick={clearMessages}
                    disabled={isLoading}
                    className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-lg hover:shadow-xl hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={translate('clearChat', language) || "Clear chat history"}
                    aria-label="Clear all chat messages"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>

                {/* Hidden for now - PDF upload input */}
                {false && (
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Enhanced Messages Container */}
        <div className="absolute top-[140px] bottom-0 left-0 right-0 mx-4">
          <div 
            className="h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl overflow-hidden"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            aria-atomic="false"
          >
            <div 
              className="h-full overflow-y-auto px-6 py-6 space-y-6"
              style={{ scrollBehavior: 'smooth' }}
            >
              
              
              {/* Messages */}
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={getMessageKey(message, index)}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="message-appear"
                    role="article"
                    aria-label={`${message.role === 'user' ? 'User' : 'Assistant'} message`}
                  >
                    <ChatMessage message={message} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Enhanced Thinking Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex justify-start"
                  role="status"
                  aria-label="AI is thinking"
                  aria-live="polite"
                >
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg">
                    <div className="thinking-dots text-gray-600 dark:text-gray-300">
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Input Container */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-white/80 via-white/60 to-transparent dark:from-gray-900/80 dark:via-gray-900/60 backdrop-blur-2xl"
        role="complementary"
        aria-label="Message input area"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl p-4">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              placeholder={translate('chatInputPlaceholder', language)} 
              isDarkMode={isDarkMode} 
              disabled={isLoading}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}