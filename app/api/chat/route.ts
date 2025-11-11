import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabase';

// Edge Runtime 사용 (더 빠른 응답 속도)
export const runtime = 'edge';

// 간단한 메모리 캐시 구현
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5분

// 캐시 키 생성 헬퍼
const getCacheKey = (table: string, ownerId: number) => `chat-${table}-${ownerId}`;

// 캐시된 데이터 가져오기
const getCachedData = async <T>(
  cacheKey: string,
  fetchFn: () => Promise<T>
): Promise<T> => {
  const now = Date.now();
  const cached = cache.get(cacheKey);
  
  // 캐시가 있고 유효한 경우
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    console.log(`[캐시 히트] ${cacheKey}`);
    return cached.data;
  }
  
  // 캐시 미스 또는 만료된 경우
  console.log(`[캐시 미스] ${cacheKey}`);
  const data = await fetchFn();
  cache.set(cacheKey, { data, timestamp: now });
  
  return data;
};

// 실제 DB 구조에 맞춰 데이터 가져오기 (필요한 필드만 선택하여 최적화)
async function getOwnerData(ownerId: number) {
  const { data, error } = await supabase
    .from('owners')
    .select('name, email')
    .eq('owner_id', ownerId)
    .single();
  
  if (error) console.error('Owner 조회 오류:', error);
  return data;
}

async function getProjectsData(ownerId: number) {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, title, description, intro, date, deployment_url, deployment_url2, siteurl, my_role, background, highlights, technology_stacks')
    .eq('owner_id', ownerId)
    .order('id', { ascending: true });
  
  if (error) console.error('Projects 조회 오류:', error);
  return data || [];
}

async function getExperiencesData(ownerId: number) {
  const { data, error } = await supabase
    .from('experiences')
    .select('title, company, position, period, description, skills')
    .eq('owner_id', ownerId)
    .order('id', { ascending: true });
  
  if (error) console.error('Experiences 조회 오류:', error);
  return data || [];
}

async function getProfilesData(ownerId: number) {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, occupation, mbti, birthdate, affiliation, age, education, email, phone, greetingscript, address')
    .eq('owner_id', ownerId)
    .single();
  
  if (error) console.error('Profiles 조회 오류:', error);
  return data;
}

async function getValuesData(ownerId: number) {
  const { data, error } = await supabase
    .from('values')
    .select('title, content')
    .eq('owner_id', ownerId)
    .order('id', { ascending: true });
  
  if (error) console.error('Values 조회 오류:', error);
  return data || [];
}

async function getCertificationsData(ownerId: number) {
  const { data, error } = await supabase
    .from('certifications')
    .select('title, period, description, skills')
    .eq('owner_id', ownerId)
    .order('id', { ascending: true });
  
  if (error) console.error('Certifications 조회 오류:', error);
  return data || [];
}

async function getSkillsData(ownerId: number) {
  const { data, error } = await supabase
    .from('skills')
    .select('name, level, description, keywords')
    .eq('owner_id', ownerId)
    .order('id', { ascending: true });
  
  if (error) console.error('Skills 조회 오류:', error);
  return data || [];
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Chat API 호출 시작 ===');
    const OWNER_ID = Number(process.env.NEXT_PUBLIC_OWNER_ID || 1);
    console.log('환경 변수 OWNER_ID:', OWNER_ID);
    
    const { message, language } = await request.json();
    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: '메시지를 입력하세요.' }, { status: 400 });
    }
    
    // 언어 코드 매핑 (기본값: 한국어)
    const userLanguage = language || 'ko';
    const languageNames: { [key: string]: string } = {
      'ko': '한국어',
      'en': '영어',
      'ja': '일본어',
      'zh': '중국어'
    };
    
    console.log('받은 메시지:', message);
    console.log('사용자 언어:', userLanguage);

    // Supabase에서 모든 사용자 데이터 가져오기 (캐시 사용)
    console.log('Supabase에서 모든 데이터 조회 중...');
    const [owner, projects, experiences, profile, values, certifications, skills] = await Promise.all([
      getCachedData(getCacheKey('owners', OWNER_ID), () => getOwnerData(OWNER_ID)),
      getCachedData(getCacheKey('projects', OWNER_ID), () => getProjectsData(OWNER_ID)),
      getCachedData(getCacheKey('experiences', OWNER_ID), () => getExperiencesData(OWNER_ID)),
      getCachedData(getCacheKey('profiles', OWNER_ID), () => getProfilesData(OWNER_ID)),
      getCachedData(getCacheKey('values', OWNER_ID), () => getValuesData(OWNER_ID)),
      getCachedData(getCacheKey('certifications', OWNER_ID), () => getCertificationsData(OWNER_ID)),
      getCachedData(getCacheKey('skills', OWNER_ID), () => getSkillsData(OWNER_ID))
    ]);

    console.log('조회된 데이터:', { 
      owner, 
      projects: projects.length, 
      experiences: experiences.length,
      profile: !!profile,
      values: values.length,
      certifications: certifications.length,
      skills: skills.length
    });

    // 데이터를 하나의 컨텍스트로 구성
    let contextData = '';
    
    // 프로필 정보 (상세)
    if (profile) {
      contextData += `프로필 정보:\n`;
      contextData += `- 이름: ${profile.name}\n`;
      contextData += `- 직업: ${profile.occupation}\n`;
      contextData += `- MBTI: ${profile.mbti}\n`;
      contextData += `- 생년월일: ${profile.birthdate}\n`;
      contextData += `- 소속: ${profile.affiliation}\n`;
      contextData += `- 나이: ${profile.age}\n`;
      
      if (profile.address) {
        contextData += `- 주소: ${profile.address}\n`;
      }
      
      if (profile.education && Array.isArray(profile.education)) {
        contextData += `- 학력: ${profile.education.map((edu: any) => `${edu.학교} ${edu.전공} ${edu.학위}`).join(', ')}\n`;
      }
      
      contextData += `- 이메일: ${profile.email}\n`;
      contextData += `- 전화: ${profile.phone}\n`;
      contextData += `- 인사말: ${profile.greetingscript}\n\n`;
    }
    
    // 기본 정보 (백업)
    if (!profile && owner) {
      contextData += `기본 정보:\n`;
      contextData += `- 이름: ${owner.name}\n`;
      contextData += `- 이메일: ${owner.email}\n\n`;
    }

    // 가치관/비전
    if (values && values.length > 0) {
      contextData += `가치관/비전:\n`;
      values.forEach(value => {
        contextData += `- ${value.title}: ${value.content}\n`;
      });
      contextData += '\n';
    }

    // 자격증 정보
    if (certifications && certifications.length > 0) {
      contextData += `자격증 (총 ${certifications.length}개):\n`;
      certifications.forEach(cert => {
        contextData += `- ${cert.title}\n`;
        if (cert.period) {
          contextData += `  취득일: ${cert.period}\n`;
        }
        if (cert.description) {
          contextData += `  설명: ${cert.description}\n`;
        }
        if (cert.skills && Array.isArray(cert.skills) && cert.skills.length > 0) {
          contextData += `  관련 기술: ${cert.skills.join(', ')}\n`;
        }
        contextData += '\n';
      });
    }

    // 기술 스택 정보
    if (skills && skills.length > 0) {
      contextData += `기술 스택 (총 ${skills.length}개):\n`;
      skills.forEach(skill => {
        contextData += `- ${skill.name} (레벨: ${skill.level}%)\n`;
        if (skill.description) {
          contextData += `  설명: ${skill.description}\n`;
        }
        if (skill.keywords && Array.isArray(skill.keywords) && skill.keywords.length > 0) {
          contextData += `  키워드: ${skill.keywords.join(', ')}\n`;
        }
        contextData += '\n';
      });
    }

    // 경력 정보
    if (experiences && experiences.length > 0) {
      contextData += `경력 정보:\n`;
      experiences.forEach(exp => {
        // title 필드가 있으면 우선 사용
        if (exp.title) {
          contextData += `- 제목: ${exp.title}\n`;
        }
        if (exp.company) {
          contextData += `  회사: ${exp.company}\n`;
        }
        if (exp.position) {
          contextData += `  직책: ${exp.position}\n`;
        }
        if (exp.period) {
          contextData += `  기간: ${exp.period}\n`;
        }
        
        // description이 jsonb 형식이므로 파싱
        if (exp.description && typeof exp.description === 'object') {
          const desc = exp.description as any;
          if (desc.skills) {
            contextData += `  기술 스택:\n`;
            if (desc.skills.ai_development) {
              contextData += `    AI 개발: `;
              const aiDev = desc.skills.ai_development;
              const aiTools = [];
              if (aiDev.chatbot_development) {
                aiTools.push(`챗봇 개발 (${aiDev.chatbot_development.tools?.join(', ')})`);
              }
              if (aiDev.workflow_automation) {
                aiTools.push(`워크플로우 자동화 (${aiDev.workflow_automation.tools?.join(', ')})`);
              }
              contextData += aiTools.join(', ') + '\n';
            }
            if (desc.skills.web_development) {
              const webDev = desc.skills.web_development;
              contextData += `    웹 개발: ${webDev.platforms?.join(', ')} - ${webDev.description}\n`;
            }
          } else if (typeof desc === 'string') {
            contextData += `  설명: ${desc}\n`;
          }
        }
        
        // skills 필드가 있으면 추가
        if (exp.skills && Array.isArray(exp.skills) && exp.skills.length > 0) {
          contextData += `  사용 기술: ${exp.skills.join(', ')}\n`;
        }
        
        contextData += '\n';
      });
    }

    // 프로젝트 정보 (다국어 jsonb)
    if (projects && projects.length > 0) {
      contextData += `프로젝트 포트폴리오 (총 ${projects.length}개):\n`;
      projects.forEach((project, index) => {
        const titleKo = project.title?.ko || project.title;
        const descKo = project.description?.ko || project.description;
        
        contextData += `${index + 1}. ${titleKo}\n`;
        
        if (project.intro) {
          contextData += `   소개: ${project.intro}\n`;
        }
        
        if (descKo) {
          contextData += `   설명: ${descKo}\n`;
        }
        
        if (project.date) {
          contextData += `   기간: ${project.date}\n`;
        }
        
        if (project.deployment_url) {
          contextData += `   배포 URL: ${project.deployment_url}\n`;
        }
        
        if (project.deployment_url2) {
          contextData += `   배포 URL 2: ${project.deployment_url2}\n`;
        }
        
        if (project.siteurl && !project.deployment_url) {
          contextData += `   URL: ${project.siteurl}\n`;
        }
        
        if (project.my_role) {
          contextData += `   내 역할: ${project.my_role}\n`;
        }
        
        if (project.background) {
          contextData += `   배경: ${project.background}\n`;
        }
        
        if (project.highlights && Array.isArray(project.highlights) && project.highlights.length > 0) {
          contextData += `   주요 하이라이트:\n`;
          project.highlights.forEach((highlight: string, idx: number) => {
            contextData += `     ${idx + 1}. ${highlight}\n`;
          });
        }
        
        if (project.technology_stacks && Array.isArray(project.technology_stacks) && project.technology_stacks.length > 0) {
          contextData += `   기술 스택: ${project.technology_stacks.join(', ')}\n`;
        }
        
        contextData += '\n';
      });
    }

    // OpenAI API 호출
    console.log('OpenAI로 질문과 컨텍스트 전송...');
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key가 설정되지 않았습니다.' }, { status: 500 });
    }

    const systemPrompt = `You are JaeKwon Lee's AI clone. Based on the information below, always respond in the first person perspective (I, me, my, etc.).

CRITICAL LANGUAGE RULE: You MUST respond in the EXACT same language that the user uses in their message.
- If the user writes in English → respond ONLY in English
- If the user writes in Japanese (日本語) → respond ONLY in Japanese
- If the user writes in Chinese (中文) → respond ONLY in Chinese
- If the user writes in Korean (한국어) → respond ONLY in Korean
Do NOT mix languages. Match the user's language exactly.

${contextData}

Response Guidelines:
1. If the question relates to the information above, use that information to provide detailed answers
2. When asked about projects, explain them specifically (technologies used, purpose, features, etc.)
3. Answer simply for simple questions, and in detail for detailed questions
4. Do not make up information that doesn't exist. If you don't know, say so politely in the user's language
5. Always respond in a friendly and natural conversational tone
6. Share your experience and technical insights as a developer
7. Do NOT start every response with greetings like "안녕하세요" or "Hello". Only greet if it's the very first message in a conversation or if the user explicitly greets you
8. REMEMBER: Always respond in the same language as the user's message. This is the most important rule.`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_completion_tokens: 800,
        temperature: 0.7
      }),
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error('OpenAI API 오류:', errorText);
      return NextResponse.json({ 
        error: 'AI 서비스 응답 오류', 
        details: errorText 
      }, { status: 500 });
    }

    const data = await openaiRes.json();
    console.log('OpenAI 응답:', data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      return NextResponse.json({ 
        error: 'AI로부터 응답을 받지 못했습니다.', 
        raw: data 
      }, { status: 500 });
    }

    const responseContent = data.choices[0].message.content;

    return NextResponse.json({ 
      response: responseContent
    });

  } catch (error) {
    console.error('Chat API 에러:', error);
    return NextResponse.json({ 
      error: 'AI 호출 중 오류가 발생했습니다.', 
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const OWNER_ID = Number(process.env.NEXT_PUBLIC_OWNER_ID || 1);
    
    // 데이터 상태 확인
    const [owner, projects, experiences, profile, values, certifications, skills] = await Promise.all([
      getOwnerData(OWNER_ID),
      getProjectsData(OWNER_ID),
      getExperiencesData(OWNER_ID),
      getProfilesData(OWNER_ID),
      getValuesData(OWNER_ID),
      getCertificationsData(OWNER_ID),
      getSkillsData(OWNER_ID)
    ]);

    return NextResponse.json({ 
      status: 'ok',
      message: '챗봇 API가 정상 작동 중입니다.',
      data: {
        owner: owner ? { name: owner.name, email: owner.email } : null,
        profile: profile ? { name: profile.name, occupation: profile.occupation, mbti: profile.mbti, age: profile.age } : null,
        projectsCount: projects.length,
        experiencesCount: experiences.length,
        valuesCount: values.length,
        certificationsCount: certifications.length,
        skillsCount: skills.length
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: 'API 상태 확인 중 오류 발생',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

