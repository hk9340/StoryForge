import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SAMPLE_WORKS } from '../data/sampleData'
import './Profile.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'settings'>('overview')

  if (!user) { navigate('/login'); return null }

  const works = SAMPLE_WORKS
  const totalWords = works.reduce((sum, w) => sum + w.totalWords, 0)

  return (
    <div className="profile-page">
      <header className="profile-topbar">
        <Link to="/dashboard" className="back-btn">&larr; 대시보드</Link>
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            프로필
          </button>
          <button
            className={`profile-tab ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            설정
          </button>
        </div>
      </header>

      <main className="profile-main">
        {activeSection === 'overview' && (
          <>
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-avatar-lg">{user.name[0]}</div>
              <h1>{user.name}</h1>
              <p className="profile-bio">{user.bio}</p>
              <div className="profile-stats-row">
                <div className="profile-stat">
                  <span className="profile-stat-val">{works.length}</span>
                  <span className="profile-stat-label">작품</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val">{totalWords.toLocaleString()}</span>
                  <span className="profile-stat-label">총 글자수</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-val">{user.joinDate}</span>
                  <span className="profile-stat-label">가입일</span>
                </div>
              </div>
            </div>

            {/* Works list */}
            <div className="profile-section">
              <h2>내 작품</h2>
              <div className="profile-works">
                {works.map(work => (
                  <Link to={`/works/${work.id}`} key={work.id} className="profile-work-item">
                    <div className="profile-work-color" style={{ background: work.coverColor }} />
                    <div className="profile-work-info">
                      <h3>{work.title}</h3>
                      <span>{work.genre} &middot; {work.status} &middot; {work.totalWords.toLocaleString()}자</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === 'settings' && (
          <div className="settings-section">
            <h2>계정 설정</h2>

            <div className="settings-group">
              <label>닉네임</label>
              <input type="text" defaultValue={user.name} />
            </div>

            <div className="settings-group">
              <label>이메일</label>
              <input type="email" defaultValue={user.email} disabled />
              <span className="settings-hint">이메일은 변경할 수 없습니다</span>
            </div>

            <div className="settings-group">
              <label>자기소개</label>
              <textarea defaultValue={user.bio} rows={3} />
            </div>

            <div className="settings-group">
              <label>테마</label>
              <select defaultValue="light">
                <option value="light">라이트 모드</option>
                <option value="dark">다크 모드 (준비 중)</option>
              </select>
            </div>

            <div className="settings-actions">
              <button className="btn btn--primary btn--sm">저장</button>
              <button className="btn btn--danger btn--sm" onClick={() => { logout(); navigate('/') }}>로그아웃</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
