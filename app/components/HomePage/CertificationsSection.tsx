'use client'

import { useEffect, useState, useMemo } from 'react'
import FadeInSection from '../FadeInSection'
import { Language } from '../../utils/translations'
import { useLanguage } from '../../hooks/useLanguage'
import SophisticatedButton from '../SophisticatedButton'
import { Award, FileText, GraduationCap, Car } from 'lucide-react'

interface CertificationItem {
  title: string
  period: string
  description: string
  skills: string[]
}

const getCertificationIcon = (title: string) => {
  if (title.includes('운전면허')) return { Icon: Car, color: '#F59E42' }
  if (title.includes('컴퓨터활용') || title.includes('정보처리')) return { Icon: FileText, color: '#6366F1' }
  if (title.includes('바리스타')) return { Icon: Award, color: '#F43F5E' }
  return { Icon: GraduationCap, color: '#10B981' }
}

export default function CertificationsSection() {
  const { language } = useLanguage()
  const [certifications, setCertifications] = useState<CertificationItem[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        const res = await fetch('/api/certifications', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data)) setCertifications(data)
      } catch {}
    }
    loadCertifications()
  }, [])

  // 연도별로 그룹핑
  const grouped = useMemo(() => {
    const map = new Map<number, CertificationItem[]>()
    certifications.forEach(item => {
      const yearMatch = item.period.match(/(\d{4})/)
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear()
      if (!map.has(year)) map.set(year, [])
      map.get(year)!.push(item)
    })
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0])
  }, [certifications])

  const visibleGroups = showAll ? grouped : grouped.slice(0, 2)

  return (
    <FadeInSection>
      <section id="certifications" className="py-16 relative overflow-visible scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-pink-50/20 dark:from-purple-900/10 dark:to-pink-900/10 rounded-[2rem] blur-xl" />
        <div className="w-full max-w-[1400px] mx-auto px-2 relative overflow-visible">
          <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-center mb-8 text-gray-800 dark:text-gray-100">
            {language === 'ko' ? '자격증' : language === 'en' ? 'Certifications' : language === 'ja' ? '資格' : '資格證書'}
          </h2>
          <div className="space-y-14">
            {visibleGroups.map(([year, yearItems]) => (
              <div key={year}>
                <div
                  className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {year}
                </div>
                <div className="space-y-6">
                  {yearItems.map((item, idx) => {
                    const { Icon, color } = getCertificationIcon(item.title)
                    return (
                      <div key={idx} className="flex items-start space-x-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border-[2px] border-gray-200 dark:border-0 dark:border dark:border-gray-700/50 p-4 shadow-md dark:shadow-sm hover:shadow-lg dark:hover:shadow-md transition-all duration-300">
                        <div className="pt-1">
                          <Icon className="w-8 h-8" style={{ color }} aria-label={item.title} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg text-gray-900 dark:text-white">{item.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">{item.period}</div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
                          {item.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="text-xs font-medium px-2 py-1 rounded-lg bg-purple-50/90 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-700/60"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          {grouped.length > 2 && (
            <div className="flex justify-center mt-6">
              <SophisticatedButton
                expanded={showAll}
                onClick={() => setShowAll(v => !v)}
                language={language}
              />
            </div>
          )}
        </div>
      </section>
    </FadeInSection>
  )
}
