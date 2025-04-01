'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send, AlertCircle, CheckCircle, XCircle, Square, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isDarkMode?: boolean
  isVoiceMode?: boolean
  placeholder?: string
}

export default function ChatInput({ onSendMessage, isDarkMode, isVoiceMode, placeholder = '메시지를 입력하세요...' }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const showError = (message: string) => {
    setErrorMessage(message)
    setSuccessMessage(null)
    setTimeout(() => setErrorMessage(null), 3000)
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setErrorMessage(null)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  // 현재 상태에 따른 placeholder 텍스트 반환
  const getPlaceholder = () => {
    if (isListening) {
      return '음성인식 중입니다...'
    }
    return placeholder
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  const startRecording = async () => {
    try {
      console.log('Starting recording...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      // 오디오 컨텍스트 생성 및 분석기 설정
      const audioContext = new AudioContext()
      const audioSource = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      audioSource.connect(analyser)

      let hasSound = false
      const checkAudioLevel = () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(dataArray)
        
        // 음성 신호의 평균 크기 계산
        const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length
        
        // 임계값 (0-255 범위에서 10은 매우 낮은 소리를 의미)
        if (average > 10) {
          hasSound = true
        }
      }

      // 100ms마다 음성 레벨 체크
      const audioLevelInterval = setInterval(checkAudioLevel, 100)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        clearInterval(audioLevelInterval)
        audioContext.close()
      }

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      setIsListening(true)
      mediaRecorder.start(100)

      // 녹음 종료 시 무음 체크
      setTimeout(() => {
        if (isListening && mediaRecorderRef.current) {
          if (!hasSound) {
            stopRecording()
            showError('음성이 감지되지 않았습니다. 다시 시도해주세요.')
          } else {
            stopRecording()
          }
        }
      }, 30000)

    } catch (error) {
      console.error('Recording error:', error)
      showError('마이크 접근에 실패했습니다.')
      setIsListening(false)
      mediaRecorderRef.current = null
    }
  }

  const stopRecording = async () => {
    console.log('Stopping recording attempt...')
    if (!mediaRecorderRef.current || !isListening) {
      console.log('No active recording to stop')
      setIsListening(false)
      return
    }

    try {
      setIsListening(false)
      setIsProcessing(true)

      // 녹음된 데이터 처리를 위한 Promise 생성
      const recordingData = new Promise<Blob[]>((resolve) => {
        const currentRecorder = mediaRecorderRef.current
        if (currentRecorder) {
          const handleStop = () => {
            resolve(audioChunksRef.current)
            currentRecorder.removeEventListener('stop', handleStop)
          }
          currentRecorder.addEventListener('stop', handleStop)
          currentRecorder.stop()
          currentRecorder.stream.getTracks().forEach(track => track.stop())
        } else {
          resolve([])
        }
      })

      // 녹음 데이터 대기
      const chunks = await recordingData
      
      // 녹음 데이터가 없는 경우
      if (chunks.length === 0) {
        showError('음성이 인식되지 않았습니다.')
        return
      }

      const audioBlob = new Blob(chunks, { type: 'audio/wav' })
      
      // 녹음 길이 체크 (1초 미만)
      const duration = chunks.reduce((acc, chunk) => acc + chunk.size, 0) / 16000 // 대략적인 계산
      if (duration < 1) {
        showError('음성이 너무 짧습니다. 1초 이상 말씀해 주세요.')
        return
      }

      // API 호출
      const formData = new FormData()
      formData.append('audio', audioBlob)

      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        body: formData
      })

      // 응답 헤더에서 에러 여부 확인
      const isError = response.headers.get('x-error') === 'true'

      if (response.ok && !isError) {  // 성공적인 응답이고 에러가 아닌 경우에만
        showSuccess('음성이 성공적으로 등록되었습니다.')
        const audioBlob = await response.blob()
        await playAudio(audioBlob)
      } else {
        // 에러 응답이 음성인 경우
        if (response.headers.get('Content-Type') === 'audio/mpeg') {
          const audioBlob = await response.blob()
          showError('음성 인식에 실패하였습니다.')
          await playAudio(audioBlob)
        } else {
          const errorData = await response.json()
          showError(errorData.error || '음성 인식에 실패하였습니다.')
        }
      }

    } catch (error) {
      console.error('Stop recording error:', error)
      showError('음성 인식에 실패하였습니다.')
    } finally {
      setIsProcessing(false)
      mediaRecorderRef.current = null
      audioChunksRef.current = []
    }
  }

  const toggleListening = async () => {
    try {
      if (isListening) {
        console.log('Attempting to stop recording...')
        await stopRecording()
      } else {
        console.log('Attempting to start recording...')
        await startRecording()
      }
    } catch (error) {
      console.error('Toggle listening error:', error)
      showError('마이크 작동 중 오류가 발생했습니다.')
      // 에러 발생 시 상태 초기화
      setIsListening(false)
      mediaRecorderRef.current = null
      audioChunksRef.current = []
    }
  }

  // 음성 재생 중지
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  // 음성 재생 시작
  const playAudio = async (audioBlob: Blob) => {
    try {
      const audioUrl = URL.createObjectURL(audioBlob)
      
      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => setIsPlaying(true)
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }
      audio.onerror = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
        showError('음성 재생 중 오류가 발생했습니다.')
      }

      await audio.play()
    } catch (error) {
      console.error('Audio playback error:', error)
      showError('음성 재생 중 오류가 발생했습니다.')
    }
  }

  // 컴포넌트 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }
    }
  }, [])

  // 음성 모드일 때는 자동으로 마이크 시작
  useEffect(() => {
    if (isVoiceMode && !isListening && !isPlaying) {
      startRecording()
    }
  }, [isVoiceMode])

  // 음성 모드가 꺼질 때 녹음 중지
  useEffect(() => {
    if (!isVoiceMode && isListening) {
      stopRecording()
    }
  }, [isVoiceMode])

  return (
    <div className="w-full relative">
      {/* 알림 메시지 */}
      <AnimatePresence>
        {(errorMessage || successMessage) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 right-0 mb-2"
          >
            {errorMessage && (
              <div className={`rounded-lg px-4 py-2 bg-red-50 border border-red-200 shadow-sm
                flex items-center gap-2 text-sm text-red-600`}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="p-1 hover:bg-red-100 rounded-full"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}
            {successMessage && (
              <div className={`rounded-lg px-4 py-2 bg-green-50 border border-green-200 shadow-sm
                flex items-center gap-2 text-sm text-green-600`}
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{successMessage}</span>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="p-1 hover:bg-green-100 rounded-full"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            className={`w-full p-3 pr-12 rounded-lg border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300'
            } ${errorMessage ? 'border-red-500' : ''} 
            ${successMessage ? 'border-green-500' : ''}`}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={isPlaying ? stopAudio : toggleListening}
              className={`p-2 rounded-full transition-all duration-200 ${
                isPlaying
                  ? `${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`
                  : isProcessing
                    ? `${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`
                    : isListening 
                      ? 'text-red-500 bg-red-50' 
                      : isDarkMode 
                        ? 'text-gray-400 hover:text-gray-200' 
                        : 'text-gray-600 hover:text-gray-800'
              }`}
              disabled={isProcessing}
            >
              {isPlaying ? (
                <Square className="w-5 h-5" />
              ) : isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={!input.trim()}
          className={`p-3 rounded-lg transition-all duration-200 ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700'
              : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200'
          } text-white disabled:cursor-not-allowed
          transform hover:scale-105 active:scale-95`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}