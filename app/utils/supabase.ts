import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 환경 변수 확인을 위한 디버깅
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);
console.log('Supabase Key 사전 4자리:', supabaseKey?.substring(0, 4));

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL 또는 API Key가 설정되지 않았습니다.');
}

// URL 형식 검증
if (!supabaseUrl.startsWith('https://')) {
  throw new Error('Supabase URL이 올바르지 않습니다. https://로 시작해야 합니다.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getChatBotResponses() {
  const { data, error } = await supabase
    .from('chatbot_responses')
    .select('*');
  
  if (error) {
    console.error('Error fetching chatbot data:', error);
    return null;
  }
  
  return data;
}

export async function findResponseForQuestion(question: string) {
  try {
    const { data, error } = await supabase
      .from('chatbot_responses')
      .select('*')
      .textSearch('question', `'${question}'`, {
        type: 'websearch',
        config: 'korean'
      });

    if (error) {
      console.error('Error searching responses:', error);
      return null;
    }

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error in findResponseForQuestion:', error);
    return null;
  }
} 

// 사용자 프로필 정보 가져오기
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
}

// 포스트카드(프로젝트/커리어) 목록 가져오기
export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data;
}

// 가치관/지향점/성향 등
export async function getValues() {
  const { data, error } = await supabase
    .from('values')
    .select('*');
  if (error) {
    console.error('Error fetching values:', error);
    return [];
  }
  return data;
}

// FAQ
export async function getFaqs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*');
  if (error) {
    console.error('Error fetching faqs:', error);
    return [];
  }
  return data;
}

// 배경/스토리/경험 등
export async function getBackgrounds() {
  const { data, error } = await supabase
    .from('backgrounds')
    .select('*');
  if (error) {
    console.error('Error fetching backgrounds:', error);
    return [];
  }
  return data;
} 

// genericinfo 테이블에서 owner_id가 환경변수 OWNER_ID와 일치하는 데이터만 조회
export async function getGenericInfoByOwnerId() {
  const OWNER_ID = Number(process.env.OWNER_ID);
  console.log('getGenericInfoByOwnerId - OWNER_ID:', OWNER_ID);
  
  const { data, error } = await supabase
    .from('genericinfo')
    .select('*')
    .eq('owner_id', OWNER_ID);
    
  if (error) {
    console.error('Error fetching genericinfo:', error);
    return [];
  }
  
  console.log('genericinfo 조회 결과:', data);
  return data;
} 

// userdata 테이블에서 owner_id가 환경변수 OWNER_ID와 일치하는 데이터만 조회
export async function getUserDataByOwnerId() {
  const OWNER_ID = Number(process.env.OWNER_ID);
  const { data, error } = await supabase
    .from('userdata')
    .select('*')
    .eq('owner_id', OWNER_ID);
  if (error) {
    console.error('Error fetching userdata:', error);
    return [];
  }
  return data;
}

// projectcard 테이블에서 owner_id가 환경변수 OWNER_ID와 일치하는 데이터만 조회
export async function getProjectCardsByOwnerId() {
  const OWNER_ID = Number(process.env.OWNER_ID);
  console.log('getProjectCardsByOwnerId - OWNER_ID:', OWNER_ID);
  
  const { data, error } = await supabase
    .from('projectcard')
    .select('*')
    .eq('owner_id', OWNER_ID);
    
  if (error) {
    console.error('Error fetching projectcard:', error);
    return [];
  }
  
  console.log('projectcard 조회 결과:', data);
  return data;
}

// value 테이블에서 owner_id가 환경변수 OWNER_ID와 일치하는 데이터만 조회
export async function getValuesByOwnerId() {
  const OWNER_ID = Number(process.env.OWNER_ID);
  console.log('getValuesByOwnerId - OWNER_ID:', OWNER_ID);
  
  const { data, error } = await supabase
    .from('value')
    .select('*')
    .eq('owner_id', OWNER_ID);
    
  if (error) {
    console.error('Error fetching value:', error);
    return [];
  }
  
  console.log('value 조회 결과:', data);
  return data;
}

// user_profiles 테이블에서 owner_id가 환경변수 OWNER_ID와 일치하는 데이터만 조회
export async function getUserProfilesByOwnerId() {
  const OWNER_ID = Number(process.env.OWNER_ID);
  console.log('getUserProfilesByOwnerId - OWNER_ID:', OWNER_ID);
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('owner_id', OWNER_ID);
    
  if (error) {
    console.error('Error fetching user_profiles:', error);
    return [];
  }
  
  console.log('user_profiles 조회 결과:', data);
  return data;
} 