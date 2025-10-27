'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, Phone, Video, CreditCard, ArrowRight, Sparkles } from 'lucide-react';
import { Language, translate } from '../utils/translations';

interface ContactProps {
  language: Language;
}

export default function Contact({ language }: ContactProps) {
  const contactOptions = [
    {
      href: '/ai-clone',
      icon: Bot,
      title: translate('aiClone', language),
      description: language === 'ko' ? 'AI 기반 스마트 인터랙션' : 
                   language === 'en' ? 'AI-powered Smart Interaction' :
                   language === 'ja' ? 'AIベースのスマートインタラクション' :
                   'AI智能交互体验',
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      hoverGlow: 'group-hover:shadow-blue-500/20'
    },
    {
      href: '/greeting-video',
      icon: Video,
      title: translate('greetingVideo', language),
      description: language === 'ko' ? '맞춤형 인사 영상 서비스' : 
                   language === 'en' ? 'Personalized Greeting Video' :
                   language === 'ja' ? 'パーソナライズド挨拶動画' :
                   '个性化问候视频',
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      hoverGlow: 'group-hover:shadow-purple-500/20'
    },
    {
      href: '/phone',
      icon: Phone,
      title: translate('phone', language),
      description: language === 'ko' ? '직접 통화로 소통하기' : 
                   language === 'en' ? 'Direct Phone Communication' :
                   language === 'ja' ? '直接通話でのコミュニケーション' :
                   '直接电话沟通',
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      hoverGlow: 'group-hover:shadow-green-500/20'
    },
    {
      href: '/innocard-inquiry',
      icon: CreditCard,
      title: translate('innoCardInquiry', language),
      description: language === 'ko' ? '이노카드 서비스 문의' : 
                   language === 'en' ? 'InnoCard Service Inquiry' :
                   language === 'ja' ? 'イノカードサービスお問い合わせ' :
                   'InnoCard服务咨询',
      color: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      hoverGlow: 'group-hover:shadow-amber-500/20'
    }
  ];

  return (
    <section className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="relative inline-block">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {language === 'ko' && '연락하기'}
            {language === 'en' && 'Get in Touch'}
            {language === 'ja' && 'お問い合わせ'}
            {language === 'zh' && '联系我们'}
          </h2>
          <div className="absolute -top-2 -right-6">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {language === 'ko' && '다양한 방법으로 연결하고 소통하세요'}
          {language === 'en' && 'Connect and communicate in various ways'}
          {language === 'ja' && '様々な方法で接続し、コミュニケーションを取ります'}
          {language === 'zh' && '通过多种方式连接和沟通'}
        </p>
      </motion.div>

      {/* Contact options grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactOptions.map((option, index) => (
          <motion.div
            key={option.href}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              type: "spring",
              damping: 20
            }}
            className="group relative"
          >
            <Link href={option.href} className="block">
              {/* Contact card */}
              <div className={`relative bg-gradient-to-br ${option.bgGradient} backdrop-blur-xl rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl ${option.hoverGlow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}>
                {/* Icon and arrow */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${option.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {option.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />

                {/* Subtle border glow */}
                <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mt-8"
      >
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {language === 'ko' && '언제든지 편한 방법으로 연락 주세요!'}
          {language === 'en' && 'Feel free to reach out anytime!'}
          {language === 'ja' && 'いつでもお気軽にご連絡ください！'}
          {language === 'zh' && '随时欢迎您的联系！'}
        </p>
      </motion.div>
    </section>
  );
} 