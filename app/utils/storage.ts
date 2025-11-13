/**
 * 안전한 로컬스토리지 접근을 위한 유틸리티
 * SSR 환경에서도 안전하게 사용할 수 있습니다.
 */

// 1시간 = 60분 * 60초 * 1000밀리초
const ONE_HOUR_IN_MS = 60 * 60 * 1000;

interface StorageItemWithExpiry {
  value: string;
  expiry: number;
}

export const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('로컬스토리지 접근 오류:', error)
      return null
    }
  },
  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('로컬스토리지 저장 오류:', error)
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('로컬스토리지 삭제 오류:', error)
    }
  },
  
  /**
   * 만료 시간과 함께 데이터 저장 (1시간 후 자동 만료)
   */
  setWithExpiry: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      const now = new Date().getTime();
      const item: StorageItemWithExpiry = {
        value: value,
        expiry: now + ONE_HOUR_IN_MS
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('로컬스토리지 저장 오류:', error);
    }
  },
  
  /**
   * 만료 시간 체크와 함께 데이터 가져오기
   * 만료된 경우 자동으로 삭제하고 null 반환
   */
  getWithExpiry: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      const itemStr = localStorage.getItem(key);
      
      // 데이터가 없으면 null 반환
      if (!itemStr) {
        return null;
      }
      
      // 만료 정보가 포함된 데이터인지 확인
      try {
        const item: StorageItemWithExpiry = JSON.parse(itemStr);
        const now = new Date().getTime();
        
        // 만료 시간이 지났으면 삭제하고 null 반환
        if (now > item.expiry) {
          localStorage.removeItem(key);
          console.log(`${key} 데이터가 1시간 경과로 만료되어 삭제되었습니다.`);
          return null;
        }
        
        return item.value;
      } catch {
        // 기존 형식의 데이터인 경우 그대로 반환
        return itemStr;
      }
    } catch (error) {
      console.error('로컬스토리지 접근 오류:', error);
      return null;
    }
  }
} 