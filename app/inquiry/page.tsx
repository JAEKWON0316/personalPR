'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Phone, Mail, MessageCircle, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { translate } from '../utils/translations'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../contexts/ThemeContext'
import Navigation from '../components/Navigation'
import Link from 'next/link'
import { toast } from 'sonner'

interface FormField {
  name: string
  value: string
  error: string
  isValid: boolean
  isFocused: boolean
  isTouched: boolean
}

interface FormData {
  name: FormField
  email: FormField
  phone: FormField
  inquiry: FormField
}

export default function InquiryPage() {
  const { language } = useLanguage()
  const { isDarkMode } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formProgress, setFormProgress] = useState(0)

  const [formData, setFormData] = useState<FormData>({
    name: {
      name: 'name',
      value: '',
      error: '',
      isValid: false,
      isFocused: false,
      isTouched: false
    },
    email: {
      name: 'email',
      value: '',
      error: '',
      isValid: false,
      isFocused: false,
      isTouched: false
    },
    phone: {
      name: 'phone',
      value: '',
      error: '',
      isValid: false,
      isFocused: false,
      isTouched: false
    },
    inquiry: {
      name: 'inquiry',
      value: '',
      error: '',
      isValid: false,
      isFocused: false,
      isTouched: false
    }
  })

  // Validation rules
  const validateField = (name: string, value: string): { isValid: boolean; error: string } => {
    switch (name) {
      case 'name':
        if (!value.trim()) return { isValid: false, error: translate('nameRequired', language) || '이름을 입력해주세요.' }
        if (value.length < 2) return { isValid: false, error: translate('nameMinLength', language) || '이름은 2글자 이상이어야 합니다.' }
        return { isValid: true, error: '' }
      
      case 'email':
        if (!value.trim()) return { isValid: false, error: translate('emailRequired', language) || '이메일을 입력해주세요.' }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return { isValid: false, error: translate('emailInvalid', language) || '유효한 이메일을 입력해주세요.' }
        return { isValid: true, error: '' }
      
      case 'phone':
        if (!value.trim()) return { isValid: false, error: translate('phoneRequired', language) || '전화번호를 입력해주세요.' }
        const phoneRegex = /^[\d\s\-\+\(\)]+$/
        if (!phoneRegex.test(value)) return { isValid: false, error: translate('phoneInvalid', language) || '유효한 전화번호를 입력해주세요.' }
        if (value.replace(/\D/g, '').length < 10) return { isValid: false, error: translate('phoneMinLength', language) || '전화번호는 10자리 이상이어야 합니다.' }
        return { isValid: true, error: '' }
      
      case 'inquiry':
        if (!value.trim()) return { isValid: false, error: translate('inquiryRequired', language) || '문의내용을 입력해주세요.' }
        if (value.length < 10) return { isValid: false, error: translate('inquiryMinLength', language) || '문의내용은 10글자 이상이어야 합니다.' }
        return { isValid: true, error: '' }
      
      default:
        return { isValid: false, error: '' }
    }
  }

  // Calculate form progress
  useEffect(() => {
    const validFields = Object.values(formData).filter(field => field.isValid).length
    const totalFields = Object.keys(formData).length
    setFormProgress((validFields / totalFields) * 100)
  }, [formData])

  // Handle field changes
  const handleFieldChange = (name: string, value: string) => {
    const validation = validateField(name, value)
    
    setFormData(prev => ({
      ...prev,
      [name]: {
        ...prev[name as keyof FormData],
        value,
        isValid: validation.isValid,
        error: validation.error,
        isTouched: true
      }
    }))
  }

  // Handle focus events
  const handleFocus = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: {
        ...prev[name as keyof FormData],
        isFocused: true
      }
    }))
  }

  const handleBlur = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: {
        ...prev[name as keyof FormData],
        isFocused: false
      }
    }))
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    let isFormValid = true
    const updatedFormData = { ...formData }
    
    Object.keys(formData).forEach(key => {
      const field = formData[key as keyof FormData]
      const validation = validateField(key, field.value)
      updatedFormData[key as keyof FormData] = {
        ...field,
        isValid: validation.isValid,
        error: validation.error,
        isTouched: true
      }
      if (!validation.isValid) isFormValid = false
    })
    
    setFormData(updatedFormData)
    
    if (!isFormValid) {
      toast.error('폼을 올바르게 작성해주세요.', {
        className: 'dark-toast toast-error'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = {
        name: formData.name.value,
        email: formData.email.value,
        phone: formData.phone.value,
        inquiry: formData.inquiry.value
      }

      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
        toast.success('문의가 성공적으로 제출되었습니다.', {
          className: 'dark-toast toast-success'
        })
        
        // Reset form after success animation
        setTimeout(() => {
          setFormData({
            name: { name: 'name', value: '', error: '', isValid: false, isFocused: false, isTouched: false },
            email: { name: 'email', value: '', error: '', isValid: false, isFocused: false, isTouched: false },
            phone: { name: 'phone', value: '', error: '', isValid: false, isFocused: false, isTouched: false },
            inquiry: { name: 'inquiry', value: '', error: '', isValid: false, isFocused: false, isTouched: false }
          })
          setIsSubmitted(false)
          setFormProgress(0)
        }, 3000)
      } else {
        throw new Error(data.error || '문의 제출에 실패했습니다.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('문의 제출에 실패했습니다. 다시 시도해 주세요.', {
        className: 'dark-toast toast-error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = Object.values(formData).every(field => field.isValid) && !isSubmitting

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/50 relative overflow-hidden">
      
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Navigation */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-b border-white/20 dark:border-gray-700/30"
      >
        <Navigation language={language} />
      </motion.div>

      <main className="flex-grow pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Enhanced Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl">
              
              {/* Enhanced Header */}
              <CardHeader className="relative overflow-hidden border-b border-white/20 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      href="/" 
                      className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span className="font-medium">Back</span>
                    </Link>
                  </motion.div>
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${formProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(formProgress)}%</span>
                  </div>
                </div>
                
                <CardTitle className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
                  {translate('innoCardInquiry', language)}
                </CardTitle>
                <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
                  문의사항을 정확히 기재해주시면 빠른 답변을 드리겠습니다.
                </p>
              </CardHeader>

              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    // Success Animation
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center py-16"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        문의가 성공적으로 제출되었습니다!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        빠른 시일 내에 답변드리겠습니다.
                      </p>
                    </motion.div>
                  ) : (
                    // Form
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      
                      {/* Name Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {translate('formName', language)}
                            <span className="text-red-500">*</span>
                          </div>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name.value}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            onFocus={() => handleFocus('name')}
                            onBlur={() => handleBlur('name')}
                            className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                              formData.name.isFocused 
                                ? 'border-blue-500 ring-4 ring-blue-200/50 dark:ring-blue-600/30' 
                                : formData.name.isTouched 
                                  ? formData.name.isValid 
                                    ? 'border-green-400 dark:border-green-500' 
                                    : 'border-red-400 dark:border-red-500'
                                  : 'border-gray-200 dark:border-gray-700'
                            }`}
                            placeholder={translate('formNamePlaceholder', language)}
                          />
                          
                          {/* Validation Icon */}
                          <AnimatePresence>
                            {formData.name.isTouched && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                              >
                                {formData.name.isValid ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-500" />
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Error Message */}
                        <AnimatePresence>
                          {formData.name.error && formData.name.isTouched && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-500 flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {formData.name.error}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Phone Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {translate('formPhone', language)}
                            <span className="text-red-500">*</span>
                          </div>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone.value}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            onFocus={() => handleFocus('phone')}
                            onBlur={() => handleBlur('phone')}
                            className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                              formData.phone.isFocused 
                                ? 'border-blue-500 ring-4 ring-blue-200/50 dark:ring-blue-600/30' 
                                : formData.phone.isTouched 
                                  ? formData.phone.isValid 
                                    ? 'border-green-400 dark:border-green-500' 
                                    : 'border-red-400 dark:border-red-500'
                                  : 'border-gray-200 dark:border-gray-700'
                            }`}
                            placeholder={translate('formPhonePlaceholder', language)}
                          />
                          
                          <AnimatePresence>
                            {formData.phone.isTouched && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                              >
                                {formData.phone.isValid ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-500" />
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        <AnimatePresence>
                          {formData.phone.error && formData.phone.isTouched && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-500 flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {formData.phone.error}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Email Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {translate('formEmail', language)}
                            <span className="text-red-500">*</span>
                          </div>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email.value}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            onFocus={() => handleFocus('email')}
                            onBlur={() => handleBlur('email')}
                            className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                              formData.email.isFocused 
                                ? 'border-blue-500 ring-4 ring-blue-200/50 dark:ring-blue-600/30' 
                                : formData.email.isTouched 
                                  ? formData.email.isValid 
                                    ? 'border-green-400 dark:border-green-500' 
                                    : 'border-red-400 dark:border-red-500'
                                  : 'border-gray-200 dark:border-gray-700'
                            }`}
                            placeholder={translate('formEmailPlaceholder', language)}
                          />
                          
                          <AnimatePresence>
                            {formData.email.isTouched && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                              >
                                {formData.email.isValid ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-500" />
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        <AnimatePresence>
                          {formData.email.error && formData.email.isTouched && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-500 flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {formData.email.error}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Inquiry Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            {translate('formInquiry', language)}
                            <span className="text-red-500">*</span>
                          </div>
                        </label>
                        <div className="relative">
                          <textarea
                            name="inquiry"
                            value={formData.inquiry.value}
                            onChange={(e) => handleFieldChange('inquiry', e.target.value)}
                            onFocus={() => handleFocus('inquiry')}
                            onBlur={() => handleBlur('inquiry')}
                            className={`w-full px-4 py-4 rounded-xl border-2 h-40 resize-none transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                              formData.inquiry.isFocused 
                                ? 'border-blue-500 ring-4 ring-blue-200/50 dark:ring-blue-600/30' 
                                : formData.inquiry.isTouched 
                                  ? formData.inquiry.isValid 
                                    ? 'border-green-400 dark:border-green-500' 
                                    : 'border-red-400 dark:border-red-500'
                                  : 'border-gray-200 dark:border-gray-700'
                            }`}
                            placeholder={translate('formInquiryPlaceholder', language)}
                          />
                          
                          <AnimatePresence>
                            {formData.inquiry.isTouched && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute right-4 top-4"
                              >
                                {formData.inquiry.isValid ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-500" />
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {/* Character Counter */}
                          <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400">
                            {formData.inquiry.value.length} / 1000
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {formData.inquiry.error && formData.inquiry.isTouched && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-500 flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {formData.inquiry.error}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Enhanced Submit Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center pt-4"
                      >
                        <motion.button
                          type="submit"
                          disabled={!canSubmit}
                          whileHover={canSubmit ? { scale: 1.05 } : {}}
                          whileTap={canSubmit ? { scale: 0.95 } : {}}
                          className={`px-12 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all duration-300 ${
                            canSubmit
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl'
                              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              제출 중...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              {translate('formSubmit', language)}
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                <h3 className="mx-4 text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  {translate('greetingTitle', language).split('\n').map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h3>
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
              </div>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 max-w-3xl mx-auto">
                {translate('greetingDescription', language).split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-lg">
                    {paragraph.split('\n').map((line, j) => (
                      <span key={j} className="block">{line}</span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
} 