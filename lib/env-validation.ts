/**
 * 환경변수 검증 및 보안 유틸리티
 */

interface EnvConfig {
    // 필수 환경변수
    required: string[];
    // 선택적 환경변수 (기본값 포함)
    optional: Record<string, string>;
    // 클라이언트에서 사용 가능한 환경변수
    clientSafe: string[];
  }
  
  const envConfig: EnvConfig = {
    required: [
      'OPENAI_API_KEY',
      'NEXT_PUBLIC_BASE_URL',
    ],
    optional: {
      'NODE_ENV': 'development',
      'VERCEL_URL': '',
    },
    clientSafe: [
      'NEXT_PUBLIC_BASE_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'NEXT_PUBLIC_KAKAO_JavaScript_KEY',
      'NEXT_PUBLIC_KAKAO_CHANNEL_ID',
    ]
  };
  
  /**
   * 필수 환경변수가 모두 설정되어 있는지 확인
   */
  export function validateRequiredEnvVars(): void {
    const missing: string[] = [];
    
    envConfig.required.forEach(key => {
      if (!process.env[key]) {
        missing.push(key);
      }
    });
  
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file and ensure all required variables are set.'
      );
    }
  }
  
  /**
   * 환경변수 값을 안전하게 가져오기
   */
  export function getEnvVar(key: string, fallback?: string): string {
    const value = process.env[key];
    
    if (!value && !fallback) {
      throw new Error(`Environment variable ${key} is not set and no fallback provided`);
    }
    
    return value || fallback || '';
  }
  
  /**
   * 클라이언트에서 안전하게 사용할 수 있는 환경변수인지 확인
   */
  export function isClientSafeEnvVar(key: string): boolean {
    return envConfig.clientSafe.includes(key) || key.startsWith('NEXT_PUBLIC_');
  }
  
  /**
   * 개발 환경인지 확인
   */
  export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }
  
  /**
   * 프로덕션 환경인지 확인
   */
  export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
  
  /**
   * API 키 마스킹 (로깅용)
   */
  export function maskApiKey(key: string): string {
    if (!key || key.length < 8) return '***';
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4);
  }
  
  /**
   * 환경변수 로깅 (민감한 정보 제외)
   */
  export function logEnvStatus(): void {
    if (!isDevelopment()) return;
  
    console.log('🔧 Environment Variables Status:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL}`);
    
    // API 키들은 마스킹해서 표시
    const apiKeys = [
      'OPENAI_API_KEY',
      'DEEPL_API_KEY',
      'NAVER_CLOUD_ACCESS_KEY',
      'SOLAPI_API_KEY'
    ];
  
    apiKeys.forEach(key => {
      const value = process.env[key];
      if (value) {
        console.log(`   ${key}: ${maskApiKey(value)}`);
      } else {
        console.log(`   ${key}: ❌ Not set`);
      }
    });
  }
  
  // 앱 시작 시 환경변수 검증 (서버사이드에서만)
  if (typeof window === 'undefined') {
    try {
      validateRequiredEnvVars();
      logEnvStatus();
    } catch (error) {
      console.error('❌ Environment validation failed:', error);
      if (isProduction()) {
        process.exit(1);
      }
    }
  } 