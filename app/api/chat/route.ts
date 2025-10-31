import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/utils/supabase';

// 실제 DB 구조에 맞춰 데이터 가져오기
async function getOwnerData(ownerId: number) {
  const { data, error } = await supabase
    .from('owners')
    .select('*')
    .eq('owner_id', ownerId)
    .single();
  
  if (error) console.error('Owner 조회 오류:', error);
  return data;
}

async function getProjectsData(ownerId: number) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', ownerId)
    .order('id', { ascending: true });
  
  if (error) console.error('Projects 조회 오류:', error);
  return data || [];
}

async function getExperiencesData(ownerId: number) {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('owner_id', ownerId)
    .order('id', { ascending: true });
  
  if (error) console.error('Experiences 조회 오류:', error);
  return data || [];
}

async function getProfilesData(ownerId: number) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('owner_id', ownerId)
    .single();
  
  if (error) console.error('Profiles 조회 오류:', error);
  return data;
}

async function getValuesData(ownerId: number) {
  const { data, error } = await supabase
    .from('values')
    .select('*')
    .eq('owner_id', ownerId)
    .order('id', { ascending: true });
  
  if (error) console.error('Values 조회 오류:', error);
  return data || [];
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Chat API 호출 시작 ===');
    const OWNER_ID = Number(process.env.NEXT_PUBLIC_OWNER_ID || 1);
    console.log('환경 변수 OWNER_ID:', OWNER_ID);
    
    const { message } = await request.json();
    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: '메시지를 입력하세요.' }, { status: 400 });
    }
    
    console.log('받은 메시지:', message);

    // Supabase에서 모든 사용자 데이터 가져오기
    console.log('Supabase에서 모든 데이터 조회 중...');
    const [owner, projects, experiences, profile, values] = await Promise.all([
      getOwnerData(OWNER_ID),
      getProjectsData(OWNER_ID),
      getExperiencesData(OWNER_ID),
      getProfilesData(OWNER_ID),
      getValuesData(OWNER_ID)
    ]);

    console.log('조회된 데이터:', { 
      owner, 
      projects: projects.length, 
      experiences: experiences.length,
      profile: !!profile,
      values: values.length
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

    // 경력 정보
    if (experiences && experiences.length > 0) {
      contextData += `경력 정보:\n`;
      experiences.forEach(exp => {
        contextData += `- 회사: ${exp.company}\n`;
        contextData += `  직책: ${exp.position}\n`;
        contextData += `  기간: ${exp.period}\n`;
        
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
          }
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
        contextData += `   설명: ${descKo}\n`;
        if (project.date) {
          contextData += `   기간: ${project.date}\n`;
        }
        if (project.siteurl) {
          contextData += `   URL: ${project.siteurl}\n`;
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

    const systemPrompt = `당신은 이재권의 AI 클론입니다. 아래 정보를 바탕으로 항상 1인칭 시점(나, 저, 제 등)으로 답변하세요.

${contextData}

답변 가이드라인:
1. 위 정보에 관련된 질문이면 해당 정보를 활용해서 자세히 답변
2. 프로젝트에 대해 물어보면 구체적으로 설명 (사용 기술, 목적, 특징 등)
3. 간단한 질문에는 간단하게, 자세한 질문에는 자세하게 답변
4. 없는 정보는 만들어내지 말고 "잘 모르겠어요" 또는 일반적인 답변 제공
5. 항상 친근하고 자연스럽게 대화하듯 답변
6. 개발자로서의 경험과 기술적 인사이트를 공유`;

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

    return NextResponse.json({ 
      response: data.choices[0].message.content 
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
    const [owner, projects, experiences, profile, values] = await Promise.all([
      getOwnerData(OWNER_ID),
      getProjectsData(OWNER_ID),
      getExperiencesData(OWNER_ID),
      getProfilesData(OWNER_ID),
      getValuesData(OWNER_ID)
    ]);

    return NextResponse.json({ 
      status: 'ok',
      message: '챗봇 API가 정상 작동 중입니다.',
      data: {
        owner: owner ? { name: owner.name, email: owner.email } : null,
        profile: profile ? { name: profile.name, occupation: profile.occupation, mbti: profile.mbti, age: profile.age } : null,
        projectsCount: projects.length,
        experiencesCount: experiences.length,
        valuesCount: values.length
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
