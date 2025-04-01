'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Moon, Sun, Trash2} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import { translate } from '../utils/translations'
import ChatInput from '../components/ChatBot/ChatInput'
import ChatMessage from '../components/ChatBot/ChatMessage'
import Navigation from '../components/Navigation'
import { Message } from '@/app/types/chat'
import { useRouter } from 'next/navigation'

const initialMessages = {
  ko: "안녕하세요! 저는 이재권's Clone입니다. 무엇을 도와드릴까요?",
  en: "Hello! I'm Jaekwon Lee's Clone. How can I help you?",
  ja: "こんにちは！イ・ジェグォンのクローンです。どのようにお手伝いできますか？",
  zh: "你好！我是李在权的克隆。我能为您做些什么？"
};

export default function ChatPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: initialMessages[language as keyof typeof initialMessages] || initialMessages.ko
  }]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // localStorage에서 메시지 불러오기
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      if (parsedMessages.length > 0) {
        setMessages(parsedMessages);
      }
    }
  }, []);

  // 언어 변경 시 첫 메시지 업데이트
  useEffect(() => {
    setMessages(prevMessages => {
      if (prevMessages.length === 0) {
        return [{
          role: 'assistant',
          content: initialMessages[language as keyof typeof initialMessages] || initialMessages.ko
        }];
      }
      return [
        {
          role: 'assistant',
          content: initialMessages[language as keyof typeof initialMessages] || initialMessages.ko
        },
        ...prevMessages.slice(1)
      ];
    });
  }, [language]);

  // 메시지가 변경될 때마다 localStorage 업데이트
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);  // 로딩 시작
      setMessages(prev => [...prev, { role: 'user', content: message }]);
      
      // 임시 로딩 메시지 추가
      setMessages(prev => [...prev, { role: 'assistant', content: '...', isLoading: true }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: message }],
          pdfContent: pdfContent
        })
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      const data = await response.json();

      // 로딩 메시지를 실제 응답으로 교체
      setMessages(prev => prev.slice(0, -1).concat({ role: 'assistant', content: data.response }));

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: translate(
          error instanceof Error ? error.message : 'chatError',
          language
        )
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);  // 로딩 종료
    }
  };

  const clearMessages = () => {
    const initialMessage: Message = {
      role: 'assistant' as const,  // 타입을 명시적으로 'assistant'로 지정
      content: initialMessages[language as keyof typeof initialMessages] || initialMessages.ko
    };
    setMessages([initialMessage]);
    localStorage.setItem('chatMessages', JSON.stringify([initialMessage]));
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Starting file upload...');
      const response = await fetch('/api/fileupload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          errorMessage = errorText;
        } catch (textError) {
          console.error('Failed to read error response:', textError);
          errorMessage = response.statusText;
        }
        throw new Error(`Upload failed (${response.status}): ${errorMessage}`);
      }

      let data;
      try {
        data = await response.json();
        console.log('Success response data:', data);
      } catch (jsonError) {
        console.error('Failed to parse response as JSON:', jsonError);
        throw new Error('Invalid response format from server');
      }
      
      if (data.success) {
        setPdfContent(data.text);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `PDF 파일 "${data.filename}"이(가) 성공적으로 업로드되었습니다. 이제 파일 내용에 대해 질문해주세요.`
        }]);
      } else {
        throw new Error(data.error || 'Upload failed without error message');
      }
    } catch (error) {
      console.error('File upload error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `파일 업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      }]);
    } finally {
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* 헤더 */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b ${
        isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'
      }`}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Navigation />
          </div>
        </div>
      </header>

      {/* 메인 채팅 컨테이너 */}
      <main className={`flex-1 max-w-3xl mx-auto w-full flex flex-col mt-20 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}>
        {/* 채팅 헤더 */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${
          isDarkMode ? 'border-gray-700' : ''
        }`}>
          <div className="flex items-center gap-2">
            <Link href="/" className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } flex items-center gap-2`}>
              <ArrowLeft className="w-5 h-5" />
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Back</span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="w-16 h-16 relative rounded-full overflow-hidden mb-2">
              <Image
                src="/pr_img3.jpg"
                alt={translate('name', language)}
                layout="fill"
                className="object-cover"
              />
            </div>
            <span className="text-lg font-medium">
              {translate('name', language)}{translate('cloneTitle', language)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/voice-chat')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="음성 대화"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10L4 14" />
                <path d="M8 7L8 17" />
                <path d="M12 4L12 20" />
                <path d="M16 7L16 17" />
                <path d="M20 10L20 14" />
              </svg>
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={clearMessages}
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full" />
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  message={message} 
                  isDarkMode={isDarkMode} 
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        <footer className={`border-t ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
        }`}>
          <div className="p-4">
            <ChatInput 
              onSendMessage={handleSendMessage}
              isDarkMode={isDarkMode}
              placeholder={translate('chatInputPlaceholder', language)}
            />
          </div>
        </footer>
      </main>
    </div>
  )
}