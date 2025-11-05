'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from './hooks/useLanguage'
import { getPostsArray } from './utils/translations'
import type { PostData } from './types/post'
import ShareButton from './components/ShareButton'
import ChatBot from './components/ChatBot/ChatBot'

// 새로운 섹션 컴포넌트들
import Header from './components/HomePage/Header'
import ProfileSection from './components/HomePage/ProfileSection'
import ContactOptionsSection from './components/HomePage/ContactOptionsSection'
import HistorySection from './components/HomePage/HistorySection'
import CertificationsSection from './components/HomePage/CertificationsSection'
import SkillsSection from './components/HomePage/SkillsSection'
import ValuesSection from './components/HomePage/ValuesSection'
import ProjectsSection from './components/HomePage/ProjectsSection'
import Footer from './components/HomePage/Footer'

export default function Home() {
  const { language } = useLanguage()
  const router = useRouter()
  
  // 초기 posts 데이터를 메모이제이션으로 가져오기
  const initialPosts = useMemo(() => getPostsArray(), [])
  const [posts, setPosts] = useState<PostData[]>(initialPosts)

  // localStorage 초기화 (한 번만 실행)
  useEffect(() => {
    const initializeStorage = () => {
      try {
        localStorage.removeItem('posts')
        localStorage.setItem('posts', JSON.stringify(initialPosts))
        setPosts(initialPosts)
      } catch (error) {
        console.error('localStorage 초기화 오류:', error)
        setPosts(initialPosts)
      }
    }

    initializeStorage()
  }, []); // 의존성 배열 비움 - 컴포넌트 마운트 시에만 실행

  // storage 이벤트 핸들러들을 useCallback으로 메모이제이션
  const handleStorageChange = useCallback(() => {
    try {
      const storedPosts = localStorage.getItem('posts')
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts)
        setPosts(parsedPosts)
      }
    } catch (error) {
      console.error('localStorage 읽기 오류:', error)
    }
  }, [])

  const handleFocus = useCallback(() => {
    try {
      const storedPosts = localStorage.getItem('posts')
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts)
        setPosts(parsedPosts)
      }
    } catch (error) {
      console.error('localStorage 포커스 읽기 오류:', error)
    }
  }, [])

  // 이벤트 리스너 등록 (분리된 useEffect)
  useEffect(() => {
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [handleStorageChange, handleFocus])

  // 이벤트 핸들러들을 useCallback으로 메모이제이션
  const handlePostClick = useCallback((postId: number) => {
    router.push(`/post/${postId}`)
  }, [router])

  const handleScrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }, [])

return (
  <div className="font-sans min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header language={language} onScrollTo={handleScrollTo} />
      
    <main className="w-full max-w-4xl mx-auto p-5 pt-24 flex-grow overflow-x-hidden">
        <ProfileSection language={language} />
        <ContactOptionsSection language={language} />
        <HistorySection />
        <CertificationsSection />
        <SkillsSection />
        <ValuesSection language={language} />
        <ProjectsSection language={language} />
    </main>

    <ShareButton language={language} />
      <Footer language={language} />
    </div>
  )
}