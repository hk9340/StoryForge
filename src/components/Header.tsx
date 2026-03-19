import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">&#9998;</span>
          <span className="logo-text">StoryForge</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <span className={`hamburger ${menuOpen ? 'open' : ''}`} />
        </button>

        <nav className={`nav ${menuOpen ? 'nav--open' : ''}`}>
          <a href="#features">기능 소개</a>
          <a href="#preview">미리보기</a>
          <a href="#roadmap">로드맵</a>
          <Link to="/login" className="nav-btn nav-btn--outline">로그인</Link>
          <Link to="/signup" className="nav-btn nav-btn--primary">시작하기</Link>
        </nav>
      </div>
    </header>
  )
}
