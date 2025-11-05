export type Language = 'ko' | 'en' | 'ja' | 'zh'

export interface ProjectItem {
  id: number
  folder: string
  title: Record<Language, string>
  description: Record<Language, string>
  tags: Record<Language, string[]>
  images: string[]
  cover: string
  link?: string
  highlights?: string[]
  role?: string
  background?: string
}


