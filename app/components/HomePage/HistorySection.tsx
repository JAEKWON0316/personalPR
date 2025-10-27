'use client'

import Career, { CareerItem } from '../Career';
import { useLanguage } from '../../hooks/useLanguage';

const careerData: Record<string, CareerItem[]> = {
  ko: [
    {
      year: 2024,
      title: '이노커브 입사',
      description: ['2024년 이노커브에 입사하여 AI 기반 서비스 개발 참여'],
      type: 'work',
    },
    {
      year: 2023,
      title: 'AI 템플릿 공모전 우수상',
      description: ['2023년 AI 템플릿 공모전에서 우수상 수상'],
      type: 'achievement',
    },
    {
      year: 2022,
      title: '스마트홈 IoT 프로젝트',
      description: ['2022년 스마트홈 IoT 시스템 개발 프로젝트 참여'],
      type: 'project',
    },
    {
      year: 2025,
      title: '컴퓨터공학과 학사 졸업',
      description: ['2025년 컴퓨터공학과 학사 졸업'],
      type: 'education',
    },
  ],
  en: [
    {
      year: 2024,
      title: 'Joined INNOCURVE',
      description: ['Joined INNOCURVE in 2024 and participated in AI-based service development'],
      type: 'work',
    },
    {
      year: 2023,
      title: 'AI Template Competition Excellence Award',
      description: ['Won Excellence Award at the 2023 AI Template Competition'],
      type: 'achievement',
    },
    {
      year: 2022,
      title: 'Smart Home IoT Project',
      description: ['Participated in Smart Home IoT System Development Project in 2022'],
      type: 'project',
    },
    {
      year: 2025,
      title: 'Bachelor of Computer Engineering, Korea University',
      description: ['Graduated with a Bachelor’s degree in Computer Engineering in 2025'],
      type: 'education',
    },
  ],
  ja: [
    {
      year: 2024,
      title: 'INNOCURVE入社',
      description: ['2024年にINNOCURVEに入社し、AIサービス開発に従事'],
      type: 'work',
    },
    {
      year: 2023,
      title: 'AIテンプレートコンテスト優秀賞',
      description: ['2023年AIテンプレートコンテストで優秀賞受賞'],
      type: 'achievement',
    },
    {
      year: 2022,
      title: 'スマートホームIoTプロジェクト',
      description: ['2022年スマートホームIoTシステム開発プロジェクトに参加'],
      type: 'project',
    },
    {
      year: 2025,
      title: '韓国大学コンピュータ工学学士卒業',
      description: ['2025年コンピュータ工学学士卒業'],
      type: 'education',
    },
  ],
  zh: [
    {
      year: 2024,
      title: '加入INNOCURVE',
      description: ['2024年加入INNOCURVE，参与AI服务开发'],
      type: 'work',
    },
    {
      year: 2023,
      title: 'AI模板大赛优秀奖',
      description: ['2023年获得AI模板大赛优秀奖'],
      type: 'achievement',
    },
    {
      year: 2022,
      title: '智能家居IoT项目',
      description: ['2022年参与智能家居IoT系统开发项目'],
      type: 'project',
    },
    {
      year: 2025,
      title: '韩国大学计算机工程学士毕业',
      description: ['2025年计算机工程学士毕业'],
      type: 'education',
    },
  ],
};

export default function HistorySection() {
  const { language } = useLanguage();
  const items = careerData[language] || careerData['ko'];
  return (
    <section id="history" className="scroll-mt-24">
      <h2 className="text-2xl font-bold mb-4">연혁</h2>
      <Career items={items} />
    </section>
  );
} 