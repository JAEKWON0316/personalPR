'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { careerTypeMeta, CareerType } from './CareerTypeMeta'
import { useLanguage } from '../hooks/useLanguage'
import SophisticatedButton from './SophisticatedButton';

export type CareerItem = {
  year: number
  title: string
  description: string[]
  type: CareerType
}

interface CareerProps {
  items?: CareerItem[]
}

const Career: React.FC<CareerProps> = ({ items = [] }) => {
  const { language } = useLanguage()
  const [showAll, setShowAll] = React.useState(false)

  // 연도별로 그룹핑
  const grouped = React.useMemo(() => {
    const map = new Map<number, CareerItem[]>();
    items.forEach(item => {
      if (!map.has(item.year)) map.set(item.year, []);
      map.get(item.year)!.push(item);
    });
    // 연도 내림차순 정렬
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [items]);

  const visibleGroups = showAll ? grouped : grouped.slice(0, 2);

  return (
    <div className="space-y-14">
      {visibleGroups.map(([year, yearItems]) => (
        <div key={year}>
          <div
            className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            {year}
          </div>
          <div className="space-y-6">
            {yearItems.map((item, idx) => {
              const { icon: Icon, color } = careerTypeMeta[item.type]
              return (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="pt-1">
                    <Icon size={32} style={{ color }} aria-label={item.type} />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{item.title}</div>
                    <ul className="list-disc ml-5 mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {item.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      {grouped.length > 2 && (
        <div className="flex justify-center mt-6">
          <SophisticatedButton
            expanded={showAll}
            onClick={() => setShowAll(v => !v)}
            language={language}
          />
        </div>
      )}
    </div>
  )
}

export default Career