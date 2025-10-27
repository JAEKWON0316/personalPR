/**
 * 프로덕션 안전 로깅 유틸리티
 * 개발 환경에서만 로그를 출력하고, 프로덕션에서는 중요한 에러만 기록
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  /**
   * 디버그 로그 (개발 환경에서만 출력)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      console.log(`🐛 [DEBUG] ${message}`, context || '');
    }
  }

  /**
   * 정보 로그
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      console.info(`ℹ️ [INFO] ${message}`, context || '');
    }
    this.logToStorage('info', message, context);
  }

  /**
   * 경고 로그
   */
  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`⚠️ [WARN] ${message}`, context || '');
    this.logToStorage('warn', message, context);
  }

  /**
   * 에러 로그 (항상 출력)
   */
  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    console.error(`❌ [ERROR] ${message}`, errorObj, context || '');
    
    this.logToStorage('error', message, context, errorObj);
    
    // 프로덕션에서는 외부 에러 리포팅 서비스로 전송 가능
    if (!this.isDevelopment) {
      this.reportToCrashlytics(message, errorObj, context);
    }
  }

  /**
   * 성능 측정 시작
   */
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(`⏱️ ${label}`);
    }
  }

  /**
   * 성능 측정 종료
   */
  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(`⏱️ ${label}`);
    }
  }

  /**
   * 객체를 테이블 형태로 출력 (개발 환경에서만)
   */
  table(data: Record<string, unknown> | Array<unknown>): void {
    if (this.isDevelopment) {
      console.table(data);
    }
  }

  /**
   * 그룹 로그 시작
   */
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(`📂 ${label}`);
    }
  }

  /**
   * 그룹 로그 종료
   */
  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * API 요청/응답 로깅
   */
  api(method: string, url: string, status: number, duration?: number): void {
    const statusIcon = status >= 400 ? '🔴' : status >= 300 ? '🟡' : '🟢';
    const message = `${statusIcon} ${method.toUpperCase()} ${url} - ${status}${duration ? ` (${duration}ms)` : ''}`;
    
    if (status >= 400) {
      this.warn(message);
    } else if (this.isDevelopment) {
      this.debug(message);
    }
  }

  /**
   * 사용자 액션 로깅
   */
  userAction(action: string, context?: Record<string, unknown>): void {
    this.debug(`👤 User Action: ${action}`, context);
  }

  /**
   * 로컬 스토리지에 로그 저장 (클라이언트에서만)
   */
  private logToStorage(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.isClient) return;

    try {
      const logs = this.getStoredLogs();
      const newLog: LogEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        context,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } as Error : undefined,
      };

      logs.push(newLog);

      // 최대 100개 로그만 유지
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (e) {
      // localStorage 접근 실패 시 무시
    }
  }

  /**
   * 저장된 로그 가져오기
   */
  private getStoredLogs(): LogEntry[] {
    if (!this.isClient) return [];

    try {
      const stored = localStorage.getItem('app_logs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * 저장된 로그 내보내기 (디버깅용)
   */
  exportLogs(): LogEntry[] {
    return this.getStoredLogs();
  }

  /**
   * 로그 초기화
   */
  clearLogs(): void {
    if (this.isClient) {
      localStorage.removeItem('app_logs');
    }
  }

  /**
   * 외부 크래시 리포팅 서비스로 전송 (구현 예시)
   */
  private reportToCrashlytics(message: string, error: Error, context?: Record<string, unknown>): void {
    // 실제 구현에서는 Sentry, Bugsnag, Firebase Crashlytics 등을 사용
    if (this.isDevelopment) {
      console.warn('📡 Would report to crashlytics:', { message, error, context });
    }
    
    // 예시: fetch를 통한 에러 리포팅
    // fetch('/api/error-reporting', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message, error: error.message, stack: error.stack, context })
    // }).catch(() => {/* 무시 */});
  }
}

// 싱글톤 인스턴스 생성
export const logger = new Logger();

// 컨텍스트별 로거 생성 함수
export function createLogger(context: string) {
  return {
    debug: (message: string, data?: Record<string, unknown>) => 
      logger.debug(`[${context}] ${message}`, data),
    info: (message: string, data?: Record<string, unknown>) => 
      logger.info(`[${context}] ${message}`, data),
    warn: (message: string, data?: Record<string, unknown>) => 
      logger.warn(`[${context}] ${message}`, data),
    error: (message: string, error?: Error | unknown, data?: Record<string, unknown>) => 
      logger.error(`[${context}] ${message}`, error, data),
    time: (label: string) => logger.time(`[${context}] ${label}`),
    timeEnd: (label: string) => logger.timeEnd(`[${context}] ${label}`),
    userAction: (action: string, data?: Record<string, unknown>) => 
      logger.userAction(`[${context}] ${action}`, data),
  };
}

// 개발 환경에서만 동작하는 디버그 함수들
export const dev = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  table: (data: Record<string, unknown> | Array<unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.table(data);
    }
  },
  group: (label: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(label);
    }
  },
  groupEnd: () => {
    if (process.env.NODE_ENV === 'development') {
      console.groupEnd();
    }
  },
};

export default logger; 