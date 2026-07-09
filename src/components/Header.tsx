import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SiriLogo } from './SiriLogo'

interface HeaderProps {
  currentStep?: 'upload' | 'detect' | 'edit' | 'export'
  connectionStatus?: 'online' | 'offline'
  questionCount?: number
  onStepClick?: (step: 'upload' | 'detect' | 'edit' | 'export') => void
}

export function Header({ currentStep = 'upload', connectionStatus = 'online', questionCount = 0, onStepClick }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateInfo, setDateInfo] = useState({ year: '', month: '', day: '', weekday: '' })
  const [userData, setUserData] = useState({ name: '用户', avatar: '👤', email: 'user@example.com' })
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  const [stepPos, setStepPos] = useState({ x: 50, y: 96 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const stepRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateDate = () => {
      const now = new Date()
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      setDateInfo({
        year: now.getFullYear().toString(),
        month: String(now.getMonth() + 1).padStart(2, '0'),
        day: String(now.getDate()).padStart(2, '0'),
        weekday: weekdays[now.getDay()],
      })
    }
    updateDate()

    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setUserData(JSON.parse(currentUser))
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !stepRef.current) return
      
      const rect = stepRef.current.getBoundingClientRect()
      const newX = Math.max(20, Math.min(window.innerWidth - rect.width - 20, e.clientX - dragOffset.current.x))
      const newY = Math.max(100, Math.min(window.innerHeight - rect.height - 20, e.clientY - dragOffset.current.y))
      
      setStepPos({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleDragStart = (e: React.MouseEvent) => {
    if (!stepRef.current) return
    const rect = stepRef.current.getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    setIsDragging(true)
  }

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      if (searchTerm.includes('题库') || searchTerm.includes('题')) {
        navigate('/library')
      } else if (searchTerm.includes('历史') || searchTerm.includes('记录')) {
        navigate('/history')
      } else {
        navigate('/workspace')
      }
      setSearchTerm('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  const steps = [
    { id: 'upload', label: '上传', icon: '📤' },
    { id: 'detect', label: '识别', icon: '🔍' },
    { id: 'edit', label: '编辑', icon: '✏️' },
    { id: 'export', label: '导出', icon: '📥' },
  ]

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/workspace', label: '拆题' },
    { path: '/library', label: '题库' },
    { path: '/history', label: '历史' },
  ]

  const userMenuItems = [
    { icon: '🏠', label: '个人空间', path: '/profile' },
    { icon: '⚙️', label: '账号设置', path: '/settings' },
    { icon: '📊', label: '使用统计', path: '/stats' },
    { icon: '', label: '退出登录', action: 'logout' },
  ]

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <SiriLogo size="small" />
        </Link>
      </div>

      <nav className="header-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-center">
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜索题目、功能..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="header-right">
        <div className="date-display">
          <div className="date-year">
            <span className="date-num">{dateInfo.year}</span>
            <span className="date-unit">年</span>
          </div>
          <div className="date-month">
            <span className="date-num">{dateInfo.month}</span>
            <span className="date-unit">月</span>
          </div>
          <div className="date-day">
            <span className="date-num">{dateInfo.day}</span>
            <span className="date-unit">日</span>
          </div>
          <div className="date-weekday">{dateInfo.weekday}</div>
        </div>

        <div className={`connection-status ${connectionStatus}`}>
          <span className="status-dot"></span>
          <span>{connectionStatus === 'online' ? '在线' : '离线'}</span>
        </div>

        {questionCount > 0 && (
          <div className="question-count">
            <span className="count-icon">📝</span>
            <span>{questionCount} 题</span>
          </div>
        )}

        <div className="user-menu-container" ref={userMenuRef}>
          <button
            className={`user-profile ${isUserMenuOpen ? 'open' : ''}`}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <span className="avatar">{userData.avatar}</span>
            <span className="user-name-mini">{userData.name}</span>
            <span className="user-arrow">▼</span>
          </button>

          {isUserMenuOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-info">
                  <span className="user-avatar">{userData.avatar}</span>
                  <div className="user-details">
                    <span className="user-name">{userData.name}</span>
                    <span className="user-email">{userData.email}</span>
                  </div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              {userMenuItems.map((item) => (
                item.action === 'logout' ? (
                  <button
                    key={item.label}
                    className="dropdown-item logout"
                    onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-label">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path!}
                    className="dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-label">{item.label}</span>
                  </Link>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span className="menu-icon">☰</span>
      </button>

      {isMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mobile-search-bar">
            <input
              type="text"
              placeholder="搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      )}

      {location.pathname === '/workspace' && (
        <div 
          ref={stepRef}
          className="step-indicator"
          style={{ left: `${stepPos.x}px`, top: `${stepPos.y}px` }}
          onMouseDown={handleDragStart}
        >
          <div className="step-drag-handle">⋮⋮</div>
          <div className="step-progress">
            {steps.map((step, index) => {
              const stepIndex = steps.findIndex((s) => s.id === currentStep)
              const isCompleted = index < stepIndex
              const isActive = step.id === currentStep
              const isClickable = index <= stepIndex
              return (
                <div
                  key={step.id}
                  className={`step-item ${isClickable ? 'clickable' : ''}`}
                  onClick={() => isClickable && onStepClick?.(step.id as 'upload' | 'detect' | 'edit' | 'export')}
                >
                  <div className={`step-icon ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    {step.icon}
                  </div>
                  <span className="step-name">{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999999;
          background: #FFFFFF;
          padding: 0.75rem 2rem;
          border-bottom: 1px solid #E7ECEF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          box-shadow: 0 1px 3px rgba(2, 128, 129, 0.06);
          height: 72px;
          box-sizing: border-box;
        }

        .header-left {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          gap: 1.5rem;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          color: inherit;
        }

        .header-nav {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }

        .nav-item {
          color: #6B7280;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.55rem 1.25rem;
          border-radius: 12px;
          transition: all 0.2s ease;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          min-width: 70px;
        }

        .nav-item:hover {
          background: #F2FCFC;
          color: #028081;
        }

        .nav-item.active {
          background: #06B2B5;
          color: #FFFFFF;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.25);
        }

        .header-center {
          flex: 0 1 420px;
          display: flex;
          justify-content: center;
        }

        .search-bar {
          position: relative;
          width: 100%;
        }

        .search-input {
          width: 100%;
          padding: 0.65rem 2.2rem 0.65rem 1.2rem;
          border: 1px solid #E7ECEF;
          border-radius: 12px;
          font-size: 0.92rem;
          background: #FCFDFD;
          color: #1F2937;
          outline: none;
          transition: all 0.2s ease;
          height: 40px;
        }

        .search-input::placeholder {
          color: #9CA3AF;
        }

        .search-input:focus {
          border-color: #06B2B5;
          box-shadow: 0 0 0 3px rgba(6, 178, 181, 0.1);
        }

        .search-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          color: #9CA3AF;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .date-display {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #F8FAFB;
          padding: 0.5rem 0.9rem;
          border-radius: 12px;
          border: 1px solid #E7ECEF;
        }

        .date-year, .date-month, .date-day {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 36px;
        }

        .date-num {
          font-size: 1rem;
          font-weight: 700;
          color: #1F2937;
          line-height: 1;
        }

        .date-unit {
          font-size: 0.65rem;
          color: #6B7280;
          margin-top: 0.1rem;
        }

        .date-weekday {
          color: #6B7280;
          margin-left: 0.6rem;
          font-size: 0.85rem;
          font-weight: 500;
          padding-left: 0.6rem;
          border-left: 1px solid #E7ECEF;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: #6B7280;
          padding: 0.4rem 0.75rem;
          border-radius: 10px;
          background: #F8FAFB;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22C55E;
          animation: status-pulse 2s ease-in-out infinite;
        }

        .connection-status.offline .status-dot {
          background: #EF4444;
        }

        @keyframes status-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .question-count {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #F2FCFC;
          padding: 0.5rem 0.9rem;
          border-radius: 12px;
          font-size: 0.9rem;
          color: #028081;
          font-weight: 600;
          border: 1px solid #CFEFEF;
        }

        .count-icon {
          font-size: 1rem;
        }

        .user-menu-container {
          position: relative;
          z-index: 1000000;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.65rem;
          border-radius: 16px;
          background: #F8FAFB;
          border: 1px solid #E7ECEF;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #4B5563;
        }

        .user-profile:hover, .user-profile.open {
          background: #F2FCFC;
          border-color: #CFEFEF;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.1);
        }

        .avatar {
          font-size: 1.25rem;
        }

        .user-name-mini {
          font-size: 0.92rem;
          font-weight: 600;
        }

        .user-arrow {
          font-size: 0.65rem;
          color: #9CA3AF;
          transition: transform 0.2s ease;
        }

        .user-profile.open .user-arrow {
          transform: rotate(180deg);
        }

        .user-dropdown {
          position: fixed;
          top: 70px;
          right: 1.5rem;
          min-width: 240px;
          background: #FCFDFD;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(2, 128, 129, 0.08);
          overflow: hidden;
          z-index: 9999999;
          animation: dropdown-appear 0.2s ease;
          border: 1px solid #E7ECEF;
        }

        @keyframes dropdown-appear {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dropdown-header {
          padding: 1.2rem;
          background: linear-gradient(135deg, #06B2B5 0%, #04999C 100%);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          color: #FFFFFF;
          font-weight: 700;
          font-size: 1rem;
        }

        .user-email {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
        }

        .dropdown-divider {
          height: 1px;
          background: #EDF2F4;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.85rem;
          padding: 0.9rem 1.2rem;
          text-decoration: none;
          color: #4B5563;
          transition: all 0.15s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 0.92rem;
        }

        .dropdown-item:hover {
          background: #F2FCFC;
        }

        .dropdown-item.logout {
          color: #EF4444;
        }

        .dropdown-item.logout:hover {
          background: rgba(239, 68, 68, 0.08);
        }

        .item-icon {
          font-size: 1.15rem;
        }

        .item-label {
          font-size: 0.92rem;
          font-weight: 500;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: 1px solid #E7ECEF;
          border-radius: 10px;
          color: #4B5563;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0.5rem 0.6rem;
          transition: all 0.2s;
        }

        .mobile-menu-btn:hover {
          background: #F2FCFC;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          background: #FCFDFD;
          padding: 1rem;
          flex-direction: column;
          gap: 0.4rem;
          box-shadow: 0 4px 16px rgba(2, 128, 129, 0.06);
          border-radius: 0 0 16px 16px;
          z-index: 9999998;
          border-top: 1px solid #E7ECEF;
        }

        .mobile-nav-item {
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #4B5563;
          border-radius: 12px;
          transition: all 0.15s ease;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .mobile-nav-item:hover {
          background: #F2FCFC;
        }

        .mobile-nav-item.active {
          background: #06B2B5;
          color: #FFFFFF;
        }

        .mobile-search-bar {
          margin-top: 0.5rem;
          padding-top: 0.8rem;
          border-top: 1px solid #EDF2F4;
        }

        .mobile-search-bar input {
          width: 100%;
          padding: 0.7rem 1rem;
          border: 1px solid #E7ECEF;
          border-radius: 12px;
          font-size: 0.92rem;
          background: #FCFDFD;
          color: #1F2937;
        }

        .step-indicator {
          position: fixed;
          z-index: 999998;
          cursor: move;
          background: #FCFDFD;
          border-radius: 16px;
          border: 1px solid #E7ECEF;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
          overflow: hidden;
          display: flex;
          align-items: center;
          transition: box-shadow 0.2s;
        }

        .step-indicator:hover {
          box-shadow: 0 8px 32px rgba(2, 128, 129, 0.12);
        }

        .step-indicator:active {
          cursor: grabbing;
          box-shadow: 0 12px 40px rgba(2, 128, 129, 0.15);
        }

        .step-drag-handle {
          padding: 0.7rem 0.6rem;
          color: #9CA3AF;
          font-size: 0.8rem;
          cursor: grab;
          display: flex;
          align-items: center;
          border-right: 1px solid #EDF2F4;
        }

        .step-drag-handle:hover {
          color: #06B2B5;
        }

        .step-progress {
          display: flex;
          gap: 1rem;
          padding: 0.6rem 1.2rem;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          cursor: default;
        }

        .step-item.clickable {
          cursor: pointer;
        }

        .step-item.clickable:hover .step-icon {
          transform: scale(1.1);
        }

        .step-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #F8FAFB;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.2s ease;
          color: #6B7280;
        }

        .step-icon.active {
          background: #06B2B5;
          color: #FFFFFF;
          box-shadow: 0 0 16px rgba(6, 178, 181, 0.35);
        }

        .step-icon.completed {
          background: #F2FCFC;
          color: #028081;
          border: 2px solid #A7E4E4;
        }

        .step-name {
          font-size: 0.78rem;
          color: #6B7280;
          font-weight: 500;
        }

        @media (max-width: 1200px) {
          .header-nav {
            display: none;
          }

          .header-center {
            flex: 0 1 300px;
          }

          .date-display {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-menu {
            display: flex;
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 0.6rem 1rem;
            gap: 1rem;
            height: 64px;
          }

          .header-center {
            display: none;
          }

          .question-count {
            display: none;
          }

          .user-name-mini {
            display: none;
          }

          .step-indicator {
            display: none;
          }

          .mobile-menu {
            top: 64px;
          }
        }
      `}</style>
    </header>
  )
}