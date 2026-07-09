import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface UserData {
  id: string
  name: string
  email: string
  avatar: string
  joinDate: string
  password?: string
}

interface FormData {
  name: string
  email: string
  avatar: string
  password: string
  confirmPassword: string
}

const settingsSections = [
  { id: 'account', label: '账号', icon: '👤' },
  { id: 'appearance', label: '外观', icon: '🎨' },
  { id: 'notifications', label: '通知', icon: '🔔' },
  { id: 'about', label: '关于', icon: 'ℹ️' },
]

export function Settings() {
  const [activeSection, setActiveSection] = useState<'account' | 'appearance' | 'notifications' | 'about'>('account')
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: '用户',
    email: 'user@example.com',
    avatar: '👤',
    joinDate: '2024-01-15',
  })
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    avatar: '',
    password: '',
    confirmPassword: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      setUserData(user)
      setFormData({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        password: '',
        confirmPassword: '',
      })
    }
  }, [])

  const handleSave = () => {
    setIsSaving(true)

    setTimeout(() => {
      if (formData.password && formData.password !== formData.confirmPassword) {
        alert('两次输入的密码不一致')
        setIsSaving(false)
        return
      }

      const updatedUser: UserData = {
        ...userData,
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        ...(formData.password && { password: formData.password }),
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex((u: UserData) => u.id === userData.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem('users', JSON.stringify(users))
      }

      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setUserData(updatedUser)
      setIsSaving(false)
      alert('设置已保存')
    }, 1000)
  }

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <div className="sidebar-header">
          <h2>⚙️ 设置</h2>
        </div>
        <nav className="sidebar-nav">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id as typeof activeSection)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="settings-content">
        {activeSection === 'account' && (
          <div className="section-card">
            <div className="section-header">
              <h3>👤 账号设置</h3>
              <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? '保存中...' : '保存'}
              </button>
            </div>

            <div className="form-group">
              <label>用户名</label>
              <input type="text" defaultValue="用户" className="form-input" />
            </div>

            <div className="form-group">
              <label>邮箱</label>
              <input type="email" defaultValue="user@example.com" className="form-input" />
            </div>

            <div className="form-group">
              <label>新密码</label>
              <input type="password" placeholder="请输入新密码" className="form-input" />
            </div>

            <div className="form-group">
              <label>确认密码</label>
              <input type="password" placeholder="请确认新密码" className="form-input" />
            </div>

            <div className="form-group">
              <label>头像</label>
              <div className="avatar-options">
                {['👤', '👨', '👩', '👨‍💻', '👩‍💻', '🤖'].map((avatar) => (
                  <button key={avatar} className="avatar-option" title={avatar}>
                    <span>{avatar}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="danger-zone">
              <h4>⚠️ 危险区域</h4>
              <button className="danger-btn">
                删除账号
              </button>
              <p className="danger-hint">此操作不可撤销，请谨慎操作</p>
            </div>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="section-card">
            <div className="section-header">
              <h3>🎨 外观设置</h3>
              <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? '保存中...' : '保存'}
              </button>
            </div>

            <div className="form-group">
              <label>主题</label>
              <div className="theme-options">
                <button className="theme-option active" title="浅色">
                  <div className="theme-preview light"></div>
                  <span>浅色</span>
                </button>
                <button className="theme-option" title="深色">
                  <div className="theme-preview dark"></div>
                  <span>深色</span>
                </button>
                <button className="theme-option" title="跟随系统">
                  <div className="theme-preview system"></div>
                  <span>系统</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>语言</label>
              <select className="form-input">
                <option>中文 (简体)</option>
                <option>English</option>
              </select>
            </div>

            <div className="form-group">
              <label>字体大小</label>
              <div className="font-size-slider">
                <input type="range" min="12" max="18" defaultValue="14" />
                <span>14px</span>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="section-card">
            <div className="section-header">
              <h3>🔔 通知设置</h3>
              <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? '保存中...' : '保存'}
              </button>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <span className="notification-title">拆题完成通知</span>
                <span className="notification-desc">当试卷拆题完成时发送通知</span>
              </div>
              <div className="toggle">
                <input type="checkbox" id="notify-detect" defaultChecked />
                <label htmlFor="notify-detect"></label>
              </div>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <span className="notification-title">导出完成通知</span>
                <span className="notification-desc">当文件导出完成时发送通知</span>
              </div>
              <div className="toggle">
                <input type="checkbox" id="notify-export" defaultChecked />
                <label htmlFor="notify-export"></label>
              </div>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <span className="notification-title">邮件通知</span>
                <span className="notification-desc">通过邮件发送重要通知</span>
              </div>
              <div className="toggle">
                <input type="checkbox" id="notify-email" />
                <label htmlFor="notify-email"></label>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="section-card">
            <h3>ℹ️ 关于 Clipe</h3>
            <div className="about-info">
              <div className="about-item">
                <span className="about-label">版本</span>
                <span className="about-value">1.0.0</span>
              </div>
              <div className="about-item">
                <span className="about-label">开发者</span>
                <span className="about-value">Clipe Team</span>
              </div>
              <div className="about-item">
                <span className="about-label">联系我们</span>
                <Link to="#" className="about-value link">support@clipe.ai</Link>
              </div>
              <div className="about-item">
                <span className="about-label">隐私政策</span>
                <Link to="#" className="about-value link">查看</Link>
              </div>
              <div className="about-item">
                <span className="about-label">服务条款</span>
                <Link to="#" className="about-value link">查看</Link>
              </div>
            </div>

            <div className="about-description">
              <p>Clipe 是一款 AI 智能试卷拆题学习助手，帮助学生和教师快速将整页试卷拆分成独立试题，支持导出分享和题库管理。</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .settings-container {
          flex: 1;
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .settings-sidebar {
          width: 220px;
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
          flex-shrink: 0;
        }

        .sidebar-header h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 1.25rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .nav-item {
          padding: 0.65rem 0.9rem;
          border-radius: 10px;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.9rem;
          color: #6B7280;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: #F2FCFC;
          color: #028081;
        }

        .nav-item.active {
          background: #06B2B5;
          color: white;
        }

        .nav-icon {
          font-size: 0.95rem;
        }

        .settings-content {
          flex: 1;
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .section-card {
          animation: fade-in 0.3s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1F2937;
        }

        .save-btn {
          padding: 0.55rem 1.1rem;
          background: #06B2B5;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(6, 178, 181, 0.25);
        }

        .save-btn:hover:not(:disabled) {
          background: #04999C;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.35);
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4B5563;
          margin-bottom: 0.4rem;
        }

        .form-input {
          width: 100%;
          padding: 0.65rem;
          border: 1px solid #E7ECEF;
          border-radius: 10px;
          font-size: 0.9rem;
          background: #FFFFFF;
          color: #1F2937;
          transition: all 0.2s;
        }

        .form-input::placeholder {
          color: #9CA3AF;
        }

        .form-input:focus {
          outline: none;
          border-color: #06B2B5;
          box-shadow: 0 0 0 3px rgba(6, 178, 181, 0.1);
        }

        .avatar-options {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .avatar-option {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1px solid #E7ECEF;
          background: #F8FAFB;
          font-size: 1.4rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .avatar-option:hover {
          border-color: #06B2B5;
          transform: scale(1.1);
        }

        .avatar-option.active {
          border-color: #06B2B5;
          background: #F2FCFC;
        }

        .danger-zone {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: rgba(239, 68, 68, 0.08);
          border-radius: 12px;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }

        .danger-zone h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #EF4444;
          margin-bottom: 0.9rem;
        }

        .danger-btn {
          padding: 0.65rem 1.25rem;
          background: #EF4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
        }

        .danger-btn:hover {
          background: #DC2626;
          transform: translateY(-1px);
        }

        .danger-hint {
          font-size: 0.75rem;
          color: #EF4444;
          margin-top: 0.4rem;
        }

        .theme-options {
          display: flex;
          gap: 0.85rem;
        }

        .theme-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 0.9rem;
          border: 1px solid #E7ECEF;
          border-radius: 12px;
          background: #F8FAFB;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-option:hover {
          border-color: #06B2B5;
        }

        .theme-option.active {
          border-color: #06B2B5;
          background: #F2FCFC;
        }

        .theme-preview {
          width: 36px;
          height: 36px;
          border-radius: 8px;
        }

        .theme-preview.light {
          background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
          border: 1px solid rgba(0,0,0,0.1);
        }

        .theme-preview.dark {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        }

        .theme-preview.system {
          background: linear-gradient(135deg, #ffffff 0%, #1f2937 100%);
        }

        .font-size-slider {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .font-size-slider input[type="range"] {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          background: #E7ECEF;
          appearance: none;
        }

        .font-size-slider input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #06B2B5;
          cursor: pointer;
        }

        .font-size-slider span {
          font-weight: 600;
          color: #06B2B5;
        }

        .notification-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9rem;
          border-bottom: 1px solid #EDF2F4;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .notification-title {
          font-weight: 600;
          color: #1F2937;
        }

        .notification-desc {
          font-size: 0.8rem;
          color: #6B7280;
        }

        .toggle {
          position: relative;
          width: 44px;
          height: 26px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle label {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #E7ECEF;
          border-radius: 13px;
          transition: 0.3s;
        }

        .toggle label:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 4px;
          bottom: 4px;
          background: #FFFFFF;
          border-radius: 50%;
          transition: 0.3s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .toggle input:checked + label {
          background: #06B2B5;
        }

        .toggle input:checked + label:before {
          transform: translateX(18px);
        }

        .about-info {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1.5rem;
        }

        .about-item {
          display: flex;
          justify-content: space-between;
          padding: 0.65rem;
          background: #F8FAFB;
          border-radius: 8px;
        }

        .about-label {
          font-weight: 500;
          color: #6B7280;
        }

        .about-value {
          font-weight: 600;
          color: #1F2937;
        }

        .about-value.link {
          color: #06B2B5;
          text-decoration: none;
        }

        .about-value.link:hover {
          text-decoration: underline;
        }

        .about-description {
          padding: 0.9rem;
          background: #F2FCFC;
          border-radius: 10px;
          border-left: 3px solid #06B2B5;
        }

        .about-description p {
          color: #4B5563;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .settings-container {
            flex-direction: column;
          }

          .settings-sidebar {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
