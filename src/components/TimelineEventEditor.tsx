import { useState, useEffect } from 'react'
import type { TimelineEvent, Chapter, CharacterNote } from '../data/sampleData'

interface Props {
  event: TimelineEvent | null  // null = new event mode
  chapters: Chapter[]
  characters: CharacterNote[]
  onSave: (event: TimelineEvent) => void
  onClose: () => void
}

export default function TimelineEventEditor({ event, chapters, characters, onSave, onClose }: Props) {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [timeLabel, setTimeLabel] = useState(event?.timeLabel || '')
  const [chapterId, setChapterId] = useState(event?.chapterId || chapters[0]?.id || '')
  const [characterIds, setCharacterIds] = useState<string[]>(event?.characterIds || [])
  const [charSearch, setCharSearch] = useState('')

  useEffect(() => {
    setTitle(event?.title || '')
    setDescription(event?.description || '')
    setTimeLabel(event?.timeLabel || '')
    setChapterId(event?.chapterId || chapters[0]?.id || '')
    setCharacterIds(event?.characterIds || [])
  }, [event, chapters])

  const toggleCharacter = (charId: string) => {
    setCharacterIds(prev =>
      prev.includes(charId) ? prev.filter(id => id !== charId) : [...prev, charId]
    )
  }

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      id: event?.id || `te-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      timeLabel: timeLabel.trim() || undefined,
      chapterId,
      characterIds,
      order: event?.order || 0,
    })
  }

  return (
    <div className="tl-editor">
      <div className="tl-editor-header">
        <h3>{event ? '사건 편집' : '새 사건 추가'}</h3>
        <button className="tl-editor-close" onClick={onClose}>&times;</button>
      </div>
      <div className="tl-editor-body">
        <div className="tl-editor-group">
          <label>사건 제목 *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="사건의 제목..."
            autoFocus
          />
        </div>
        <div className="tl-editor-group">
          <label>설명</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="무슨 일이 일어났는지 설명..."
            rows={3}
          />
        </div>
        <div className="tl-editor-row">
          <div className="tl-editor-group">
            <label>시간 라벨 (선택)</label>
            <input
              value={timeLabel}
              onChange={e => setTimeLabel(e.target.value)}
              placeholder="예: 3일 후, 저녁, 봄"
            />
          </div>
          <div className="tl-editor-group">
            <label>소속 챕터</label>
            <select value={chapterId} onChange={e => setChapterId(e.target.value)}>
              {chapters.map(ch => (
                <option key={ch.id} value={ch.id}>{ch.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="tl-editor-group">
          <label>등장인물 ({characterIds.length}명 선택)</label>

          {/* Selected characters as horizontal cards */}
          {characterIds.length > 0 && (
            <div className="tl-char-cards">
              {characterIds.map(id => {
                const c = characters.find(ch => ch.id === id)
                if (!c) return null
                return (
                  <div key={c.id} className="tl-char-card">
                    <span className="tl-char-card-avatar">{c.name[0]}</span>
                    <span className="tl-char-card-name">{c.name}</span>
                    <button
                      className="tl-char-card-remove"
                      onClick={() => setCharacterIds(prev => prev.filter(x => x !== c.id))}
                      title="제거"
                    >&#8854;</button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Search & results */}
          <input
            className="search-input search-input--sm"
            value={charSearch}
            onChange={e => setCharSearch(e.target.value)}
            placeholder="캐릭터 이름으로 검색하여 추가..."
          />
          {charSearch.trim() && (
            <div className="tl-char-search-results">
              {characters
                .filter(c => c.name.toLowerCase().includes(charSearch.toLowerCase()))
                .map(c => {
                  const isAdded = characterIds.includes(c.id)
                  return (
                    <div key={c.id} className={`tl-char-search-item ${isAdded ? 'added' : ''}`}>
                      <span className="tl-char-card-avatar">{c.name[0]}</span>
                      <span className="tl-char-search-name">{c.name}</span>
                      <span className="tl-char-search-role">{c.role}</span>
                      <button
                        className={`tl-char-search-btn ${isAdded ? 'remove' : 'add'}`}
                        onClick={() => {
                          if (isAdded) {
                            setCharacterIds(prev => prev.filter(x => x !== c.id))
                          } else {
                            setCharacterIds(prev => [...prev, c.id])
                          }
                        }}
                      >
                        {isAdded ? '−' : '+'}
                      </button>
                    </div>
                  )
                })}
              {characters.filter(c => c.name.toLowerCase().includes(charSearch.toLowerCase())).length === 0 && (
                <div className="tl-char-search-empty">검색 결과가 없습니다.</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="tl-editor-footer">
        <button className="btn btn--ghost-sm" onClick={onClose}>취소</button>
        <button className="btn btn--primary btn--sm" onClick={handleSave} disabled={!title.trim()}>
          {event ? '저장' : '추가'}
        </button>
      </div>
    </div>
  )
}
