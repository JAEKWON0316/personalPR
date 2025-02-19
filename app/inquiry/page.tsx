'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { translate } from '../utils/translations'
import { useLanguage } from '../hooks/useLanguage'
import Navigation from '../components/Navigation'
import Link from 'next/link'

export default function InquiryPage() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiry: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrors(prev => ({
        ...prev,
        email: '올바른 이메일 형식을 입력해주세요.'
      }))
      return false
    }
    setErrors(prev => ({ ...prev, email: '' }))
    return true
  }

  // 전화번호 유효성 검사
  const validatePhone = (phone: string) => {
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/
    const cleanPhone = phone.replace(/-/g, '')
    if (cleanPhone.length !== 11 || !phoneRegex.test(cleanPhone)) {
      setErrors(prev => ({
        ...prev,
        phone: '올바른 전화번호 형식(11자리)을 입력해주세요.'
      }))
      return false
    }
    setErrors(prev => ({ ...prev, phone: '' }))
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 제출 전 유효성 검사
    const isEmailValid = validateEmail(formData.email)
    const isPhoneValid = validatePhone(formData.phone)

    if (!isEmailValid || !isPhoneValid) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submitDate: new Date().toISOString(),
          type: 'InnoCard 문의'
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '제출에 실패했습니다.')
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiry: ''
      })

      alert(result.message || '문의가 성공적으로 제출되었습니다.')
    } catch (error) {
      console.error('Submit error:', error)
      alert(error instanceof Error ? error.message : '문의 제출 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 전화번호 자동 하이픈 추가
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '')
    let formatted = cleaned
    if (cleaned.length >= 3) {
      formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3)
    }
    if (cleaned.length >= 7) {
      formatted = formatted.slice(0, 8) + '-' + formatted.slice(8)
    }
    return formatted
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation language={language} />

      <main className="flex-grow pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="w-full">
            <CardHeader className="flex flex-col items-center">
              <div className="self-start">
                <Link href="/" className="p-2 rounded-full hover:bg-gray-100 flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-gray-600">{translate('back', language)}</span>
                </Link>
              </div>
              <CardTitle className="text-2xl font-bold mt-4">{translate('innoCardInquiry', language)}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('formName', language)}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translate('formNamePlaceholder', language)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('이메일', language)}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value})
                      validateEmail(e.target.value)
                    }}
                    required
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={translate('이메일을 입력해주세요.', language)}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('formPhone', language)}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      setFormData({...formData, phone: formatted})
                      validatePhone(formatted)
                    }}
                    required
                    maxLength={13}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={translate('formPhonePlaceholder', language)}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('formInquiry', language)}
                  </label>
                  <textarea
                    value={formData.inquiry}
                    onChange={(e) => setFormData({...formData, inquiry: e.target.value})}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={translate('formInquiryPlaceholder', language)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-black text-white px-6"
                    disabled={isSubmitting || !!errors.email || !!errors.phone}
                  >
                    {isSubmitting ? '제출 중...' : translate('formSubmit', language)}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center space-y-4 mt-8 relative">
            <svg className="absolute top-0 left-0 w-16 h-16 text-gray-400 transform -translate-x-1/4 -translate-y-1/4 z-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <div className="relative z-10 text-2xl font-bold mb-4">
              {translate('greetingTitle', language).split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className="text-lg relative z-10">
              {translate('greetingDescription', language).split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <svg className="absolute top-0 right-0 w-16 h-16 text-gray-400 transform translate-x-1/4 -translate-y-1/4 rotate-180 z-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
        </div>
      </main>
    </div>
  )
} 