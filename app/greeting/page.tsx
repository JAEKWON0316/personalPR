'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings, Download } from 'lucide-react'
import { translate } from '../utils/translations'
import { useLanguage } from '../hooks/useLanguage'
import Navigation from '../components/Navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function GreetingVideo() {
  const { language } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  
  // Video states
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  
  // UI states
  const [translatedTitle, setTranslatedTitle] = useState('')
  const [translatedDescription, setTranslatedDescription] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null)

  // 모바일 환경 감지
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const videoSources = {
    ko: "/greetingvideo/greetingko.mp4",
    en: "/greetingvideo/greetingen.mp4",
    ja: "/greetingvideo/greetingja.mp4",
    zh: "/greetingvideo/greetingzh.mp4"
  }

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

  // Control visibility management
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true)
    if (controlsTimeout) clearTimeout(controlsTimeout)
    const timeout = setTimeout(() => setShowControls(false), 3000)
    setControlsTimeout(timeout)
  }, [controlsTimeout])

  const handleMouseMove = useCallback(() => {
    if (isPlaying) {
      showControlsTemporarily()
    }
  }, [isPlaying, showControlsTemporarily])

  // Video control functions
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }, [isPlaying])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }, [])

  const handleProgressClick = useCallback((e: React.MouseEvent) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const width = rect.width
      const newTime = (clickX / width) * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }, [duration])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted
      videoRef.current.muted = newMuted
      setIsMuted(newMuted)
    }
  }, [isMuted])

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const skipTime = useCallback((seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }, [currentTime, duration])

  const changePlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
      setShowSettings(false)
    }
  }, [])

  // Format time helper
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target === document.body) {
        switch (e.code) {
          case 'Space':
            e.preventDefault()
            togglePlay()
            break
          case 'ArrowLeft':
            skipTime(-10)
            break
          case 'ArrowRight':
            skipTime(10)
            break
          case 'KeyM':
            toggleMute()
            break
          case 'KeyF':
            toggleFullscreen()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [togglePlay, skipTime, toggleMute, toggleFullscreen])

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)
      const handleEnded = () => setIsPlaying(false)
      const handleWaiting = () => setIsLoading(true)
      const handleCanPlay = () => setIsLoading(false)

      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)
      video.addEventListener('ended', handleEnded)
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('waiting', handleWaiting)
      video.addEventListener('canplay', handleCanPlay)

      return () => {
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('waiting', handleWaiting)
        video.removeEventListener('canplay', handleCanPlay)
      }
    }
  }, [handleTimeUpdate, handleLoadedMetadata])

  // Translation effect
  useEffect(() => {
    async function translateContent() {
      try {
        setTranslatedTitle(translate('greetingTitle', language))
        setTranslatedDescription(translate('greetingDescription', language))
      } catch (error) {
        console.error('Translation error:', error)
      }
    }
    translateContent()
  }, [language])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
      
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-100/20 dark:bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Navigation */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-black/20 backdrop-blur-2xl border-b border-white/10"
      >
        <Navigation language={language} />
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto pt-24 pb-12 px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden bg-white/70 dark:bg-gray-900/30 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
            
            {/* Enhanced Header */}
            <CardHeader className="relative z-10 border-b border-white/20 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/20 backdrop-blur-xl">
              <div className="flex justify-between items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/" 
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/30 dark:bg-gray-800/20 hover:bg-white/50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                  </Link>
                </motion.div>
                
                <CardTitle className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  {translate('greetingVideo', language)}
                </CardTitle>
                
                <div className="invisible flex items-center gap-3 px-4 py-2">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 p-6 md:p-8">
              
              {/* Cinematic Video Player */}
              <div className="max-w-4xl mx-auto mb-8">
                <motion.div
                  ref={containerRef}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative bg-white dark:bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setShowControls(false)}
                >
                  
                  {/* Video Element */}
                  <video 
                    ref={videoRef}
                    src={videoSources[language] || videoSources['en']}
                    className="w-full aspect-video object-contain bg-black dark:bg-black cursor-pointer"
                    playsInline
                    poster="/greetingvideo/thumbnail.png"
                    onClick={togglePlay}
                    controls={false}
                    style={{ touchAction: 'manipulation' }}
                  >
                    Your browser does not support the video tag.
                  </video>

                  {/* Loading Overlay */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center"
                      >
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Play Button Overlay */}
                  <AnimatePresence>
                    {!isPlaying && !isLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={togglePlay}
                      >
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/30 shadow-xl">
                          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Enhanced Controls - 모바일에서는 숨김 */}
                  {!isMobile && (
                    <AnimatePresence>
                      {showControls && (
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 50 }}
                          transition={{ duration: 0.3 }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-6"
                          style={{
                            paddingBottom: 'env(safe-area-inset-bottom, 12px)',
                            minHeight: '56px',
                            zIndex: 20
                          }}
                        >
                          {/* Progress Bar */}
                          <div 
                            ref={progressRef}
                            className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4 group"
                            onClick={handleProgressClick}
                          >
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full relative group-hover:h-3 transition-all duration-200"
                              style={{ width: `${(currentTime / duration) * 100}%` }}
                            >
                              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            
                            {/* Left Controls */}
                            <div className="flex items-center gap-4">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={togglePlay}
                                className="p-2 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-all duration-200"
                              >
                                {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" fill="currentColor" />}
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => skipTime(-10)}
                                className="p-2 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-all duration-200"
                              >
                                <SkipBack className="w-5 h-5 text-white" />
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => skipTime(10)}
                                className="p-2 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-all duration-200"
                              >
                                <SkipForward className="w-5 h-5 text-white" />
                              </motion.button>

                              {/* Volume Control */}
                              <div className="flex items-center gap-2 group">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={toggleMute}
                                  className="p-2 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-all duration-200"
                                >
                                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                                </motion.button>
                                
                                <motion.div
                                  initial={{ width: 0, opacity: 0 }}
                                  animate={{ width: 80, opacity: 1 }}
                                  exit={{ width: 0, opacity: 0 }}
                                  className="group-hover:block hidden"
                                >
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                  />
                                </motion.div>
                              </div>

                              <span className="text-white/80 text-sm font-medium">
                                {formatTime(currentTime)} / {formatTime(duration)}
                              </span>
                            </div>

                            {/* Right Controls */}
                            <div className="flex items-center gap-2">
                              
                              {/* Settings */}
                              <div className="relative">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setShowSettings(!showSettings)}
                                  className="p-2 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-all duration-200"
                                >
                                  <Settings className="w-5 h-5 text-white" />
                                </motion.button>
                                
                                <AnimatePresence>
                                  {showSettings && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                      className="absolute bottom-12 right-0 bg-black/80 backdrop-blur-xl rounded-lg p-3 min-w-[120px]"
                                    >
                                      <div className="text-white/80 text-sm mb-2">Playback Speed</div>
                                      {playbackRates.map((rate) => (
                                        <button
                                          key={rate}
                                          onClick={() => changePlaybackRate(rate)}
                                          className={`block w-full text-left px-3 py-1 text-sm rounded hover:bg-white/20 transition-colors ${
                                            playbackRate === rate ? 'text-cyan-400 bg-white/10' : 'text-white/80'
                                          }`}
                                        >
                                          {rate}x
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleFullscreen}
                                className="p-2 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-all duration-200"
                              >
                                {isFullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              </div>

              {/* Enhanced Content Sections */}
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Video Description */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700/30"
                >
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                      {translate('greetingTitle', language).split('\n').map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </h3>
                    <div className="text-lg leading-relaxed space-y-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-100">
                      {translate('greetingDescription', language).split('\n\n').map((paragraph, i) => (
                        <p key={i}>
                          {paragraph.split('\n').map((line, j) => (
                            <span key={j} className="block">{line}</span>
                          ))}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
                {/* Video Script 카드 및 대본 코드 완전 제거 */}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
} 