import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface QuestionBankItem {
  id: number
  timestamp: number
  questionCount: number
  questions: { id: number; box: { x: number; y: number; width: number; height: number } }[]
  imageUrl?: string
}

export function Library() {
  const [bank, setBank] = useState<QuestionBankItem[]>([])
  const [selectedItem, setSelectedItem] = useState<QuestionBankItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const existingBank = localStorage.getItem('questionBank')
    if (existingBank) {
      setBank(JSON.parse(existingBank))
    }
  }, [])

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这条记录吗？')) {
      const updatedBank = bank.filter((item) => item.id !== id)
      setBank(updatedBank)
      localStorage.setItem('questionBank', JSON.stringify(updatedBank))
      if (selectedItem?.id === id) {
        setSelectedItem(null)
      }
    }
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有题库记录吗？')) {
      setBank([])
      localStorage.removeItem('questionBank')
      setSelectedItem(null)
    }
  }

  const handleLoadToWorkspace = (item: QuestionBankItem) => {
    localStorage.setItem('loadedQuestionSet', JSON.stringify(item))
    navigate('/workspace')
  }

  const handleExportSelected = (item: QuestionBankItem) => {
    const dataStr = JSON.stringify(item, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `questions_${formatDate(item.timestamp).replace(/[:/]/g, '-')}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredBank = bank.filter((item) => {
    const dateStr = formatDate(item.timestamp)
    return dateStr.includes(searchTerm) || item.questionCount.toString().includes(searchTerm)
  })

  return (
    <div className="library-container">
      <div className="library-header">
        <div className="header-info">
          <h1>📚 题库管理</h1>
          <p>共 {bank.length} 条记录，{bank.reduce((sum, item) => sum + item.questionCount, 0)} 道题目</p>
        </div>
        {bank.length > 0 && (
          <button className="clear-btn" onClick={handleClearAll}>
            🗑️ 清空全部
          </button>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索日期或题目数量..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="library-content">
        <div className="bank-list">
          <div className="list-header">
            <span>📋 题库列表</span>
          </div>
          {filteredBank.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>暂无题库记录</p>
              <p className="empty-hint">在拆题工作区完成拆题后，点击「保存到题库」即可添加</p>
            </div>
          ) : (
            <div className="bank-items">
              {filteredBank.map((item) => (
                <div
                  key={item.id}
                  className={`bank-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="item-info">
                    <span className="item-date">{formatDate(item.timestamp)}</span>
                    <span className="item-count">{item.questionCount} 道题目</span>
                  </div>
                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bank-detail">
          <div className="detail-header">
            <span>📝 题目详情</span>
          </div>
          {selectedItem ? (
            <div className="detail-content">
              <div className="detail-info">
                <div className="info-row">
                  <span className="info-label">记录时间</span>
                  <span className="info-value">{formatDate(selectedItem.timestamp)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">题目数量</span>
                  <span className="info-value">{selectedItem.questionCount} 道</span>
                </div>
              </div>

              <div className="detail-actions">
                <button className="action-btn load-btn" onClick={() => handleLoadToWorkspace(selectedItem)}>
                  <span>🎨</span>
                  <span>加载到工作区</span>
                </button>
                <button className="action-btn export-btn" onClick={() => handleExportSelected(selectedItem)}>
                  <span>📥</span>
                  <span>导出JSON</span>
                </button>
              </div>

              <div className="questions-preview">
                <h3>题目列表</h3>
                <div className="preview-grid">
                  {selectedItem.questions.map((q) => (
                    <div key={q.id} className="question-preview">
                      <span className="preview-number">Q{q.id}</span>
                      <div className="preview-dimensions">
                        <span>{q.box.width} × {q.box.height}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="detail-empty">
              <span className="empty-icon">👆</span>
              <p>点击左侧记录查看详情</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .library-container {
          flex: 1;
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .library-header {
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

        .search-bar {
          position: relative;
          margin-bottom: 1.25rem;
        }

        .search-bar input {
          width: 100%;
          padding: 0.8rem 2.5rem 0.8rem 1.2rem;
          border: 1px solid #E7ECEF;
          border-radius: 14px;
          font-size: 0.95rem;
          background: #FFFFFF;
          color: #1F2937;
          outline: none;
          transition: all 0.25s;
        }

        .search-bar input::placeholder {
          color: #9CA3AF;
        }

        .search-bar input:focus {
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

        .library-content {
          display: flex;
          gap: 1.25rem;
        }

        .bank-list, .bank-detail {
          flex: 1;
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .list-header, .detail-header {
          font-size: 1rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 0.9rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid #EDF2F4;
        }

        .empty-state {
          text-align: center;
          padding: 2.5rem 1rem;
          color: #6B7280;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.9rem;
          display: block;
        }

        .empty-hint {
          font-size: 0.85rem;
          margin-top: 0.4rem;
          color: #9CA3AF;
        }

        .bank-items {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          max-height: 380px;
          overflow-y: auto;
        }

        .bank-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9rem;
          background: #F8FAFB;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s;
          border: 1px solid transparent;
        }

        .bank-item:hover {
          background: #F2FCFC;
          border-color: #CFEFEF;
        }

        .bank-item.selected {
          background: #F2FCFC;
          border-color: #06B2B5;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .item-date {
          font-weight: 600;
          color: #1F2937;
        }

        .item-count {
          font-size: 0.85rem;
          color: #6B7280;
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
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: scale(1.1);
        }

        .detail-content {
          animation: fade-in 0.2s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .detail-info {
          margin-bottom: 0.9rem;
        }

        .detail-actions {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: all 0.25s;
        }

        .load-btn {
          background: #06B2B5;
          color: white;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.25);
        }

        .load-btn:hover {
          background: #04999C;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(6, 178, 181, 0.35);
        }

        .export-btn {
          background: #F2FCFC;
          color: #028081;
          border: 1px solid #CFEFEF;
        }

        .export-btn:hover {
          background: #E3F7F7;
          border-color: #A7E4E4;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: #F8FAFB;
          border-radius: 10px;
          margin-bottom: 0.4rem;
        }

        .info-label {
          font-weight: 500;
          color: #6B7280;
        }

        .info-value {
          font-weight: 600;
          color: #1F2937;
        }

        .questions-preview h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 0.65rem;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 0.4rem;
          max-height: 220px;
          overflow-y: auto;
        }

        .question-preview {
          background: #F2FCFC;
          border: 1px solid #CFEFEF;
          padding: 0.75rem;
          border-radius: 10px;
          text-align: center;
        }

        .preview-number {
          display: block;
          font-weight: 700;
          color: #028081;
          font-size: 1rem;
        }

        .preview-dimensions {
          font-size: 0.7rem;
          color: #6B7280;
          margin-top: 0.2rem;
        }

        .detail-empty {
          text-align: center;
          padding: 3.5rem 1rem;
          color: #9CA3AF;
        }

        @media (max-width: 768px) {
          .library-content {
            flex-direction: column;
          }

          .bank-items {
            max-height: 220px;
          }
        }
      `}</style>
    </div>
  )
}