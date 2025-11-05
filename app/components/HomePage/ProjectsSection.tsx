'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import FadeInSection from '../FadeInSection'
import { Language } from '../../utils/translations'
import type { ProjectItem } from '../../types/project'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface ProjectsSectionProps {
  language: Language
}

export default function ProjectsSection({ language }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [active, setActive] = useState<ProjectItem | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (mounted && Array.isArray(data)) setProjects(data)
      } catch {}
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="w-full overflow-visible">
      <FadeInSection>
        <section id="community" className="py-16 relative overflow-visible">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-50/20 via-transparent to-cyan-50/20 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-[2rem] blur-xl" />
          <div className="w-full max-w-[1400px] mx-auto px-2 relative z-10 overflow-visible">
            <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-center mb-8 text-gray-800 dark:text-gray-100">
              PROJECT
            </h2>

            {projects.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              loop={projects.length > 1}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 12 },
                768: { slidesPerView: Math.min(2, projects.length), spaceBetween: 16 },
                1200: { slidesPerView: Math.min(3, projects.length), spaceBetween: 20 }
              }}
              className="!pb-10"
            >
              {projects.map((p, idx) => (
                <SwiperSlide key={`${p.id}-${p.folder}`} className="!h-auto">
                  <button
                    type="button"
                    onClick={() => setActive(p)}
                    className="group text-left w-full relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border-[2px] border-gray-200 dark:border-0 dark:border dark:border-gray-700/50 shadow-xl dark:shadow-lg hover:shadow-2xl dark:hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden"
                  >
                    <div className="relative w-full h-56 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <Image
                        src={p.cover}
                        alt={p.title[language]}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain object-center p-2"
                        priority={idx < 3}
                      />
                    </div>
                    <div className="p-5">
                      <h3
                        className={`font-bold text-gray-900 dark:text-white leading-tight group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 ${
                          (p.folder === '스시마츠' || p.folder === '모다리빙') ? 'text-sm' : 'text-base'
                        }`}
                        style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          minHeight: '2.2rem',
                          lineHeight: '1.3',
                        }}
                      >
                        {p.title[language]}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {p.description[language]}
                      </p>
                      {p.tags[language]?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {p.tags[language].slice(0, 4).map((tag, i) => (
                            <span key={i} className="text-xs font-medium px-2 py-0.5 rounded-lg border bg-blue-50/90 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-700/60">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
            )}

            {active && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setActive(null)} />
                <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl border-[2px] border-gray-200 dark:border-0 dark:border dark:border-gray-700 shadow-2xl dark:shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b-[2px] border-gray-200 dark:border-b-0 dark:border-b dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{active.title[language]}</h3>
                    <button onClick={() => setActive(null)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">✕</button>
                  </div>

                  <div className="max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                      <div className="p-0">
                        <div className="relative w-full h-80 md:h-[70vh]">
                          <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            loop={active.images.length > 1}
                            className="w-full h-full"
                          >
                            {active.images.map((img, i) => (
                              <SwiperSlide key={i} className="!h-full">
                                <div className="relative w-full h-80 md:h-[70vh] bg-gray-100 dark:bg-gray-800">
                                  <Image src={img} alt={`${active.title[language]} ${i+1}`} fill className="object-contain p-2" />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">사이트 요약</h4>
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{active.description[language]}</p>
                        </div>
                        {active.role && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">역할</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{active.role}</p>
                          </div>
                        )}
                        {active.background && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">배경</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{active.background}</p>
                          </div>
                        )}
                        {active.highlights && active.highlights.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">주요 하이라이트</h4>
                            <ol className="mt-2 list-decimal list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              {active.highlights.map((h, i) => (<li key={i}>{h}</li>))}
                            </ol>
                          </div>
                        )}
                        {active.tags[language] && active.tags[language].length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">기술 스택</h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {active.tags[language].map((tag, i) => (
                                <span key={i} className="text-xs font-medium px-2 py-0.5 rounded-lg border bg-blue-50/90 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-700/60">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {active.link && (
                          <a href={active.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            프로젝트 보기 ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </FadeInSection>
    </div>
  )
}