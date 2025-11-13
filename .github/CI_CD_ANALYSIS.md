# CI/CD 워크플로우 분석 및 이점

## 현재 워크플로우

### 1. `ci.yml` - CI (Continuous Integration)
- **기능**: 빌드 테스트 + 린트 검사
- **실행 시점**: Push 및 Pull Request 시

### 2. `cd.yml` - CD (Continuous Deployment)
- **기능**: Docker 이미지 빌드 및 GitHub Container Registry에 푸시
- **실행 시점**: Push 및 Pull Request 시

## Vercel 자동 배포와의 비교

### Vercel 자동 배포만 사용하는 경우:
```
GitHub Push → Vercel 감지 → Vercel 빌드 → Vercel 배포
```
- ✅ 간단하고 빠름
- ✅ Vercel이 빌드 실패를 알려줌
- ❌ Vercel 배포 전에 문제를 미리 발견할 수 없음
- ❌ Pull Request에서 빌드 테스트 불가 (Vercel Preview는 생성되지만)

### CI/CD 워크플로우를 추가하는 경우:

#### `ci.yml`의 이점:
1. **빌드 실패 조기 발견**
   - Vercel 배포 전에 GitHub Actions에서 빌드 실패를 먼저 확인
   - Pull Request 단계에서 빌드 실패를 미리 발견 가능
   - Vercel 빌드 시간을 절약 (실패할 코드는 배포하지 않음)

2. **코드 품질 검사**
   - ESLint로 코드 스타일 및 오류 검사
   - Pull Request에서 코드 품질 문제를 미리 확인

3. **비용 절감**
   - Vercel 빌드 시간이 줄어듦 (실패할 코드는 배포하지 않으므로)
   - Vercel 빌드 할당량 절약

#### `cd.yml`의 이점:
1. **다중 환경 배포**
   - Vercel 외 다른 환경(자체 서버, 다른 클라우드 등) 배포 가능
   - Docker 이미지를 GitHub Container Registry에 저장하여 어디서든 사용 가능

2. **백업 배포 옵션**
   - Vercel에 문제가 있을 때 대체 배포 경로 제공

## 결론 및 권장사항

### 시나리오 1: Vercel만 사용하는 경우
**권장**: `ci.yml`만 유지, `cd.yml`은 제거
- 이유:
  - `ci.yml`: 빌드 실패를 미리 발견하여 Vercel 빌드 시간 절약
  - `cd.yml`: Docker 이미지가 필요 없으므로 불필요

### 시나리오 2: Vercel + 다른 환경도 배포하는 경우
**권장**: 둘 다 유지
- `ci.yml`: 코드 품질 검사
- `cd.yml`: Docker 이미지로 다른 환경 배포

### 시나리오 3: 완전히 간단하게 하고 싶은 경우
**권장**: 둘 다 제거
- Vercel 자동 배포만으로 충분
- Vercel이 빌드 실패를 알려주므로 CI는 선택사항

## 비용 고려사항

- **GitHub Actions**: 무료 플랜은 월 2,000분 제공 (개인 프로젝트에는 충분)
- **Vercel**: 무료 플랜 제공
- **GitHub Container Registry**: 무료 (공개 이미지) 또는 제한적 무료 (비공개 이미지)

## 최종 권장사항

**개인 프로젝트이고 Vercel만 사용한다면:**
- `ci.yml` 유지 (빌드 실패 조기 발견)
- `cd.yml` 제거 (Docker 이미지 불필요)

**또는 완전히 간단하게:**
- 둘 다 제거하고 Vercel 자동 배포만 사용

