declare namespace NodeJS {
    interface ProcessEnv {
      // Database
      DATABASE_URL: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      
      // Public Environment Variables
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      // Kakao 관련 환경 변수 삭제
      // NEXT_PUBLIC_KAKAO_JavaScript_KEY: string;
      // NEXT_PUBLIC_KAKAO_CHANNEL_ID: string;
      
      // API Keys (Server-side only)
      OPENAI_API_KEY: string;
      DEEPL_API_KEY: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
      
      // SMS/Message Services
      NAVER_CLOUD_ACCESS_KEY: string;
      NAVER_CLOUD_SECRET_KEY: string;
      NAVER_CLOUD_SERVICE_ID: string;
      SENDER_PHONE_NUMBER: string;
      SENDER_PROFILE_ID: string;
      
      // SOLAPI
      SOLAPI_API_KEY: string;
      SOLAPI_API_SECRET: string;
      
      // Development
      NODE_ENV: 'development' | 'production' | 'test';
      VERCEL_URL?: string;
    }
  }
  
  // Global type augmentations
  // Kakao 관련 Window 타입 선언 삭제
  
  export {}; 