'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Download, ZoomIn, ZoomOut, RotateCw, Heart, Share2, Maximize, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Navigation from '@/app/components/Navigation'
import { useLanguage } from '@/app/hooks/useLanguage'
import { storage } from '@/app/utils/storage'
import { Language } from '../../utils/translations'

interface GalleryItem {
  id: number;
  title: { [key in Language]: string };
  image: string;
  description: { [key in Language]: string };
  content: { [key in Language]: string };
}

export default function GalleryPage() {
  const router = useRouter()
  const params = useParams()
  const { language } = useLanguage()
  const [gallery, setGallery] = useState<GalleryItem | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const galleryId = parseInt(params.id as string)
    const emptyLangObj = {
      ko: '로딩 중...',
      en: 'Loading...',
      ja: '読み込み中...',
      zh: '加载中...'
    };
    setGallery({
      id: galleryId,
      title: emptyLangObj,
      image: '',
      description: emptyLangObj,
      content: emptyLangObj,
    })
    // 서버에서 데이터를 받아오는 로직 추가
    // 예: fetch(`/api/gallery/${galleryId}`)
    // 데이터를 받으면 setGallery(data)
    // 데이터를 받지 못하면 router.push('/')
  }, [params.id, router])

  // Auto-hide controls in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const timer = setTimeout(() => setShowControls(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowControls(true)
    }
  }, [isFullscreen, showControls])

  const handleDownload = () => {
    if (gallery) {
      const link = document.createElement('a')
      link.href = gallery.image
      link.download = `gallery-${gallery.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = async () => {
    if (navigator.share && gallery) {
      try {
        await navigator.share({
          title: gallery.title[language],
          url: window.location.href
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  const resetView = () => {
    setZoom(1)
    setRotation(0)
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">로딩 중...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation language={language} />
      
      {/* Main Content */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">뒤로 가기</span>
            </button>

            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {gallery.title[language]}
            </h1>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isLiked 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image Viewer */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-2xl overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ scale: zoom, rotate: rotation }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <Image 
                      src={gallery.image} 
                      alt={gallery.title[language]} 
                      fill
                      className="object-contain"
                      onLoadingComplete={() => setImageLoaded(true)}
                      priority
                    />
                  </motion.div>

                  {/* Loading overlay */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Image controls */}
                  <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/20 backdrop-blur-lg rounded-xl p-2">
                    <button
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="줌 아웃"
                    >
                      <ZoomOut className="w-4 h-4 text-white" />
                    </button>
                    
                    <span className="text-white text-sm font-medium px-2">
                      {Math.round(zoom * 100)}%
                    </span>
                    
                    <button
                      onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="줌 인"
                    >
                      <ZoomIn className="w-4 h-4 text-white" />
                    </button>
                    
                    <button
                      onClick={() => setRotation(rotation + 90)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="회전"
                    >
                      <RotateCw className="w-4 h-4 text-white" />
                    </button>

                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="전체화면"
                    >
                      <Maximize className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Reset view button */}
                  {(zoom !== 1 || rotation !== 0) && (
                    <motion.button
                      onClick={resetView}
                      className="absolute bottom-4 left-4 px-4 py-2 bg-black/20 backdrop-blur-lg rounded-xl text-white text-sm font-medium hover:bg-black/30 transition-colors"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      원본 보기
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Information Panel */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Description Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">설명</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {gallery.description[language]}
                </p>
              </div>

              {/* Content Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">상세 내용</h3>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {gallery.content[language]}
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">액션</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    <span>이미지 다운로드</span>
                  </button>
                  
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Maximize className="w-5 h-5" />
                    <span>전체화면 보기</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            {/* Fullscreen controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  className="absolute top-4 right-4 flex items-center space-x-2 bg-black/50 backdrop-blur-lg rounded-xl p-2 z-10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setZoom(Math.max(0.5, zoom - 0.25))
                    }}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <ZoomOut className="w-4 h-4 text-white" />
                  </button>
                  
                  <span className="text-white text-sm font-medium px-2">
                    {Math.round(zoom * 100)}%
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setZoom(Math.min(3, zoom + 0.25))
                    }}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-white" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setRotation(rotation + 90)
                    }}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <RotateCw className="w-4 h-4 text-white" />
                  </button>
                  
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="relative max-w-full max-h-full"
              style={{ scale: zoom, rotate: rotation }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              onMouseMove={() => setShowControls(true)}
            >
              <Image 
                src={gallery.image} 
                alt={gallery.title[language]} 
                width={1200}
                height={900}
                className="object-contain max-w-full max-h-full"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 