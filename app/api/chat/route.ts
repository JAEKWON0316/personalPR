import { NextRequest, NextResponse } from 'next/server';
import {
  getUserProfilesByOwnerId,
  getUserDataByOwnerId,
  getProjectCardsByOwnerId,
  getValuesByOwnerId,
  getGenericInfoByOwnerId,
  supabase
} from '@/app/utils/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Chat API 호출 시작 ===');
    console.log('환경 변수 OWNER_ID:', process.env.OWNER_ID);
    
    const { message } = await request.json();
    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: '메시지를 입력하세요.' }, { status: 400 });
    }
    
    console.log('받은 메시지:', message);

    // Supabase에서 모든 사용자 데이터 가져오기
    console.log('Supabase에서 모든 데이터 조회 중...');
    const [profiles, projects, values, genericInfo] = await Promise.all([
      getUserProfilesByOwnerId(),
      getProjectCardsByOwnerId(), 
      getValuesByOwnerId(),
      getGenericInfoByOwnerId()
    ]);

    // 데이터를 하나의 컨텍스트로 구성
    let contextData = '';
    
    if (profiles && profiles.length > 0) {
      const profile = profiles[0];
      contextData += `프로필 정보:\n`;
      contextData += `- 이름: ${profile.name}\n`;
      contextData += `- 직업: ${profile.occupation}\n`;
      contextData += `- MBTI: ${profile.mbti}\n`;
      contextData += `- 생년월일: ${profile.birthdate}\n`;
      contextData += `- 소속: ${profile.affiliation}\n`;
      if (profile.education && profile.education.length > 0) {
        contextData += `- 학력: ${profile.education.map((edu: any) => `${edu.학교}: ${edu.전공}`).join(', ')}\n`;
      }
      contextData += `- 이메일: ${profile.email}\n`;
      contextData += `- 전화: ${profile.phone}\n`;
      contextData += `- 인사말: ${profile.greetingscript}\n\n`;
    }

    if (values && values.length > 0) {
      contextData += `가치관/비전:\n`;
      values.forEach(value => {
        contextData += `- ${value.title}: ${value.content}\n`;
      });
      contextData += '\n';
    }

    if (projects && projects.length > 0) {
      contextData += `프로젝트/경력:\n`;
      projects.forEach(project => {
        contextData += `- ${project.title}: ${project.description}\n`;
      });
      contextData += '\n';
    }

    if (genericInfo && genericInfo.length > 0) {
      contextData += `기타 정보:\n`;
      genericInfo.forEach(info => {
        contextData += `- ${info.title}: ${info.content}\n`;
      });
      contextData += '\n';
    }

    // OpenAI API 호출
    console.log('OpenAI로 질문과 컨텍스트 전송...');
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'No API key' }, { status: 500 });
    }

    const systemPrompt = `당신은 챗봇 주인의 클론입니다. 아래 정보를 바탕으로 항상 1인칭 시점(나, 저, 제 등)으로 답변하세요.

${contextData}

답변 가이드라인:
1. 위 정보에 관련된 질문이면 해당 정보를 활용해서 답변
2. 간단한 질문에는 간단하게, 자세한 질문에는 자세하게 답변
3. 없는 정보는 만들어내지 말고 "잘 모르겠어요" 또는 일반적인 답변 제공
4. 항상 친근하고 자연스럽게 대화하듯 답변`;

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
        max_tokens: 512,
        temperature: 0.7
      }),
    });

    const data = await openaiRes.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      return NextResponse.json({ error: 'No response from AI', raw: data }, { status: 500 });
    }

    return NextResponse.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Chat API 에러:', error);
    return NextResponse.json({ 
      error: 'AI 호출 중 오류 발생', 
      raw: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: '챗봇 서비스는 현재 점검 중입니다. 곧 개선된 서비스로 돌아오겠습니다.' 
  });
}