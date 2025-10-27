'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar, Mail, Phone, User, MessageCircle, Send, X, CheckCircle } from 'lucide-react';
import Script from 'next/script';

interface ReservationFormProps {
  onSubmit: (data: { name: string; email: string; phoneNumber: string; date: string; message: string }) => void;
  onCancel: () => void;
}

// Kakao 관련 타입 선언, useEffect, 상태, ref, 함수, UI 등 모두 삭제
// 기존 예약 폼 및 기타 기능만 남김

export function ReservationForm({ onSubmit, onCancel }: ReservationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const kakaoButtonRef = useRef<HTMLDivElement>(null);

  // Form validation
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        return value.length < 2 ? '이름은 2글자 이상 입력해주세요.' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? '올바른 이메일 형식이 아닙니다.' : '';
      case 'phoneNumber':
        const phoneRegex = /^010\d{8}$/;
        return !phoneRegex.test(value.replace(/-/g, '')) ? '010으로 시작하는 11자리 번호를 입력해주세요.' : '';
      case 'date':
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today ? '오늘 이후 날짜를 선택해주세요.' : '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      case 'date':
        setDate(value);
        break;
      case 'message':
        setMessage(value);
        break;
    }

    // Real-time validation
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const fieldErrors: {[key: string]: string} = {};
    fieldErrors.name = validateField('name', name);
    fieldErrors.email = validateField('email', email);
    fieldErrors.phoneNumber = validateField('phoneNumber', phoneNumber);
    fieldErrors.date = validateField('date', date);

    const hasErrors = Object.values(fieldErrors).some(error => error !== '');
    
    if (hasErrors) {
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({ name, email, phoneNumber, date, message });
    setIsSubmitting(false);
  };

  const inputFields = [
    {
      id: 'name',
      label: '이름',
      value: name,
      type: 'text',
      icon: User,
      placeholder: '홍길동',
      required: true
    },
    {
      id: 'email',
      label: '이메일',
      value: email,
      type: 'email',
      icon: Mail,
      placeholder: 'example@email.com',
      required: true
    },
    {
      id: 'phoneNumber',
      label: '전화번호',
      value: phoneNumber,
      type: 'tel',
      icon: Phone,
      placeholder: '01012345678',
      required: true
    },
    {
      id: 'date',
      label: '희망 상담 날짜',
      value: date,
      type: 'date',
      icon: Calendar,
      placeholder: '',
      required: true
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
      >
        {/* Glassmorphism Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-white/30 dark:border-gray-700/30 shadow-2xl overflow-hidden">
          
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 p-8 text-white overflow-hidden">
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-2"
              >
                상담 예약
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/90"
              >
                전문 상담을 위해 정보를 입력해주세요
              </motion.p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl" />
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`relative ${field.id === 'date' ? 'md:col-span-2' : ''}`}
                  >
                    {/* Enhanced Input Field */}
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <field.icon className={`w-5 h-5 transition-colors duration-200 ${
                          focusedField === field.id || field.value
                            ? 'text-blue-500' 
                            : 'text-gray-400'
                        }`} />
                      </div>
                      
                      <Input
                        id={field.id}
                        type={field.type}
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        onFocus={() => setFocusedField(field.id)}
                        onBlur={() => setFocusedField(null)}
                        required={field.required}
                        placeholder={field.placeholder}
                        className={`pl-12 pr-4 py-6 bg-gray-50/50 dark:bg-gray-800/50 border-2 rounded-xl transition-all duration-300 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 ${
                          errors[field.id] ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      />
                      
                      {/* Floating Label */}
                      <label
                        htmlFor={field.id}
                        className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                          focusedField === field.id || field.value
                            ? '-top-2 text-xs bg-white dark:bg-gray-900 px-2 text-blue-500 font-medium'
                            : 'top-1/2 -translate-y-1/2 text-gray-500'
                        }`}
                      >
                        {field.label} {field.required && '*'}
                      </label>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {errors[field.id] && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-xs mt-2 ml-1"
                        >
                          {errors[field.id]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Message Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="relative"
              >
                <div className="relative">
                  <div className="absolute left-4 top-4 z-10">
                    <MessageCircle className={`w-5 h-5 transition-colors duration-200 ${
                      focusedField === 'message' || message
                        ? 'text-blue-500' 
                        : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="상담받고 싶은 내용을 자유롭게 작성해주세요"
                    rows={4}
                    className="pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 resize-none"
                  />
                  
                  {/* Floating Label */}
                  <label
                    htmlFor="message"
                    className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                      focusedField === 'message' || message
                        ? '-top-2 text-xs bg-white dark:bg-gray-900 px-2 text-blue-500 font-medium'
                        : 'top-4 text-gray-500'
                    }`}
                  >
                    추가 메시지 (선택)
                  </label>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Enhanced Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="px-8 pb-8 flex flex-col sm:flex-row gap-4 sm:justify-between"
          >
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-8 py-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
            >
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
            
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  처리 중...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  예약하기
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Success Animation Overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  예약 정보를 처리 중입니다...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}