// 샘플 계정
export const SAMPLE_USER = {
  email: 'demo@storyforge.com',
  password: 'demo1234',
  name: '김작가',
  bio: '판타지 소설을 쓰는 아마추어 작가입니다.',
  joinDate: '2026-03-19',
}

// 샘플 작품 데이터
export interface Episode {
  id: string
  title: string
  content: string
  updatedAt: string
  wordCount: number
}

export interface Chapter {
  id: string
  title: string
  episodes: Episode[]
}

export interface CharacterRelation {
  targetId: string
  label: string
  color: string
  note?: string
}

export interface CharacterNote {
  id: string
  name: string
  role: string
  description: string
  tags: string[]
  age?: string
  gender?: string
  appearance?: string
  personality?: string
  backstory?: string
  relations: CharacterRelation[]
}

export interface WorldNote {
  id: string
  title: string
  content: string
  folderId: string
  createdAt: string
  updatedAt: string
}

export interface WorldFolder {
  id: string
  name: string
  color: string
  parentId: string | null
  createdAt: string
}

export interface TimelineEvent {
  id: string
  title: string
  description: string
  timeLabel?: string
  chapterId: string
  characterIds: string[]
  order: number
}

export interface ChapterCharRelation {
  sourceId: string
  targetId: string
  label: string
  color: string
  note?: string
}

export interface ChapterRelationSnapshot {
  chapterId: string
  relations: ChapterCharRelation[]
}

export interface Work {
  id: string
  title: string
  genre: string
  description: string
  coverColor: string
  coverImage?: string
  chapters: Chapter[]
  characters: CharacterNote[]
  worldFolders: WorldFolder[]
  worldNotes: WorldNote[]
  timelineEvents: TimelineEvent[]
  chapterSnapshots: ChapterRelationSnapshot[]
  createdAt: string
  updatedAt: string
  totalWords: number
  status: '집필 중' | '완결' | '휴재'
}

export const SAMPLE_WORKS: Work[] = [
  {
    id: 'work-1',
    title: '별이 잠든 숲',
    genre: '판타지',
    description: '잊혀진 숲 속에 잠든 별의 기억을 찾아 떠나는 소녀의 모험 이야기',
    coverColor: '#6C63FF',
    chapters: [
      {
        id: 'ch-1',
        title: '프롤로그',
        episodes: [
          {
            id: 'ep-1-1',
            title: '잊혀진 기억',
            content: `어둠 속에서 한 줄기 빛이 스며들었다. 그것은 오래 잊혀진 기억의 조각이었다.

소녀는 천천히 눈을 떴다. 창밖으로 보이는 세상은 어제와 달랐다. 하늘에는 별이 없었고, 숲은 고요했다.

"별이... 사라졌어."

마을 사람들은 아무도 신경 쓰지 않았다. 하늘에 별이 있었다는 사실조차 기억하지 못하는 것 같았다. 하지만 소녀, 유나는 분명히 기억하고 있었다. 밤하늘을 수놓던 수천 개의 빛들을.`,
            updatedAt: '2026-03-19',
            wordCount: 150,
          },
          {
            id: 'ep-1-2',
            title: '할머니의 이야기',
            content: `할머니가 들려주시던 이야기가 떠올랐다.

"이 숲 깊은 곳에는 별들이 잠드는 곳이 있단다. 별이 지치면 그곳에서 쉬다 가지."

유나는 결심했다. 별을 찾으러 숲으로 가겠다고.`,
            updatedAt: '2026-03-19',
            wordCount: 97,
          },
        ],
      },
      {
        id: 'ch-2',
        title: '제1장 - 숲의 입구',
        episodes: [
          {
            id: 'ep-2-1',
            title: '안개 너머',
            content: `마을 끝자락에 있는 숲의 입구는 안개에 싸여 있었다. 오래된 나무 표지판에는 "돌아올 수 없는 길"이라는 글자가 희미하게 새겨져 있었다.

유나는 작은 배낭을 메고 첫 발을 내디뎠다. 안개를 헤치고 들어서자, 놀라운 광경이 펼쳐졌다. 나뭇잎 하나하나가 은은한 빛을 발하고 있었다.

"이건... 별빛?"`,
            updatedAt: '2026-03-19',
            wordCount: 120,
          },
          {
            id: 'ep-2-2',
            title: '빛나는 존재',
            content: `바로 그때, 나뭇가지 사이에서 작은 생물이 나타났다. 손바닥만 한 크기에 반투명한 날개를 가진, 빛나는 작은 존재.

"드디어 왔구나. 오래 기다렸어."`,
            updatedAt: '2026-03-19',
            wordCount: 78,
          },
        ],
      },
      {
        id: 'ch-3',
        title: '제2장 - 빛의 안내자',
        episodes: [
          {
            id: 'ep-3-1',
            title: '에피소드 1',
            content: '',
            updatedAt: '2026-03-19',
            wordCount: 0,
          },
        ],
      },
    ],
    characters: [
      {
        id: 'char-1',
        name: '유나',
        role: '주인공',
        description: '16세 소녀. 별이 사라진 것을 유일하게 기억하는 인물. 호기심이 많고 용감하다.',
        tags: ['주인공', '인간', '소녀'],
        age: '16세',
        gender: '여성',
        appearance: '검은 단발머리, 큰 눈, 항상 별 모양 목걸이를 하고 있다.',
        personality: '호기심이 많고 용감하다. 다른 사람을 돕는 것을 좋아하지만, 때로는 무모할 정도로 앞으로 나선다.',
        backstory: '할머니에게서 별의 이야기를 들으며 자랐다. 부모님은 마을 밖으로 나간 뒤 소식이 끊겼다.',
        relations: [
          { targetId: 'char-2', label: '동행자 / 안내자', color: '#00B894', note: '숲에서 처음 만남. 루미가 유나를 별이 잠든 곳으로 안내한다.' },
          { targetId: 'char-3', label: '적대 관계', color: '#FF6584', note: '그림자 왕은 유나의 여정을 방해한다. 하지만 과거 인연이 있을 수도.' },
        ],
      },
      {
        id: 'char-2',
        name: '루미',
        role: '조력자',
        description: '숲에 사는 빛의 정령. 손바닥만 한 크기에 반투명한 날개를 가졌다. 유나를 별이 잠든 곳으로 안내한다.',
        tags: ['정령', '조력자', '빛'],
        age: '약 300년',
        gender: '무성',
        appearance: '손바닥만 한 크기. 반투명한 날개, 옅은 금빛 몸체.',
        personality: '낙천적이고 수다스럽다. 하지만 숲의 위기에 대해서는 심각하게 생각한다.',
        backstory: '별의 숲에서 태어난 빛의 정령. 별이 사라진 후 유일하게 깨어있는 정령이다.',
        relations: [
          { targetId: 'char-1', label: '보호 대상 / 동행자', color: '#00B894', note: '유나를 별의 숲으로 안내하는 역할. 유나를 지키고 싶어한다.' },
          { targetId: 'char-3', label: '과거 수호자의 잔영', color: '#FF6584', note: '그림자 왕의 본래 모습을 기억하고 있는 유일한 존재.' },
        ],
      },
      {
        id: 'char-3',
        name: '그림자 왕',
        role: '적대자',
        description: '별빛을 삼키고 어둠을 퍼뜨리는 존재. 과거에는 별의 수호자였으나 타락했다.',
        tags: ['적대자', '보스', '어둠'],
        age: '불명 (수천 년 추정)',
        gender: '남성 (과거)',
        appearance: '거대한 그림자 형태. 가끔 과거 수호자였던 모습이 비치기도 한다.',
        personality: '냉혹하고 무감정하지만, 과거의 기억이 남아 가끔 동요한다.',
        backstory: '원래는 별의 숲을 지키는 수호자 "아스텔"이었으나, 기억의 무게를 감당하지 못해 어둠에 빠졌다.',
        relations: [
          { targetId: 'char-1', label: '적대 / 과거 인연', color: '#FF6584', note: '유나의 할머니와 관련이 있을 수 있다는 암시.' },
          { targetId: 'char-2', label: '과거 주종 관계', color: '#B2BEC3', note: '수호자 시절 루미를 만들어낸 존재. 지금은 기억하지 못한다.' },
        ],
      },
    ],
    worldFolders: [
      { id: 'wf-1', name: '장소', color: '#6C63FF', parentId: null, createdAt: '2026-03-15' },
      { id: 'wf-2', name: '마법 체계', color: '#FF6584', parentId: null, createdAt: '2026-03-16' },
      { id: 'wf-3', name: '역사/전설', color: '#00B894', parentId: null, createdAt: '2026-03-17' },
      { id: 'wf-4', name: '별의 숲 세부', color: '#A29BFE', parentId: 'wf-1', createdAt: '2026-03-18' },
    ],
    worldNotes: [
      {
        id: 'wn-1', title: '별의 숲', folderId: 'wf-1',
        content: '별들이 지칠 때 쉬어가는 신비로운 장소. 일반인은 입구를 찾을 수 없다. 숲 입구에는 안개가 항상 끼어있으며, 나뭇잎이 은은한 빛을 발한다.',
        createdAt: '2026-03-15', updatedAt: '2026-03-19',
      },
      {
        id: 'wn-2', title: '유나의 마을', folderId: 'wf-1',
        content: '숲 근처의 작은 마을. 주민 약 200명. 별이 사라진 후에도 평범하게 생활하고 있다. 마을 사람들은 별의 존재를 잊은 듯하다.',
        createdAt: '2026-03-15', updatedAt: '2026-03-17',
      },
      {
        id: 'wn-3', title: '별빛 기억', folderId: 'wf-2',
        content: '별이 가진 기억의 힘. 세상의 중요한 기억들을 보존하는 역할을 한다. 별빛이 사라지면 관련된 기억도 함께 희미해진다.',
        createdAt: '2026-03-16', updatedAt: '2026-03-18',
      },
      {
        id: 'wn-4', title: '그림자 영역', folderId: 'wf-2',
        content: '별빛이 사라진 곳에 생기는 어둠의 공간. 이곳에 들어가면 기억을 잃는다. 그림자 왕의 힘이 강해질수록 영역이 확장된다.',
        createdAt: '2026-03-16', updatedAt: '2026-03-19',
      },
      {
        id: 'wn-5', title: '별의 수호자 전설', folderId: 'wf-3',
        content: '오래전, 별의 수호자가 숲을 지키고 있었다. 그러나 어둠의 유혹에 빠져 타락했고, 지금의 그림자 왕이 되었다는 전설이 전해진다.',
        createdAt: '2026-03-17', updatedAt: '2026-03-17',
      },
      {
        id: 'wn-6', title: '숲의 입구 묘사', folderId: 'wf-4',
        content: '마을 끝자락에 위치. 오래된 나무 표지판에 "돌아올 수 없는 길"이 새겨져 있다. 안개 너머로 발광하는 나뭇잎이 보인다.',
        createdAt: '2026-03-18', updatedAt: '2026-03-18',
      },
      {
        id: 'wn-7', title: '정령들의 쉼터', folderId: 'wf-4',
        content: '숲 깊은 곳에 있는 작은 공터. 빛의 정령들이 모여 사는 곳. 루미의 고향이기도 하다.',
        createdAt: '2026-03-18', updatedAt: '2026-03-19',
      },
    ],
    timelineEvents: [
      { id: 'te-1', title: '별이 사라지다', description: '어느 날 밤, 하늘의 별이 모두 사라진다. 마을 사람들은 기억조차 하지 못하지만 유나만이 별을 기억한다.', timeLabel: '어느 날 밤', chapterId: 'ch-1', characterIds: ['char-1'], order: 1 },
      { id: 'te-2', title: '숲으로의 결심', description: '할머니의 이야기를 떠올린 유나는 별을 찾기 위해 숲으로 가기로 결심한다.', chapterId: 'ch-1', characterIds: ['char-1'], order: 2 },
      { id: 'te-3', title: '숲의 입구 진입', description: '안개에 싸인 숲 입구를 지나 발광하는 나뭇잎의 세계로 들어선다.', timeLabel: '다음 날 아침', chapterId: 'ch-2', characterIds: ['char-1'], order: 3 },
      { id: 'te-4', title: '루미와의 만남', description: '빛나는 작은 정령 루미가 나타나 유나를 기다렸다고 말한다.', chapterId: 'ch-2', characterIds: ['char-1', 'char-2'], order: 4 },
    ],
    chapterSnapshots: [],
    createdAt: '2026-03-15',
    updatedAt: '2026-03-19',
    totalWords: 445,
    status: '집필 중',
  },
  {
    id: 'work-2',
    title: '카페, 오후 세시',
    genre: '일상/에세이',
    description: '도시 한편의 작은 카페에서 벌어지는 소소한 이야기들',
    coverColor: '#FF6584',
    chapters: [
      {
        id: 'ch-4',
        title: '첫 번째 이야기',
        episodes: [
          {
            id: 'ep-4-1',
            title: '단골손님',
            content: `매일 오후 세시, 그 남자가 온다.

창가 자리에 앉아 아메리카노 한 잔을 시키고, 낡은 노트북을 펼친다. 무엇을 쓰는지는 모르겠지만, 그의 표정은 늘 진지하다.

나는 카운터 뒤에서 그를 지켜본다. 바리스타의 특권이라면 특권이다. 손님들의 이야기를 상상하는 것.

오늘도 그는 왔고, 오늘도 나는 상상한다.`,
            updatedAt: '2026-03-18',
            wordCount: 132,
          },
        ],
      },
    ],
    characters: [
      {
        id: 'char-4',
        name: '나 (바리스타)',
        role: '화자',
        description: '카페에서 일하며 손님들의 이야기를 관찰하고 상상하는 인물.',
        tags: ['화자', '바리스타'],
        relations: [],
      },
    ],
    worldFolders: [
      { id: 'wf-10', name: '장소', color: '#FF6584', parentId: null, createdAt: '2026-03-18' },
      { id: 'wf-11', name: '인물 관계', color: '#6C63FF', parentId: null, createdAt: '2026-03-18' },
    ],
    worldNotes: [
      {
        id: 'wn-10', title: '카페 "오후 세시"', folderId: 'wf-10',
        content: '도심 골목에 위치한 작은 카페. 나무 인테리어, 재즈 음악이 흘러나온다. 창가 좌석 3개, 테이블 5개.',
        createdAt: '2026-03-18', updatedAt: '2026-03-18',
      },
    ],
    timelineEvents: [],
    chapterSnapshots: [],
    createdAt: '2026-03-18',
    updatedAt: '2026-03-18',
    totalWords: 132,
    status: '집필 중',
  },
]
