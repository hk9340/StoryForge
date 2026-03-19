import { useState, useRef, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useConfirm } from '../contexts/ConfirmContext'
import { SAMPLE_WORKS, type WorldNote, type WorldFolder, type CharacterNote, type Chapter } from '../data/sampleData'
import CharacterDetail from '../components/CharacterDetail'
import RelationDiagram from '../components/RelationDiagram'
import './WorkDetail.css'

type Tab = 'write' | 'chapters' | 'characters' | 'relations' | 'world' | 'glossary'
type SortMode = 'name' | 'created' | 'updated'

interface WorkSettings {
  autoSave: boolean
  autoSaveInterval: number // minutes
}

interface GlossaryTerm {
  id: string
  term: string
  description: string
  pinned: boolean
}

export default function WorkDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('write')
  const [activeChapter, setActiveChapter] = useState(0)

  // Chapters state
  const work = SAMPLE_WORKS.find(w => w.id === id)
  const [chapters, setChapters] = useState<Chapter[]>(work?.chapters || [])
  const [editorContent, setEditorContent] = useState(chapters[0]?.content || '')

  // New chapter form
  const [showNewChapterForm, setShowNewChapterForm] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const newChapterRef = useRef<HTMLDivElement>(null)

  // Save status
  const [hasChanges, setHasChanges] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<WorkSettings>({ autoSave: true, autoSaveInterval: 5 })

  // World tab state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('name')
  const [selectedNote, setSelectedNote] = useState<WorldNote | null>(null)

  // Character tab state
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterNote | null>(null)
  const [characters, setCharacters] = useState(work?.characters || [])
  const [expandedCharacters, setExpandedCharacters] = useState<Set<string>>(new Set())

  // Glossary state
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([
    { id: 'g1', term: '별의 숲', description: '별들이 지칠 때 쉬어가는 신비로운 장소. 일반인은 입구를 찾을 수 없다.', pinned: true },
    { id: 'g2', term: '별빛 기억', description: '별이 가진 기억의 힘. 세상의 중요한 기억들을 보존하는 역할을 한다.', pinned: true },
    { id: 'g3', term: '그림자 영역', description: '별빛이 사라진 곳에 생기는 어둠의 공간. 이곳에 들어가면 기억을 잃는다.', pinned: false },
  ])
  const [newTerm, setNewTerm] = useState('')
  const [newTermDesc, setNewTermDesc] = useState('')
  const [glossaryTooltip, setGlossaryTooltip] = useState<{ term: string; desc: string; x: number; y: number } | null>(null)

  // Scroll to new chapter form
  useEffect(() => {
    if (showNewChapterForm && newChapterRef.current) {
      newChapterRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [showNewChapterForm])

  if (!user) { navigate('/login'); return null }
  if (!work) return <div className="not-found">작품을 찾을 수 없습니다.</div>

  const chapter = chapters[activeChapter]

  const markChanged = () => setHasChanges(true)

  // Chapter add
  const openNewChapterForm = () => {
    setActiveTab('chapters')
    setShowNewChapterForm(true)
    setNewChapterTitle('')
  }

  const addChapter = () => {
    if (!newChapterTitle.trim()) return
    const newCh: Chapter = {
      id: `ch-new-${Date.now()}`,
      title: newChapterTitle.trim(),
      content: '',
      updatedAt: new Date().toISOString().split('T')[0],
      wordCount: 0,
    }
    setChapters(prev => [...prev, newCh])
    setShowNewChapterForm(false)
    setNewChapterTitle('')
    setHasChanges(true)
  }

  const deleteChapter = async (e: React.MouseEvent, chapterId: string) => {
    e.stopPropagation()
    if (!await confirm('이 챕터를 삭제하시겠습니까?')) return
    const idx = chapters.findIndex(c => c.id === chapterId)
    setChapters(prev => prev.filter(c => c.id !== chapterId))
    if (activeChapter >= idx && activeChapter > 0) setActiveChapter(activeChapter - 1)
    markChanged()
  }

  const deleteCharacter = async (e: React.MouseEvent, charId: string) => {
    e.stopPropagation()
    if (!await confirm('이 캐릭터를 삭제하시겠습니까?')) return
    setCharacters(prev => prev.filter(c => c.id !== charId))
    markChanged()
  }

  // World helpers
  const getSubFolders = (parentId: string | null): WorldFolder[] => {
    const folders = work.worldFolders.filter(f => f.parentId === parentId)
    return [...folders].sort((a, b) => {
      if (sortMode === 'name') return a.name.localeCompare(b.name, 'ko')
      return a.createdAt.localeCompare(b.createdAt)
    })
  }

  const getNotesInFolder = (folderId: string): WorldNote[] => {
    const notes = work.worldNotes.filter(n => n.folderId === folderId)
    return [...notes].sort((a, b) => {
      if (sortMode === 'name') return a.title.localeCompare(b.title, 'ko')
      if (sortMode === 'updated') return b.updatedAt.localeCompare(a.updatedAt)
      return b.createdAt.localeCompare(a.createdAt)
    })
  }

  const getBreadcrumb = (): WorldFolder[] => {
    const trail: WorldFolder[] = []
    let fid = currentFolderId
    while (fid) {
      const folder = work.worldFolders.find(f => f.id === fid)
      if (!folder) break
      trail.unshift(folder)
      fid = folder.parentId
    }
    return trail
  }

  const currentFolderNoteCount = (folderId: string): number => {
    const direct = work.worldNotes.filter(n => n.folderId === folderId).length
    const subFolders = work.worldFolders.filter(f => f.parentId === folderId)
    return direct + subFolders.reduce((sum, sf) => sum + currentFolderNoteCount(sf.id), 0)
  }

  return (
    <div className="work-detail">
      {/* Top Bar */}
      <header className="work-topbar">
        <div className="work-topbar-left">
          <Link to="/dashboard" className="back-btn">&larr;</Link>
          <div>
            <h1>{work.title}</h1>
            <span className="work-topbar-genre">{work.genre}</span>
          </div>
        </div>
        <div className="work-topbar-right">
          {hasChanges ? (
            <span className="save-status save-status--unsaved">미저장 변경사항</span>
          ) : (
            <span className="save-status">자동 저장됨</span>
          )}
          <button className="btn btn--primary btn--sm" onClick={() => setHasChanges(false)}>저장</button>
          <button className="topbar-settings-btn" onClick={() => setShowSettings(!showSettings)} title="작품 설정">
            &#9881;
          </button>
        </div>
      </header>

      {/* Work Stats Bar */}
      <div className="work-stats-bar">
        <div className="work-stat-item">
          <span className="work-stat-value">{chapters.length}</span>
          <span className="work-stat-label">챕터</span>
        </div>
        <div className="work-stat-divider" />
        <div className="work-stat-item">
          <span className="work-stat-value">{characters.length}</span>
          <span className="work-stat-label">캐릭터</span>
        </div>
        <div className="work-stat-divider" />
        <div className="work-stat-item">
          <span className="work-stat-value">{chapters.reduce((sum, ch) => sum + ch.wordCount, 0).toLocaleString()}</span>
          <span className="work-stat-label">총 글자 수</span>
        </div>
        <div className="work-stat-divider" />
        <div className="work-stat-item">
          <span className="work-stat-value">{work.worldNotes.length}</span>
          <span className="work-stat-label">세계관 노트</span>
        </div>
        <div className="work-stat-divider" />
        <div className="work-stat-item">
          <span className="work-stat-value">{work.updatedAt}</span>
          <span className="work-stat-label">최근 수정</span>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-dropdown">
          <div className="settings-dropdown-header">
            <h3>작품 설정</h3>
            <button className="settings-dropdown-close" onClick={() => setShowSettings(false)}>&times;</button>
          </div>
          <div className="settings-dropdown-body">
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">자동 저장</span>
                <span className="settings-row-desc">변경사항을 자동으로 저장합니다</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={e => setSettings(s => ({ ...s, autoSave: e.target.checked }))}
                />
                <span className="toggle-slider" />
              </label>
            </div>
            {settings.autoSave && (
              <div className="settings-row">
                <div className="settings-row-info">
                  <span className="settings-row-label">저장 간격</span>
                  <span className="settings-row-desc">자동 저장이 실행되는 간격</span>
                </div>
                <select
                  className="settings-select"
                  value={settings.autoSaveInterval}
                  onChange={e => setSettings(s => ({ ...s, autoSaveInterval: Number(e.target.value) }))}
                >
                  <option value={1}>1분</option>
                  <option value={3}>3분</option>
                  <option value={5}>5분</option>
                  <option value={10}>10분</option>
                  <option value={15}>15분</option>
                </select>
              </div>
            )}
            <div className="settings-divider" />
            <p className="settings-section-label">집필 지원 (준비 중)</p>
            <div className="settings-row disabled">
              <div className="settings-row-info">
                <span className="settings-row-label">맞춤법 검사</span>
                <span className="settings-row-desc">작성 중 맞춤법을 실시간으로 확인</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" disabled />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="settings-row disabled">
              <div className="settings-row-info">
                <span className="settings-row-label">글자 수 목표</span>
                <span className="settings-row-desc">일일/챕터별 글자 수 목표 설정</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" disabled />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="settings-row disabled">
              <div className="settings-row-info">
                <span className="settings-row-label">집중 모드</span>
                <span className="settings-row-desc">사이드바와 탭을 숨기고 에디터에 집중</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" disabled />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab Nav */}
      <div className="work-tabs">
        <button className={`work-tab ${activeTab === 'write' ? 'active' : ''}`} onClick={() => setActiveTab('write')}>
          &#128221; 집필
        </button>
        <button className={`work-tab ${activeTab === 'chapters' ? 'active' : ''}`} onClick={() => setActiveTab('chapters')}>
          &#128196; 챕터
        </button>
        <button className={`work-tab ${activeTab === 'characters' ? 'active' : ''}`} onClick={() => setActiveTab('characters')}>
          &#128100; 캐릭터
        </button>
        <button className={`work-tab ${activeTab === 'relations' ? 'active' : ''}`} onClick={() => setActiveTab('relations')}>
          &#128268; 관계도
        </button>
        <button className={`work-tab ${activeTab === 'world' ? 'active' : ''}`} onClick={() => { setActiveTab('world'); setSelectedNote(null) }}>
          &#127760; 세계관
        </button>
        <button className={`work-tab ${activeTab === 'glossary' ? 'active' : ''}`} onClick={() => setActiveTab('glossary')}>
          &#128218; 용어집
        </button>
      </div>

      {/* Content */}
      <div className="work-content">
        {activeTab === 'write' && (
          <div className="editor-layout">
            <aside className="chapter-sidebar">
              <h3>챕터 목록</h3>
              {chapters.map((ch, i) => (
                <div
                  key={ch.id}
                  className={`chapter-item ${i === activeChapter ? 'active' : ''}`}
                  onClick={() => { setActiveChapter(i); setEditorContent(chapters[i].content) }}
                >
                  <span className="chapter-title">{ch.title}</span>
                  <span className="chapter-words">{ch.wordCount}자</span>
                  <button className="delete-btn-sm" onClick={e => deleteChapter(e, ch.id)} title="챕터 삭제">&#8854;</button>
                </div>
              ))}
              <button className="chapter-item chapter-add" onClick={openNewChapterForm}>+ 새 챕터</button>
            </aside>

            <div className="editor-area">
              <input
                className="editor-chapter-title-input"
                value={chapter?.title || ''}
                onChange={e => {
                  const newTitle = e.target.value
                  setChapters(prev => prev.map((ch, i) => i === activeChapter ? { ...ch, title: newTitle } : ch))
                  markChanged()
                }}
                placeholder="챕터 제목"
              />
              <div className="editor-wrapper">
                <div className="editor-highlight-layer" aria-hidden="true">
                  {(() => {
                    const pinnedTerms = glossary.filter(g => g.pinned && g.term)
                    if (pinnedTerms.length === 0) return editorContent || '\u00A0'
                    const pattern = new RegExp(`(${pinnedTerms.map(g => g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
                    const parts = editorContent.split(pattern)
                    return parts.map((part, i) => {
                      const matched = pinnedTerms.find(g => g.term === part)
                      if (matched) return <mark key={i} className="term-highlight">{part}</mark>
                      return part
                    })
                  })()}
                  {'\n'}
                </div>
                <textarea
                  className="editor-textarea"
                  value={editorContent}
                  onChange={e => { setEditorContent(e.target.value); markChanged() }}
                  placeholder="이야기를 시작하세요..."
                  onScroll={e => {
                    const target = e.target as HTMLTextAreaElement
                    const highlight = target.previousElementSibling as HTMLElement
                    if (highlight) highlight.scrollTop = target.scrollTop
                  }}
                  onClick={e => {
                    const pinnedTerms = glossary.filter(g => g.pinned && g.term)
                    if (pinnedTerms.length === 0) return
                    const textarea = e.target as HTMLTextAreaElement
                    const pos = textarea.selectionStart
                    for (const g of pinnedTerms) {
                      let idx = editorContent.indexOf(g.term)
                      while (idx !== -1) {
                        if (pos >= idx && pos <= idx + g.term.length) {
                              setGlossaryTooltip({
                            term: g.term,
                            desc: g.description,
                            x: Math.min(e.clientX, window.innerWidth - 320),
                            y: e.clientY + 10,
                          })
                          return
                        }
                        idx = editorContent.indexOf(g.term, idx + 1)
                      }
                    }
                    setGlossaryTooltip(null)
                  }}
                />
              </div>
              <div className="editor-footer">
                <span>{editorContent.length}자</span>
                <span>챕터 {activeChapter + 1} / {chapters.length}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chapters' && (
          <div className="chapters-view">
            <div className="chapters-header">
              <h2>전체 챕터 ({chapters.length})</h2>
              <button className="btn btn--primary btn--sm" onClick={() => { setShowNewChapterForm(true); setNewChapterTitle('') }}>
                + 새 챕터 추가
              </button>
            </div>
            <div className="chapters-list">
              {/* New Chapter Form - top (역순이므로 최신이 위) */}
              {showNewChapterForm && (
                <div className="new-chapter-form" ref={newChapterRef}>
                  <div className="new-chapter-form-inner">
                    <div className="chapter-card-num new">{chapters.length + 1}</div>
                    <div className="new-chapter-fields">
                      <input
                        className="new-chapter-input"
                        value={newChapterTitle}
                        onChange={e => setNewChapterTitle(e.target.value)}
                        placeholder="새 챕터 제목을 입력하세요..."
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') addChapter(); if (e.key === 'Escape') setShowNewChapterForm(false) }}
                      />
                      <div className="new-chapter-actions">
                        <button className="btn btn--primary btn--sm" onClick={addChapter} disabled={!newChapterTitle.trim()}>추가</button>
                        <button className="btn btn--ghost-sm" onClick={() => setShowNewChapterForm(false)}>취소</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 챕터 목록 역순 (최신이 위) */}
              {[...chapters].reverse().map((ch) => {
                const origIndex = chapters.indexOf(ch)
                return (
                  <div key={ch.id} className="chapter-card" onClick={() => { setActiveChapter(origIndex); setActiveTab('write'); setEditorContent(ch.content) }}>
                    <div className="chapter-card-num">{origIndex + 1}</div>
                    <div className="chapter-card-info">
                      <h3>{ch.title}</h3>
                      <p>{ch.content ? ch.content.slice(0, 80) + '...' : '아직 작성되지 않았습니다.'}</p>
                      <div className="chapter-card-meta">
                        <span>{ch.wordCount}자</span>
                        <span>수정: {ch.updatedAt}</span>
                      </div>
                    </div>
                    <button className="delete-btn" onClick={e => deleteChapter(e, ch.id)} title="챕터 삭제">&#8854;</button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="characters-view">
            <div className="chapters-header">
              <h2>캐릭터 ({characters.length})</h2>
              <div className="chapters-header-right">
                <button className="btn btn--ghost-sm" onClick={() => setActiveTab('relations')}>
                  &#128268; 관계도 보기
                </button>
                <button className="btn btn--primary btn--sm" onClick={() => {
                  const newChar: CharacterNote = {
                    id: `char-new-${Date.now()}`,
                    name: '',
                    role: '',
                    description: '',
                    tags: [],
                    relations: [],
                  }
                  setCharacters(prev => [...prev, newChar])
                  setExpandedCharacters(prev => new Set(prev).add(newChar.id))
                  markChanged()
                }}>+ 캐릭터 추가</button>
              </div>
            </div>
            <div className="character-accordion-list">
              {characters.map(char => {
                const isExpanded = expandedCharacters.has(char.id)
                const toggleExpand = () => {
                  setExpandedCharacters(prev => {
                    const next = new Set(prev)
                    if (next.has(char.id)) next.delete(char.id)
                    else next.add(char.id)
                    return next
                  })
                }
                const updateChar = (updates: Partial<CharacterNote>) => {
                  setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, ...updates } : c))
                  markChanged()
                }
                return (
                  <div key={char.id} className={`char-accordion ${isExpanded ? 'expanded' : ''}`}>
                    <div className="char-accordion-header" onClick={toggleExpand}>
                      <div className="char-accordion-avatar">{char.name?.[0] || '?'}</div>
                      <div className="char-accordion-summary">
                        <span className="char-accordion-name">{char.name || '이름 없음'}</span>
                        <span className="char-accordion-role">{char.role || '역할 미지정'}</span>
                      </div>
                      <div className="char-accordion-meta">
                        {char.tags.length > 0 && (
                          <div className="char-accordion-tags">
                            {char.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                          </div>
                        )}
                        {char.relations.length > 0 && (
                          <span className="character-relations-badge">&#128268; {char.relations.length}</span>
                        )}
                      </div>
                      <button className="delete-btn-sm" onClick={e => deleteCharacter(e, char.id)} title="캐릭터 삭제">&#8854;</button>
                      <span className="char-accordion-toggle">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                    {isExpanded && (
                      <div className="char-accordion-body">
                        <div className="char-accordion-section">
                          <div className="char-form-row">
                            <div className="char-form-group">
                              <label>이름</label>
                              <input value={char.name} onChange={e => updateChar({ name: e.target.value })} placeholder="캐릭터 이름" />
                            </div>
                            <div className="char-form-group">
                              <label>역할</label>
                              <input value={char.role} onChange={e => updateChar({ role: e.target.value })} placeholder="예: 주인공, 조력자" />
                            </div>
                          </div>
                          <div className="char-form-row">
                            <div className="char-form-group">
                              <label>나이</label>
                              <input value={char.age || ''} onChange={e => updateChar({ age: e.target.value })} placeholder="예: 16세" />
                            </div>
                            <div className="char-form-group">
                              <label>성별</label>
                              <input value={char.gender || ''} onChange={e => updateChar({ gender: e.target.value })} placeholder="예: 여성" />
                            </div>
                          </div>
                          <div className="char-form-group">
                            <label>외형</label>
                            <textarea value={char.appearance || ''} onChange={e => updateChar({ appearance: e.target.value })} placeholder="캐릭터의 외형을 묘사하세요..." rows={2} />
                          </div>
                          <div className="char-form-group">
                            <label>성격</label>
                            <textarea value={char.personality || ''} onChange={e => updateChar({ personality: e.target.value })} placeholder="캐릭터의 성격을 설명하세요..." rows={2} />
                          </div>
                          <div className="char-form-group">
                            <label>설명</label>
                            <textarea value={char.description} onChange={e => updateChar({ description: e.target.value })} placeholder="캐릭터에 대한 간단한 설명..." rows={2} />
                          </div>
                          <div className="char-form-group">
                            <label>배경 이야기</label>
                            <textarea value={char.backstory || ''} onChange={e => updateChar({ backstory: e.target.value })} placeholder="캐릭터의 과거와 배경..." rows={3} />
                          </div>
                          <div className="char-form-group">
                            <label>태그</label>
                            <input value={char.tags.join(', ')} onChange={e => updateChar({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} placeholder="쉼표로 구분 (예: 주인공, 인간, 소녀)" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'world' && (
          <div className="world-view">
            <div className="world-header">
              <div className="world-header-left">
                <div className="world-breadcrumb">
                  <button
                    className={`breadcrumb-item ${!currentFolderId ? 'current' : ''}`}
                    onClick={() => { setCurrentFolderId(null); setSelectedNote(null) }}
                  >
                    &#127760; 세계관
                  </button>
                  {getBreadcrumb().map(folder => (
                    <span key={folder.id} className="breadcrumb-sep">
                      &rsaquo;
                      <button
                        className={`breadcrumb-item ${currentFolderId === folder.id ? 'current' : ''}`}
                        onClick={() => { setCurrentFolderId(folder.id); setSelectedNote(null) }}
                      >
                        {folder.name}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="world-header-right">
                <div className="sort-control">
                  <span className="sort-label">정렬:</span>
                  <select value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)}>
                    <option value="name">이름순</option>
                    <option value="created">생성일순</option>
                    <option value="updated">수정일순</option>
                  </select>
                </div>
                <button className="btn btn--primary btn--sm">+ 새 폴더</button>
                {currentFolderId && <button className="btn btn--ghost-sm">+ 노트 추가</button>}
              </div>
            </div>
            <div className="world-layout">
              <div className={`world-listing ${selectedNote ? 'has-detail' : ''}`}>
                {getSubFolders(currentFolderId).length > 0 && (
                  <div className="world-section">
                    <h3 className="world-section-title">폴더</h3>
                    <div className="world-folder-grid">
                      {getSubFolders(currentFolderId).map(folder => (
                        <div key={folder.id} className="world-folder-card" onClick={() => { setCurrentFolderId(folder.id); setSelectedNote(null) }}>
                          <div className="folder-icon" style={{ background: folder.color }}>&#128193;</div>
                          <div className="folder-info">
                            <span className="folder-name">{folder.name}</span>
                            <span className="folder-count">{currentFolderNoteCount(folder.id)}개 노트</span>
                          </div>
                          <button className="delete-btn-sm" onClick={async e => { e.stopPropagation(); if (await confirm('이 폴더를 삭제하시겠습니까?')) markChanged() }} title="폴더 삭제">&#8854;</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {currentFolderId && (
                  <div className="world-section">
                    <h3 className="world-section-title">노트 ({getNotesInFolder(currentFolderId).length})</h3>
                    {getNotesInFolder(currentFolderId).length === 0 ? (
                      <div className="world-empty"><p>이 폴더에 노트가 없습니다.</p><button className="btn btn--ghost-sm">+ 첫 노트 작성하기</button></div>
                    ) : (
                      <div className="world-note-list">
                        {getNotesInFolder(currentFolderId).map(note => (
                          <div key={note.id} className={`world-note-item ${selectedNote?.id === note.id ? 'active' : ''}`} onClick={() => setSelectedNote(note)}>
                            <div className="note-item-icon">&#128196;</div>
                            <div className="note-item-info">
                              <span className="note-item-title">{note.title}</span>
                              <span className="note-item-preview">{note.content.slice(0, 50)}...</span>
                              <span className="note-item-date">수정: {note.updatedAt}</span>
                            </div>
                            <button className="delete-btn-sm" onClick={async e => { e.stopPropagation(); if (await confirm('이 노트를 삭제하시겠습니까?')) markChanged() }} title="노트 삭제">&#8854;</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {!currentFolderId && getSubFolders(null).length === 0 && (
                  <div className="world-empty-root"><p>세계관 폴더를 만들어 설정을 정리하세요.</p><button className="btn btn--primary btn--sm">+ 첫 폴더 만들기</button></div>
                )}
              </div>
              {selectedNote && (
                <div className="world-detail-panel">
                  <div className="detail-panel-header"><h2>{selectedNote.title}</h2><button className="detail-close" onClick={() => setSelectedNote(null)}>&times;</button></div>
                  <div className="detail-panel-meta"><span>생성: {selectedNote.createdAt}</span><span>수정: {selectedNote.updatedAt}</span></div>
                  <div className="detail-panel-body"><textarea className="detail-textarea" defaultValue={selectedNote.content} onChange={markChanged} placeholder="노트 내용을 작성하세요..." /></div>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'relations' && (
          <div className="relations-view">
            <div className="chapters-header">
              <h2>캐릭터 관계도</h2>
            </div>
            <RelationDiagram
              characters={characters}
              onSelectCharacter={char => setSelectedCharacter(char)}
              onUpdateRelation={(charId, relIndex, updates) => {
                setCharacters(prev => prev.map(c => {
                  if (c.id !== charId) return c
                  const newRels = [...c.relations]
                  newRels[relIndex] = { ...newRels[relIndex], ...updates }
                  return { ...c, relations: newRels }
                }))
                markChanged()
              }}
            />
          </div>
        )}

        {activeTab === 'glossary' && (
          <div className="glossary-view">
            <div className="chapters-header">
              <div className="glossary-title-row">
                <h2>용어집 ({glossary.length})</h2>
                <span className="glossary-pin-count">&#128204; 핀 고정 ({glossary.filter(g => g.pinned).length})</span>
                <span className="glossary-hint">집필 화면에서 핀 고정 용어가 하이라이트되어 클릭 시 설명을 볼 수 있습니다.</span>
              </div>
            </div>

            <div className="glossary-form">
              <div className="glossary-form-row">
                <input
                  className="glossary-term-input"
                  value={newTerm}
                  onChange={e => setNewTerm(e.target.value)}
                  placeholder="용어를 입력하세요..."
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newTerm.trim() && newTermDesc.trim()) {
                      setGlossary(prev => [...prev, { id: `g-${Date.now()}`, term: newTerm.trim(), description: newTermDesc.trim(), pinned: false }])
                      setNewTerm(''); setNewTermDesc(''); markChanged()
                    }
                  }}
                />
                <textarea
                  className="glossary-desc-input"
                  value={newTermDesc}
                  onChange={e => setNewTermDesc(e.target.value)}
                  placeholder="용어에 대한 설명..."
                  rows={2}
                />
                <button
                  className="btn btn--primary btn--sm"
                  disabled={!newTerm.trim() || !newTermDesc.trim()}
                  onClick={() => {
                    setGlossary(prev => [...prev, { id: `g-${Date.now()}`, term: newTerm.trim(), description: newTermDesc.trim(), pinned: false }])
                    setNewTerm(''); setNewTermDesc(''); markChanged()
                  }}
                >추가</button>
              </div>
            </div>

            <div className="glossary-list">
              {glossary.length === 0 ? (
                <div className="glossary-empty"><p>등록된 용어가 없습니다. 위 입력란에서 용어를 추가해보세요.</p></div>
              ) : (
                glossary.map(g => (
                  <div key={g.id} className={`glossary-item ${g.pinned ? 'pinned' : ''}`}>
                    <button
                      className={`glossary-pin ${g.pinned ? 'active' : ''}`}
                      onClick={() => {
                        setGlossary(prev => prev.map(t => t.id === g.id ? { ...t, pinned: !t.pinned } : t))
                        markChanged()
                      }}
                      title={g.pinned ? '핀 해제 — 집필 화면에서 하이라이트 숨김' : '핀 고정 — 집필 화면에서 하이라이트 표시'}
                    >
                      &#128204;
                    </button>
                    <div className="glossary-item-content">
                      <span className="glossary-item-term">{g.term}</span>
                      <span className="glossary-item-desc">{g.description}</span>
                    </div>
                    <button className="delete-btn-sm" onClick={async () => {
                      if (await confirm(`"${g.term}" 용어를 삭제하시겠습니까?`)) {
                        setGlossary(prev => prev.filter(t => t.id !== g.id)); markChanged()
                      }
                    }} title="용어 삭제">&#8854;</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Glossary Tooltip */}
      {glossaryTooltip && (
        <div className="glossary-tooltip-overlay" onClick={() => setGlossaryTooltip(null)}>
          <div
            className="glossary-tooltip"
            style={{ top: glossaryTooltip.y, left: glossaryTooltip.x }}
            onClick={e => e.stopPropagation()}
          >
            <div className="glossary-tooltip-header">
              <span className="glossary-tooltip-term">{glossaryTooltip.term}</span>
              <button className="glossary-tooltip-close" onClick={() => setGlossaryTooltip(null)}>&times;</button>
            </div>
            <p className="glossary-tooltip-desc">{glossaryTooltip.desc}</p>
          </div>
        </div>
      )}

      {/* Character Detail Overlay */}
      {selectedCharacter && (
        <CharacterDetail
          character={selectedCharacter}
          work={{ ...work, characters }}
          isNew={!characters.some(c => c.id === selectedCharacter.id)}
          onClose={() => setSelectedCharacter(null)}
          onSave={updated => {
            setCharacters(prev => {
              const exists = prev.some(c => c.id === updated.id)
              if (exists) return prev.map(c => c.id === updated.id ? updated : c)
              return [...prev, updated]
            })
            setSelectedCharacter(updated)
            markChanged()
          }}
        />
      )}
    </div>
  )
}
