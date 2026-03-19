# StoryForge 개발 로그

> 최종 업데이트: 2026-03-19

## 프로젝트 정보

| 항목 | 내용 |
|------|------|
| 저장소 | https://github.com/hk9340/StoryForge |
| 배포 URL | https://hk9340.github.io/StoryForge/ |
| 기술 스택 | React 19 + TypeScript 5.9 + Vite 8 |
| 배포 방식 | `npm run deploy` (gh-pages 브랜치) |
| 샘플 계정 | `demo@storyforge.com` / `demo1234` |

---

## 구현 완료 기능

### 기본 인프라
- [x] 랜딩 페이지, 로그인/회원가입 (샘플 인증)
- [x] 대시보드 (사이드바 + 작품 카드 캐러셀 + 최근 활동)
- [x] 내 작품 페이지 (그리드/리스트 뷰 전환 + 제목 검색)
- [x] 새 작품 생성 (장르 콤보박스)
- [x] 프로필 페이지
- [x] 다크모드 토글 (대시보드 사이드바 + 작품 설정 드롭다운)

### 작품 상세 (탭: 집필 → 챕터 → 캐릭터 → 관계도 → 타임라인 → 세계관 → 용어집)

**집필 탭**
- [x] 챕터 > 에피소드 계층 구조 (사이드바에서 챕터 접기/펼치기)
- [x] 에피소드 단위 제목/본문 편집, 챕터 라벨 표시
- [x] 에피소드 추가/삭제
- [x] 글자 수 카운트, 자동 저장 설정
- [x] 용어집 핀 고정 용어 하이라이트 + 클릭 시 설명 툴팁

**챕터 탭**
- [x] 챕터 목록 (역순), 에피소드 수 표시, 챕터명 검색
- [x] 새 챕터 추가 폼
- [x] 챕터 클릭 → 첫 에피소드로 집필 탭 이동

**캐릭터 탭**
- [x] 아코디언 레이아웃 (여러 캐릭터 동시 펼침/편집)
- [x] 이름 검색 필터
- [x] 이름, 역할, 나이, 성별, 외형, 성격, 설명, 배경, 태그
- [x] 신규 캐릭터 하단 추가 + 자동 펼침

**관계도 탭**
- [x] SVG 원형 배치 다이어그램
- [x] 양방향 관계: 평행 직선 2줄 + 화살표 방향 표시
- [x] 라벨: 양방향 시 from 쪽 1/3 지점에 분산 배치
- [x] 클릭 → 툴팁(관계 정보) → 수정 버튼 → 편집 팝업
- [x] 캐릭터 노드 클릭 → 상세 패널 (인물관계 탭 먼저)

**타임라인 탭 (프로토타입)**
- [x] 챕터 필터 바 + 세로 플로우차트
- [x] 사건 CRUD (제목, 설명, 시간라벨, 챕터, 등장인물)
- [x] 등장인물 선택: 카드+검색 방식 (+/- 버튼)
- [x] ▲/▼ 순서 변경
- [x] 편집 중 이동 시 dirty check → 실제 변경 있을 때만 미저장 confirm
- [x] 챕터별 관계도 스냅샷 생성 (글로벌/다른 챕터에서 복사 → 독립 편집)

**세계관 탭**
- [x] 폴더/하위폴더 구조, 노트 작성
- [x] 정렬 (이름순/생성일/수정일), 브레드크럼 네비게이션
- [x] 우측 상세 패널 노트 편집 (노트 전환 시 본문 정상 갱신)
- [x] 폴더 카드: 전체 노트 수 + 하위 폴더 수 분리 표시

**용어집 탭**
- [x] 용어 + 설명 입력폼, 목록
- [x] 핀(📌) on/off 토글
- [x] 집필 화면 연동 (핀 고정 용어 하이라이트)
- [x] 헤더: 좌 타이틀 / 우 핀 고정 카운트 / 힌트

### 공통 UX
- [x] 전체 목록 삭제 아이콘 (⊖, hover 시 표시)
- [x] 커스텀 확인/취소 모달 (window.confirm 대체)
- [x] 작품별 통계 바 (챕터, 에피소드, 캐릭터, 글자 수, 세계관 노트, 수정일)
- [x] 섹션 헤더 패턴 통일 (좌 타이틀 / 우 뱃지 / 힌트 문구)
- [x] 검색: 작품 제목, 챕터명, 캐릭터명, 타임라인 등장인물

---

## 데이터 모델 (sampleData.ts)

```
Work
├── chapters: Chapter[]
│   └── episodes: Episode[]     ← id, title, content, updatedAt, wordCount
├── characters: CharacterNote[]
│   └── relations: CharacterRelation[]
├── worldFolders: WorldFolder[]
├── worldNotes: WorldNote[]
├── timelineEvents: TimelineEvent[]     ← id, title, description, timeLabel?, chapterId, characterIds, order
└── chapterSnapshots: ChapterRelationSnapshot[]
    └── relations: ChapterCharRelation[]  ← sourceId, targetId, label, color, note
```

---

## 커밋 히스토리 (주요)

| 커밋 | 내용 |
|------|------|
| `e7339a2` | 초기 버전 - 랜딩, 대시보드, 에디터 |
| `349090a` | 세계관 폴더 노트, 프로필, 네비게이션 |
| `9448346` | 캐릭터 상세 + 관계도 다이어그램 |
| `e7792ce` | 캐릭터 관계 자유도 + 관계도 라인 편집 |
| `a19d440` | 챕터 추가, 새 작품 생성, 자동저장 |
| `8d5717e` | UI/UX 개선 (커버이미지, 모바일탭, 역순) |
| `26e99cb` | 삭제기능 + 캐릭터 아코디언 + 양방향 라인 |
| `fcb62c0` | 다크모드 토글 |
| `daaf15f` | 대시보드 통계 제거 → 작품별 통계 바 |
| `5caa2e6` | 용어집 탭 + 집필 화면 용어 하이라이트 |
| `29309d3` | 커스텀 확인/취소 모달 |
| `d714aea` | 양방향 관계선 평행 직선으로 겹침 해소 |
| `592f9a0` | 관계도 툴팁 → 수정 팝업 2단계 UX |
| `8e88c20` | 타임라인 탭 추가 (Phase 1+2) |
| `fc53db7` | 작품/챕터/캐릭터/타임라인 검색 기능 |
| `8dcf142` | 타임라인 등장인물 카드+검색 UI |
| `fd87d4f` | 챕터>에피소드 계층 구조 집필 개편 |
| `e943ace` | 타임라인 미저장 confirm dirty check 개선 |
| `4879e9e` | 세계관 폴더 카운트 + 타임라인 confirm 범위 확대 |
| `eab9a0f` | 작품 설정에 다크모드 토글 추가 |

---

## 파일 구조

```
src/
├── App.tsx                              # 라우팅 + Provider (Theme, Confirm, Auth)
├── index.css                            # CSS 변수 + 다크모드 오버라이드
├── contexts/
│   ├── AuthContext.tsx                   # 인증
│   ├── ThemeContext.tsx                  # 다크모드 상태
│   └── ConfirmContext.tsx + .css         # 커스텀 confirm 모달
├── pages/
│   ├── Dashboard.tsx/css                # 대시보드 (사이드바 + 다크모드 토글)
│   ├── MyWorks.tsx/css                  # 내 작품 (검색 + 그리드/리스트)
│   ├── WorkDetail.tsx/css               # 작품 상세 (7개 탭 + 설정 드롭다운)
│   ├── NewWork.tsx/css                  # 새 작품 생성
│   ├── Landing.tsx/css                  # 랜딩 페이지
│   ├── Login.tsx / Signup.tsx / Auth.css # 인증
│   └── Profile.tsx/css                  # 프로필
├── components/
│   ├── CharacterDetail.tsx/css          # 캐릭터 상세 오버레이 (defaultTab)
│   ├── RelationDiagram.tsx/css          # 관계도 SVG (툴팁+편집)
│   ├── TimelineTab.tsx/css              # 타임라인 메인 컨테이너
│   ├── TimelineFilterBar.tsx            # 챕터 필터
│   ├── TimelineFlowChart.tsx            # 플로우차트
│   ├── TimelineEventCard.tsx            # 이벤트 카드
│   ├── TimelineEventEditor.tsx          # 이벤트 편집 (dirty check)
│   ├── ChapterSnapshotViewer.tsx        # 챕터별 관계도 스냅샷
│   ├── Header.tsx/css                   # 랜딩 헤더
│   └── Footer.tsx/css                   # 랜딩 푸터
└── data/
    └── sampleData.ts                    # 타입 정의 + 샘플 데이터
```

---

## 향후 과제 / 미구현

- [ ] 데이터 영속화 (localStorage 또는 백엔드)
- [ ] 타임라인 드래그앤드롭 순서 변경
- [ ] 타임라인 모바일 반응형 개선
- [ ] 세계관 폴더/노트 실제 CRUD (현재 UI만)
- [ ] 이미지 업로드, 내보내기/가져오기
- [ ] 다중 사용자 인증
