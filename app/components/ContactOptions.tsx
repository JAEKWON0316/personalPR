'use client'

import { Card } from "@/components/ui/card"
import { Language, translate } from '../utils/translations'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ContactOptionsProps {
  language: Language
}

const ContactOptions: React.FC<ContactOptionsProps> = ({ language }) => {
  const router = useRouter()

  const handleOptionClick = (key: string) => {
    if (key === 'aiClone') {
      router.push('/chat')
    } else if (key === 'greetingVideo') {
      router.push('/greeting')
    } else if (key === 'phone') {
      window.location.href = 'tel:+8210-1234-5678'
    } else if (key === 'innocard') {
      router.push('/inquiry')
    }
  }

  const options = [
    {
      key: 'aiClone',
      title: translate('aiClone', language),
      gradient: 'from-blue-500 via-purple-500 to-cyan-500',
      glowColor: 'blue-400',
      icon: (
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <circle cx="32" cy="20" r="12" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <path d="M32 36C18.7452 36 8 46.7452 8 60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M56 60C56 46.7452 45.2548 36 32 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M32 60V48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M24 56H40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="32" cy="20" r="4" fill="currentColor"/>
        </svg>
      ),
    },
    {
      key: 'greetingVideo',
      title: translate('greetingVideo', language),
      gradient: 'from-pink-500 via-red-500 to-orange-500',
      glowColor: 'pink-400',
      icon: (
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <path d="M28 24L40 32L28 40V24Z" fill="currentColor" className="transition-transform duration-300 group-hover:translate-x-0.5"/>
        </svg>
      ),
    },
    {
      key: 'phone',
      title: translate('phone', language),
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      glowColor: 'green-400',
      icon: (
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <rect x="18" y="4" width="28" height="56" rx="6" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <line x1="18" y1="12" x2="46" y2="12" stroke="currentColor" strokeWidth="2.5"/>
          <line x1="18" y1="52" x2="46" y2="52" stroke="currentColor" strokeWidth="2.5"/>
          <circle cx="32" cy="56" r="2" fill="currentColor"/>
          <rect x="26" y="6" width="12" height="4" rx="2" fill="currentColor"/>
        </svg>
      ),
    },
    {
      key: 'innocard',
      title: translate('innoCardInquiry', language),
      gradient: 'from-violet-500 via-indigo-500 to-blue-600',
      glowColor: 'violet-400',
      icon: (
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
          <path d="M10 54L14 42L50 6L58 14L22 50L10 54Z" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <path d="M42 14L50 22" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M10 54L14 42" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M8 58H56" stroke="currentColor" strokeWidth="2.5"/>
        </svg>
      ),
    }
  ]

  return (
    <div className="relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-purple-50/10 to-cyan-50/20 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-cyan-900/10 rounded-[1.5rem] blur-lg" />
      
      {/* Grid container with padding to prevent clipping */}
      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-2">
        {options.map((option, index) => (
          <div
            key={option.key}
            className="group relative"
          >
            {/* 카드와 동일한 radius, overflow-hidden 적용, blur-sm로 줄임, scale 효과 제거 */}
            <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} rounded-2xl blur-sm opacity-0 group-hover:opacity-20 transition-all duration-300 pointer-events-none overflow-hidden`} style={{ zIndex: 1 }} />
            {/* Main button */}
            <div
              className="relative h-48 sm:h-52 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 cursor-pointer overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
              onClick={() => handleOptionClick(option.key)}
            >
              {/* 내부 효과도 overflow-hidden, radius 맞춤 */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10 rounded-2xl overflow-hidden pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
              </div>
              {/* Content container */}
              <div className="relative h-full flex flex-col justify-between p-5">
                {/* Title section */}
                <div className="flex-1 flex items-start">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white leading-tight group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:via-blue-600 group-hover:to-cyan-600 dark:group-hover:from-white dark:group-hover:via-blue-300 dark:group-hover:to-cyan-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {option.title.split('\n').map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                </div>
                {/* Icon section with subtle styling */}
                <div className="flex justify-end items-end">
                  <div className={`relative p-3 bg-gradient-to-br ${option.gradient} rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                    <div className="text-white">
                      {option.icon}
                    </div>
                  </div>
                </div>
              </div>
              {/* Subtle hover highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out rounded-2xl pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContactOptions
