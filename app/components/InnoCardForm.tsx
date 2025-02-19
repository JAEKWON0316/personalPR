'use client'

import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { translate } from '../utils/translations'

export default function InnoCardForm() {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    phone: '',
    inquiry: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

      if (!response.ok) {
        throw new Error('제출 실패')
      }

      // 폼 초기화
      setFormData({
        name: '',
        birthdate: '',
        phone: '',
        inquiry: ''
      })

      alert('문의가 성공적으로 제출되었습니다.')
    } catch (error) {
      console.error('Submit error:', error)
      alert('문의 제출 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {translate('formName', language)}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder={translate('formNamePlaceholder', language)}
        />
      </div>
      
      {/* 다른 폼 필드들... */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? '제출 중...' : translate('formSubmit', language)}
      </button>
    </form>
  )
} 