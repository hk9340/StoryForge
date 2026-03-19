import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './NewWork.css'

const GENRES = ['판타지', '로맨스', 'SF', '미스터리', '호러', '일상/에세이', '무협', '역사', '기타']
const COVER_COLORS = ['#6C63FF', '#FF6584', '#00B894', '#FF9F43', '#E17055', '#00CEC9', '#A29BFE', '#636E72', '#FECA57', '#2D3436']

export default function NewWork() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [coverColor, setCoverColor] = useState(COVER_COLORS[0])
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setCoverImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const removeCoverImage = () => {
    setCoverImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (!user) { navigate('/login'); return null }

  const handleCreate = () => {
    if (!title.trim()) return
    // In real app: save to backend, get ID, navigate to work
    navigate('/dashboard')
  }

  return (
    <div className="newwork-page">
      <header className="newwork-topbar">
        <Link to="/dashboard" className="back-btn">&larr; 대시보드</Link>
      </header>

      <main className="newwork-main">
        <div className="newwork-card">
          <h1>새 작품 시작하기</h1>
          <p className="newwork-subtitle">새로운 이야기를 시작해보세요</p>

          <div className="newwork-form">
            <div className="newwork-group">
              <label>작품 제목</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="작품의 제목을 입력하세요"
                autoFocus
              />
            </div>

            <div className="newwork-group">
              <label>장르</label>
              <select value={genre} onChange={e => setGenre(e.target.value)}>
                <option value="">장르를 선택하세요</option>
                {GENRES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="newwork-group">
              <label>표지</label>
              {coverImage ? (
                <div className="cover-image-preview">
                  <img src={coverImage} alt="표지" />
                  <button className="cover-image-remove" onClick={removeCoverImage}>&times; 이미지 제거</button>
                </div>
              ) : (
                <>
                  <div className="cover-colors">
                    {COVER_COLORS.map(c => (
                      <button
                        key={c}
                        className={`cover-color-btn ${coverColor === c ? 'selected' : ''}`}
                        style={{ background: c }}
                        onClick={() => setCoverColor(c)}
                      />
                    ))}
                  </div>
                  <button className="cover-upload-btn" onClick={() => fileInputRef.current?.click()}>
                    &#128247; 이미지 업로드
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} hidden />
                </>
              )}
            </div>

            <div className="newwork-group">
              <label>작품 소개 (선택)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="작품에 대한 간단한 소개를 적어주세요..."
                rows={3}
              />
            </div>

            {/* Preview */}
            <div className="newwork-preview">
              <div className="newwork-preview-cover" style={coverImage ? { backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: coverColor }}>
                {!coverImage && <span>&#128214;</span>}
              </div>
              <div className="newwork-preview-info">
                <span className="newwork-preview-genre">{genre || '장르 미선택'}</span>
                <h3>{title || '작품 제목'}</h3>
                <p>{description || '작품 소개가 여기에 표시됩니다.'}</p>
              </div>
            </div>

            <div className="newwork-actions">
              <button className="btn btn--primary btn--lg" onClick={handleCreate} disabled={!title.trim()}>
                작품 생성하기
              </button>
              <Link to="/dashboard" className="btn btn--ghost btn--lg">취소</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
