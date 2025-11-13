# CI/CD 상태 확인 가이드

## 🔍 확인해야 할 항목들

### 1. GitHub Actions 워크플로우 확인

#### 방법 1: GitHub 웹사이트에서 확인
1. GitHub 레포지토리로 이동: `https://github.com/JAEKWON0316/personalPR`
2. 상단 메뉴에서 **Actions** 탭 클릭
3. 왼쪽 사이드바에서 워크플로우 선택:
   - **CI** - 빌드 테스트 및 린트
   - **CD** - Docker 이미지 빌드

#### 확인 포인트:
- ✅ **초록색 체크**: 성공
- ❌ **빨간색 X**: 실패 (클릭하여 에러 로그 확인)
- 🟡 **노란색 원**: 진행 중
- ⚪ **회색 원**: 대기 중

#### 실패한 경우:
1. 실패한 워크플로우 클릭
2. 실패한 Job 클릭 (예: "Build Next.js" 또는 "Build Docker Image")
3. 실패한 Step 클릭하여 에러 로그 확인

---

### 2. Docker 이미지 확인 (CD 워크플로우)

#### GitHub Container Registry에서 확인:
1. GitHub 레포지토리 → **Packages** 탭 클릭
2. 또는 직접 접속: `https://github.com/JAEKWON0316/personalPR/pkgs/container/personalpr`
3. 최신 버전의 이미지가 업로드되었는지 확인

#### 이미지 사용 방법:
```bash
# 이미지 pull
docker pull ghcr.io/jaekwon0316/personalpr:main

# 이미지 실행
docker run -p 3000:3000 ghcr.io/jaekwon0316/personalpr:main
```

---

### 3. Vercel 배포 확인

#### Vercel 대시보드에서 확인:
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Deployments** 탭에서 배포 상태 확인

#### 확인 포인트:
- ✅ **Ready**: 배포 완료
- 🔄 **Building**: 빌드 중
- ❌ **Error**: 배포 실패 (클릭하여 에러 확인)

#### 배포 URL 확인:
- Vercel 대시보드에서 프로젝트의 **Settings** → **Domains**에서 확인
- 또는 배포 목록에서 각 배포의 URL 확인

---

### 4. 실시간 모니터링

#### GitHub Actions 실시간 확인:
1. 레포지토리 → **Actions** 탭
2. 최신 워크플로우 실행 클릭
3. 실시간으로 로그 확인 가능

#### Vercel 실시간 확인:
1. Vercel 대시보드 → 프로젝트
2. **Deployments** 탭에서 실시간 빌드 로그 확인

---

## 📊 전체 워크플로우 흐름

```
GitHub Push
    ↓
┌─────────────────────────────────────┐
│  GitHub Actions (CI)                │
│  - 빌드 테스트                       │
│  - 린트 검사                         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  GitHub Actions (CD)                 │
│  - Docker 이미지 빌드                │
│  - GitHub Container Registry 푸시   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Vercel (자동 배포)                  │
│  - 자동 빌드 및 배포                 │
│  - Production 배포                  │
└─────────────────────────────────────┘
```

---

## 🚨 문제 해결

### CI 워크플로우 실패 시:
1. **Actions** 탭에서 실패한 워크플로우 클릭
2. 에러 로그 확인
3. 일반적인 원인:
   - 빌드 오류
   - 린트 오류
   - 환경 변수 누락

### CD 워크플로우 실패 시:
1. **Actions** 탭에서 실패한 워크플로우 클릭
2. 에러 로그 확인
3. 일반적인 원인:
   - Docker 빌드 오류
   - 환경 변수 누락
   - package-lock.json 동기화 문제

### Vercel 배포 실패 시:
1. Vercel 대시보드 → 프로젝트 → **Deployments**
2. 실패한 배포 클릭하여 에러 로그 확인
3. 일반적인 원인:
   - 빌드 오류
   - 환경 변수 누락
   - 의존성 문제

---

## ✅ 체크리스트

배포 후 확인할 항목:

- [ ] GitHub Actions CI 워크플로우 성공
- [ ] GitHub Actions CD 워크플로우 성공
- [ ] Docker 이미지가 GitHub Container Registry에 업로드됨
- [ ] Vercel 배포 성공
- [ ] Vercel 사이트가 정상 작동
- [ ] 모든 환경 변수가 올바르게 설정됨

---

## 🔗 빠른 링크

- **GitHub Actions**: `https://github.com/JAEKWON0316/personalPR/actions`
- **GitHub Packages**: `https://github.com/JAEKWON0316/personalPR/pkgs/container/personalpr`
- **Vercel Dashboard**: `https://vercel.com/dashboard`

