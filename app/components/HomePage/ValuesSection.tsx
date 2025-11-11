'use client'

import FadeInSection from '../FadeInSection'
import MyValues from '../MyValues'
import { Language, translateValues } from '../../utils/translations'

interface ValuesSectionProps {
  language: Language
}

export default function ValuesSection({ language }: ValuesSectionProps) {
  const intro = translateValues('intro', language);
  const aiDescription = translateValues('aiDescription', language);
  const example = translateValues('example', language);
  const mission = translateValues('mission', language);
  const vision1 = translateValues('vision1', language);
  const vision2 = translateValues('vision2', language);
  const thanks = translateValues('thanks', language);

  return (
    <section id="values" className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 scroll-mt-24">
      <div className="relative max-w-3xl w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 p-10">
        {/* 상단 gradient bar */}
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-6 mx-auto" />
        {/* 인용구 본문 */}
        <blockquote className="text-center text-2xl md:text-3xl font-extrabold leading-snug text-gray-800 dark:text-gray-100 mb-8">
          <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            {intro}
          </span>
        </blockquote>
        {/* 본문 */}
        <div className="max-w-2xl mx-auto flex flex-col items-center space-y-8">
          <p className="text-lg font-bold text-gray-700 dark:text-gray-200 text-left w-full">
            {aiDescription}
          </p>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-200 text-left w-full">
            {example}
          </p>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-200 text-left w-full">
            {mission}
          </p>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-200 text-left w-full">
            {vision1}
          </p>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-200 text-left w-full">
            {vision2}
          </p>
          {/* 마지막 단락(감사합니다) 강조 */}
          <p className="text-center text-lg font-bold text-cyan-600 italic mt-6">{thanks}</p>
        </div>
      </div>
    </section>
  )
} 