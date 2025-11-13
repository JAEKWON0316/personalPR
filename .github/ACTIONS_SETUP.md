# GitHub Actions & Vercel 자동 배포 설정 가이드

## 🔍 문제 진단

GitHub Actions가 실행되지 않는 경우 다음을 확인하세요:

### 1. GitHub Actions 활성화 확인
1. GitHub 레포지토리로 이동
2. **Settings** → **Actions** → **General** 이동
3. **Actions permissions** 섹션에서:
   - ✅ "Allow all actions and reusable workflows" 선택
   - 또는 "Allow local actions and reusable workflows" 선택
4. **Workflow permissions** 섹션에서:
   - ✅ "Read and write permissions" 선택
   - ✅ "Allow GitHub Actions to create and approve pull requests" 체크
5. **Save** 클릭

### 2. 워크플로우 파일 위치 확인
워크플로우 파일이 다음 위치에 있는지 확인:
```
.github/workflows/
  ├── ci.yml
  ├── cd.yml
  └── deploy-vercel.yml
```

### 3. 브랜치 확인
현재 브랜치가 `main`인지 확인:
```bash
git branch
```

## 🔐 GitHub Secrets 설정

### 필수 Secrets (Settings → Secrets and variables → Actions)

#### CI/CD용:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_OWNER_ID`
- `NEXT_PUBLIC_KAKAO_JavaScript_KEY`
- `NEXT_PUBLIC_KAKAO_CHANNEL_ID`

#### Vercel 배포용:
- `VERCEL_TOKEN` (Vercel 대시보드 → Settings → Tokens에서 생성)
- `VERCEL_ORG_ID` (선택사항)
- `VERCEL_PROJECT_ID` (선택사항)

### Vercel Token 생성 방법:
1. [Vercel Dashboard](https://vercel.com/account/tokens) 접속
2. **Create Token** 클릭
3. Token 이름 입력 (예: "GitHub Actions")
4. Scope: **Full Account** 선택
5. 생성된 Token을 복사하여 GitHub Secrets에 추가

## 🚀 Vercel 자동 배포 설정 (방법 1: Vercel 대시보드)

가장 간단한 방법:

1. [Vercel Dashboard](https://vercel.com) 접속
2. 프로젝트 선택 또는 새 프로젝트 생성
3. **Settings** → **Git** 이동
4. GitHub 레포지토리 연결
5. **Production Branch**: `main` 설정
6. 자동 배포 활성화

이 방법을 사용하면 GitHub Actions 없이도 자동 배포됩니다.

## 🔧 GitHub Actions로 Vercel 배포 (방법 2)

방법 1을 사용하지 않는 경우, `.github/workflows/deploy-vercel.yml` 워크플로우가 자동으로 배포합니다.

## ✅ 테스트 방법

1. 작은 변경사항 커밋:
```bash
git add .
git commit -m "test: GitHub Actions 테스트"
git push origin main
```

2. GitHub 레포지토리에서 확인:
   - **Actions** 탭 클릭
   - 워크플로우 실행 상태 확인

3. 문제가 있다면:
   - **Actions** 탭에서 실패한 워크플로우 클릭
   - 에러 로그 확인

## 📝 워크플로우 설명

### ci.yml
- Next.js 빌드 테스트
- ESLint 실행
- Pull Request 시 자동 실행

### cd.yml
- Docker 이미지 빌드
- GitHub Container Registry에 푸시
- Production 배포용

### deploy-vercel.yml
- Vercel에 자동 배포
- main 브랜치 push 시에만 실행

## 🐛 문제 해결

### Actions 탭이 보이지 않는 경우:
- 레포지토리 Settings → Actions에서 활성화 필요

### 워크플로우가 실행되지 않는 경우:
1. `.github/workflows/` 디렉토리 확인
2. 파일 확장자가 `.yml` 또는 `.yaml`인지 확인
3. YAML 문법 오류 확인
4. 브랜치 이름이 `main`인지 확인

### Secrets 오류:
- 모든 필수 Secrets가 설정되었는지 확인
- Secret 이름이 정확한지 확인 (대소문자 구분)

