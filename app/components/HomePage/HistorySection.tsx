'use client'

import { useEffect, useState, useMemo } from 'react'
import FadeInSection from '../FadeInSection'
import { Language, translate } from '../../utils/translations'
import { useLanguage } from '../../hooks/useLanguage'
import SophisticatedButton from '../SophisticatedButton'
import { Briefcase, GraduationCap, Award, Folder, Calendar } from 'lucide-react'

interface CareerItem {
  title: string
  period: string
  description: string
  skills: string[]
}

const getCareerIcon = (title: string) => {
  if (title.includes('졸업') || title.includes('수료')) return { Icon: GraduationCap, color: '#6366F1' }
  if (title.includes('전역') || title.includes('병장')) return { Icon: Award, color: '#F43F5E' }
  if (title.includes('매니저') || title.includes('근무')) return { Icon: Briefcase, color: '#10B981' }
  if (title.includes('프로젝트') || title.includes('웹사이트') || title.includes('준우승')) return { Icon: Folder, color: '#F59E42' }
  return { Icon: Calendar, color: '#8B5CF6' }
}

export default function HistorySection() {
  const { language } = useLanguage()
  const [careerData, setCareerData] = useState<CareerItem[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const loadCareer = async () => {
      try {
        const res = await fetch('/api/career', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data)) setCareerData(data)
      } catch {}
    }
    loadCareer()
  }, [])

  // 연도별로 그룹핑 (period에서 연도 추출) 및 월별 정렬
  const grouped = useMemo(() => {
    const map = new Map<number, CareerItem[]>()
    careerData.forEach(item => {
      const yearMatch = item.period.match(/(\d{4})/)
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear()
      if (!map.has(year)) map.set(year, [])
      map.get(year)!.push(item)
    })
    
    // 각 연도별로 항목들을 12월부터 1월 순서로 정렬
    const sortedEntries = Array.from(map.entries()).sort((a, b) => b[0] - a[0])
    
    return sortedEntries.map(([year, items]) => {
      // period에서 월 추출 및 정렬 (12월부터 1월 순서)
      const sortedItems = [...items].sort((a, b) => {
        // period에서 월 추출 (예: "2025년 09월", "2024년 11~12월")
        const getMonth = (period: string): number => {
          // "11~12월" 같은 경우 첫 번째 월 사용
          const monthMatch = period.match(/(\d{1,2})월/)
          if (monthMatch) {
            return parseInt(monthMatch[1])
          }
          // "2024년 11~12월" 같은 경우도 처리
          const rangeMatch = period.match(/(\d{1,2})~(\d{1,2})월/)
          if (rangeMatch) {
            return parseInt(rangeMatch[1]) // 시작 월 사용
          }
          // "2024년 12월 ~ 2025년 03월" 같은 경우 처리
          const crossYearMatch = period.match(/(\d{4})년\s*(\d{1,2})월/)
          if (crossYearMatch) {
            return parseInt(crossYearMatch[2])
          }
          // 월이 없으면 0 반환 (맨 뒤로)
          return 0
        }
        
        const monthA = getMonth(a.period)
        const monthB = getMonth(b.period)
        
        // 월이 없으면 맨 뒤로
        if (monthA === 0 && monthB === 0) return 0
        if (monthA === 0) return 1
        if (monthB === 0) return -1
        
        // 12월부터 1월 순서로 정렬 (내림차순)
        const monthDiff = monthB - monthA
        
        // 같은 월이거나 비슷한 경우 (12월과 11~12월 같은 경우) 특정 항목 우선순위 적용
        if (monthDiff === 0 || (monthA === 12 && monthB === 11) || (monthA === 11 && monthB === 12)) {
          // "Innocurve AI 회사" 항목을 "대한청년을세계로 웹사이트 제작"보다 위에
          if (a.title.includes('Innocurve AI') && b.title.includes('대한청년을세계로')) {
            return -1
          }
          if (a.title.includes('대한청년을세계로') && b.title.includes('Innocurve AI')) {
            return 1
          }
        }
        
        return monthDiff
      })
      
      return [year, sortedItems] as [number, CareerItem[]]
    })
  }, [careerData])

  const visibleGroups = showAll ? grouped : grouped.slice(0, 2)

  return (
    <FadeInSection>
      <section id="history" className="py-16 relative overflow-visible scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-cyan-50/20 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-[2rem] blur-xl" />
        <div className="w-full max-w-[1400px] mx-auto px-2 relative overflow-visible">
          <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-center mb-8 text-gray-800 dark:text-gray-100">
            {translate('history', language)}
          </h2>
          <div className="space-y-14">
            {visibleGroups.map(([year, yearItems]) => (
              <div key={year}>
                <div
                  className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {year}
                </div>
                <div className="space-y-6">
                  {yearItems.map((item, idx) => {
                    const { Icon, color } = getCareerIcon(item.title)
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
                                  className="text-xs font-medium px-2 py-1 rounded-lg bg-blue-50/90 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/60"
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
