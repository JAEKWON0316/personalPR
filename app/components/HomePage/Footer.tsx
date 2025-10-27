'use client'

import { Mail, Phone } from 'lucide-react'
import { Language, translate } from '../../utils/translations'

interface FooterProps {
  language: Language
}

export default function Footer({ language }: FooterProps) {
  return (
    <footer className="bg-gray-800 dark:bg-gray-800 text-white py-12 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{translate('contact', language)}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-5 h-5" />
              <p>admin@inno-curve.com</p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <p>010-1234-5678</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{translate('affiliation', language)}</h3>
            <div className="space-y-2">
              <p className="block text-white">
                {translate('affiliations_1', language)}
              </p>
              <p className="block text-white">
                {translate('affiliations_2', language)}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{translate('socialMedia', language)}</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2025 INNOCURVE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 