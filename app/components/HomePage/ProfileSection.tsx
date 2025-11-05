'use client'

import Image from 'next/image'
import FadeInSection from '../FadeInSection'
import { Language, translate } from '../../utils/translations'

interface ProfileSectionProps {
  language: Language
}

function ProfileItem({ label, value, className = '' }: { label: string, value: string[], className?: string }) {
  return (
    <div className={`group relative flex flex-col space-y-2 ${className}`}>
      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1">
        <span className="text-blue-600/90 dark:text-blue-400/90 text-sm font-semibold tracking-wide uppercase">{label}</span>
        <div className="text-gray-900 dark:text-white font-medium">
          {value.map((item, index) => (
            <div key={index} className="text-base leading-relaxed">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProfileSection({ language }: ProfileSectionProps) {
  return (
    <div className="w-full overflow-x-hidden">
      <FadeInSection>
        <section id="profile" className="mb-12 relative px-4">
          {/* Subtle background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/20 to-cyan-50/30 dark:from-gray-900/30 dark:via-gray-800/20 dark:to-blue-900/10 rounded-[2rem] blur-xl" />
          
          {/* Main card with proper padding to prevent clipping */}
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-[2rem] p-4 sm:p-8 md:p-12 border border-white/40 dark:border-gray-700/40 shadow-xl overflow-hidden">
            <div className="relative flex flex-col items-center space-y-8">
              {/* Enhanced profile image with subtle glow */}
              <div className="relative group p-4">
                <div className="w-44 h-44 sm:w-64 sm:h-64 relative">
                  {/* Subtle glow effect - much reduced */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 scale-110" />
                  
                  {/* Profile image container */}
                  <div className="relative w-full h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-full p-2 border border-white/60 dark:border-gray-700/60 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02]">
                    <Image 
                      src="/pr_img3.jpg"
                      alt={translate('name', language)} 
                      fill
                      sizes="(max-width: 640px) 176px, 256px"
                      priority
                      className="rounded-full object-cover object-top" 
                    />
                  </div>
                </div>
              </div>

              {/* Typography - 이름 크기 조정 */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-br from-gray-900 via-blue-800 to-cyan-600 dark:from-white dark:via-blue-200 dark:to-cyan-300 bg-clip-text text-transparent leading-tight tracking-tight">
                  {translate('name', language)}
                </h2>
                <p className="text-base sm:text-lg lg:text-2xl text-gray-600/90 dark:text-gray-300/90 leading-relaxed font-medium">
                  {translate('title', language).split('|').map((part, index) => (
                    <span key={index} className="sm:inline block">
                      {index > 0 && <span className="sm:inline hidden mx-3 text-blue-500/60">·</span>}
                      {part}
                    </span>
                  ))}
                </p>
              </div>

              {/* Profile items grid with proper spacing */}
              <div className="w-full max-w-4xl mx-auto px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProfileItem label={translate('birth', language)} value={[translate('birthDate', language)]} className="text-center" />
                  <ProfileItem label={translate('mbti', language)} value={[translate('mbtiType', language)]} className="text-center" />
                  <ProfileItem 
                    label={translate('affiliation', language)} 
                    value={translate('affiliationDescription', language).split('\n')} 
                    className="text-center md:col-span-2 lg:col-span-1"
                  />
                  <ProfileItem 
                    label={translate('education', language)} 
                    value={translate('educationDescription', language).split('\n')} 
                    className="text-center md:col-span-2 lg:col-span-2"
                  />
                  <ProfileItem 
                    label={translate('field', language)} 
                    value={[translate('fieldDescription', language)]} 
                    className="text-center md:col-span-2 lg:col-span-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  )
} 