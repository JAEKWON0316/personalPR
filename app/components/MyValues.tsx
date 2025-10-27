'use client'

import { useState } from 'react'
import { Language, translate, translateValues } from '../utils/translations'
import SophisticatedButton from './SophisticatedButton'

interface MyValuesProps {
  language: Language
}

const MyValues: React.FC<MyValuesProps> = ({ language }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // translations.ts에서 가져온 콘텐츠 사용
  const currentContent = [
    translate('valuesDescription', language),
    translateValues('intro', language),
    translateValues('example', language),
    translateValues('aiDescription', language),
    translateValues('mission', language),
    translateValues('thanks', language)
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
      <div className="relative max-w-3xl w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 p-10">
        {/* 상단 gradient bar */}
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-6 mx-auto" />
        {/* 인용구 본문 */}
        <blockquote className="text-center text-2xl md:text-3xl font-extrabold leading-snug text-gray-800 dark:text-gray-100 mb-8">
          <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            우리는 격동과 변혁의 시대 한가운데에 서 있습니다.
          </span>
        </blockquote>
        {/* 본문 */}
        <div className="max-w-2xl mx-auto flex flex-col items-center space-y-8">
          {currentContent.slice(1, -1).map((paragraph, idx) => (
            <p key={idx} className="text-lg font-bold text-gray-700 dark:text-gray-200 text-left w-full">
              {paragraph}
            </p>
          ))}
          {/* 마지막 단락(감사합니다) 강조 */}
          <p className="text-center text-lg font-bold text-cyan-600 italic mt-6">{currentContent[currentContent.length-1]}</p>
        </div>
      </div>
    </div>
  )
}

export default MyValues