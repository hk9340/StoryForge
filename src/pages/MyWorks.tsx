import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SAMPLE_WORKS, type Work } from '../data/sampleData'
import './MyWorks.css'

export default function MyWorks() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [works, setWorks] = useState<Work[]>(SAMPLE_WORKS)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const deleteWork = (e: React.MouseEvent, workId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('이 작품을 삭제하시겠습니까?')) {
      setWorks(prev => prev.filter(w => w.id !== workId))
    }
  }

  if (!user) { navigate('/login'); return null }

  return (
    <div className="myworks-page">
      <header className="myworks-topbar">
        <Link to="/dashboard" className="back-btn">&larr; 대시보드</Link>
        <div className="myworks-topbar-right">
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="그리드">&#9638;</button>
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="리스트">&#9776;</button>
          </div>
          <Link to="/new-work" className="btn btn--primary btn--sm">+ 새 작품</Link>
        </div>
      </header>

      <main className="myworks-main">
        <h1>내 작품 ({works.length})</h1>

        {viewMode === 'grid' ? (
          <div className="myworks-grid">
            {works.map(work => (
              <Link to={`/works/${work.id}`} key={work.id} className="myworks-card">
                <div className="myworks-cover" style={work.coverImage ? { backgroundImage: `url(${work.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: work.coverColor }}>
                  {!work.coverImage && <span className="myworks-cover-icon">&#128214;</span>}
                </div>
                <div className="myworks-info">
                  <span className="myworks-genre">{work.genre}</span>
                  <h3>{work.title}</h3>
                  <p>{work.description}</p>
                  <div className="myworks-meta">
                    <span className="myworks-status">{work.status}</span>
                    <span>{work.chapters.length}챕터 &middot; {work.totalWords.toLocaleString()}자</span>
                  </div>
                </div>
                <button className="delete-btn" onClick={e => deleteWork(e, work.id)} title="작품 삭제">&#8854;</button>
              </Link>
            ))}
          </div>
        ) : (
          <div className="myworks-list">
            {works.map(work => (
              <Link to={`/works/${work.id}`} key={work.id} className="myworks-list-item">
                <div className="myworks-list-color" style={work.coverImage ? { backgroundImage: `url(${work.coverImage})`, backgroundSize: 'cover' } : { background: work.coverColor }} />
                <div className="myworks-list-info">
                  <h3>{work.title}</h3>
                  <p>{work.description}</p>
                </div>
                <div className="myworks-list-stats">
                  <span className="myworks-status">{work.status}</span>
                  <span>{work.genre}</span>
                  <span>{work.totalWords.toLocaleString()}자</span>
                </div>
                <button className="delete-btn" onClick={e => deleteWork(e, work.id)} title="작품 삭제">&#8854;</button>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
