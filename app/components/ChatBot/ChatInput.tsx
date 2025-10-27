'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useAudio } from '@/app/contexts/AudioContext'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { translate } from '@/app/utils/translations'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
  id: string
}

interface ChatInputProps {
  onSendMessage: (message: string) => void
  placeholder?: string
  isDarkMode?: boolean
  isVoiceMode?: boolean
  disabled?: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = '메시지를 입력하세요...',
  isDarkMode,
  isVoiceMode,
  disabled = false,
}) => {
  const { language } = useLanguage()
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLocalProcessing, setIsLocalProcessing] = useState(false)
  const [audioLevel, setAudioLevel] = useState<number>(0)
  const [isFocused, setIsFocused] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)
  const recordingStartRef = useRef<number | null>(null)
  const mimeTypeRef = useRef<string>('audio/webm')
  
  const { isProcessing, setIsProcessing } = useAudio()

  // 음성 검증을 위한 무효한 구문 목록 추가
  const invalidPhrases = [
    '끝',
    '완성',
    'MBC 뉴스 이덕영입니다.'
  ];

  // 텍스트 검증 함수
  const validateText = (text: string): string | null => {
    // 1. 빈 텍스트 체크
    if (!text?.trim()) {
      return null;
    }

    // 2. 너무 짧은 텍스트 체크
    if (text.trim().length < 2) {
      return null;
    }

    // 3. 의미 없는 텍스트 체크
    if (invalidPhrases.some(phrase => 
      text.toLowerCase().includes(phrase.toLowerCase())
    )) {
      return null;
    }

    return text.trim();
  };

  // 텍스트 입력 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  // 음성 데이터 처리 (STT API 호출)
  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsLocalProcessing(true)
      
      // MIME 타입에 따른 파일 확장자 결정
      const fileExtension = audioBlob.type.includes('wav') 
        ? 'wav' 
        : audioBlob.type.includes('mp3') 
          ? 'mp3' 
          : 'webm';
      
      const fileName = `recording.${fileExtension}`;
      console.log('STT API 요청 파일:', { name: fileName, type: audioBlob.type, size: audioBlob.size });
      
      const formData = new FormData()
      formData.append('audio', audioBlob, fileName)

      const response = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('음성 변환에 실패했습니다.')
      }

      const data = await response.json()
      
      // 음성 인식 결과 검증
      const validatedText = data.text ? validateText(data.text) : null;
      
      if (validatedText) {
        onSendMessage(validatedText)
        toast.success('음성 인식이 완료되었습니다')
      } else {
        // 음성이 인식되지 않았거나 유효하지 않은 텍스트인 경우
        toast.error('음성이 감지되지 않았습니다.')
      }
    } catch (error) {
      console.error('음성 처리 오류:', error)
      toast.error('음성을 텍스트로 변환하는 중 오류가 발생했습니다.')
    } finally {
      setIsLocalProcessing(false)
    }
  }

  // 녹음 관련 리소스 정리
  const cleanupRecording = () => {
    // 상태 초기화
    setIsRecording(false)
    setIsLocalProcessing(false)
    setAudioLevel(0)
    
    // 애니메이션 프레임 정리
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    // 오디오 컨텍스트 정리
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(err => console.error('오디오 컨텍스트 정리 오류:', err))
      audioContextRef.current = null
    }
    
    // 마이크 스트림 정리
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop())
      microphoneStreamRef.current = null
    }
    
    // 미디어 레코더 정리
    mediaRecorderRef.current = null
    
    // 녹음 데이터 정리
    chunksRef.current = []
    
    // 녹음 시작 시간 정리
    recordingStartRef.current = null
  }

  // 음성 녹음 시작
  const startRecording = async () => {
    // 이미 녹음 중이면 무시
    if (isRecording || isLocalProcessing) return
    
    try {
      // 기존 녹음 리소스 정리
      cleanupRecording()
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      microphoneStreamRef.current = stream

      // 지원되는 MIME 타입 확인
      const mimeType = MediaRecorder.isTypeSupported('audio/wav') 
        ? 'audio/wav' 
        : MediaRecorder.isTypeSupported('audio/mp3')
          ? 'audio/mp3'
          : MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : 'audio/webm;codecs=opus';
      
      console.log('사용할 MIME 타입:', mimeType);
      mimeTypeRef.current = mimeType;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      
      // 오디오 컨텍스트 및 분석기 설정 (음성 레벨 표시용)
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      analyserRef.current = analyser
      
      // 오디오 레벨 업데이트 함수
      const updateAudioLevel = () => {
        if (!isRecording) return
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        setAudioLevel(average)
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
      }
      
      // 데이터 수집 이벤트 핸들러 설정
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      // 녹음 중지 이벤트 핸들러 설정
      mediaRecorder.onstop = async () => {
        // 마지막 데이터 조각이 모두 수집될 수 있도록 약간의 지연 추가
        setTimeout(async () => {
          try {
            if (chunksRef.current.length === 0) {
              toast.error('녹음된 데이터가 없습니다. 다시 시도해 주세요.');
              cleanupRecording();
              return;
            }
            
            // 올바른 MIME 타입으로 Blob 생성
            const audioBlob = new Blob(chunksRef.current, { type: mimeTypeRef.current });
            console.log('생성된 오디오 Blob:', { size: audioBlob.size, type: audioBlob.type });
            
            if (audioBlob.size === 0) {
              toast.error('녹음된 데이터가 없습니다. 다시 시도해 주세요.');
              cleanupRecording();
              return;
            }
            
            await processAudio(audioBlob);
          } catch (error) {
            console.error('녹음 처리 오류:', error);
            toast.error('녹음 처리 중 오류가 발생했습니다.');
          } finally {
            cleanupRecording();
          }
        }, 300); // 300ms 지연
      };
      
      // 녹음 시작 시간 기록 - 실제 녹음 시작 직전에 설정
      recordingStartRef.current = Date.now()
      
      // 상태 업데이트를 먼저 하고 녹음 시작
      setIsRecording(true)
      setIsLocalProcessing(false) // 녹음 시작 시 처리 중 상태 확실히 해제
      
      // 녹음 시작 - 타임슬라이스를 더 짧게 설정하여 짧은 녹음에도 데이터가 수집되도록 함
      mediaRecorder.start(100) // 100ms마다 데이터 수집
      
      // 녹음 시작 메시지
      toast.success('음성 녹음을 시작합니다. 마이크 버튼을 다시 누르면 녹음이 종료됩니다.')
      
      // 오디오 레벨 업데이트 시작
      updateAudioLevel()
    } catch (error) {
      console.error('녹음 시작 오류:', error)
      toast.error('마이크 접근 권한이 필요합니다')
      cleanupRecording()
    }
  }

  // 녹음 중지
  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    
    try {
      // 녹음 중지 전에 마지막 데이터 조각을 명시적으로 요청
      mediaRecorderRef.current.requestData();
      
      // 녹음 중지 메시지 표시
      toast.success('녹음이 종료되었습니다. 변환 중...');
      
      // 녹음 상태 해제하고 처리 상태 설정
      setIsRecording(false);
      setIsLocalProcessing(true);
      
      // 녹음 중지
      mediaRecorderRef.current.stop();
    } catch (error) {
      console.error('녹음 중지 오류:', error);
      cleanupRecording();
    }
  }

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
      cleanupRecording()
    }
  }, [])

  // isVoiceMode에 따른 자동 녹음 시작/종료
  useEffect(() => {
    // 음성 모드가 활성화되면 자동으로 녹음 시작
    if (isVoiceMode && !isRecording && !isLocalProcessing) {
      startRecording();
    }
    
    // 음성 모드가 비활성화되면 녹음 중지 (모드 전환 시에만)
    if (!isVoiceMode && isRecording) {
      stopRecording();
    }
  }, [isVoiceMode]); // isRecording, isLocalProcessing 의존성 제거

  // 녹음 중일 때는 placeholder 변경
  const getPlaceholder = () => {
    return isRecording ? '음성인식 중입니다...' : placeholder
  }

  // 동적 스타일 계산
  const isActive = isFocused || message.length > 0 || isRecording
  const canSend = message.trim() && !isLocalProcessing

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full"
    >
      {/* Enhanced container with glassmorphism */}
      <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isActive 
          ? 'bg-white/90 dark:bg-gray-800/90 border-blue-300 dark:border-blue-600 shadow-xl ring-2 ring-blue-200/50 dark:ring-blue-600/30' 
          : 'bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 shadow-lg'
      } backdrop-blur-2xl`}>
        
        {/* Recording pulse background */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-red-500/10 animate-pulse"
            />
          )}
        </AnimatePresence>

        {/* Audio level visualization */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 opacity-70"
              style={{ 
                transform: `scaleY(${Math.max(0.1, audioLevel / 100)})`,
                transformOrigin: 'bottom'
              }}
            />
          )}
        </AnimatePresence>

        <div className="flex items-center p-3 gap-3">
          
          {/* Enhanced Voice Button */}
          <motion.button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled || isLocalProcessing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              isRecording 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg ring-4 ring-red-200/50 dark:ring-red-600/30' 
                : isLocalProcessing
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
            }`}
            title={
              isRecording 
                ? translate('stopRecording', language) || '녹음 중지' 
                : translate('voiceInput', language) || '음성으로 입력'
            }
          >
            <AnimatePresence mode="wait">
              {isLocalProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                </motion.div>
              ) : isRecording ? (
                <motion.div
                  key="recording"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <MicOff className="w-5 h-5" />
                  {/* Pulse indicator */}
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-white/30 rounded-lg"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Mic className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Processing status */}
            <AnimatePresence>
              {isLocalProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
                >
                  변환 중...
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Enhanced Input Field */}
          <div className="flex-grow relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={getPlaceholder()}
              disabled={disabled || isLocalProcessing}
              className={`w-full px-4 py-3 bg-transparent outline-none transition-all duration-300 ${
                isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              } ${isRecording || isLocalProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
            />

            {/* Input status indicators */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              
              {/* Character count for long messages */}
              <AnimatePresence>
                {message.length > 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                  >
                    {message.length}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI suggestion indicator */}
            </div>
          </div>

          {/* Enhanced Send Button */}
          <motion.button
            type="submit"
            disabled={!canSend}
            whileHover={canSend ? { scale: 1.05 } : {}}
            whileTap={canSend ? { scale: 0.95 } : {}}
            className={`p-3 rounded-xl transition-all duration-300 ${
              canSend
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={canSend ? 'send' : 'disabled'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Send className="w-5 h-5" />
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Enhanced focus ring */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Recording timer */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>Recording...</span>
              <Mic className="w-4 h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  )
}

export default ChatInput