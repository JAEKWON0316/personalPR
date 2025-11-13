import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jack1.co.kr'

export default function sitemap(): MetadataRoute.Sitemap {
  // 주요 페이지들
  const routes = [
    '',
    '/greeting',
    '/gallery',
    '/chat',
    '/voice-chat',
    '/inquiry',
    '/post',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}