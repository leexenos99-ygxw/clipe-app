import { useState, useEffect } from 'react'

interface HistoryItem {
  id: number
  timestamp: number
  action: string
  type: 'upload' | 'detect' | 'export' | 'share' | 'merge' | 'delete'
}

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [filter, setFilter] = useState<'all' | 'upload' | 'detect' | 'export' | 'share'>('all')

  useEffect(() => {
    const existingHistory = localStorage.getItem('userHistory')
    if (existingHistory) {
      setHistory(JSON.parse(existingHistory))
    } else {
      const mockHistory: HistoryItem[] = [
        { id: 1, timestamp: Date.now() - 3600000, action: '上传试卷并识别 20 道题目', type: 'detect' },
        { id: 2, timestamp: Date.now() - 7200000, action: '导出为 PDF 文件', type: 'export' },
        { id: 3, timestamp: Date.now() - 10800000, action: '分享题目到微信', type: 'share' },
        { id: 4, timestamp: Date.now() - 14400000, action: '上传试卷图片', type: 'upload' },
        { id: 5, timestamp: Date.now() - 18000000, action: '合并 3 道题目', type: 'merge' },
        { id: 6, timestamp: Date.now() - 21600000, action: '识别试卷，拆分出 15 道题目', type: 'detect' },
        { id: 7, timestamp: Date.now() - 25200000, action: '导出为 PNG 图片', type: 'export' },
        { id: 8, timestamp: Date.now() - 43200000, action: '删除 2 道误识别题目', type: 'delete' },
      ]
      setHistory(mockHistory)
      localStorage.setItem('userHistory', JSON.stringify(mockHistory))
    }
  }, [])

  const handleDelete = (id: number) => {
    
    if (confirm('确定要删除这条记录吗？')) {
      const updatedHistory = history.filter((item) => item.id !== id)
      setHistory(updatedHistory)
      localStorage.setItem('userHistory', JSON.stringify(updatedHistory))
    }
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      setHistory([])
      localStorage.removeItem('userHistory')
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`

    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      upload: '📤',
      detect: '🔍',
      export: '📥',
      share: '🔗',
      merge: '🔗',
      delete: '🗑️',
    }
    return icons[type] || '📋'
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      upload: '#3b82f6',
      detect: '#10b981',
      export: '#f59e0b',
      share: '#8b5cf6',
      merge: '#06b6d4',
      delete: '#ef4444',
    }
    return colors[type] || '#6b7280'
  }

  const filteredHistory = filter === 'all'
    ? history
    : history.filter((item) => item.type === filter)

  const filters = [
    { id: 'all', label: '全部' },
    { id: 'upload', label: '上传' },
    { id: 'detect', label: '识别' },
    { id: 'export', label: '导出' },
    { id: 'share', label: '分享' },
  ]

  const stats = {
    total: history.length,
    today: history.filter((item) => Date.now() - item.timestamp < 86400000).length,
    week: history.filter((item) => Date.now() - item.timestamp < 604800000).length,
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="header-info">
          <h1>📜 使用记录</h1>
          <p>追踪您的每一次操作</p>
        </div>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClearAll}>
            🗑️ 清空全部
          </button>
        )}
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">总操作次数</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.today}</span>
          <span className="stat-label">今日操作</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.week}</span>
          <span className="stat-label">本周操作</span>
        </div>
      </div>

      <div className="filter-bar">
        {filters.map((f) => (
          <button
            key={f.id}
            className={`filter-btn ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id as typeof filter)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>暂无操作记录</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div className="item-icon" style={{ background: `${getTypeColor(item.type)}20`, color: getTypeColor(item.type) }}>
                {getTypeIcon(item.type)}
              </div>
              <div className="item-content">
                <span className="item-action">{item.action}</span>
                <span className="item-time">{formatTime(item.timestamp)}</span>
              </div>
              <div className="item-type" style={{ background: `${getTypeColor(item.type)}15`, color: getTypeColor(item.type) }}>
                {item.type === 'upload' && '上传'}
                {item.type === 'detect' && '识别'}
                {item.type === 'export' && '导出'}
                {item.type === 'share' && '分享'}
                {item.type === 'merge' && '合并'}
                {item.type === 'delete' && '删除'}
              </div>
              <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        .history-container {
          flex: 1;
          padding: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .header-info h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 0.25rem;
        }

        .header-info p {
          font-size: 0.95rem;
          color: #6B7280;
        }

        .clear-btn {
          padding: 0.65rem 1.1rem;
          background: #EF4444;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
        }

        .clear-btn:hover {
          background: #DC2626;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .stat-card {
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 14px;
          padding: 1.1rem;
          text-align: center;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #06B2B5;
          margin-bottom: 0.2rem;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6B7280;
        }

        .filter-bar {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          padding: 0.45rem;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .filter-btn {
          flex: 1;
          padding: 0.7rem 0.5rem;
          border: none;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          color: #6B7280;
          transition: all 0.25s;
        }

        .filter-btn:hover {
          background: #F2FCFC;
          color: #028081;
        }

        .filter-btn.active {
          background: #06B2B5;
          color: white;
        }

        .history-list {
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .empty-state {
          text-align: center;
          padding: 3.5rem 1rem;
          color: #9CA3AF;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.9rem;
          display: block;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.9rem;
          border-bottom: 1px solid #EDF2F4;
          animation: slide-in 0.3s ease;
          transition: background 0.25s;
        }

        .history-item:hover {
          background: #F8FAFB;
          border-radius: 12px;
          margin: 0 -0.9rem;
          padding: 0.9rem;
        }

        .history-item:last-child {
          border-bottom: none;
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .item-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .item-content {
          flex: 1;
          min-width: 0;
        }

        .item-action {
          display: block;
          font-weight: 500;
          color: #1F2937;
          margin-bottom: 0.2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-time {
          font-size: 0.8rem;
          color: #6B7280;
        }

        .item-type {
          padding: 0.35rem 0.75rem;
          border-radius: 18px;
          font-size: 0.75rem;
          font-weight: 500;
          flex-shrink: 0;
        }

        .delete-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.25s;
          flex-shrink: 0;
          opacity: 0;
        }

        .history-item:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.1);
        }

        @media (max-width: 640px) {
          .stats-row {
            grid-template-columns: 1fr;
          }

          .filter-bar {
            flex-wrap: wrap;
          }

          .filter-btn {
            flex: 1;
            min-width: 90px;
          }

          .item-type {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}