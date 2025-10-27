'use client'

import FadeInSection from '../FadeInSection'
import ContactOptions from '../ContactOptions'
import { Language } from '../../utils/translations'

interface ContactOptionsSectionProps {
  language: Language
}

export default function ContactOptionsSection({ language }: ContactOptionsSectionProps) {
  return (
    <div className="w-full overflow-x-hidden">
      <FadeInSection>
        <section id="smart-options" className="mb-8">
          <ContactOptions language={language} />
        </section>
      </FadeInSection>
    </div>
  )
} 