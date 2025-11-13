# 자동 배포 가이드

## 🎯 현재 설정된 자동화

### 1. GitHub Actions에서 자동 테스트
CD 워크플로우에서 이미지를 빌드하고 푸시한 후, 자동으로:
- ✅ 이미지를 pull
- ✅ 컨테이너 실행
- ✅ 상태 확인
- ✅ 로그 확인
- ✅ 테스트 후 정리

**위치는**: `.github/workflows/cd.yml`의 "Pull and test Docker image" 스텝

---

## 🚀 추가 자동화 옵션

### 옵션 1: 원격 서버에 자동 배포

원격 서버(예: AWS EC2, 자체 서버)에 자동으로 배포하려면:

#### 1단계: SSH 키 생성 및 설정
```bash
# 로컬에서 SSH 키 생성
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy

# 공개키를 서버에 추가
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-server.com
```

#### 2단계: GitHub Secrets 설정
GitHub 레포지토리 → Settings → Secrets and variables → Actions에서 추가:
- `SSH_PRIVATE_KEY`: 개인키 내용 (전체 내용 복사)
- `SSH_USER`: 서버 사용자명 (예: `ubuntu`, `root`)
- `SSH_HOST`: 서버 IP 또는 도메인

#### 3단계: 자동 배포 워크플로우 활성화
`.github/workflows/cd-auto-deploy.yml.example` 파일을 참고하여 새 워크플로우 생성

---

### 옵션 2: Docker Compose로 자동 배포

#### docker-compose.yml 생성
```yaml
version: '3.8'
services:
  app:
    image: ghcr.io/jaekwon0316/personalpr:main
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    pull_policy: always  # 항상 최신 이미지 pull
```

#### 자동 배포 스크립트
```bash
#!/bin/bash
# deploy.sh

# GitHub Container Registry 로그인
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 최신 이미지 pull
docker-compose pull

# 컨테이너 재시작
docker-compose up -d

# 상태 확인
docker-compose ps
```

---

### 옵션 3: GitHub Actions에서 직접 배포

현재 `cd.yml`에 이미 자동 테스트가 포함되어 있습니다. 
원격 서버 배포를 추가하려면:

```yaml
# .github/workflows/cd.yml에 추가
- name: Deploy to remote server
  if: github.event_name != 'pull_request'
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      docker pull ghcr.io/jaekwon0316/personalpr:main
      docker stop personalpr-app || true
      docker rm personalpr-app || true
      docker run -d -p 3000:3000 --name personalpr-app \
        --restart unless-stopped \
        ghcr.io/jaekwon0316/personalpr:main
```

---

## 📊 현재 워크플로우 흐름

```
GitHub Push
    ↓
┌─────────────────────────────────────┐
│  GitHub Actions (CD)                │
│  1. Docker 이미지 빌드               │
│  2. GitHub Container Registry 푸시 │
│  3. 자동으로 이미지 pull            │
│  4. 컨테이너 실행 및 테스트          │
│  5. 상태 확인 및 정리                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Vercel (자동 배포)                  │
│  - 자동 빌드 및 배포                 │
└─────────────────────────────────────┘
```

---

## ✅ 확인 방법

### GitHub Actions에서 확인:
1. 레포지토리 → **Actions** 탭
2. **CD** 워크플로우 클릭
3. 최신 실행 클릭
4. "Pull and test Docker image" 스텝 확인

### 로그에서 확인할 수 있는 정보:
- ✅ 이미지 pull 성공
- ✅ 컨테이너 실행 상태
- ✅ 컨테이너 로그
- ✅ 테스트 결과

---

## 🔧 커스터마이징

### 테스트 시간 조정
```yaml
sleep 15  # 15초 대기 (필요에 따라 조정)
```

### HTTP 테스트 추가
```yaml
curl -f http://localhost:3000 || echo "HTTP test failed"
```

### 여러 포트로 테스트
```yaml
docker run -d -p 3000:3000 --name test-container1 ...
docker run -d -p 3001:3000 --name test-container2 ...
```

---

## 🎓 다음 단계

1. **현재**: GitHub Actions에서 자동 테스트 ✅
2. **추가 가능**: 원격 서버 자동 배포
3. **추가 가능**: Docker Compose 자동 배포
4. **추가 가능**: Kubernetes 자동 배포

원하는 자동화 옵션을 알려주시면 설정을 도와드리겠습니다!

