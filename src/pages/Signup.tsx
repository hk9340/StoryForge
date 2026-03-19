import { Link } from 'react-router-dom'
import './Auth.css'

export default function Signup() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">&#9998; StoryForge</Link>
        <h1>새로운 이야기의 시작</h1>
        <p className="auth-subtitle">무료 계정을 만들고 창작을 시작하세요</p>

        <form className="auth-form" onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">닉네임</label>
            <input type="text" id="name" placeholder="작가명을 입력하세요" />
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input type="password" id="password" placeholder="8자 이상 입력하세요" />
          </div>
          <button type="submit" className="btn btn--primary btn--full">회원가입</button>
        </form>

        <p className="auth-switch">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  )
}
