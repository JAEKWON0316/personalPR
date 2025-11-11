'use client'

import { useEffect, useState, useMemo } from 'react'
import FadeInSection from '../FadeInSection'
import { Language } from '../../utils/translations'
import { useLanguage } from '../../hooks/useLanguage'
import SophisticatedButton from '../SophisticatedButton'
import { Code, Database, Globe, Palette, Terminal, GitBranch, Layers, Brain, Wand2, Server, Cloud, FileCode, Cpu, Workflow, Zap } from 'lucide-react'
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
  if (name.includes('AI 기반 개발')) return { Icon: Brain, color: '#0EA5E9' }
  if (name.includes('AI 기반 브랜딩')) return { Icon: Wand2, color: '#F59E0B' }
  if (name.includes('Next.js')) return { Icon: Layers, color: '#000000' }
  if (name.includes('Express.js')) return { Icon: Server, color: '#68A063' }
  if (name.includes('AWS')) return { Icon: Cloud, color: '#FF9900' }
  if (name.includes('Java') && name.includes('Servlet')) return { Icon: Code, color: '#EA2D2E' }
  if (name.includes('Spring')) return { Icon: Layers, color: '#6DB33F' }
  if (name.includes('React')) return { Icon: Globe, color: '#61DAFB' }
  if (name.includes('JavaScript')) return { Icon: Zap, color: '#F7DF1E' }
  if (name.includes('Python')) return { Icon: Cpu, color: '#306998' }
  if (name.includes('GitHub')) return { Icon: GitBranch, color: '#181717' }
  if (name.includes('Node.js')) return { Icon: Workflow, color: '#8CC84B' }
  if (name.includes('MySQL')) return { Icon: Database, color: '#00758F' }
  if (name.includes('HTML')) return { Icon: FileCode, color: '#F06529' }
  if (name.includes('CSS')) return { Icon: Palette, color: '#1572B6' }
  return { Icon: Code, color: '#6366F1' }
}

export default function SkillsSection() {
  const { language } = useLanguage()
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [showAll, setShowAll] = useState(false)

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

  // 남색 계열 그라데이션 색상
  const radarColor = '#4338CA' // indigo-700
  const radarFillColor = '#6366F1' // indigo-500

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

  // 보여줄 스킬 개수 (showAll 토글)
  const visibleSkills = showAll ? skills : skills.slice(0, 6)

  const sectionTitle: Record<Language, string> = {
    ko: '나의 스킬들',
    en: 'My Skills',
    ja: '私のスキル',
    zh: '我的技能'
  }

  return (
    <FadeInSection>
      <section id="skills" className="py-16 relative overflow-visible scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-cyan-50/20 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-[2rem] blur-xl" />
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
                    stroke="#A5B4FC" 
                    strokeOpacity={0.5}
                    className="dark:stroke-indigo-500/40"
                  />
                  <PolarAngleAxis 
                    dataKey="subject"
                    tick={{ 
                      fill: '#3730A3', 
                      fontSize: 12, 
                      fontWeight: 600 
                    }}
                    className="dark:[&_text]:fill-indigo-300"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]}
                    tick={{ 
                      fill: '#818CF8', 
                      fontSize: 10 
                    }}
                    className="dark:[&_text]:fill-indigo-400"
                    tickCount={5}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Radar
                    name="Skills"
                    dataKey="level"
                    stroke={radarColor}
                    fill={radarFillColor}
                    fillOpacity={0.45}
                    strokeWidth={3}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <CustomLegend />
            </div>
          )}

          {/* 스킬 상세 정보 리스트 */}
          <div className="space-y-8">
            <div
              className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              {sectionTitle[language]}
            </div>
            <div className="space-y-6">
              {visibleSkills.map((skill, idx) => {
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
                                className="text-xs font-medium px-2 py-1 rounded-lg bg-blue-50/90 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/60"
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
          </div>
          {skills.length > 6 && (
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
