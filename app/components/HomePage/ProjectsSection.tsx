'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import FadeInSection from '../FadeInSection'
import { Language } from '../../utils/translations'
import { PostData } from '../../types/post'

interface ProjectsSectionProps {
  language: Language
  posts: PostData[]
  onPostClick: (postId: number) => void
}

export default function ProjectsSection({ language, posts, onPostClick }: ProjectsSectionProps) {
  return (
    <>
      <style jsx global>{`
        .swiper-container {
          width: 100%;
          height: 100%;
          padding: 25px 0;
        }
        .swiper-slide {
          height: auto;
          padding: 6px;
        }
        /* Enhanced navigation buttons */
        .swiper-button-next,
        .swiper-button-prev {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          width: 52px !important;
          height: 52px !important;
          margin-top: -26px !important;
          z-index: 50;
          color: #2563eb;
          opacity: 0.92;
          transition: color 0.2s cubic-bezier(.4,0,.2,1), opacity 0.2s;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          color: #0ea5e9;
          opacity: 1;
        }
        .dark .swiper-button-next,
        .dark .swiper-button-prev {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: #38bdf8;
        }
        .dark .swiper-button-next:hover,
        .dark .swiper-button-prev:hover {
          color: #0ea5e9;
        }
        .swiper-button-prev {
          left: -8px !important;
        }
        .swiper-button-next {
          right: -8px !important;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 32px !important;
          color: inherit;
          font-weight: bold;
        }
        /* Enhanced pagination */
        .swiper-pagination-bullet {
          background: rgba(59, 130, 246, 0.3) !important;
          width: 10px !important;
          height: 10px !important;
          transition: all 0.3s ease !important;
        }
        .swiper-pagination-bullet-active {
          background: linear-gradient(45deg, #3B82F6, #06B6D4) !important;
          width: 24px !important;
          border-radius: 5px !important;
          transform: scale(1.1);
        }
        @media (max-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
      <div className="w-full overflow-visible">
        <FadeInSection>
          <section id="community" className="py-16 relative overflow-visible">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-cyan-50/20 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-[2rem] blur-xl" />
            {/* Container with padding to prevent clipping */}
            <div className="w-full max-w-[1400px] mx-auto px-2 relative overflow-visible">
              <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-center mb-8 text-gray-800 dark:text-gray-100">
                PROJECT
              </h2>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={12}
                slidesPerView={1}
                navigation
                pagination={{ 
                  clickable: true,
                  dynamicBullets: true 
                }}
                loop={posts.length > 1}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  stopOnLastSlide: false
                }}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                  },
                  768: {
                    slidesPerView: Math.min(2, posts.length),
                    spaceBetween: 20,
                  },
                  1200: {
                    slidesPerView: Math.min(3, posts.length),
                    spaceBetween: 25,
                  }
                }}
                className="swiper-container !pb-14"
              >
                {posts.map((post, index) => (
                  <SwiperSlide 
                    key={post.id}
                    className="h-[360px] w-full"
                  >
                    <div className="group relative h-full w-full">
                      {/* Subtle hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-cyan-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-105" />
                      {/* Main card */}
                      <div
                        onClick={() => onPostClick(post.id)}
                        className="relative h-full w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 cursor-pointer overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.01] group-hover:-translate-y-1"
                      >
                        {/* Image section */}
                        <div className="relative w-full h-[220px] bg-gray-100 dark:bg-gray-800 rounded-t-2xl overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title[language]}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
                            priority={index < 3}
                          />
                        </div>
                        {/* Content section */}
                        <div className="p-6 flex flex-col flex-1 gap-2 justify-between w-full">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300"
                              style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                minHeight: '2.2rem',
                                lineHeight: '1.3',
                                fontSize: '1.05rem',
                              }}
                          >
                            {post.title[language]}
                          </h3>
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-1">
                            {post.tags[language].slice(0, 4).map((tag, tagIndex) => (
                              <span 
                                key={tagIndex} 
                                className={`text-xs font-medium px-2 py-0.5 rounded-lg border transition-all duration-200 hover:scale-105 ${
                                  tagIndex % 3 === 0 
                                    ? 'bg-blue-50/90 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-700/60'
                                    : tagIndex % 3 === 1
                                    ? 'bg-purple-50/90 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-700/60'
                                    : 'bg-cyan-50/90 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-700/60'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Subtle hover indicator - 카드 내부 텍스트와 겹치지 않게 z-index, 위치 조정 */}
                        <div className="absolute bottom-3 right-3 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300 z-20" style={{ bottom: '0.5rem', right: '0.5rem' }}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        </FadeInSection>
      </div>
    </>
  )
} 