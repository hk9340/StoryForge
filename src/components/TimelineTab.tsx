import { useState } from 'react'
import type { TimelineEvent, Chapter, CharacterNote, ChapterRelationSnapshot } from '../data/sampleData'
import { useConfirm } from '../contexts/ConfirmContext'
import TimelineFilterBar from './TimelineFilterBar'
import TimelineFlowChart from './TimelineFlowChart'
import TimelineEventEditor from './TimelineEventEditor'
import ChapterSnapshotViewer from './ChapterSnapshotViewer'
import './TimelineTab.css'

interface Props {
  chapters: Chapter[]
  characters: CharacterNote[]
  timelineEvents: TimelineEvent[]
  setTimelineEvents: React.Dispatch<React.SetStateAction<TimelineEvent[]>>
  chapterSnapshots: ChapterRelationSnapshot[]
  setChapterSnapshots: React.Dispatch<React.SetStateAction<ChapterRelationSnapshot[]>>
  markChanged: () => void
}

export default function TimelineTab({
  chapters, characters, timelineEvents, setTimelineEvents,
  chapterSnapshots, setChapterSnapshots, markChanged,
}: Props) {
  const confirm = useConfirm()
  const [filterChapterId, setFilterChapterId] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [showSnapshot, setShowSnapshot] = useState(false)

  const handleFilterChange = async (chapterId: string | null) => {
    if ((isAdding || selectedEventId) && !showSnapshot) {
      if (!await confirm('수정사항이 저장되지 않았습니다. 챕터를 전환하시겠습니까?')) return
    }
    setFilterChapterId(chapterId)
    closeSidePanel()
  }

  const filteredEvents = filterChapterId
    ? timelineEvents.filter(e => e.chapterId === filterChapterId)
    : timelineEvents

  const selectedEvent = timelineEvents.find(e => e.id === selectedEventId) || null

  const handleSaveEvent = (event: TimelineEvent) => {
    setTimelineEvents(prev => {
      const exists = prev.some(e => e.id === event.id)
      if (exists) {
        return prev.map(e => e.id === event.id ? event : e)
      }
      const maxOrder = prev.length > 0 ? Math.max(...prev.map(e => e.order)) : 0
      return [...prev, { ...event, order: maxOrder + 1 }]
    })
    setSelectedEventId(event.id)
    setIsAdding(false)
    setShowSnapshot(false)
    markChanged()
  }

  const handleDelete = async (id: string) => {
    if (!await confirm('이 사건을 삭제하시겠습니까?')) return
    setTimelineEvents(prev => prev.filter(e => e.id !== id))
    if (selectedEventId === id) setSelectedEventId(null)
    markChanged()
  }

  const handleMoveUp = (id: string) => {
    const sorted = [...filteredEvents].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex(e => e.id === id)
    if (idx <= 0) return
    const current = sorted[idx]
    const above = sorted[idx - 1]
    setTimelineEvents(prev => prev.map(e => {
      if (e.id === current.id) return { ...e, order: above.order }
      if (e.id === above.id) return { ...e, order: current.order }
      return e
    }))
    markChanged()
  }

  const handleMoveDown = (id: string) => {
    const sorted = [...filteredEvents].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex(e => e.id === id)
    if (idx < 0 || idx >= sorted.length - 1) return
    const current = sorted[idx]
    const below = sorted[idx + 1]
    setTimelineEvents(prev => prev.map(e => {
      if (e.id === current.id) return { ...e, order: below.order }
      if (e.id === below.id) return { ...e, order: current.order }
      return e
    }))
    markChanged()
  }

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id)
    setIsAdding(false)
    setShowSnapshot(false)
  }

  const handleAddEvent = () => {
    setIsAdding(true)
    setSelectedEventId(null)
    setShowSnapshot(false)
  }

  const handleShowSnapshot = () => {
    setShowSnapshot(true)
    setIsAdding(false)
    setSelectedEventId(null)
  }

  const closeSidePanel = () => {
    setIsAdding(false)
    setSelectedEventId(null)
    setShowSnapshot(false)
  }

  const hasSidePanel = isAdding || selectedEventId || showSnapshot

  return (
    <div className="tl-view">
      <div className="section-header-block">
        <div className="section-header-top">
          <h2>타임라인</h2>
          <span className="section-header-badge">&#128337; {timelineEvents.length}개 사건</span>
        </div>
        <p className="section-header-hint">챕터별 사건 흐름을 플로우차트로 관리합니다. 사건을 클릭하면 편집할 수 있으며, 특정 챕터를 선택하면 해당 시점의 관계도 스냅샷을 생성/관리할 수 있습니다.</p>
      </div>

      <TimelineFilterBar
        chapters={chapters}
        selectedChapterId={filterChapterId}
        onFilterChange={handleFilterChange}
        onAddEvent={handleAddEvent}
        onShowSnapshot={handleShowSnapshot}
        snapshotAvailable={filterChapterId ? chapterSnapshots.some(s => s.chapterId === filterChapterId) : false}
      />

      <div className={`tl-layout ${hasSidePanel ? 'has-panel' : ''}`}>
        <div className="tl-main">
          <TimelineFlowChart
            events={filteredEvents}
            chapters={chapters}
            characters={characters}
            selectedEventId={selectedEventId}
            onSelectEvent={handleSelectEvent}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onDelete={handleDelete}
          />
        </div>

        {hasSidePanel && (
          <div className="tl-side-panel">
            {showSnapshot && filterChapterId && (
              <ChapterSnapshotViewer
                chapterId={filterChapterId}
                chapters={chapters}
                characters={characters}
                chapterSnapshots={chapterSnapshots}
                onUpdateSnapshots={s => { setChapterSnapshots(s); markChanged() }}
                onClose={closeSidePanel}
              />
            )}
            {(isAdding || selectedEventId) && !showSnapshot && (
              <TimelineEventEditor
                event={isAdding ? null : selectedEvent}
                chapters={chapters}
                characters={characters}
                onSave={handleSaveEvent}
                onClose={closeSidePanel}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
