import type { TimelineEvent, Chapter, CharacterNote } from '../data/sampleData'
import TimelineEventCard from './TimelineEventCard'

interface Props {
  events: TimelineEvent[]
  chapters: Chapter[]
  characters: CharacterNote[]
  selectedEventId: string | null
  onSelectEvent: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onDelete: (id: string) => void
}

export default function TimelineFlowChart({
  events, chapters, characters, selectedEventId,
  onSelectEvent, onMoveUp, onMoveDown, onDelete,
}: Props) {
  const sorted = [...events].sort((a, b) => a.order - b.order)

  if (sorted.length === 0) {
    return (
      <div className="tl-empty">
        <p>등록된 사건이 없습니다.</p>
        <p>우측 상단의 "+ 사건 추가" 버튼으로 타임라인을 구성해보세요.</p>
      </div>
    )
  }

  return (
    <div className="tl-flowchart">
      {sorted.map((event, i) => (
        <div key={event.id} className="tl-flow-node">
          {i > 0 && <div className="tl-flow-line" />}
          <TimelineEventCard
            event={event}
            chapter={chapters.find(c => c.id === event.chapterId)}
            characters={characters}
            isSelected={selectedEventId === event.id}
            isFirst={i === 0}
            isLast={i === sorted.length - 1}
            onSelect={() => onSelectEvent(event.id)}
            onMoveUp={() => onMoveUp(event.id)}
            onMoveDown={() => onMoveDown(event.id)}
            onDelete={() => onDelete(event.id)}
          />
        </div>
      ))}
    </div>
  )
}
