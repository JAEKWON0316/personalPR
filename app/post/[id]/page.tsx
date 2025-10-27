'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Eye, Share2, Bookmark, Calendar, Tag, Maximize2, X, Mail } from 'lucide-react'
import { translate } from '../../utils/translations'
import { useLanguage } from '@/app/hooks/useLanguage'
import type { PostData } from '@/app/types/post'
import Navigation from '@/app/components/Navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation as SwiperNavigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { storage } from '@/app/utils/storage'

export default function PostDetail() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [post, setPost] = useState<PostData | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const fetchPost = () => {
      const postsJson = storage.get('posts')
      if (!postsJson) return;
      
      try {
        const posts = JSON.parse(postsJson)
        const foundPost = posts.find((p: PostData) => p.id === Number(params.id))
        if (foundPost) {
          setPost(foundPost)
        }
      } catch (error) {
        console.error('포스트 데이터 파싱 오류:', error)
      }
    }

    fetchPost()
  }, [params.id])

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const element = document.documentElement
      const scrollTop = element.scrollTop
      const scrollHeight = element.scrollHeight - element.clientHeight
      const progress = (scrollTop / scrollHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title[language],
          url: window.location.href
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </motion.div>
      </div>
    )
  }

  const allImages = [post.image, ...(post.images || [])]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 z-50"
        style={{ width: `${readingProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${readingProgress}%` }}
        transition={{ duration: 0.1 }}
      />

      <Navigation language={language} />

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-32 right-20 w-32 h-32 bg-blue-400/5 dark:bg-blue-500/3 rounded-full blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-40 h-40 bg-cyan-400/5 dark:bg-cyan-500/3 rounded-full blur-3xl"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16 relative z-10">
        <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-2xl overflow-hidden min-h-[600px]">
          {/* Hero image section */}
          <motion.div 
            className="relative h-[220px] sm:h-[280px] md:h-[320px] w-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {allImages.length > 1 ? (
              <Swiper
                modules={[SwiperNavigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                  delay: 6000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
                }}
                className="w-full h-full"
              >
                {allImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <Image 
                        src={image} 
                        alt={`${post.title[language]} - ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 900px, 1200px"
                        quality={95}
                        className="object-contain transition-transform duration-700"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <>
                <Image 
                  src={post.image} 
                  alt={post.title[language]} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 900px, 1200px"
                  quality={95}
                  className="object-contain transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300" />
              </>
            )}
            {/* Expand button */}
            <div className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-lg rounded-xl opacity-0 transition-opacity duration-300">
              <Maximize2 className="w-5 h-5 text-white" />
            </div>
          </motion.div>
          {/* Article header */}
          <motion.div
            className="flex flex-col gap-2 px-6 pt-6 pb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
              {post.title[language]}
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-2 mt-1 w-full">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                <button
                  onClick={() => router.push('/inquiry')}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-xl transition-all duration-200 text-xs sm:text-sm min-w-[90px] max-w-full"
                >
                  <Mail className="w-4 h-4" />
                  <span>문의하기</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 text-xs sm:text-sm min-w-[90px] max-w-full"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
              <button
                onClick={() => router.push('/#community')}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-2 sm:px-3 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group text-xs sm:text-sm min-w-[110px] max-w-full"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {translate('backToList', language)}
                </span>
              </button>
            </div>
          </motion.div>
          {/* Article content */}
          <motion.div
            className="px-6 pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-base leading-relaxed font-medium text-gray-800 dark:text-gray-200 mb-0">
              {post.description[language]}
            </p>
          </motion.div>
          {/* Gallery section */}
          {post.gallery && (
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                {translate('gallery', language)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {post.gallery.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    className="cursor-pointer relative group rounded-2xl overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500"
                    onClick={() => router.push(`/gallery/${item.id}`)}
                    whileHover={{ y: -5, scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.title[language]}
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white text-xl font-bold mb-2">
                        {item.title[language]}
                      </h3>
                      <p className="text-gray-200 text-sm opacity-90">
                        클릭하여 자세히 보기
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </article>
      </main>
    </div>
  )
}