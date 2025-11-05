import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 요청 바디 파싱 및 기본값
    let text: unknown;
    let voice_settings: unknown;
    try {
      const body = await request.json();
      text = body?.text;
      voice_settings = body?.voice_settings;
    } catch {
      return NextResponse.json(
        { error: '잘못된 JSON 형식입니다.' },
        { status: 400 }
      );
    }

    // 입력 유효성 검사
    if (typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'text 필드는 비어 있을 수 없습니다.' },
        { status: 400 }
      );
    }
    
    // ElevenLabs 설정
    const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || process.env.ELEVEN_LABS_VOICE_ID;
    const API_KEY = process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LABS_API_KEY;

    console.log('환경 변수 상태:', { 
      hasApiKey: !!API_KEY, 
      apiKeyLength: API_KEY?.length,
      hasVoiceId: !!VOICE_ID,
      voiceId: VOICE_ID
    });

    if (!VOICE_ID || !API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API 키 또는 Voice ID가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 이하 ElevenLabs 호출 (기존 동작)

    // TTS 요청
    console.log('TTS 요청 시작:', { 
      textLength: text.length,
      model: 'eleven_multilingual_v2',
      voice_settings
    });

    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: (voice_settings as Record<string, unknown>) || {
            stability: 0.75, // 높은 안정성으로 일관된 목소리 유지
            similarity_boost: 0.95, // 원본 목소리와 최대한 유사하게
          }
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('TTS 요청 실패:', {
        status: ttsResponse.status,
        statusText: ttsResponse.statusText,
        error: errorText
      });
      // 외부 API 상태 코드를 그대로 전달하여 클라이언트에서 원인 파악이 쉽도록 처리
      const mappedMessage =
        ttsResponse.status === 401 ? '인증 실패: API 키가 유효하지 않습니다.' :
        ttsResponse.status === 422 ? '잘못된 요청: 텍스트가 너무 길거나 형식이 잘못되었습니다.' :
        ttsResponse.status === 429 ? '요청 한도 초과: API 사용량을 확인해주세요.' :
        `TTS 변환 실패: ${ttsResponse.status} ${ttsResponse.statusText}`;

      return NextResponse.json(
        { error: mappedMessage, details: errorText },
        { status: ttsResponse.status }
      );
    }

    console.log('TTS 응답 수신 완료');
    const audioBlob = await ttsResponse.blob();
    
    if (audioBlob.size === 0) {
      return NextResponse.json(
        { error: '생성된 오디오가 비어있습니다.' },
        { status: 502 }
      );
    }

    console.log('오디오 변환 성공:', {
      size: audioBlob.size,
      type: audioBlob.type
    });

    return new Response(audioBlob, {
      headers: { 
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache'
      },
    });
  } catch (error) {
    console.error('TTS 처리 중 오류:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'TTS 변환 중 오류가 발생했습니다.',
        details: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error
      },
      { status: 500 }
    );
  }
} 