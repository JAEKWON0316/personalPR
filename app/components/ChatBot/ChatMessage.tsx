'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message } from './ChatInput'
import { Volume2, VolumeX, Loader2, Sparkles, User, Bot } from 'lucide-react'
import { toast } from 'sonner'
import { useAudio } from '@/app/contexts/AudioContext'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

// 오디오 캐시를 위한 Map 객체
const audioCache = new Map<string, { blob: Blob; timestamp: number }>()

// 캐시 만료 시간 (1시간)
const CACHE_EXPIRY = 60 * 60 * 1000

interface ChatMessageProps {
  message: Message
  isDarkMode?: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isDarkMode }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const prevPathnameRef = useRef<string | null>(null)
  
  // 로컬 상태
  const [isLoading, setIsLoading] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  // 전역 오디오 상태
  const { 
    playingMessageId, 
    isProcessing, 
    setPlayingMessageId, 
    setIsProcessing 
  } = useAudio()

  // 현재 메시지가 재생 중인지 확인
  const isThisMessagePlaying = playingMessageId === message.id

  // 다른 메시지가 재생 중인지 확인
  const isOtherMessagePlaying = playingMessageId !== null && playingMessageId !== message.id

  // 토스트 ID 참조
  const toastIdRef = useRef<string | number | null>(null)
  // 타임아웃 ID 참조
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)
  // 현재 재생 중인 메시지 ID 참조
  const currentPlayingIdRef = useRef<string | null>(null)

  // 전역 상태 변경 시 로컬 참조 업데이트
  useEffect(() => {
    currentPlayingIdRef.current = playingMessageId
    console.log('전역 상태 변경 감지: playingMessageId =', playingMessageId, 'currentPlayingIdRef =', currentPlayingIdRef.current)
  }, [playingMessageId])

  // 컴포넌트 언마운트 시 오디오 리소스 정리
  useEffect(() => {
    return () => {
      cleanupAudio()
    }
  }, [])

  // 페이지 이동 감지를 위한 useEffect
  useEffect(() => {
    const handleRouteChange = () => {
      console.log('라우트 변경 감지')
      if (audio && !audio.paused) {
        cleanupAudio()
      }
    }

    // 페이지 변경 감지
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      console.log('페이지 변경 감지: 오디오 정리')
      handleRouteChange()
    }
    prevPathnameRef.current = pathname

    // 브라우저 네비게이션 이벤트
    window.addEventListener('popstate', handleRouteChange)
    
    // 페이지 숨김/표시 이벤트
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && audio && !audio.paused) {
        cleanupAudio()
      }
    })

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [pathname, searchParams, audio])

  // 동기적인 오디오 정리를 위한 useEffect
  useEffect(() => {
    const stopAudioSync = () => {
      if (audio) {
        console.log('페이지 닫힘 감지: 즉시 오디오 중지')
        try {
          audio.pause()
          audio.currentTime = 0
          audio.src = ''
          setAudio(null)
        } catch (error) {
          console.error('동기적 오디오 정리 중 오류:', error)
        }
      }
    }

    window.addEventListener('beforeunload', stopAudioSync)
    window.addEventListener('pagehide', stopAudioSync)
    window.addEventListener('unload', stopAudioSync)

    return () => {
      window.removeEventListener('beforeunload', stopAudioSync)
      window.removeEventListener('pagehide', stopAudioSync)
      window.removeEventListener('unload', stopAudioSync)
    }
  }, [audio])

  // 링크 클릭 감지를 위한 useEffect
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const linkElement = target.tagName === 'A' ? target : target.closest('a')
      
      if (linkElement && audio && !audio.paused) {
        console.log('링크 클릭 감지: 오디오 즉시 정리')
        e.preventDefault()
        cleanupAudio()
        // 약간의 지연 후 네비게이션 진행
        setTimeout(() => {
          const href = linkElement.getAttribute('href')
          if (href) {
            router.push(href)
          }
        }, 50)
      }
    }
    
    // 캡처링 단계에서 이벤트 처리
    window.addEventListener('click', handleClick, true)

    return () => {
      window.removeEventListener('click', handleClick, true)
    }
  }, [audio, router])

  // 컴포넌트 언마운트 시 오디오 리소스 정리
  useEffect(() => {
    return () => {
      console.log('컴포넌트 언마운트: 오디오 정리')
      if (audio && !audio.paused) {
        cleanupAudio()
      }
    }
  }, [audio])

  // 오디오 리소스 정리 함수
  const cleanupAudio = () => {
    console.log('오디오 리소스 정리 시작')
    
    // 즉시 실행되어야 하는 정리 작업
    const cleanup = () => {
      if (audio) {
        try {
          // 1. 먼저 재생 중지
          audio.pause()
          
          // 2. 이벤트 리스너 제거
          audio.onended = null
          audio.oncanplaythrough = null
          audio.onloadeddata = null
          audio.onloadedmetadata = null
          audio.onerror = null
          
          // 3. 오디오 리소스 해제
          audio.src = ''
          audio.load()
          
          // 4. 상태 초기화
          setAudio(null)
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl)
            setAudioUrl(null)
            setAudioBlob(null)
          }
          
          // 5. 전역 상태 초기화
          if (isThisMessagePlaying) {
            setPlayingMessageId(null)
            setIsProcessing(false)
          }
          setIsLoading(false)
          
          // 6. 토스트 정리
          if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current)
            toastIdRef.current = null
          }
          
          // 7. 타임아웃 정리
          if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current)
            timeoutIdRef.current = null
          }
          
          console.log('오디오 리소스 정리 완료')
        } catch (error) {
          console.error('오디오 정리 중 오류:', error)
        }
      }
    }
    
    // 즉시 실행
    cleanup()
  }

  // 캐시에서 오디오 가져오기
  const getAudioFromCache = (text: string) => {
    const cached = audioCache.get(text)
    if (cached) {
      const isExpired = Date.now() - cached.timestamp > CACHE_EXPIRY
      if (isExpired) {
        audioCache.delete(text)
        return null
      }
      return cached.blob
    }
    return null
  }

  // 오디오 재생 시작
  const startPlayback = (newAudio: HTMLAudioElement, toastId: string | number, currentMessageId: string) => {
    console.log('재생 시작: 현재 메시지 ID =', currentMessageId, 'currentPlayingIdRef =', currentPlayingIdRef.current)
    
    if (currentPlayingIdRef.current !== currentMessageId) {
      console.log('재생 시작 시 메시지 ID 불일치, 재생 중단')
      return
    }
    
    const safePlay = () => {
      if (currentPlayingIdRef.current !== currentMessageId) {
        console.log('재생 직전 메시지 ID 불일치 감지, 재생 취소')
        return
      }
      
      newAudio.play().then(() => {
        console.log('오디오 재생 시작 성공')
        setIsLoading(false)
        setIsProcessing(false)
        toast.dismiss(toastId)
        
        // 재생 완료 시 상태 초기화
        newAudio.onended = () => {
          console.log('재생 완료, 상태 초기화')
          // 재생 완료 시에도 메시지 ID 확인
          if (currentPlayingIdRef.current === currentMessageId) {
            setPlayingMessageId(null)
            setIsProcessing(false)
          }
        }
        
        newAudio.onerror = (error) => {
          console.error('오디오 재생 중 오류:', error)
          toast.error('오디오 재생 중 오류가 발생했습니다')
          if (currentPlayingIdRef.current === currentMessageId) {
            setPlayingMessageId(null)
            setIsProcessing(false)
          }
        }
      }).catch(error => {
        console.error('오디오 재생 실패:', error)
        toast.error('오디오 재생에 실패했습니다')
        setPlayingMessageId(null)
        setIsProcessing(false)
        setIsLoading(false)
      })
    }
    
    // 오디오가 준비되면 재생
    if (newAudio.readyState >= 3) { // HAVE_FUTURE_DATA
      console.log('오디오 준비 완료, 즉시 재생')
      safePlay()
    } else {
      console.log('오디오 로딩 대기 중...')
      newAudio.oncanplaythrough = () => {
        console.log('오디오 로딩 완료, 재생 시작')
        safePlay()
      }
    }
  }

  // 오디오 객체 설정
  const setupAudioObject = (blob: Blob, toastId: string | number, currentMessageId: string) => {
    // 컴포넌트가 언마운트되었거나 다른 메시지로 변경된 경우 중단
    if (currentPlayingIdRef.current !== currentMessageId) {
      console.log('setupAudioObject: 메시지 ID 불일치로 설정 중단')
      return
    }
    
    try {
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      setAudioBlob(blob)
      
      const newAudio = new Audio(url)
      setAudio(newAudio)
      
      console.log('오디오 객체 설정 완료')
      
      // 안전한 재생 시작 함수
      const safeStartPlayback = () => {
        // 컴포넌트 상태 재확인
        if (currentPlayingIdRef.current !== currentMessageId) {
          console.log('safeStartPlayback: 메시지 ID 불일치로 재생 중단')
          return
        }
        
        startPlayback(newAudio, toastId, currentMessageId)
      }
      
      // iOS Safari 호환성을 위한 추가 처리
      if (newAudio.readyState >= 1) { // HAVE_METADATA
        console.log('메타데이터 로드 완료, 재생 준비')
        safeStartPlayback()
      } else {
        console.log('메타데이터 로딩 중...')
        newAudio.onloadedmetadata = () => {
          console.log('메타데이터 로딩 완료')
          safeStartPlayback()
        }
        
        newAudio.onloadeddata = () => {
          console.log('데이터 로딩 완료')
          safeStartPlayback()
        }
        
        // 로딩 타임아웃 설정 (30초)
        timeoutIdRef.current = setTimeout(() => {
          console.log('오디오 로딩 타임아웃')
          toast.error('오디오 로딩 시간이 초과되었습니다')
          setPlayingMessageId(null)
          setIsProcessing(false)
          setIsLoading(false)
        }, 30000)
      }
      
      // 오디오 로드 오류 처리
      newAudio.onerror = (error) => {
        console.error('오디오 로드 오류:', error)
        toast.error('오디오 파일을 로드할 수 없습니다')
        setPlayingMessageId(null)
        setIsProcessing(false)
        setIsLoading(false)
      }
      
    } catch (error) {
      console.error('오디오 객체 설정 오류:', error)
      toast.error('오디오 설정 중 오류가 발생했습니다')
      setPlayingMessageId(null)
      setIsProcessing(false)
      setIsLoading(false)
    }
  }

  // TTS API 호출 및 재생
  const playTTS = async () => {
    // 중복 실행 방지
    if (isThisMessagePlaying && !isLoading) {
      console.log('재생 중이므로 중지')
      cleanupAudio()
      return
    }
    
    if (isLoading) {
      console.log('음성 변환 중이므로 작업 불가')
      return
    }
    
    // 다른 메시지가 재생 중이거나 처리 중이면 중복 실행 방지
    if (isOtherMessagePlaying || (isProcessing && !isThisMessagePlaying)) {
      console.log('다른 메시지 재생 중이거나 처리 중이므로 작업 불가')
      return
    }
    
    // 처리 시작
    console.log('재생 시작 전 상태: playingMessageId =', playingMessageId)
    setIsProcessing(true)
    setPlayingMessageId(message.id)
    setIsLoading(true)
    
    // 현재 메시지 ID를 로컬 변수와 참조에 저장 (상태 업데이트는 비동기적이므로)
    const currentMessageId = message.id
    currentPlayingIdRef.current = currentMessageId
    console.log('재생 시작: currentMessageId =', currentMessageId, 'currentPlayingIdRef =', currentPlayingIdRef.current)
    
    // 상태 업데이트 확인을 위한 즉시 실행 함수
    setTimeout(() => {
      console.log('상태 업데이트 확인: playingMessageId =', playingMessageId, 'currentPlayingIdRef =', currentPlayingIdRef.current)
    }, 0)
    
    try {
      // 토스트 메시지 표시
      const toastId = toast.loading('목소리 가다듬는 중...', {
        className: 'dark-toast toast-info'
      })
      toastIdRef.current = toastId
      
      // 이미 변환된 오디오가 있는 경우 (재생 중지 후 다시 재생)
      if (audioBlob) {
        setupAudioObject(audioBlob, toastId, currentMessageId)
        return
      }
      
      // 캐시에서 오디오 확인
      const cachedAudio = getAudioFromCache(message.content)
      
      if (cachedAudio) {
        setupAudioObject(cachedAudio, toastId, currentMessageId)
      } else {
        // API 호출
        try {
          const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              text: message.content,
              voice_settings: {
                stability: 0.3,
                similarity_boost: 0.8,
              }
            }),
          })
          if (!response.ok) {
            toast.dismiss(toastId)
            toast.error('AI 음성 서버가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도해 주세요.', { className: 'dark-toast toast-error' })
            setPlayingMessageId(null)
            setIsProcessing(false)
            setIsLoading(false)
            return
          }
          const newAudioBlob = await response.blob()
          if (newAudioBlob.size === 0) {
            toast.dismiss(toastId)
            toast.error('AI 음성 응답이 없습니다. 잠시 후 다시 시도해 주세요.', { className: 'dark-toast toast-error' })
            setPlayingMessageId(null)
            setIsProcessing(false)
            setIsLoading(false)
            return
          }
          audioCache.set(message.content, {
            blob: newAudioBlob,
            timestamp: Date.now()
          })
          setupAudioObject(newAudioBlob, toastId, currentMessageId)
        } catch (apiError) {
          toast.dismiss(toastId)
          toast.error('AI 음성 서버 연결에 문제가 있습니다. 잠시 후 다시 시도해 주세요.', { className: 'dark-toast toast-error' })
          setPlayingMessageId(null)
          setIsProcessing(false)
          setIsLoading(false)
        }
      }
    } catch (error) {
      toast.error('알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', { className: 'dark-toast toast-error' })
      setPlayingMessageId(null)
      setIsProcessing(false)
      setIsLoading(false)
    }
  }

  const isUser = message.role === 'user'
  
  // 버튼 비활성화 상태 계산
  const isButtonDisabled = isOtherMessagePlaying || (isProcessing && !isThisMessagePlaying) || (isLoading && isThisMessagePlaying)

  // 버튼 상태에 따른 아이콘 및 툴팁 결정
  const getButtonState = () => {
    if (isThisMessagePlaying && !isLoading) {
      return {
        icon: <VolumeX className="w-4 h-4" />,
        tooltip: '음성 중지',
        disabled: false
      }
    }
    
    if (isLoading && isThisMessagePlaying) {
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        tooltip: '음성 변환 중...',
        disabled: true // 로딩 중에는 클릭 불가능하도록 변경
      }
    }
    
    if (isOtherMessagePlaying) {
      return {
        icon: <Volume2 className="w-4 h-4" />,
        tooltip: '다른 메시지 재생 중',
        disabled: true
      }
    }
    
    if (isProcessing && !isThisMessagePlaying) {
      return {
        icon: <Volume2 className="w-4 h-4" />,
        tooltip: '오디오 처리 중',
        disabled: true
      }
    }
    
    return {
      icon: <Volume2 className="w-4 h-4" />,
      tooltip: '음성으로 듣기',
      disabled: false
    }
  }
  
  const buttonState = getButtonState()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}
    >
      <div className={`flex items-end gap-2 max-w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`} style={{ width: '100%' }}>
        {/* Avatar */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex-shrink-0"
        >
          {isUser ? (
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white ring-2 ring-blue-300/50">
              <User className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-300/50 shadow-lg">
              <img src="/profile.png" alt="AI Assistant" className="w-full h-full object-cover rounded-full" />
            </div>
          )}
        </motion.div>
        {/* Bubble + TTS 버튼 컨테이너 */}
        <div className="relative flex flex-col items-stretch max-w-[85vw] sm:max-w-[70vw]" style={{ minWidth: 0 }}>
          {/* 메시지 Bubble */}
          <div
            className={`relative backdrop-blur-2xl rounded-3xl px-5 py-3 shadow-xl border ${
              isUser
                ? 'bg-gradient-to-br from-blue-500/90 to-cyan-500/90 text-white border-white/20 ml-2'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border-gray-200/50 dark:border-gray-600/50 mr-2'
            } ${isUser ? 'rounded-br-lg' : 'rounded-bl-lg'} min-w-[40px]`}
            style={{ wordBreak: 'break-word', minWidth: 0 }}
          >
            <p className="whitespace-pre-wrap break-words leading-relaxed text-sm md:text-base">
              {message.content}
            </p>
            {/* 타임스탬프 - bubble 내부 하단 오른쪽/왼쪽 */}
            <div className={`flex w-full mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              <span className={`text-xs ${isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>{new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {/* Subtle glow effect for playing message */}
            {isThisMessagePlaying && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl -z-10"
              />
            )}
          </div>
          {/* TTS 버튼 - bubble 바깥 오른쪽 하단에 absolute로 배치 */}
          {message.role === 'assistant' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={playTTS}
              disabled={buttonState.disabled}
              className={`absolute -right-4 bottom-0 translate-y-1/2 flex-shrink-0 p-2 rounded-xl transition-all duration-300 shadow-md bg-gray-100/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 z-10 ${
                buttonState.disabled 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:shadow-lg'
              } ${
                isLoading && isThisMessagePlaying
                  ? 'cursor-not-allowed opacity-50 pointer-events-none'
                  : ''
              } ${
                isThisMessagePlaying && !isLoading
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : ''
              }`}
              title={buttonState.tooltip}
              style={{ minWidth: 32, minHeight: 32 }}
            >
              {buttonState.icon}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage