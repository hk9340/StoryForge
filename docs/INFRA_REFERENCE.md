# StoryForge - 소규모 웹 서비스 인프라 참조

> 작성일: 2026-03-24
> 용도: 토이 프로젝트 → 정식 서비스 전환 시 인프라 구성 참조

---

## 추천 구성 요약

| 영역 | 추천 서비스 | 무료 티어 | 비고 |
|------|------------|-----------|------|
| 프론트 호스팅 | **Vercel** | 월 100GB 대역폭 | git push 자동 배포, 프리뷰 URL |
| 백엔드 API | **Vercel Serverless Functions** | 프론트와 동일 계정 | 별도 서버 관리 불필요 |
| 데이터베이스 | **Neon (PostgreSQL)** | 0.5GB, 190h/월 | Serverless, 미사용 시 자동 중지 |
| ORM | **Prisma** | 오픈소스 | 타입 안전, 마이그레이션, 학습자료 풍부 |
| 인증 | **NextAuth.js (Auth.js)** | 오픈소스 | Google/카카오/이메일, JWT 자동 |
| 이미지 저장 | **Cloudinary** | 월 25GB 저장 + 25GB 전송 | URL 기반 리사이즈/변환 |
| 캐시/세션 | **Upstash (Redis)** | 일 10K 커맨드 | 후순위, 규모 커질 때 추가 |
| 도메인 | **Namecheap / 가비아** | 연 1~2만원 | Vercel 연결 간단 |
| 모니터링 | **Vercel Analytics + Sentry** | 기본 무료 | 성능/에러 추적 |

---

## 아키텍처

```
[사용자 브라우저]
    │
    ▼
[Vercel] ─── 프론트 (React SPA)
    │
    ▼
[Vercel Serverless Functions] ─── API (인증, CRUD)
    │         │
    ▼         ▼
[Neon DB]  [Cloudinary]
(PostgreSQL)  (이미지)
    │
    ▼ (후순위)
[Upstash Redis] ─── 세션/캐시/Rate Limiting
```

---

## 월 비용 예상

| 단계 | 사용자 규모 | 예상 비용 |
|------|------------|-----------|
| 초기 | ~100명 | **$0** (전부 무료 티어) |
| 성장 | ~1,000명 | $0~$20/월 (Neon Launch $19) |
| 본격 서비스 | 5,000+ | $50~$100/월 (Vercel Pro + Neon Scale) |

---

## 서비스별 상세

### Vercel (프론트 + 백엔드)
- React/Vite 프로젝트 그대로 배포 가능
- API Routes로 백엔드를 같은 레포에서 관리 (모노레포)
- PR마다 프리뷰 배포 자동 생성
- GitHub Pages → Vercel 이전 비용 최소

### Neon (PostgreSQL)
- URL 하나로 DB 연결, 서버 설치/관리 없음
- Serverless: 미사용 시 자동 중지 → 과금 없음
- 소설 데이터는 텍스트 위주라 0.5GB 무료 티어로 장기간 가능

### Prisma (ORM)
- `schema.prisma` 파일 하나에 테이블 구조 정의 → TypeScript 타입 자동 생성
- 마이그레이션 관리 내장
- Neon과 공식 연동 지원

### NextAuth.js (인증)
- 소셜 로그인(Google, 카카오) 설정 몇 줄로 연동
- JWT 기반 → Redis 없이 세션 관리 가능
- Prisma Adapter로 Neon DB에 유저 정보 직접 저장

### Cloudinary (이미지)
- 업로드 → URL 반환, DB에는 URL만 저장
- URL 파라미터로 리사이즈/포맷 변환 (서버 코드 불필요)

### Upstash (Redis) — 후순위
- 당장은 JWT로 세션 관리 충분
- 사용자 증가 후 세션, 캐시, Rate Limiting 용도로 도입
- 무료 티어: 일 10K 커맨드, 256MB

---

## 대안 비교

| 영역 | 추천 | 대안 | 대안 특징 |
|------|------|------|-----------|
| 호스팅 | Vercel | Netlify | 비슷한 수준, Vercel이 React 생태계에 더 최적화 |
| DB | Neon | Supabase | Supabase는 DB+인증+스토리지 올인원, 단 복잡도 높음 |
| DB | Neon | PlanetScale | MySQL 기반, 무료 티어 축소됨 |
| 인증 | NextAuth | Clerk | 호스티드 인증, 무료 10K MAU, 설정 더 쉬움 |
| 이미지 | Cloudinary | Uploadthing | 더 단순, Next.js 친화적 |
| 백엔드 | Vercel Functions | Railway / Fly.io | 상시 서버 필요 시 (WebSocket 등) |

---

## 고려사항

- 현재 Vite + React 구조에서 Vercel Serverless를 쓰려면:
  - **방법 1**: Next.js로 마이그레이션 (API Routes 내장)
  - **방법 2**: 프론트(Vercel) + 백엔드(Railway/Fly.io) 분리 배포
- 동료 조언: Neon + Upstash로 시작 → 규모 커지면 비싼 인스턴스로 전환
