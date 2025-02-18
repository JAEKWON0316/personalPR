'use client'

import { useState, useMemo } from 'react'
import SophisticatedButton from './SophisticatedButton'
import { useLanguage } from '../hooks/useLanguage'
import { translate } from '../utils/translations'

type CertificationsByLanguage = {
  [key: string]: { title: string; subtitle: string }[]
}

export default function Career() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { language } = useLanguage()

  const certifications: CertificationsByLanguage = useMemo(() => ({
    ko: [
      {
        title: "정보처리기사",
        subtitle: "주무부처: 한국산업인력공단"
      },
      {
        title: "컴퓨터활용능력 1급",
        subtitle: "주무부처: 대한상공회의소"
      },
    ],
    en: [
      {
        title: "Engineer Information Processing",
        subtitle: "Ministry: Human Resources Development Service of Korea"
      },
      {
        title: "Computer Specialist Level 1",
        subtitle: "Ministry: Korea Chamber of Commerce and Industry"
      },
    ],
    ja: [
      {
        title: "情報処理技術者",
        subtitle: "所管：韓国産業人材公団"
      },
      {
        title: "コンピュータ活用能力 1級",
        subtitle: "所管：大韓商工会議所"
      },
    ],
    zh: [
      {
        title: "信息处理工程师",
        subtitle: "主管部门：韩国产业人力公团"
      },
      {
        title: "计算机应用能力 1级",
        subtitle: "主管部门：大韩商工会议所"
      },
    ]
  }), [])

  const currentCertifications = useMemo(() => {
    return certifications[language] || certifications['ko']
  }, [language, certifications])

  const displayedCertifications = useMemo(() => {
    return isExpanded ? currentCertifications : currentCertifications.slice(0, 3)
  }, [isExpanded, currentCertifications])

  return (
    <section className="mb-4 px-4 md:px-6 lg:px-8" role="region" aria-label="자격 사항">
      <h2 className="text-3xl font-bold text-center mb-8">
        <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
          {translate('인증 및 자격', language)}
        </span>
      </h2>
      <div className="space-y-6">
        <ul className="space-y-6" role="list">
          {displayedCertifications.map((cert, index) => (
            <li 
              key={index} 
              className="border-b border-gray-100 pb-4 last:border-b-0"
              role="listitem"
            >
              <h3 className="text-lg font-semibold text-[#4B6BF5] mb-1">
                {cert.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {cert.subtitle}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center mt-6">
        <SophisticatedButton 
          expanded={isExpanded} 
          onClick={() => setIsExpanded(!isExpanded)} 
          language={language}
          aria-expanded={isExpanded}
          aria-controls="certifications-list"
        />
      </div>
    </section>
  )
}