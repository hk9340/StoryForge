import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SAMPLE_WORKS, type Work } from '../data/sampleData'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [works, setWorks] = useState<Work[]>(SAMPLE_WORKS)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const deleteWork = (e: React.MouseEvent, workId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('이 작품을 삭제하시겠습니까?')) {
      setWorks(prev => prev.filter(w => w.id !== workId))
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  const totalWords = works.reduce((sum, w) => sum + w.totalWords, 0)
  const totalChapters = works.reduce((sum, w) => sum + w.chapters.length, 0)

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">&#9998; StoryForge</Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>&times;</button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link active">
            <span className="sidebar-icon">&#128200;</span> 대시보드
          </Link>
          <Link to="/my-works" className="sidebar-link">
            <span className="sidebar-icon">&#128214;</span> 내 작품
          </Link>
          <Link to="/new-work" className="sidebar-link">
            <span className="sidebar-icon">&#128221;</span> 새 작품 쓰기
          </Link>
          <Link to="/profile" className="sidebar-link">
            <span className="sidebar-icon">&#128100;</span> 프로필
          </Link>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{user.name[0]}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-username">{user.name}</span>
            <span className="sidebar-email">{user.email}</span>
          </div>
          <button className="sidebar-logout" onClick={() => { logout(); navigate('/'); }}>
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}>&#9776;</button>
          <div>
            <h1>안녕하세요, {user.name}님!</h1>
            <p>오늘도 좋은 이야기를 써볼까요?</p>
          </div>
        </header>

        {/* Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">&#128214;</span>
            <div className="stat-info">
              <span className="stat-value">{works.length}</span>
              <span className="stat-label">작품 수</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#128196;</span>
            <div className="stat-info">
              <span className="stat-value">{totalChapters}</span>
              <span className="stat-label">총 챕터</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#9999;&#65039;</span>
            <div className="stat-info">
              <span className="stat-value">{totalWords.toLocaleString()}</span>
              <span className="stat-label">총 글자 수</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#128293;</span>
            <div className="stat-info">
              <span className="stat-value">3일</span>
              <span className="stat-label">연속 집필</span>
            </div>
          </div>
        </section>

        {/* Works */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>내 작품</h2>
            <Link to="/new-work" className="btn btn--primary btn--sm">+ 새 작품</Link>
          </div>
          <div className="works-carousel">
            {works.map(work => (
              <Link to={`/works/${work.id}`} key={work.id} className="work-card">
                <div className="work-cover" style={work.coverImage ? { backgroundImage: `url(${work.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: work.coverColor }}>
                  {!work.coverImage && <span className="work-cover-icon">&#128214;</span>}
                </div>
                <div className="work-info">
                  <span className="work-genre">{work.genre}</span>
                  <h3>{work.title}</h3>
                  <p>{work.description}</p>
                  <div className="work-meta">
                    <span className="work-status">{work.status}</span>
                    <span>{work.chapters.length}챕터 &middot; {work.totalWords.toLocaleString()}자</span>
                  </div>
                </div>
                <button className="delete-btn" onClick={e => deleteWork(e, work.id)} title="작품 삭제">&#128465;</button>
              </Link>
            ))}

            <Link to="/new-work" className="work-card work-card--new">
              <div className="work-new-inner">
                <span className="work-new-icon">+</span>
                <p>새 작품 시작하기</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="dashboard-section">
          <h2>최근 활동</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-dot" />
              <div className="activity-content">
                <p><strong>별이 잠든 숲</strong> - "제1장 - 숲의 입구" 198자 작성</p>
                <span className="activity-time">오늘 오전 10:30</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-dot" />
              <div className="activity-content">
                <p><strong>별이 잠든 숲</strong> - 캐릭터 "루미" 프로필 추가</p>
                <span className="activity-time">오늘 오전 9:15</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-dot" />
              <div className="activity-content">
                <p><strong>카페, 오후 세시</strong> - 새 작품 생성</p>
                <span className="activity-time">어제 오후 3:00</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
