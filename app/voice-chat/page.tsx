'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Moon, Sun, Mic, MicOff } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { translate } from '../utils/translations'

// 파일 상단에 타입 정의 추가
interface SpeechRecognitionEvent {
  resultIndex: number
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string
      }
      isFinal: boolean
    }
  }
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onstart: () => void
  onend: () => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onresult: (event: SpeechRecognitionEvent) => void
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export default function VoiceChatPage() {
  const { language } = useLanguage()
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // 음성 대화 관련 상태 추가
  const [isListening, setIsListening] = useState(false)
  const [isTalking, setIsTalking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  // 음성 감지 설정
  const SILENCE_THRESHOLD = 15 // 묵음 임계값
  const SILENCE_DURATION = 1500 // 묵음 지속 시간 (1.5초)

  // 음성 파형 바들의 애니메이션을 위한 설정
  const bars = Array.from({ length: 30 }) // 30개의 파형 바
  const getRandomHeight = () => Math.random() * 50 + 10 // 10-60px 사이의 랜덤 높이

  // SpeechRecognition 설정 함수 수정
  const setupSpeechRecognition = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        throw new Error('Speech Recognition is not supported in this browser')
      }

      const recognition = new SpeechRecognition()
      
      recognition.lang = language === 'ko' ? 'ko-KR' : 'en-US'
      recognition.continuous = false  // 연속 인식 비활성화
      recognition.interimResults = true
      
      recognition.onstart = () => {
        console.log('음성 인식 시작')
        setIsListening(true)
      }
      
      recognition.onresult = (event) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        
        console.log('음성 인식 중:', transcript)
        setTranscript(transcript)
        
        if (event.results[current].isFinal) {
          console.log('🎤 최종 음성 인식 결과:', transcript)
          handleSpeechResult(transcript)
        }
      }
      
      recognition.onerror = (event) => {
        console.error('음성 인식 오류:', event.error)
        stopListening()
      }
      
      recognition.onend = () => {
        console.log('음성 인식 종료')
        // 처리 중이 아닐 때만 재시작
        if (isListening && !isProcessing) {
          console.log('음성 인식 재시작')
          recognition.start()
        }
      }

      recognitionRef.current = recognition
      return recognition
    } catch (error) {
      console.error('Speech Recognition 설정 오류:', error)
      return null
    }
  }

  // handleSpeechResult 함수 수정
  const handleSpeechResult = async (text: string) => {
    if (!text.trim() || isProcessing) return
    
    setIsProcessing(true)
    try {
      // 음성 인식 일시 중지
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (err) {
          // 중지 중 에러는 무시
        }
      }

      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      })

      if (!response.ok) throw new Error('API 응답 오류')

      const audioBlob = await response.blob()
      await playAudio(audioBlob)

      // 오디오 재생이 끝난 후 자동으로 다음 음성 인식 시작
      if (isListening) { // isListening 상태 확인 추가
        const recognition = setupSpeechRecognition()
        if (recognition) {
          recognition.start()
          setIsListening(true)
        }
      }

    } catch (error) {
      if (error instanceof Error) {
        console.warn('음성 처리가 중단되었습니다:', error.message)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // startListening 함수 수정
  const startListening = async () => {
    try {
      // 기존 리소스 정리
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }

      // Speech Recognition 새로 설정 및 시작
      const recognition = setupSpeechRecognition()
      if (recognition) {
        recognition.start()
      }

      // 오디오 분석 설정
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 2048
      source.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      
      setIsListening(true)
      monitorAudioLevel()
      
    } catch (error) {
      console.error('음성 인식 시작 오류:', error)
      stopListening()
    }
  }

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return

    const analyser = analyserRef.current
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    
    const checkLevel = () => {
      if (!isListening) return
      
      analyser.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
      
      if (average > SILENCE_THRESHOLD) {
        // 음성 감지됨
        setIsTalking(true)
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current)
          silenceTimeoutRef.current = null
        }
      } else if (isTalking) {
        // 묵음 감지
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            handleSpeechEnd()
          }, SILENCE_DURATION)
        }
      }
      
      requestAnimationFrame(checkLevel)
    }
    
    checkLevel()
  }

  const handleSpeechEnd = async () => {
    setIsTalking(false)
    // transcript가 이미 handleSpeechResult에서 처리되었으므로
    // 여기서는 상태만 초기화
    setTranscript("")
  }

  // stopListening 함수 수정
  const stopListening = () => {
    try {
      setIsProcessing(false) // 먼저 처리 상태를 false로 설정

      // 1. 현재 재생 중인 오디오 중지 - 에러 처리 추가
      if (audioPlayerRef.current) {
        try {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.src = '';
          audioPlayerRef.current = null;
        } catch (err) {
          // 오디오 중지 중 에러는 무시
        }
      }

      // 2. Web Speech Recognition 중지
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
          // 빈 함수로 이벤트 핸들러 초기화
          recognitionRef.current.onend = () => {}
          recognitionRef.current.onresult = () => {}
          recognitionRef.current.onerror = () => {}
          recognitionRef.current = null
        } catch (err) {
          // Recognition 중지 중 에러는 무시
        }
      }

      // 3. 미디어 스트림 트랙 중지
      if (mediaStreamRef.current) {
        try {
          mediaStreamRef.current.getTracks().forEach(track => {
            track.stop()
            mediaStreamRef.current?.removeTrack(track)
          })
          mediaStreamRef.current = null
        } catch (err) {
          // 미디어 스트림 중지 중 에러는 무시
        }
      }

      // 4. AudioContext 정리
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close()
          audioContextRef.current = null
        } catch (err) {
          // AudioContext 중지 중 에러는 무시
        }
      }

      // 5. AnalyserNode 연결 해제
      if (analyserRef.current) {
        try {
          analyserRef.current.disconnect()
          analyserRef.current = null
        } catch (err) {
          // Analyser 연결 해제 중 에러는 무시
        }
      }

      // 6. 타이머 정리
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
        silenceTimeoutRef.current = null
      }

      // 7. 상태 초기화
      setIsListening(false)
      setIsTalking(false)
      setTranscript("")

      console.log('음성 대화가 안전하게 종료되었습니다.')
    } catch (error) {
      console.warn('리소스 정리 중 일부 작업이 실패했습니다:', error)
    }
  }

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [])

  // 페이지 이동 시 정리를 위한 추가
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopListening()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // playAudio 함수 수정
  const playAudio = async (audioBlob: Blob): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // 이전 오디오 정리
        if (audioPlayerRef.current) {
          try {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.src = '';
          } catch (err) {
            // 이전 오디오 중지 중 에러는 무시
          }
        }

        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audioPlayerRef.current = audio;
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          audioPlayerRef.current = null;
          resolve();
        }

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl)
          audioPlayerRef.current = null;
          reject(new Error('오디오 재생이 중단되었습니다.'))
        }

        audio.play().catch(err => {
          reject(new Error('오디오 재생을 시작할 수 없습니다.'))
        })
      } catch (error) {
        reject(new Error('오디오 재생 준비 중 오류가 발생했습니다.'))
      }
    })
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* 헤더 */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b ${
        isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'
      }`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/chat" 
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } flex items-center gap-2`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>채팅으로 돌아가기</span>
            </Link>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 max-w-5xl mx-auto w-full mt-20 p-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
          <div className="w-32 h-32 relative rounded-full overflow-hidden mb-8 shadow-xl">
            <Image
              src="/pr_img3.jpg"
              alt={translate('name', language)}
              layout="fill"
              className="object-cover"
            />
          </div>

          {/* 음성 파형 애니메이션 - 상태에 따라 다르게 표시 */}
          <div className="flex items-center justify-center gap-1 mb-8 h-32">
            {bars.map((_, i) => (
              <motion.div
                key={i}
                className={`w-1 rounded-full ${
                  isTalking 
                    ? 'bg-green-500' 
                    : isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                }`}
                animate={{
                  height: isTalking 
                    ? [getRandomHeight() * 1.5, getRandomHeight() * 1.5] 
                    : isListening 
                      ? [getRandomHeight(), getRandomHeight()]
                      : "20px"
                }}
                transition={{
                  duration: isTalking ? 0.3 : 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>

          {/* 상태 메시지 */}
          <div className={`text-center max-w-md mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <h2 className="text-2xl font-bold mb-4">
              {isListening 
                ? isTalking 
                  ? "음성을 인식하고 있습니다..."
                  : "말씀해 주세요"
                : `${translate('name', language)}${translate('cloneTitle', language)}와 음성으로 대화해보세요`}
            </h2>
            <p className="text-lg opacity-75">
              {isListening 
                ? "자동으로 음성을 감지하여 대화합니다"
                : "자유롭게 말씀해주세요. 자동으로 음성을 인식하여 대화를 시작합니다."}
            </p>
          </div>

          {/* 대화 시작/종료 버튼 */}
          <motion.button
            onClick={isListening ? stopListening : startListening}
            className={`mt-12 px-8 py-4 rounded-full text-white font-medium
              ${isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } transform transition-all duration-200 hover:scale-105`}
            whileTap={{ scale: 0.95 }}
          >
            {isListening ? '대화 종료하기' : '대화 시작하기'}
          </motion.button>
        </div>
      </main>
    </div>
  )
} 