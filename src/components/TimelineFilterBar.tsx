import type { Chapter } from '../data/sampleData'

interface Props {
  chapters: Chapter[]
  selectedChapterId: string | null
  onFilterChange: (chapterId: string | null) => void
  onAddEvent: () => void
  onShowSnapshot: () => void
  snapshotAvailable: boolean
}

export default function TimelineFilterBar({
  chapters, selectedChapterId, onFilterChange, onAddEvent, onShowSnapshot, snapshotAvailable,
}: Props) {
  return (
    <div className="tl-filter-bar">
      <div className="tl-filter-pills">
        <button
          className={`tl-filter-pill ${selectedChapterId === null ? 'active' : ''}`}
          onClick={() => onFilterChange(null)}
        >
          전체
        </button>
        {chapters.map(ch => (
          <button
            key={ch.id}
            className={`tl-filter-pill ${selectedChapterId === ch.id ? 'active' : ''}`}
            onClick={() => onFilterChange(ch.id)}
          >
            {ch.title.length > 12 ? ch.title.slice(0, 12) + '…' : ch.title}
          </button>
        ))}
      </div>
      <div className="tl-filter-actions">
        {selectedChapterId && (
          <button className="btn btn--ghost-sm" onClick={onShowSnapshot}>
            &#128268; {snapshotAvailable ? '관계도 스냅샷' : '스냅샷 생성'}
          </button>
        )}
        <button className="btn btn--primary btn--sm" onClick={onAddEvent}>
          + 사건 추가
        </button>
      </div>
    </div>
  )
}
