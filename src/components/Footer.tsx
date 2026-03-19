import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">&#9998; StoryForge</span>
          <p>당신의 이야기를 만들어가는 공간</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>서비스</h4>
            <a href="#features">기능 소개</a>
            <a href="#roadmap">로드맵</a>
          </div>
          <div className="footer-col">
            <h4>지원</h4>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#feedback">피드백</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 StoryForge. Built with React + TypeScript.</p>
      </div>
    </footer>
  )
}
