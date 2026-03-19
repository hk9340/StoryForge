import type { TimelineEvent, Chapter, CharacterNote } from '../data/sampleData'

interface Props {
  event: TimelineEvent
  chapter?: Chapter
  characters: CharacterNote[]
  isSelected: boolean
  isFirst: boolean
  isLast: boolean
  onSelect: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}

export default function TimelineEventCard({
  event, chapter, characters, isSelected, isFirst, isLast,
  onSelect, onMoveUp, onMoveDown, onDelete,
}: Props) {
  const involvedChars = characters.filter(c => event.characterIds.includes(c.id))

  return (
    <div className={`tl-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      {event.timeLabel && (
        <span className="tl-card-time">{event.timeLabel}</span>
      )}
      <div className="tl-card-header">
        {chapter && (
          <span className="tl-card-chapter">{chapter.title}</span>
        )}
      </div>
      <h4 className="tl-card-title">{event.title}</h4>
      <p className="tl-card-desc">{event.description}</p>
      {involvedChars.length > 0 && (
        <div className="tl-card-avatars">
          {involvedChars.map(c => (
            <span key={c.id} className="tl-card-avatar" title={c.name}>
              {c.name[0]}
            </span>
          ))}
        </div>
      )}
      <div className="tl-card-actions">
        <button
          className="tl-action-btn"
          onClick={e => { e.stopPropagation(); onMoveUp() }}
          disabled={isFirst}
          title="위로 이동"
        >▲</button>
        <button
          className="tl-action-btn"
          onClick={e => { e.stopPropagation(); onMoveDown() }}
          disabled={isLast}
          title="아래로 이동"
        >▼</button>
        <button
          className="tl-action-btn tl-action-delete"
          onClick={e => { e.stopPropagation(); onDelete() }}
          title="삭제"
        >&#8854;</button>
      </div>
    </div>
  )
}
