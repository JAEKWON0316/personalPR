# Docker 이미지 Pull 가이드

## 🔐 인증 필요

GitHub Container Registry는 인증이 필요합니다. 먼저 로그인해야 합니다.

---

## 방법 1: CMD (Windows 명령 프롬프트)에서 실행

### 1단계: GitHub Personal Access Token 생성
1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)** 클릭
3. Token 이름 입력 (예: "Docker Pull")
4. 권한 선택:
   - ✅ `read:packages` (이미지 다운로드용)
   - ✅ `write:packages` (이미지 업로드용, 선택사항)
5. **Generate token** 클릭
6. **토큰을 복사** (다시 볼 수 없으므로 저장해두세요!)

### 2단계: CMD에서 로그인
```cmd
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

**예시:**
```cmd
echo ghp_xxxxxxxxxxxxxxxxxxxx | docker login ghcr.io -u JAEKWON0316 --password-stdin
```

### 3단계: 이미지 Pull
```cmd
docker pull ghcr.io/jaekwon0316/personalpr:main
```

---

## 방법 2: Git Bash에서 실행

### 1단계: GitHub Personal Access Token 생성
(위와 동일)

### 2단계: Git Bash에서 로그인
```bash
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

**예시:**
```bash
echo ghp_xxxxxxxxxxxxxxxxxxxx | docker login ghcr.io -u JAEKWON0316 --password-stdin
```

### 3단계: 이미지 Pull
```bash
docker pull ghcr.io/jaekwon0316/personalpr:main
```

---

## 🔒 보안 팁

### 토큰을 파일에 저장 (선택사항)
토큰을 파일에 저장하고 사용할 수 있습니다:

**Git Bash:**
```bash
# 토큰을 파일에 저장 (한 번만)
echo "ghp_xxxxxxxxxxxxxxxxxxxx" > ~/.github_token

# 로그인 (재사용)
cat ~/.github_token | docker login ghcr.io -u JAEKWON0316 --password-stdin
```

**CMD:**
```cmd
# 토큰을 파일에 저장 (한 번만)
echo ghp_xxxxxxxxxxxxxxxxxxxx > %USERPROFILE%\.github_token

# 로그인 (재사용)
type %USERPROFILE%\.github_token | docker login ghcr.io -u JAEKWON0316 --password-stdin
```

⚠️ **주의**: 토큰 파일을 Git에 커밋하지 마세요!

---

## ✅ 확인 방법

### 이미지가 다운로드되었는지 확인:
```bash
docker images | grep personalpr
```

### 이미지 실행:
```bash
docker run -p 3000:3000 ghcr.io/jaekwon0316/personalpr:main
```

브라우저에서 `http://localhost:3000` 접속하여 확인

---

## 🐛 문제 해결

### "unauthorized" 오류:
- 토큰이 올바른지 확인
- `read:packages` 권한이 있는지 확인
- 사용자 이름이 올바른지 확인

### "repository not found" 오류:
- 이미지 이름이 올바른지 확인
- 레포지토리가 비공개인 경우 토큰에 접근 권한이 있는지 확인

### "connection refused" 오류:
- Docker Desktop이 실행 중인지 확인
- 인터넷 연결 확인

