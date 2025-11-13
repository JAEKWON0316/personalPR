# Docker 이미지 활용 가이드

## 🎯 Docker 이미지의 주요 활용 방법

### 1. **로컬 개발 환경 테스트**
프로덕션과 동일한 환경에서 테스트할 수 있습니다.

```bash
# 로컬에서 프로덕션 빌드 테스트
docker run -p 3000:3000 ghcr.io/jaekwon0316/personalpr:main

# 다른 포트로 실행 (기존 개발 서버와 충돌 방지)
docker run -p 3001:3000 ghcr.io/jaekwon0316/personalpr:main
```

**이점:**
- ✅ 로컬 개발 환경과 프로덕션 환경의 차이 확인
- ✅ 빌드 오류 조기 발견
- ✅ 의존성 문제 사전 확인

---

### 2. **다른 서버/클라우드에 배포**

#### AWS EC2, Google Cloud, Azure 등에 배포:
```bash
# 서버에 SSH 접속 후
docker pull ghcr.io/jaekwon0316/personalpr:main
docker run -d -p 3000:3000 --name my-app ghcr.io/jaekwon0316/personalpr:main
```

#### Docker Compose로 배포:
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    image: ghcr.io/jaekwon0316/personalpr:main
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

```bash
docker-compose up -d
```

**이점:**
- ✅ Vercel 외 다른 환경에도 배포 가능
- ✅ 자체 서버에서 실행 가능
- ✅ 멀티 클라우드 전략 가능

---

### 3. **스테이징/프리뷰 환경 구축**

```bash
# 스테이징 환경
docker run -d -p 3001:3000 --name staging-app ghcr.io/jaekwon0316/personalpr:main

# 프로덕션 환경
docker run -d -p 3000:3000 --name prod-app ghcr.io/jaekwon0316/personalpr:main
```

**이점:**
- ✅ 프로덕션 배포 전 최종 테스트
- ✅ 클라이언트에게 프리뷰 제공
- ✅ A/B 테스트 환경 구축

---

### 4. **CI/CD 파이프라인에서 자동 테스트**

GitHub Actions에서 자동으로 이미지를 pull하고 테스트:

```yaml
# .github/workflows/test.yml
name: Test Docker Image
on:
  workflow_run:
    workflows: ["CD"]
    types:
      - completed

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Pull and test image
        run: |
          docker pull ghcr.io/jaekwon0316/personalpr:main
          docker run -d -p 3000:3000 --name test-app ghcr.io/jaekwon0316/personalpr:main
          sleep 10
          curl http://localhost:3000
```

**이점:**
- ✅ 자동화된 배포 전 테스트
- ✅ 이미지 정상 작동 확인
- ✅ 회귀 테스트 자동화

---

### 5. **로컬 개발 서버 대체**

개발 중에도 Docker 이미지를 사용:

```bash
# 개발 서버 대신 Docker 이미지 사용
docker run -d -p 3000:3000 \
  -v $(pwd)/.env.local:/app/.env.local \
  --name dev-app \
  ghcr.io/jaekwon0316/personalpr:main
```

**이점:**
- ✅ 일관된 개발 환경
- ✅ 팀원 간 환경 차이 제거
- ✅ "내 컴퓨터에서는 작동했는데" 문제 해결

---

### 6. **백업 및 롤백**

```bash
# 특정 버전의 이미지 태그 저장
docker tag ghcr.io/jaekwon0316/personalpr:main ghcr.io/jaekwon0316/personalpr:v1.0.0

# 문제 발생 시 이전 버전으로 롤백
docker stop current-app
docker run -d -p 3000:3000 --name rollback-app ghcr.io/jaekwon0316/personalpr:v1.0.0
```

**이점:**
- ✅ 빠른 롤백
- ✅ 버전 관리
- ✅ 안정적인 배포

---

### 7. **다중 인스턴스 실행 (로드 밸런싱)**

```bash
# 여러 인스턴스 실행
docker run -d -p 3000:3000 --name app1 ghcr.io/jaekwon0316/personalpr:main
docker run -d -p 3001:3000 --name app2 ghcr.io/jaekwon0316/personalpr:main
docker run -d -p 3002:3000 --name app3 ghcr.io/jaekwon0316/personalpr:main

# Nginx로 로드 밸런싱
```

**이점:**
- ✅ 트래픽 분산
- ✅ 고가용성
- ✅ 확장성

---

### 8. **다른 프로젝트에서 재사용**

다른 프로젝트에서 이 이미지를 기반으로 확장:

```dockerfile
# 다른 프로젝트의 Dockerfile
FROM ghcr.io/jaekwon0316/personalpr:main

# 추가 설정
COPY ./custom-config /app/custom-config
RUN npm install custom-package
```

**이점:**
- ✅ 코드 재사용
- ✅ 표준화된 베이스 이미지
- ✅ 빠른 프로토타이핑

---

## 🚀 실제 사용 시나리오

### 시나리오 1: Vercel + 자체 서버 이중 배포
```
Vercel (프론트엔드) → 자체 서버 (Docker 이미지)
```
- Vercel: 빠른 CDN 배포
- 자체 서버: 특정 기능이나 데이터 처리

### 시나리오 2: 개발/스테이징/프로덕션 환경 분리
```
개발: 로컬 Docker
스테이징: Docker 이미지 (테스트 서버)
프로덕션: Vercel + Docker 이미지 (백업)
```

### 시나리오 3: 클라이언트 프리뷰 제공
```
GitHub PR → Docker 이미지 빌드 → 프리뷰 URL 제공
```

---

## 📊 Docker vs Vercel 비교

| 항목 | Vercel | Docker 이미지 |
|------|--------|---------------|
| 배포 속도 | ⚡ 매우 빠름 | 🐢 상대적으로 느림 |
| 비용 | 💰 무료 플랜 제공 | 💰 서버 비용 필요 |
| 확장성 | ✅ 자동 스케일링 | ⚙️ 수동 설정 필요 |
| 제어권 | ❌ 제한적 | ✅ 완전한 제어 |
| 커스터마이징 | ❌ 제한적 | ✅ 자유롭게 가능 |
| 다른 환경 배포 | ❌ 불가능 | ✅ 어디서나 가능 |

---

## 💡 권장 사용 패턴

### 패턴 1: Vercel 주 + Docker 보조
- **주 배포**: Vercel (빠르고 간편)
- **보조 배포**: Docker 이미지 (특수 요구사항, 백업)

### 패턴 2: Docker 주 + Vercel 보조
- **주 배포**: 자체 서버 (Docker)
- **보조 배포**: Vercel (CDN, 글로벌 배포)

### 패턴 3: 하이브리드
- **정적 페이지**: Vercel
- **API 서버**: Docker 이미지
- **데이터베이스**: 별도 관리

---

## 🔧 실용적인 명령어 모음

### 이미지 관리
```bash
# 이미지 목록 확인
docker images | grep personalpr

# 이미지 삭제
docker rmi ghcr.io/jaekwon0316/personalpr:main

# 이미지 태그 변경
docker tag ghcr.io/jaekwon0316/personalpr:main my-registry/personalpr:v1.0
```

### 컨테이너 관리
```bash
# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인 (중지된 것 포함)
docker ps -a

# 컨테이너 중지
docker stop personalpr-app

# 컨테이너 시작
docker start personalpr-app

# 컨테이너 재시작
docker restart personalpr-app

# 컨테이너 삭제
docker rm personalpr-app

# 컨테이너 로그 확인
docker logs personalpr-app

# 실시간 로그 확인
docker logs -f personalpr-app
```

### 환경 변수 설정
```bash
# 환경 변수와 함께 실행
docker run -d -p 3000:3000 \
  -e OPENAI_API_KEY=your-key \
  -e DATABASE_URL=your-url \
  --name app \
  ghcr.io/jaekwon0316/personalpr:main

# .env 파일 사용
docker run -d -p 3000:3000 \
  --env-file .env.production \
  --name app \
  ghcr.io/jaekwon0316/personalpr:main
```

### 볼륨 마운트 (개발용)
```bash
# 로컬 파일을 컨테이너에 마운트
docker run -d -p 3000:3000 \
  -v $(pwd)/public:/app/public \
  --name app \
  ghcr.io/jaekwon0316/personalpr:main
```

---

## 🎓 학습 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Docker Compose 가이드](https://docs.docker.com/compose/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

