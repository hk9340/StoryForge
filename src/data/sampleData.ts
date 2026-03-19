// 샘플 계정
export const SAMPLE_USER = {
  email: 'demo@storyforge.com',
  password: 'demo1234',
  name: '김작가',
  bio: '판타지 소설을 쓰는 아마추어 작가입니다.',
  joinDate: '2026-03-19',
}

// 샘플 작품 데이터
export interface Chapter {
  id: string
  title: string
  content: string
  updatedAt: string
  wordCount: number
}

export interface CharacterNote {
  id: string
  name: string
  role: string
  description: string
  tags: string[]
}

export interface Work {
  id: string
  title: string
  genre: string
  description: string
  coverColor: string
  chapters: Chapter[]
  characters: CharacterNote[]
  worldNotes: string[]
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
        title: '프롤로그 - 잊혀진 기억',
        content: `어둠 속에서 한 줄기 빛이 스며들었다. 그것은 오래 잊혀진 기억의 조각이었다.

소녀는 천천히 눈을 떴다. 창밖으로 보이는 세상은 어제와 달랐다. 하늘에는 별이 없었고, 숲은 고요했다.

"별이... 사라졌어."

마을 사람들은 아무도 신경 쓰지 않았다. 하늘에 별이 있었다는 사실조차 기억하지 못하는 것 같았다. 하지만 소녀, 유나는 분명히 기억하고 있었다. 밤하늘을 수놓던 수천 개의 빛들을.

할머니가 들려주시던 이야기가 떠올랐다.

"이 숲 깊은 곳에는 별들이 잠드는 곳이 있단다. 별이 지치면 그곳에서 쉬다 가지."

유나는 결심했다. 별을 찾으러 숲으로 가겠다고.`,
        updatedAt: '2026-03-19',
        wordCount: 247,
      },
      {
        id: 'ch-2',
        title: '제1장 - 숲의 입구',
        content: `마을 끝자락에 있는 숲의 입구는 안개에 싸여 있었다. 오래된 나무 표지판에는 "돌아올 수 없는 길"이라는 글자가 희미하게 새겨져 있었다.

유나는 작은 배낭을 메고 첫 발을 내디뎠다. 안개를 헤치고 들어서자, 놀라운 광경이 펼쳐졌다. 나뭇잎 하나하나가 은은한 빛을 발하고 있었다.

"이건... 별빛?"

바로 그때, 나뭇가지 사이에서 작은 생물이 나타났다. 손바닥만 한 크기에 반투명한 날개를 가진, 빛나는 작은 존재.

"드디어 왔구나. 오래 기다렸어."`,
        updatedAt: '2026-03-19',
        wordCount: 198,
      },
      {
        id: 'ch-3',
        title: '제2장 - 빛의 안내자',
        content: '',
        updatedAt: '2026-03-19',
        wordCount: 0,
      },
    ],
    characters: [
      {
        id: 'char-1',
        name: '유나',
        role: '주인공',
        description: '16세 소녀. 별이 사라진 것을 유일하게 기억하는 인물. 호기심이 많고 용감하다.',
        tags: ['주인공', '인간', '소녀'],
      },
      {
        id: 'char-2',
        name: '루미',
        role: '조력자',
        description: '숲에 사는 빛의 정령. 손바닥만 한 크기에 반투명한 날개를 가졌다. 유나를 별이 잠든 곳으로 안내한다.',
        tags: ['정령', '조력자', '빛'],
      },
      {
        id: 'char-3',
        name: '그림자 왕',
        role: '적대자',
        description: '별빛을 삼키고 어둠을 퍼뜨리는 존재. 과거에는 별의 수호자였으나 타락했다.',
        tags: ['적대자', '보스', '어둠'],
      },
    ],
    worldNotes: [
      '별의 숲: 별들이 지칠 때 쉬어가는 신비로운 장소. 일반인은 입구를 찾을 수 없다.',
      '별빛 기억: 별이 가진 기억의 힘. 세상의 중요한 기억들을 보존하는 역할을 한다.',
      '그림자 영역: 별빛이 사라진 곳에 생기는 어둠의 공간. 이곳에 들어가면 기억을 잃는다.',
    ],
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
        title: '첫 번째 이야기 - 단골손님',
        content: `매일 오후 세시, 그 남자가 온다.

창가 자리에 앉아 아메리카노 한 잔을 시키고, 낡은 노트북을 펼친다. 무엇을 쓰는지는 모르겠지만, 그의 표정은 늘 진지하다.

나는 카운터 뒤에서 그를 지켜본다. 바리스타의 특권이라면 특권이다. 손님들의 이야기를 상상하는 것.

오늘도 그는 왔고, 오늘도 나는 상상한다.`,
        updatedAt: '2026-03-18',
        wordCount: 132,
      },
    ],
    characters: [
      {
        id: 'char-4',
        name: '나 (바리스타)',
        role: '화자',
        description: '카페에서 일하며 손님들의 이야기를 관찰하고 상상하는 인물.',
        tags: ['화자', '바리스타'],
      },
    ],
    worldNotes: [
      '카페 "오후 세시": 도심 골목에 위치한 작은 카페. 나무 인테리어, 재즈 음악이 흘러나온다.',
    ],
    createdAt: '2026-03-18',
    updatedAt: '2026-03-18',
    totalWords: 132,
    status: '집필 중',
  },
]
