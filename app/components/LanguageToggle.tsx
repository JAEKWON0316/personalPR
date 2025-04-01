'use client';

import { useLanguage } from '../contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const getLanguageText = (lang: string) => {
    switch(lang) {
      case 'ko': return '한국어'
      case 'en': return 'English'
      case 'ja': return '日本語'
      case 'zh': return '中文'
      default: return '한국어'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
          <span className="text-sm font-medium">{getLanguageText(language)}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-24">
        <DropdownMenuItem 
          onClick={() => setLanguage('ko')}
          className={`${language === 'ko' ? 'bg-blue-50' : ''}`}
        >
          <span className={language === 'ko' ? 'font-medium text-blue-600' : ''}>한국어</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={`${language === 'en' ? 'bg-blue-50' : ''}`}
        >
          <span className={language === 'en' ? 'font-medium text-blue-600' : ''}>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('ja')}
          className={`${language === 'ja' ? 'bg-blue-50' : ''}`}
        >
          <span className={language === 'ja' ? 'font-medium text-blue-600' : ''}>日本語</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('zh')}
          className={`${language === 'zh' ? 'bg-blue-50' : ''}`}
        >
          <span className={language === 'zh' ? 'font-medium text-blue-600' : ''}>中文</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

