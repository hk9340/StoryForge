import { Link } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Beta Coming Soon</span>
          <h1>당신의 이야기를<br />만들어가는 공간</h1>
          <p className="hero-desc">
            소설 집필부터 캐릭터 설정, 세계관 정리까지.<br />
            창작에 필요한 모든 도구를 한곳에서 만나보세요.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn--primary btn--lg">무료로 시작하기</Link>
            <a href="#features" className="btn btn--ghost btn--lg">기능 둘러보기 &darr;</a>
          </div>
          <p className="hero-note">회원가입 없이 체험 가능 &middot; 영원히 무료 플랜 제공</p>
        </div>
        <div className="hero-visual">
          <div className="editor-preview">
            <div className="editor-toolbar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="editor-title">제1장 - 새로운 시작</span>
            </div>
            <div className="editor-body">
              <p className="editor-text">
                <span className="line-num">1</span>
                어둠 속에서 한 줄기 빛이 스며들었다.
              </p>
              <p className="editor-text">
                <span className="line-num">2</span>
                그것은 오래 잊혀진 기억의 조각이었다.
              </p>
              <p className="editor-text">
                <span className="line-num">3</span>
                소녀는 천천히 눈을 떴다.
              </p>
              <p className="editor-text typing">
                <span className="line-num">4</span>
                창밖으로 보이는 세상은 어제와 달랐다.<span className="cursor">|</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-inner">
          <span className="section-label">핵심 기능</span>
          <h2>창작에 집중할 수 있도록</h2>
          <p className="section-desc">복잡한 도구 없이, 글쓰기에만 집중하세요.</p>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">&#128221;</div>
              <h3>몰입형 에디터</h3>
              <p>방해 없는 깔끔한 글쓰기 환경. 마크다운과 리치텍스트를 모두 지원합니다.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#128218;</div>
              <h3>작품 관리</h3>
              <p>챕터별 구성, 자동 저장, 버전 히스토리로 작품을 체계적으로 관리하세요.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#128100;</div>
              <h3>캐릭터 & 세계관</h3>
              <p>캐릭터 프로필, 관계도, 세계관 설정을 한곳에서 정리할 수 있습니다.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#128200;</div>
              <h3>집필 통계</h3>
              <p>일별 글자 수, 집필 시간, 목표 달성률을 한눈에 확인하세요.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#127760;</div>
              <h3>작품 공유</h3>
              <p>완성된 작품을 공개하고 다른 작가들과 피드백을 주고받으세요.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#128274;</div>
              <h3>안전한 보관</h3>
              <p>클라우드 동기화로 어디서든 안전하게 작품에 접근할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="preview" id="preview">
        <div className="section-inner">
          <span className="section-label">미리보기</span>
          <h2>이렇게 작동합니다</h2>
          <div className="preview-steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>새 작품 만들기</h3>
              <p>제목과 장르를 입력하고 바로 집필을 시작하세요.</p>
            </div>
            <div className="step-arrow">&#8594;</div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>자료 정리</h3>
              <p>캐릭터, 장소, 사건 등을 카드 형태로 정리합니다.</p>
            </div>
            <div className="step-arrow">&#8594;</div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>집필 & 공유</h3>
              <p>몰입 모드로 집필하고, 완성 후 공유하세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="roadmap" id="roadmap">
        <div className="section-inner">
          <span className="section-label">로드맵</span>
          <h2>앞으로의 계획</h2>
          <div className="roadmap-timeline">
            <div className="roadmap-item active">
              <div className="roadmap-dot" />
              <div className="roadmap-content">
                <span className="roadmap-phase">Phase 1</span>
                <h3>기본 플랫폼</h3>
                <p>회원가입, 에디터, 작품 관리, 자료실</p>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot" />
              <div className="roadmap-content">
                <span className="roadmap-phase">Phase 2</span>
                <h3>커뮤니티</h3>
                <p>작품 공유, 댓글, 피드백 시스템</p>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot" />
              <div className="roadmap-content">
                <span className="roadmap-phase">Phase 3</span>
                <h3>고급 기능</h3>
                <p>AI 글쓰기 보조, 공동 집필, 내보내기</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="feedback">
        <div className="section-inner">
          <h2>지금 바로 시작하세요</h2>
          <p>StoryForge와 함께 당신만의 이야기를 써보세요.</p>
          <Link to="/signup" className="btn btn--primary btn--lg">무료로 시작하기</Link>
        </div>
      </section>
    </main>
  )
}
