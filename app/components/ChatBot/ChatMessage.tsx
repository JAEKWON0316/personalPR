'use client'

import { Message } from './ChatInput'
import Image from 'next/image'

interface ChatMessageProps {
  message: Message
  isDarkMode?: boolean
}

export default function ChatMessage({ message, isDarkMode }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
          <Image
            src="/profile.png"
            alt="Bot Avatar"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white'
            : isDarkMode
            ? 'bg-gray-700 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="whitespace-normal break-words">{message.content}</p>
      </div>
    </div>
  )
}

