import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SiriLogo } from './SiriLogo'

interface UserData {
  id: string
  name: string
  email: string
  avatar: string
  joinDate: string
  password: string
}

export function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser')
    if (loggedInUser) {
      navigate('/')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!isLogin && password !== confirmPassword) {
      setError('两次输入的密码不一致')
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      if (isLogin) {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const user = users.find((u: UserData) => u.email === email && u.password === password)
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user))
          alert('登录成功！')
          navigate('/')
        } else {
          setError('邮箱或密码错误')
        }
      } else {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const existingUser = users.find((u: UserData) => u.email === email)
        if (existingUser) {
          setError('该邮箱已被注册')
        } else {
          const newUser: UserData = {
            id: Date.now().toString(),
            name: email.split('@')[0],
            email,
            password,
            avatar: ['👤', '👨', '👩', '👨‍💻', '👩‍💻', '🤖'][Math.floor(Math.random() * 6)],
            joinDate: new Date().toISOString().split('T')[0],
          }
          users.push(newUser)
          localStorage.setItem('users', JSON.stringify(users))
          localStorage.setItem('currentUser', JSON.stringify(newUser))
          alert('注册成功！')
          navigate('/')
        }
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <SiriLogo size="medium" />
          <h1>Clipe</h1>
          <p>{isLogin ? '欢迎回来' : '创建账号'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              required
            />
          </div>

          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请确认密码"
                required
              />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="loading">
                <span className="spinner"></span>
                {isLogin ? '登录中...' : '注册中...'}
              </span>
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </button>
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </form>

        <div className="login-footer">
          <span>
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </span>
        </div>

        <div className="divider">
          <span>或</span>
        </div>

        <div className="social-login">
          <button className="social-btn wechat">
            <span>💬</span>
            <span>微信登录</span>
          </button>
          <button className="social-btn qq">
            <span>🐧</span>
            <span>QQ登录</span>
          </button>
        </div>
      </div>

      <style>{`
        .login-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slide-up 0.5s ease;
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .login-header h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          margin-top: 0.5rem;
        }

        .login-header p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.85rem;
        }

        .form-group input {
          padding: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          font-size: 0.9rem;
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.95);
        }

        .form-group input:focus {
          outline: none;
          border-color: rgba(102, 126, 234, 0.5);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .submit-btn {
          margin-top: 0.4rem;
          padding: 0.9rem;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.65rem;
          background: rgba(239, 68, 68, 0.15);
          border-radius: 8px;
          color: rgba(239, 68, 68, 0.9);
          font-size: 0.8rem;
          margin-top: 0.65rem;
        }

        .loading {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .toggle-btn {
          background: none;
          border: none;
          color: rgba(102, 126, 234, 0.9);
          font-weight: 600;
          cursor: pointer;
          margin-left: 0.2rem;
          font-size: inherit;
        }

        .toggle-btn:hover {
          text-decoration: underline;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin: 1.25rem 0;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .social-login {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .social-btn {
          padding: 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.85);
        }

        .social-btn:hover {
          border-color: rgba(102, 126, 234, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }

        .social-btn.wechat {
          color: rgba(7, 193, 96, 0.9);
        }

        .social-btn.qq {
          color: rgba(18, 183, 245, 0.9);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 1.75rem 1.25rem;
          }

          .social-login {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
