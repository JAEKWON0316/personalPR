'use client'

import FadeInSection from '../FadeInSection'
import MyValues from '../MyValues'
import { Language } from '../../utils/translations'

interface ValuesSectionProps {
  language: Language
}

export default function ValuesSection({ language }: ValuesSectionProps) {
  // 본문 데이터 배열 선언 (MyValues.tsx와 동일하게)
  const currentContent = [
    "우리는 격동과 변혁의 시대 한가운데에 서 있습니다.",
    "이곳에 가치관이나 메시지를 작성하실 수 있습니다. 위에 작성한 비전 및 목표에 대한 내용을 자유롭게 입력하세요.",
    "예시",
    "특히 인공지능은 우리의 일상과 산업 전반에 걸쳐 커다란 변화를 이끌며 미래를 재정의하고 있습니다. 하지만 이러한 변화가 과연 모든 이에 게 공평하게 다가가고 있는지, 그 과정을 되돌아볼 필요가 있습니다.",
    "저희는 기술의 장벽을 낮추고, 누구나 인공지능을 통해 더 나은 삶을 누릴 수 있도록 돕는 데 최선을 다하고자 합니다. 교육과 소통을 통해 더 많은 사람들이 기술을 이해하고 활용할 수 있도록 지원하며, 모두가 함께 성장할 수 있는 포용적 환경을 만들어 나가겠습니다.",
    "감사합니다."
  ];
  return (
    <section id="values" className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 scroll-mt-24">
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
    </section>
  )
} 