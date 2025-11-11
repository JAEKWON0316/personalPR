'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput, { Message } from './ChatInput';
import { ReservationForm } from '@/app/components/ReservationForm';
import { translate } from '@/app/utils/translations';
import { useLanguage } from '@/app/hooks/useLanguage';
import { useTheme } from '@/app/contexts/ThemeContext';

interface ChatBotProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const ChatBot = ({ isOpen: externalIsOpen, onOpenChange }: ChatBotProps) => {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialLoadRef = useRef(true);
  const savedMessagesRef = useRef<Message[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLatestResponse = () => {
    const lastBotMessage = chatMessagesRef.current?.querySelector('.bot-message:last-child');
    if (lastBotMessage) {
      lastBotMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
      if (externalIsOpen) {
        setTimeout(scrollToBottom, 100);
      }
    }
  }, [externalIsOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpenChange = (newIsOpen: boolean) => {
    if (onOpenChange) {
      // externalIsOpen이 있으면 onOpenChange를 통해 부모 컴포넌트의 state를 업데이트
      onOpenChange(newIsOpen);
    } else {
      // externalIsOpen이 없으면 내부 state만 업데이트
      setIsOpen(newIsOpen);
    }
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          // "initialMessage" 텍스트가 있는 메시지를 cloneGreeting으로 교체
          // timestamp를 명시적으로 보존 (없으면 현재 시간으로 설정)
          const baseTime = Date.now();
          const messagesWithIds = parsedMessages.map((msg, index) => {
            const updatedMsg = {
              ...msg,
              id: msg.id || `msg_${baseTime + index}_${Math.random().toString(36).substr(2, 9)}`,
              // timestamp가 없으면 현재 시간으로 설정 (한 번만 설정되고 이후 유지됨)
              timestamp: msg.timestamp !== undefined && msg.timestamp !== null ? msg.timestamp : baseTime - (parsedMessages.length - index) * 60000
            };
            // content가 "initialMessage" 문자열인 경우 번역된 메시지로 교체
            if (msg.content === 'initialMessage') {
              updatedMsg.content = translate('cloneGreeting', language);
            }
            return updatedMsg;
          });
          
          // timestamp가 추가된 메시지를 localStorage에 즉시 저장 (마이그레이션)
          localStorage.setItem('chatMessages', JSON.stringify(messagesWithIds));
          
          savedMessagesRef.current = messagesWithIds;
          setMessages(messagesWithIds);
          // 다음 tick에 isInitialLoadRef를 false로 설정하여 저장 useEffect가 실행되도록 함
          setTimeout(() => {
            isInitialLoadRef.current = false;
          }, 0);
        } else {
          const initialMessage = {
            role: 'assistant' as const,
            content: translate('cloneGreeting', language),
            timestamp: Date.now(),
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };
          savedMessagesRef.current = [initialMessage];
          setMessages([initialMessage]);
          
          // 초기 메시지를 즉시 localStorage에 저장
          localStorage.setItem('chatMessages', JSON.stringify([initialMessage]));
          
          setTimeout(() => {
            isInitialLoadRef.current = false;
          }, 0);
        }
      } catch (error) {
        console.error('Error parsing saved messages:', error);
        const initialMessage = {
          role: 'assistant' as const,
          content: translate('cloneGreeting', language),
          timestamp: Date.now(),
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        savedMessagesRef.current = [initialMessage];
        setMessages([initialMessage]);
        
        // 초기 메시지를 즉시 localStorage에 저장
        localStorage.setItem('chatMessages', JSON.stringify([initialMessage]));
        
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 0);
      }
    } else {
      const initialMessage = {
        role: 'assistant' as const,
        content: translate('cloneGreeting', language),
        timestamp: Date.now(),
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      savedMessagesRef.current = [initialMessage];
      setMessages([initialMessage]);
      
      // 초기 메시지를 즉시 localStorage에 저장
      localStorage.setItem('chatMessages', JSON.stringify([initialMessage]));
      
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 0);
    }
  }, [language]);

  // localStorage 저장 시 기존 메시지의 timestamp 보존
  useEffect(() => {
    // 초기 로드 시에는 저장하지 않음 (이미 로드된 메시지가 저장되면 안 됨)
    if (isInitialLoadRef.current) {
      return;
    }

    if (messages.length > 0) {
      try {
        // savedMessagesRef에 저장된 이전 메시지와 비교하여 timestamp 보존
        const messagesWithPreservedTimestamps = messages.map(msg => {
          // 메시지가 이미 timestamp를 가지고 있으면 그대로 사용
          if (msg.timestamp !== undefined && msg.timestamp !== null) {
            return msg;
          }
          
          // savedMessagesRef에 같은 id의 메시지가 있으면 timestamp 유지
          const savedMsg = savedMessagesRef.current.find(saved => saved.id === msg.id);
          if (savedMsg && savedMsg.timestamp !== undefined && savedMsg.timestamp !== null) {
            return {
              ...msg,
              timestamp: savedMsg.timestamp // 기존 timestamp 유지
            };
          }
          
          // 새 메시지인데 timestamp가 없으면 현재 시간으로 설정
          return {
            ...msg,
            timestamp: Date.now()
          };
        });
        
        // 실제로 변경된 내용이 있는지 확인 (content나 새 메시지 추가)
        const hasChanges = messagesWithPreservedTimestamps.length !== savedMessagesRef.current.length ||
          messagesWithPreservedTimestamps.some((msg, index) => {
            const saved = savedMessagesRef.current[index];
            return !saved || saved.id !== msg.id || saved.content !== msg.content;
          });
        
        // 변경된 내용이 있을 때만 저장
        if (hasChanges) {
          localStorage.setItem('chatMessages', JSON.stringify(messagesWithPreservedTimestamps));
          savedMessagesRef.current = messagesWithPreservedTimestamps;
        }
      } catch (error) {
        console.error('Error saving messages:', error);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      scrollToLatestResponse();
    }
  }, [messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/fileupload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setPdfContent(data.text);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `PDF 파일 "${data.filename}"이(가) 성공적으로 업로드되었습니다. 이제 파일 내용에 대해 질문해주세요.`,
          timestamp: Date.now(),
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }]);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `파일 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        timestamp: Date.now(),
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }]);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      
      // 사용자 메시지 추가
      const newUserMessage: Message = { 
        role: 'user', 
        content: message,
        timestamp: Date.now(),
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      setMessages(prev => [...prev, newUserMessage]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(), // 단일 메시지만 전송
          language: language // 언어 정보 전달
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // 봇 응답 추가
      const botMessage = { 
        role: 'assistant' as const, 
        content: data.response,
        timestamp: Date.now(),
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '죄송합니다. 오류가 발생했습니다.',
        timestamp: Date.now(),
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservationSubmit = async (reservationData: { 
    name: string; 
    email: string; 
    phoneNumber: string; 
    date: string; 
    message: string; 
  }) => {
    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      });

      if (response.ok) {
        const reservationMessage = `예약이 완료되었습니다!

📅 예약 날짜: ${reservationData.date}
👤 이름: ${reservationData.name}
📧 이메일: ${reservationData.email}
📞 연락처: ${reservationData.phoneNumber}
📝 상담 내용: ${reservationData.message}

✓ 예약하신 내용은 확인 후 연락드리겠습니다.`;

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: reservationMessage,
          timestamp: Date.now(),
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }]);
        setShowReservationForm(false);
      } else {
        throw new Error('예약 API 응답이 실패했습니다.');
      }
    } catch (error) {
      console.error('Reservation Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '죄송합니다. 예약 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: Date.now(),
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }]);
    }
  };

  // 예약 폼이 표시될 때 스크롤
  useEffect(() => {
    if (showReservationForm) {
      setTimeout(() => {
        const reservationFormElement = document.querySelector('.reservation-form');
        if (reservationFormElement) {
          reservationFormElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [showReservationForm]);

  const clearChat = () => {
    const initialMessage = {
      role: 'assistant' as const,
      content: translate('cloneGreeting', language),
      timestamp: Date.now(),
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setMessages([initialMessage]);
    localStorage.setItem('chatMessages', JSON.stringify([initialMessage]));
  };

  // externalIsOpen이 있으면 그것을 우선 사용
  const isChatVisible = useMemo(() => {
    return externalIsOpen !== undefined ? externalIsOpen : isOpen;
  }, [externalIsOpen, isOpen]);

  // CSS animations for thinking indicator
  const thinkingStyles = useMemo(() => `
    @keyframes thinking {
      0%, 60%, 100% { 
        transform: translateY(0);
        opacity: 0.4; 
      }
      30% { 
        transform: translateY(-10px);
        opacity: 1; 
      }
    }
    
    .thinking-dots {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
    }
    
    .thinking-dots span {
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: 50%;
      animation: thinking 1.4s ease-in-out infinite;
    }
    
    .thinking-dots span:nth-child(1) { animation-delay: 0s; }
    .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
    .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
  `, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <style>{thinkingStyles}</style>
      {/* Chat Window */}
      <AnimatePresence mode="wait">
        {isChatVisible && (
          <motion.div 
            key="chat-window"
            className="w-[90vw] max-w-[350px] h-[500px] sm:w-[400px] sm:h-[600px] md:w-[450px] md:h-[650px] lg:w-[550px] lg:h-[700px] xl:w-[600px] xl:h-[750px] rounded-lg shadow-xl flex flex-col mb-20 bg-white dark:bg-gray-800"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 20 }}
          >
          <div className="p-3 sm:p-4 rounded-t-lg flex items-center justify-between bg-blue-500 dark:bg-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white flex-shrink-0">
                <Image
                  src="/pr_img3.jpg"
                  alt="ChatBot Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-blue-500 text-sm sm:text-base truncate">이재권&apos;s clone</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-xs sm:text-sm text-gray-100">온라인</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button 
                onClick={clearChat}
                className="text-white hover:text-gray-200 p-1.5 sm:p-2"
                title="내역 지우기"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" 
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={message.id || index} 
                  message={message}
                  isDarkMode={isDarkMode}
                />
              ))}

              {/* Enhanced Thinking Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex justify-start"
                  role="status"
                  aria-label="AI is thinking"
                  aria-live="polite"
                >
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg">
                    <div className="thinking-dots text-gray-600 dark:text-gray-300">
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {showReservationForm && (
              <div className="mt-4 w-full">
                <div className="bg-white rounded-lg shadow-sm">
                  <ReservationForm
                    onSubmit={handleReservationSubmit}
                    onCancel={() => {
                      setShowReservationForm(false);
                      scrollToBottom();
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {!showReservationForm && (
            <div className="p-3 sm:p-4 border-t bg-white dark:bg-gray-800">
              <ChatInput 
                onSendMessage={handleSendMessage}
                placeholder={translate('chatInputPlaceholder', language)}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
