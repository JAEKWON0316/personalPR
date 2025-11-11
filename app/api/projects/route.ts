import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

type Language = 'ko' | 'en' | 'ja' | 'zh'

export interface ProjectItem {
  id: number
  folder: string
  title: Record<Language, string>
  description: Record<Language, string>
  tags: Record<Language, string[]>
  images: string[]
  cover: string
  link?: string
  link2?: string
  highlights?: string[]
  role?: string
  background?: string
}

type InformationItem = {
  id?: number
  title?: string
  intro?: string
  deploymentURL?: string
  deploymentURL2?: string
  summary?: string
  highlights?: string[]
  myRole?: string
  description?: string
  background?: string
  technologyStacks?: string[]
}

type InformationJson = { information?: InformationItem[]; readmes?: InformationItem[] } | InformationItem

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg'])

function isImage(name: string) {
  return IMAGE_EXTS.has(path.extname(name).toLowerCase())
}

export async function GET() {
  try {
    const base = path.join(process.cwd(), 'public', 'project_info')
    if (!fs.existsSync(base)) return NextResponse.json([])

    const dirs = fs.readdirSync(base, { withFileTypes: true }).filter(d => d.isDirectory())
    const projects: ProjectItem[] = []

    for (const d of dirs) {
      const dirPath = path.join(base, d.name)
      const infoPath = path.join(dirPath, 'information.json')
      let info: InformationItem | undefined
      try {
        if (fs.existsSync(infoPath)) {
          const raw = fs.readFileSync(infoPath, 'utf-8')
          const parsed: InformationJson = JSON.parse(raw)
          if (parsed && typeof parsed === 'object') {
            if ('information' in parsed) {
              const arr = (parsed as { information?: InformationItem[] }).information
              info = Array.isArray(arr) && arr.length > 0 ? arr[0] : undefined
            } else if ('readmes' in parsed) {
              const arr = (parsed as { readmes?: InformationItem[] }).readmes
              info = Array.isArray(arr) && arr.length > 0 ? arr[0] : undefined
            } else {
              info = parsed as InformationItem
            }
          }
        }
      } catch {}

      const files = fs.readdirSync(dirPath, { withFileTypes: true }).filter(f => f.isFile())
      const imgs = files.map(f => f.name).filter(isImage).sort()
      if (imgs.length === 0) continue

      const publicImgs = imgs.map(n => `/project_info/${d.name}/${n}`)
      // Prefer a sensible cover: try files that look like main/cover/01
      let preferred = imgs.find(n => /portfolio01|(^|[^\d])01\.|main|cover/i.test(n))
      // Explicit override for JACK1블로그: portfolio111.png
      if (d.name === 'JACK1블로그') {
        const specific = imgs.find(n => n.toLowerCase() === 'portfolio111.png')
        if (specific) preferred = specific
      }
      if (d.name === '대청세 사이트DCS') {
        const specific = imgs.find(n => n.toLowerCase() === 'dcs01.png')
        if (specific) preferred = specific
      }
      if (d.name === 'AI포트폴리오') {
        const specific = imgs.find(n => n.toLowerCase() === 'aiport01.png')
        if (specific) preferred = specific
      }
      if (d.name === '브랜딩') {
        const specific = imgs.find(n => n.toLowerCase() === 'branding01.png')
        if (specific) preferred = specific
      }
      const cover = preferred ? `/project_info/${d.name}/${preferred}` : publicImgs[0]

      const id = typeof info?.id === 'number' ? info!.id : projects.length + 1
      const titleKo = info?.title ?? d.name
      const descKo = info?.summary || info?.description || info?.intro || ''
      const tagsKo = Array.isArray(info?.technologyStacks) ? info!.technologyStacks! : []

      projects.push({
        id,
        folder: d.name,
        title: { ko: titleKo, en: titleKo, ja: titleKo, zh: titleKo },
        description: { ko: descKo, en: descKo, ja: descKo, zh: descKo },
        tags: { ko: tagsKo, en: tagsKo, ja: tagsKo, zh: tagsKo },
        images: publicImgs,
        cover,
        link: info?.deploymentURL,
        link2: info?.deploymentURL2,
        highlights: Array.isArray(info?.highlights) ? info!.highlights : undefined,
        role: info?.myRole,
        background: info?.background,
      })
    }

    // 프로젝트 표시 순서 정의
    const projectOrder: string[] = [
      'AI포트폴리오',
      'PKM AI',
      '브랜딩',
      '챗봇시스템AWS',
      '링키지',
      '대청세 사이트DCS',
      '모다리빙',
      '루가레스',
      'RPM',
      '스시마츠',
      'JACK1블로그'
    ]
    
    // 순서에 따라 정렬
    projects.sort((a, b) => {
      const indexA = projectOrder.indexOf(a.folder)
      const indexB = projectOrder.indexOf(b.folder)
      
      // 순서에 없는 프로젝트는 맨 뒤로
      if (indexA === -1 && indexB === -1) {
        return a.title.ko.localeCompare(b.title.ko)
      }
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      
      return indexA - indexB
    })
    
    return NextResponse.json(projects)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 })
  }
}


