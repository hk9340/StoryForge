import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SAMPLE_WORKS, type WorldNote, type WorldFolder } from '../data/sampleData'
import './WorkDetail.css'

type Tab = 'write' | 'chapters' | 'characters' | 'world'
type SortMode = 'name' | 'created' | 'updated'

export default function WorkDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('write')
  const [activeChapter, setActiveChapter] = useState(0)

  // World tab state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('name')
  const [selectedNote, setSelectedNote] = useState<WorldNote | null>(null)

  if (!user) { navigate('/login'); return null }

  const work = SAMPLE_WORKS.find(w => w.id === id)
  if (!work) return <div className="not-found">작품을 찾을 수 없습니다.</div>

  const chapter = work.chapters[activeChapter]
  const [editorContent, setEditorContent] = useState(chapter?.content || '')

  // World helpers
  const getSubFolders = (parentId: string | null): WorldFolder[] => {
    const folders = work.worldFolders.filter(f => f.parentId === parentId)
    return sortFolders(folders)
  }

  const getNotesInFolder = (folderId: string): WorldNote[] => {
    const notes = work.worldNotes.filter(n => n.folderId === folderId)
    return sortNotes(notes)
  }

  const sortFolders = (folders: WorldFolder[]) => {
    return [...folders].sort((a, b) => {
      if (sortMode === 'name') return a.name.localeCompare(b.name, 'ko')
      return a.createdAt.localeCompare(b.createdAt)
    })
  }

  const sortNotes = (notes: WorldNote[]) => {
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
          <span className="save-status">자동 저장됨</span>
          <button className="btn btn--primary btn--sm">저장</button>
        </div>
      </header>

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
        <button className={`work-tab ${activeTab === 'world' ? 'active' : ''}`} onClick={() => { setActiveTab('world'); setSelectedNote(null) }}>
          &#127760; 세계관
        </button>
      </div>

      {/* Content */}
      <div className="work-content">
        {activeTab === 'write' && (
          <div className="editor-layout">
            <aside className="chapter-sidebar">
              <h3>챕터 목록</h3>
              {work.chapters.map((ch, i) => (
                <button
                  key={ch.id}
                  className={`chapter-item ${i === activeChapter ? 'active' : ''}`}
                  onClick={() => { setActiveChapter(i); setEditorContent(work.chapters[i].content) }}
                >
                  <span className="chapter-title">{ch.title}</span>
                  <span className="chapter-words">{ch.wordCount}자</span>
                </button>
              ))}
              <button className="chapter-item chapter-add">+ 새 챕터</button>
            </aside>

            <div className="editor-area">
              <div className="editor-chapter-title">{chapter?.title}</div>
              <textarea
                className="editor-textarea"
                value={editorContent}
                onChange={e => setEditorContent(e.target.value)}
                placeholder="이야기를 시작하세요..."
              />
              <div className="editor-footer">
                <span>{editorContent.length}자</span>
                <span>챕터 {activeChapter + 1} / {work.chapters.length}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chapters' && (
          <div className="chapters-view">
            <div className="chapters-header">
              <h2>전체 챕터</h2>
              <button className="btn btn--primary btn--sm">+ 새 챕터 추가</button>
            </div>
            <div className="chapters-list">
              {work.chapters.map((ch, i) => (
                <div key={ch.id} className="chapter-card" onClick={() => { setActiveChapter(i); setActiveTab('write'); setEditorContent(ch.content) }}>
                  <div className="chapter-card-num">{i + 1}</div>
                  <div className="chapter-card-info">
                    <h3>{ch.title}</h3>
                    <p>{ch.content ? ch.content.slice(0, 80) + '...' : '아직 작성되지 않았습니다.'}</p>
                    <div className="chapter-card-meta">
                      <span>{ch.wordCount}자</span>
                      <span>수정: {ch.updatedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="characters-view">
            <div className="chapters-header">
              <h2>캐릭터 ({work.characters.length})</h2>
              <button className="btn btn--primary btn--sm">+ 캐릭터 추가</button>
            </div>
            <div className="character-grid">
              {work.characters.map(char => (
                <div key={char.id} className="character-card">
                  <div className="character-avatar">{char.name[0]}</div>
                  <h3>{char.name}</h3>
                  <span className="character-role">{char.role}</span>
                  <p>{char.description}</p>
                  <div className="character-tags">
                    {char.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'world' && (
          <div className="world-view">
            {/* Header with breadcrumb & controls */}
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
              {/* Folder & Note listing */}
              <div className={`world-listing ${selectedNote ? 'has-detail' : ''}`}>
                {/* Subfolders */}
                {getSubFolders(currentFolderId).length > 0 && (
                  <div className="world-section">
                    <h3 className="world-section-title">폴더</h3>
                    <div className="world-folder-grid">
                      {getSubFolders(currentFolderId).map(folder => (
                        <button
                          key={folder.id}
                          className="world-folder-card"
                          onClick={() => { setCurrentFolderId(folder.id); setSelectedNote(null) }}
                        >
                          <div className="folder-icon" style={{ background: folder.color }}>&#128193;</div>
                          <div className="folder-info">
                            <span className="folder-name">{folder.name}</span>
                            <span className="folder-count">{currentFolderNoteCount(folder.id)}개 노트</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes in current folder */}
                {currentFolderId && (
                  <div className="world-section">
                    <h3 className="world-section-title">
                      노트 ({getNotesInFolder(currentFolderId).length})
                    </h3>
                    {getNotesInFolder(currentFolderId).length === 0 ? (
                      <div className="world-empty">
                        <p>이 폴더에 노트가 없습니다.</p>
                        <button className="btn btn--ghost-sm">+ 첫 노트 작성하기</button>
                      </div>
                    ) : (
                      <div className="world-note-list">
                        {getNotesInFolder(currentFolderId).map(note => (
                          <button
                            key={note.id}
                            className={`world-note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                            onClick={() => setSelectedNote(note)}
                          >
                            <div className="note-item-icon">&#128196;</div>
                            <div className="note-item-info">
                              <span className="note-item-title">{note.title}</span>
                              <span className="note-item-preview">{note.content.slice(0, 50)}...</span>
                              <span className="note-item-date">수정: {note.updatedAt}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Root level: show all folders prompt */}
                {!currentFolderId && getSubFolders(null).length === 0 && (
                  <div className="world-empty-root">
                    <p>세계관 폴더를 만들어 설정을 정리하세요.</p>
                    <button className="btn btn--primary btn--sm">+ 첫 폴더 만들기</button>
                  </div>
                )}
              </div>

              {/* Note detail panel */}
              {selectedNote && (
                <div className="world-detail-panel">
                  <div className="detail-panel-header">
                    <h2>{selectedNote.title}</h2>
                    <button className="detail-close" onClick={() => setSelectedNote(null)}>&times;</button>
                  </div>
                  <div className="detail-panel-meta">
                    <span>생성: {selectedNote.createdAt}</span>
                    <span>수정: {selectedNote.updatedAt}</span>
                  </div>
                  <div className="detail-panel-body">
                    <textarea
                      className="detail-textarea"
                      defaultValue={selectedNote.content}
                      placeholder="노트 내용을 작성하세요..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
