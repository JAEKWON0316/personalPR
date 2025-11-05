'use client'

import { useEffect, useState, useMemo } from 'react'
import FadeInSection from '../FadeInSection'
import { Language } from '../../utils/translations'
import { useLanguage } from '../../hooks/useLanguage'
import SophisticatedButton from '../SophisticatedButton'
import { Code, Database, Globe, Palette, Terminal, GitBranch, Layers } from 'lucide-react'
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts'

interface SkillItem {
  name: string
  level: number
  color: string
  description: string
  keywords: string[]
}

const getSkillIcon = (name: string) => {
  if (name.includes('Java') || name.includes('Spring') || name.includes('Servlet')) return { Icon: Code, color: '#EA2D2E' }
  if (name.includes('MySQL') || name.includes('Database') || name.includes('SQL')) return { Icon: Database, color: '#00758F' }
  if (name.includes('React') || name.includes('HTML') || name.includes('CSS') || name.includes('JavaScript')) return { Icon: Globe, color: '#61DAFB' }
  if (name.includes('GitHub') || name.includes('Git')) return { Icon: GitBranch, color: '#181717' }
  if (name.includes('Node')) return { Icon: Terminal, color: '#8CC84B' }
  if (name.includes('Python')) return { Icon: Layers, color: '#306998' }
  return { Icon: Palette, color: '#6366F1' }
}

export default function SkillsSection() {
  const { language } = useLanguage()
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [showAll, setShowAll] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await fetch('/api/skills', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data)) setSkills(data)
      } catch {}
    }
    loadSkills()
  }, [])

  // 레이더 차트용 데이터 변환
  const chartData = useMemo(() => {
    if (skills.length === 0) return []
    return skills.map(skill => ({
      subject: skill.name.length > 12 ? skill.name.substring(0, 12) : skill.name,
      level: skill.level,
      fullMark: 100,
      fullName: skill.name,
      color: skill.color,
    }))
  }, [skills])

  // 평균 색상 계산
  const averageColor = useMemo(() => {
    if (skills.length === 0) return '#6366F1'
    const topSkill = skills.reduce((prev, current) => 
      prev.level > current.level ? prev : current
    )
    return topSkill.color
  }, [skills])

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{data.fullName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span style={{ color: data.color }}>Level: </span>
            <span className="font-bold">{data.level}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  // 커스텀 레전드 컴포넌트
  const CustomLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {skills.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: skill.color }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
              {skill.name}: <span className="font-bold">{skill.level}%</span>
            </span>
          </div>
        ))}
      </div>
    )
  }

  // 레벨별로 그룹핑
  const grouped = useMemo(() => {
    const high: SkillItem[] = []
    const medium: SkillItem[] = []
    const low: SkillItem[] = []
    
    skills.forEach(skill => {
      if (skill.level >= 80) high.push(skill)
      else if (skill.level >= 60) medium.push(skill)
      else low.push(skill)
    })

    return [
      { level: 'High', items: high },
      { level: 'Medium', items: medium },
      { level: 'Low', items: low }
    ].filter(group => group.items.length > 0)
  }, [skills])

  const visibleGroups = showAll ? grouped : grouped.slice(0, 1)

  const toggleGroup = (level: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(level)) {
        newSet.delete(level)
      } else {
        newSet.add(level)
      }
      return newSet
    })
  }

  const levelLabels: Record<string, Record<Language, string>> = {
    High: { ko: '상급 (80% 이상)', en: 'High (80%+)', ja: '上級 (80%以上)', zh: '高级 (80%以上)' },
    Medium: { ko: '중급 (60-79%)', en: 'Medium (60-79%)', ja: '中級 (60-79%)', zh: '中级 (60-79%)' },
    Low: { ko: '초급 (60% 미만)', en: 'Low (Below 60%)', ja: '初級 (60%未満)', zh: '初级 (60%以下)' }
  }

  return (
    <FadeInSection>
      <section id="skills" className="py-16 relative overflow-visible scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 via-transparent to-emerald-50/20 dark:from-green-900/10 dark:to-emerald-900/10 rounded-[2rem] blur-xl" />
        <div className="w-full max-w-[1400px] mx-auto px-2 relative overflow-visible">
          <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-center mb-8 text-gray-800 dark:text-gray-100">
            {language === 'ko' ? '기술 스택' : language === 'en' ? 'Skills' : language === 'ja' ? 'スキル' : '技能'}
          </h2>
          
          {/* 레이더 차트 */}
          {chartData.length > 0 && skills.length > 0 && (
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border-[2px] border-gray-200 dark:border-0 dark:border dark:border-gray-700/50 p-6 shadow-xl dark:shadow-lg mb-8">
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart 
                  data={chartData}
                  margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                >
                  <PolarGrid 
                    stroke="#e5e7eb" 
                    strokeOpacity={0.5}
                    className="dark:stroke-gray-600"
                  />
                  <PolarAngleAxis 
                    dataKey="subject"
                    tick={{ 
                      fill: '#374151', 
                      fontSize: 12, 
                      fontWeight: 500 
                    }}
                    className="dark:[&_text]:fill-gray-300"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]}
                    tick={{ 
                      fill: '#9ca3af', 
                      fontSize: 10 
                    }}
                    className="dark:[&_text]:fill-gray-500"
                    tickCount={5}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Radar
                    name="Skills"
                    dataKey="level"
                    stroke={averageColor}
                    fill={averageColor}
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <CustomLegend />
            </div>
          )}

          {/* 스킬 상세 정보 리스트 (연혁 섹션 형식) */}
          <div className="space-y-14">
            {visibleGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <div
                  className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {levelLabels[group.level]?.[language] || group.level}
                </div>
                <div className="space-y-6">
                  {(expandedGroups.has(group.level) ? group.items : group.items.slice(0, 4)).map((skill, idx) => {
                    const { Icon } = getSkillIcon(skill.name)
                    return (
                      <div key={idx} className="flex items-start space-x-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border-[2px] border-gray-200 dark:border-0 dark:border dark:border-gray-700/50 p-4 shadow-md dark:shadow-sm hover:shadow-lg dark:hover:shadow-md transition-all duration-300">
                        <div className="pt-1">
                          <Icon className="w-8 h-8" style={{ color: skill.color }} aria-label={skill.name} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-bold text-lg text-gray-900 dark:text-white" style={{ color: skill.color }}>
                              {skill.name}
                            </div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${skill.level}%`,
                                backgroundColor: skill.color,
                              }}
                            />
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{skill.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {skill.keywords.map((keyword, i) => (
                              <span
                                key={i}
                                className="text-xs font-medium px-2 py-1 rounded-lg bg-green-50/90 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200/60 dark:border-green-700/60"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {group.items.length > 4 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => toggleGroup(group.level)}
                      className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                    >
                      {expandedGroups.has(group.level) 
                        ? (language === 'ko' ? '숨기기' : language === 'en' ? 'Show Less' : language === 'ja' ? '折りたたむ' : '折叠')
                        : (language === 'ko' ? `펼쳐보기 (${group.items.length - 4}개 더)` : language === 'en' ? `Show More (${group.items.length - 4} more)` : language === 'ja' ? `展開 (あと${group.items.length - 4}件)` : `展开 (还有${group.items.length - 4}个)`)
                      }
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {grouped.length > 1 && (
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
