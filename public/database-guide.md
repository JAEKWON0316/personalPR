# 데이터베이스 사용 설명서

이 문서는 주요 테이블 구조와 각 테이블에 어떤 정보를 넣어야 하는지 예시와 함께 설명합니다.

---

## 1. User (유저 프로필)
- **설명:** 홈페이지 주인의 기본 정보(이름, 생년월일, 직업, 소속 등)를 저장합니다.
- **주요 컬럼:**
  - name: 이름 (예: 홍길동)
  - occupation: 직업 (예: 개발자)
  - birthdate: 생년월일 (예: 1990-01-01)
  - affiliation: 소속 (예: OO회사)
  - education: 학력 (JSON, 예: [{학교: '서울대', 전공: '컴퓨터공학'}])
  - field: 분야 (예: IT)
  - mbti: MBTI (예: INFP)
  - greetingScript: 인사말 대본
  - phone, email, organization, instagram, facebook, naver 등

**예시:**
```json
{
  "name": "홍길동",
  "occupation": "프론트엔드 개발자",
  "birthdate": "1990-01-01",
  "affiliation": "OO테크",
  "education": [{"학교": "서울대", "전공": "컴퓨터공학"}],
  "field": "IT",
  "mbti": "INFP",
  "greetingScript": "안녕하세요! 홍길동입니다.",
  "phone": "010-1234-5678",
  "email": "hong@example.com"
}
```

---

## 2. UserData (유저 추가 정보)
- **설명:** 가치관, 취미, 목표 등 챗봇에서 활용할 수 있는 추가 정보를 저장합니다.
- **주요 컬럼:**
  - age: 나이 (예: 34)
  - values: 가치관 (JSON, 예: ["성실함", "도전정신"])
  - hobbies: 취미 (JSON, 예: ["등산", "코딩"])
  - personality: 성격 (예: 외향적)
  - goals: 목표 (예: "AI 전문가 되기")
  - vision: 비전 (예: "기술로 세상에 기여")
  - position: 직책 (예: 팀장)
  - organizationInfo: 소속기관 정보 (긴 설명)

**예시:**
```json
{
  "age": 34,
  "values": ["성실함", "도전정신"],
  "hobbies": ["등산", "코딩"],
  "personality": "외향적",
  "goals": "AI 전문가 되기",
  "vision": "기술로 세상에 기여",
  "position": "팀장",
  "organizationInfo": "OO테크는 혁신을 추구하는 IT기업입니다."
}
```

---

## 3. ProjectCard (프로젝트/커리어 카드)
- **설명:** 홈페이지 주인이 수행한 프로젝트/커리어 정보를 카드 형태로 저장합니다.
- **주요 컬럼:**
  - postId: 카드 순서 식별자 (예: 1)
  - title: 프로젝트 제목 (예: "AI 챗봇 개발")
  - description: 상세 설명 (예: "2023년 OO기업과 협업하여 AI 챗봇을 개발")
  - hashtags: 해시태그 (JSON, 예: ["AI", "챗봇"])

**예시:**
```json
{
  "postId": 1,
  "title": "AI 챗봇 개발",
  "description": "2023년 OO기업과 협업하여 AI 챗봇을 개발하였습니다.",
  "hashtags": ["AI", "챗봇"]
}
```

---

## 6. Value (가치관/지향점)
- **설명:** 홈페이지 주인의 가치관, 신념, 지향점 등을 저장합니다.
- **주요 컬럼:**
  - title: 제목 (예: "도전정신")
  - content: 내용 (예: "새로운 기술에 도전하는 것을 두려워하지 않습니다.")

**예시:**
```json
{
  "title": "도전정신",
  "content": "새로운 기술에 도전하는 것을 두려워하지 않습니다."
}
```

---


---

> 각 테이블의 컬럼명과 예시를 참고하여 데이터를 입력하시면 됩니다. 추가로 궁금한 점이 있으면 언제든 문의해 주세요. 