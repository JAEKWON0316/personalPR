import { NextRequest, NextResponse } from 'next/server';
import {
  getUserProfilesByOwnerId,
  getProjectCardsByOwnerId,
  getValuesByOwnerId,
  getGenericInfoByOwnerId,
  supabase
} from '@/app/utils/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('=== 디버깅 API 호출 ===');
    console.log('환경 변수들:');
    console.log('- OWNER_ID:', process.env.OWNER_ID);
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    // Supabase 연결 테스트
    let connectionTest, connectionError;
    try {
      const result = await supabase.from('user_profiles').select('id').limit(1).maybeSingle();
      connectionTest = result.data;
      connectionError = result.error;
    } catch (error) {
      connectionError = error;
      console.error('Supabase 연결 시도 중 예외 발생:', error);
    }

    if (connectionError) {
      console.error('Supabase 연결 에러:', connectionError);
      return NextResponse.json({
        success: false,
        error: 'Supabase 연결 실패',
        details: connectionError
      });
    }

    // 각 테이블에서 데이터 조회 테스트
    const profiles = await getUserProfilesByOwnerId();
    const projects = await getProjectCardsByOwnerId();
    const values = await getValuesByOwnerId();
    const genericInfo = await getGenericInfoByOwnerId();

    // 테이블별 전체 데이터 수 확인
    const { count: profileCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    const { count: projectCount } = await supabase
      .from('projectcard')
      .select('*', { count: 'exact', head: true });

    const { count: valueCount } = await supabase
      .from('value')
      .select('*', { count: 'exact', head: true });

    const { count: genericCount } = await supabase
      .from('genericinfo')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      environment: {
        ownerId: process.env.OWNER_ID,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasApiKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      tableCounts: {
        user_profiles: profileCount,
        projectcard: projectCount,
        value: valueCount,
        genericinfo: genericCount
      },
      ownerData: {
        profiles: profiles?.length || 0,
        projects: projects?.length || 0,
        values: values?.length || 0,
        genericInfo: genericInfo?.length || 0
      },
      sampleData: {
        profiles: profiles?.[0] || null,
        projects: projects?.[0] || null,
        values: values?.[0] || null,
        genericInfo: genericInfo?.[0] || null
      }
    });

  } catch (error) {
    console.error('디버깅 API 에러:', error);
    return NextResponse.json({
      success: false,
      error: '디버깅 중 오류 발생',
      details: String(error)
    }, { status: 500 });
  }
}