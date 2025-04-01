'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from 'lucide-react'
import { translate } from '../utils/translations'
import { useLanguage } from '../contexts/LanguageContext'
import Navigation from '../components/Navigation'
import Link from 'next/link'

interface VideoSources {
  [key: string]: string;
}

export default function GreetingVideo() {
  const { language } = useLanguage() as { language: 'ko' | 'en' | 'ja' | 'zh' }
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [translatedTitle, setTranslatedTitle] = useState('')
  const [translatedDescription, setTranslatedDescription] = useState('')

  const videoSources: VideoSources = {
    ko: "/jaekwon002.mp4",
    en: "/jaekwon002.mp4",
    ja: "/jaekwon002.mp4",
    zh: "/jaekwon002.mp4"
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleEnded = () => setIsPlaying(false)
      video.addEventListener('ended', handleEnded)
      return () => video.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    async function translateContent() {
      try {
        const title = '희미해지는 것이 아닌,\n더 깊이 새겨지는\n당신의 존재'
        const description = '인간의 존엄이 위협받는 AI 시대에도,\n당신의 이야기는 결코 흐려지지 않습니다.\n\nInnoCard는 당신의 가치를 더 선명하고,\n더 오래도록 기억하게 만듭니다.'

        if (language === 'ko') {
          setTranslatedTitle(title)
          setTranslatedDescription(description)
          return
        }

        const [titleTranslation, descTranslation] = await Promise.all([
          translate(title, language),
          translate(description, language)
        ])

        setTranslatedTitle(titleTranslation)
        setTranslatedDescription(descTranslation)
      } catch (error) {
        console.error('Translation error:', error)
      }
    }

    translateContent()
  }, [language, translate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      <main className="flex-grow pt-16 pb-12 px-4 min-h-screen">
        <div className="h-full max-w-8xl mx-auto">
          <Card className="w-full h-full bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b">
              <div className="max-w-8xl mx-auto w-full flex justify-between items-center px-4">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </Link>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {translate('greetingVideo', language)}
                </CardTitle>
                <div className="w-20" /> {/* 균형을 위한 빈 공간 */}
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-12 items-stretch h-full">
                {/* 비디오 섹션 */}
                <div className="w-full lg:w-3/5 lg:sticky lg:top-8">
                  <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl">
                    <div className="relative w-full h-full">
                      <video 
                        ref={videoRef}
                        src={videoSources[language] || videoSources['en']}
                        className="w-full h-full object-cover"
                        playsInline
                      >
                        Your browser does not support the video tag.
                      </video>
                      <button 
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-all duration-300"
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      >
                        <div className="transform transition-transform duration-300 hover:scale-110">
                          {isPlaying ? (
                            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="6" y="4" width="4" height="16" />
                              <rect x="14" y="4" width="4" height="16" />
                            </svg>
                          ) : (
                            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 텍스트 섹션 */}
                <div className="w-full lg:w-2/5 relative">
                  <div className="relative px-8 py-10 text-center bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm h-full flex flex-col justify-center">
                    <div className="relative z-10">
                      <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                        {translatedTitle.split('\n').map((line, i) => (
                          <p key={i} className="mb-1">{line}</p>
                        ))}
                      </h2>
                      <div className="text-lg text-gray-600 leading-normal">
                        {translatedDescription.split('\n').map((line, i) => (
                          <p key={i} className="mb-3">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 