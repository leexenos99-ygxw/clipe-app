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

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'history'>('overview')
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: '用户',
    email: 'user@example.com',
    avatar: '👤',
    joinDate: '2024-01-15',
  })

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setUserData(JSON.parse(currentUser))
    }

    const bank = JSON.parse(localStorage.getItem('questionBank') || '[]')
    const history = JSON.parse(localStorage.getItem('userHistory') || '[]')
    console.log('Bank:', bank.length, 'History:', history.length)
  }, [])

  const recentQuestions = [
    { id: 1, date: '2024-01-20', count: 15, subject: '数学' },
    { id: 2, date: '2024-01-19', count: 20, subject: '英语' },
    { id: 3, date: '2024-01-18', count: 12, subject: '物理' },
  ]

  const bank = JSON.parse(localStorage.getItem('questionBank') || '[]')
  const history = JSON.parse(localStorage.getItem('userHistory') || '[]')
  const totalQuestions = bank.reduce((sum: number, item: { questionCount: number }) => sum + item.questionCount, 0)
  const totalPapers = bank.length

  const statsCards = [
    { label: '总题目数', value: totalQuestions, icon: '📝', color: '#3b82f6' },
    { label: '试卷数', value: totalPapers, icon: '📄', color: '#10b981' },
    { label: '操作次数', value: history.length, icon: '🎯', color: '#f59e0b' },
  ]

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-card">
          <div className="avatar-wrapper">
            <span className="avatar">{userData.avatar}</span>
            <div className="avatar-badge">✓</div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userData.name}</h1>
            <p className="profile-email">{userData.email}</p>
            <p className="profile-date">加入于 {userData.joinDate}</p>
          </div>
          <div className="profile-actions">
            <Link to="/settings" className="action-btn settings-btn">
              <span>⚙️</span>
              <span>设置</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="stats-row">
        {statsCards.map((card) => (
          <div key={card.label} className="stat-card" style={{ background: `linear-gradient(135deg, ${card.color}20 0%, ${card.color}10 100%)`, border: `1px solid ${card.color}30` }}>
            <span className="stat-icon">{card.icon}</span>
            <span className="stat-value" style={{ color: card.color }}>{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </div>
        ))}
      </div>

      <div className="profile-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span>
            <span>概览</span>
          </button>
          <button
            className={`tab ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <span>📝</span>
            <span>题目管理</span>
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span>📜</span>
            <span>使用记录</span>
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="section-card">
                <h3 className="section-title">📈 使用趋势</h3>
                <div className="chart-placeholder">
                  <div className="chart-bars">
                    {[65, 80, 45, 70, 90, 55, 85].map((height, index) => (
                      <div key={index} className="chart-bar" style={{ height: `${height}%` }}>
                        <span className="bar-tooltip">{height}</span>
                      </div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    <span>周一</span>
                    <span>周二</span>
                    <span>周三</span>
                    <span>周四</span>
                    <span>周五</span>
                    <span>周六</span>
                    <span>周日</span>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h3 className="section-title">🏆 成就</h3>
                <div className="achievements-grid">
                  {['🎯 首次拆题', '📚 拆题达人', '⚡ 快速识别', '🎨 完美编辑'].map((achievement) => (
                    <div key={achievement} className="achievement-item">
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="questions-content">
              <div className="section-card">
                <h3 className="section-title">📋 最近识别</h3>
                <div className="questions-list">
                  {recentQuestions.map((item) => (
                    <div key={item.id} className="question-item">
                      <div className="question-info">
                        <span className="question-subject">{item.subject}</span>
                        <span className="question-date">{item.date}</span>
                      </div>
                      <div className="question-count">
                        <span>{item.count} 题</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/library" className="view-all">
                  查看全部 →
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-content">
              <div className="section-card">
                <h3 className="section-title">📜 使用记录</h3>
                <div className="history-list">
                  {[
                    { time: '今天 14:30', action: '上传试卷并识别 20 道题目' },
                    { time: '今天 10:15', action: '导出 PDF 文件' },
                    { time: '昨天 16:45', action: '分享题目到微信' },
                    { time: '昨天 09:20', action: '合并 3 道题目' },
                  ].map((item, index) => (
                    <div key={index} className="history-item">
                      <span className="history-time">{item.time}</span>
                      <span className="history-action">{item.action}</span>
                    </div>
                  ))}
                </div>
                <Link to="/history" className="view-all">
                  查看全部 →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .profile-container {
          flex: 1;
          padding: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        .profile-header {
          margin-bottom: 1.5rem;
        }

        .profile-card {
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .avatar-wrapper {
          position: relative;
        }

        .avatar {
          width: 75px;
          height: 75px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06B2B5 0%, #63D5D6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.3rem;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.3);
        }

        .avatar-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #22C55E;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          border: 3px solid #FCFDFD;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 0.2rem;
        }

        .profile-email {
          font-size: 1rem;
          color: #6B7280;
          margin-bottom: 0.4rem;
        }

        .profile-date {
          font-size: 0.85rem;
          color: #9CA3AF;
        }

        .profile-actions {
          display: flex;
          gap: 0.8rem;
        }

        .action-btn {
          padding: 0.75rem 1.2rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.25s;
        }

        .settings-btn {
          background: #F2FCFC;
          color: #028081;
          border: 1px solid #CFEFEF;
        }

        .settings-btn:hover {
          background: #E3F7F7;
          border-color: #A7E4E4;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.25rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .stat-icon {
          font-size: 1.5rem;
          margin-bottom: 0.4rem;
        }

        .stat-value {
          display: block;
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6B7280;
        }

        .profile-content {
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #EDF2F4;
        }

        .tab {
          flex: 1;
          padding: 0.95rem;
          background: none;
          border: none;
          font-size: 0.95rem;
          font-weight: 500;
          color: #6B7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: all 0.25s;
        }

        .tab:hover {
          background: #F2FCFC;
          color: #028081;
        }

        .tab.active {
          background: #F2FCFC;
          color: #06B2B5;
          border-bottom: 3px solid #06B2B5;
        }

        .tab-content {
          padding: 1.5rem;
        }

        .section-card {
          margin-bottom: 1.25rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 0.9rem;
        }

        .chart-placeholder {
          background: #F8FAFB;
          border-radius: 14px;
          padding: 1.25rem;
        }

        .chart-bars {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 110px;
          margin-bottom: 0.4rem;
        }

        .chart-bar {
          width: 12%;
          background: linear-gradient(180deg, #06B2B5 0%, #63D5D6 100%);
          border-radius: 6px 6px 0 0;
          position: relative;
          transition: height 0.3s;
          box-shadow: 0 2px 8px rgba(6, 178, 181, 0.25);
        }

        .chart-bar:hover {
          opacity: 0.85;
        }

        .bar-tooltip {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: #FCFDFD;
          color: #1F2937;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          opacity: 0;
          transition: opacity 0.2s;
          box-shadow: 0 2px 8px rgba(2, 128, 129, 0.1);
          border: 1px solid #E7ECEF;
        }

        .chart-bar:hover .bar-tooltip {
          opacity: 1;
        }

        .chart-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #6B7280;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.65rem;
        }

        .achievement-item {
          background: #F2FCFC;
          border: 1px solid #CFEFEF;
          padding: 0.95rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #028081;
        }

        .questions-list, .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .question-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.95rem;
          background: #F8FAFB;
          border-radius: 12px;
          border: 1px solid #E7ECEF;
        }

        .question-info {
          display: flex;
          flex-direction: column;
        }

        .question-subject {
          font-weight: 600;
          color: #1F2937;
        }

        .question-date {
          font-size: 0.8rem;
          color: #6B7280;
        }

        .question-count {
          font-weight: 600;
          color: #028081;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          padding: 0.7rem 0;
          border-bottom: 1px solid #EDF2F4;
        }

        .history-item:last-child {
          border-bottom: none;
        }

        .history-time {
          font-size: 0.85rem;
          color: #6B7280;
        }

        .history-action {
          font-weight: 500;
          color: #4B5563;
        }

        .view-all {
          display: block;
          text-align: right;
          margin-top: 0.9rem;
          color: #06B2B5;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .view-all:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .profile-container {
            padding: 1rem;
          }

          .profile-card {
            flex-direction: column;
            text-align: center;
          }

          .stats-row {
            grid-template-columns: 1fr;
          }

          .tabs {
            flex-direction: column;
          }

          .tab {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  )
}
