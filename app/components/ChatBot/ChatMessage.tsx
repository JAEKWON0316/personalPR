'use client'

import Image from 'next/image'

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant' | 'system'
    content: string
    isLoading?: boolean
    timestamp?: number
  }
  isDarkMode?: boolean
}

export default function ChatMessage({ message, isDarkMode }: ChatMessageProps) {
  const isAI = message.role === 'assistant'

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} items-start gap-2`}>
      {isAI && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src="/pr_img3.jpg"
            alt="AI Clone Avatar"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
      )}
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
        isAI 
          ? isDarkMode 
            ? 'bg-gray-800 text-white' 
            : 'bg-gray-100'
          : isDarkMode
            ? 'bg-blue-600 text-white'
            : 'bg-blue-500 text-white'
      }`}>
        {message.isLoading ? (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </div>
  )
}

