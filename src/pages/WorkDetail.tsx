import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SAMPLE_WORKS } from '../data/sampleData'
import './WorkDetail.css'

type Tab = 'write' | 'chapters' | 'characters' | 'world'

export default function WorkDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('write')
  const [activeChapter, setActiveChapter] = useState(0)

  if (!user) { navigate('/login'); return null }

  const work = SAMPLE_WORKS.find(w => w.id === id)
  if (!work) return <div className="not-found">작품을 찾을 수 없습니다.</div>

  const chapter = work.chapters[activeChapter]
  const [editorContent, setEditorContent] = useState(chapter?.content || '')

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
        <button className={`work-tab ${activeTab === 'world' ? 'active' : ''}`} onClick={() => setActiveTab('world')}>
          &#127760; 세계관
        </button>
      </div>

      {/* Content */}
      <div className="work-content">
        {activeTab === 'write' && (
          <div className="editor-layout">
            {/* Chapter sidebar */}
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

            {/* Editor */}
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
            <div className="chapters-header">
              <h2>세계관 노트 ({work.worldNotes.length})</h2>
              <button className="btn btn--primary btn--sm">+ 노트 추가</button>
            </div>
            <div className="world-notes">
              {work.worldNotes.map((note, i) => (
                <div key={i} className="world-note-card">
                  <div className="world-note-icon">&#128205;</div>
                  <p>{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
