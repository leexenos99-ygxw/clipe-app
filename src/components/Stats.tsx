import { useState } from 'react'

export function Stats() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  const statsData = {
    week: {
      totalQuestions: 45,
      totalPapers: 3,
      avgTime: '2分30秒',
      accuracy: 92,
      dailyData: [5, 8, 3, 10, 12, 4, 3],
    },
    month: {
      totalQuestions: 128,
      totalPapers: 15,
      avgTime: '2分15秒',
      accuracy: 94,
      dailyData: [4, 6, 8, 5, 10, 12, 8, 6, 9, 11, 7, 5, 8, 10, 12, 9, 7, 6, 8, 11, 13, 9, 6, 4, 7, 10, 12, 8, 6, 9],
    },
    year: {
      totalQuestions: 856,
      totalPapers: 120,
      avgTime: '2分45秒',
      accuracy: 93,
      dailyData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 30),
    },
  }

  const currentData = statsData[timeRange]

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>📊 使用统计</h1>
        <div className="time-range">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              className={`range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === 'week' && '本周'}
              {range === 'month' && '本月'}
              {range === 'year' && '本年'}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-value">{currentData.totalQuestions}</span>
            <span className="stat-label">识别题目数</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <span className="stat-value">{currentData.totalPapers}</span>
            <span className="stat-label">处理试卷数</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <span className="stat-value">{currentData.avgTime}</span>
            <span className="stat-label">平均耗时</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-value">{currentData.accuracy}%</span>
            <span className="stat-label">识别准确率</span>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <div className="section-header">
          <h2>📈 识别趋势</h2>
        </div>
        <div className="chart-container">
          <div className="chart-bars">
            {currentData.dailyData.map((value, index) => (
              <div
                key={index}
                className="chart-bar"
                style={{ height: `${(value / Math.max(...currentData.dailyData)) * 100}%` }}
              >
                <span className="bar-value">{value}</span>
              </div>
            ))}
          </div>
          <div className="chart-labels">
            {timeRange === 'week' && ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day) => (
              <span key={day}>{day}</span>
            ))}
            {timeRange === 'month' && Array.from({ length: 30 }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
            {timeRange === 'year' && ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <div className="section-card">
          <h3>🏆 成就进度</h3>
          <div className="achievements">
            {[
              { name: '拆题新手', progress: 100, target: 10, current: 15 },
              { name: '识别达人', progress: 50, target: 50, current: 25 },
              { name: '速度之星', progress: 30, target: 100, current: 30 },
              { name: '完美编辑', progress: 70, target: 200, current: 140 },
            ].map((item) => (
              <div key={item.name} className="achievement-row">
                <span className="achievement-name">{item.name}</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
                </div>
                <span className="achievement-count">{item.current}/{item.target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .stats-container {
          flex: 1;
          padding: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .stats-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1F2937;
        }

        .time-range {
          display: flex;
          gap: 0.4rem;
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          padding: 0.35rem;
          border-radius: 12px;
        }

        .range-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          color: #6B7280;
          transition: all 0.2s;
        }

        .range-btn:hover {
          background: #F2FCFC;
          color: #028081;
        }

        .range-btn.active {
          background: #06B2B5;
          color: white;
          box-shadow: 0 2px 8px rgba(6, 178, 181, 0.25);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.9rem;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          background: #F2FCFC;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #06B2B5;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6B7280;
        }

        .chart-section {
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .section-header h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 1.25rem;
        }

        .chart-container {
          padding: 0.9rem;
          background: #F8FAFB;
          border-radius: 14px;
        }

        .chart-bars {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 140px;
          margin-bottom: 0.4rem;
        }

        .chart-bar {
          width: 3%;
          background: linear-gradient(180deg, #06B2B5 0%, #63D5D6 100%);
          border-radius: 6px 6px 0 0;
          position: relative;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(6, 178, 181, 0.25);
        }

        .chart-bar:hover {
          opacity: 0.85;
        }

        .bar-value {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: #FCFDFD;
          color: #1F2937;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.65rem;
          opacity: 0;
          transition: opacity 0.2s;
          border: 1px solid #E7ECEF;
          box-shadow: 0 2px 8px rgba(2, 128, 129, 0.1);
        }

        .chart-bar:hover .bar-value {
          opacity: 1;
        }

        .chart-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #6B7280;
        }

        .bottom-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.9rem;
        }

        .section-card {
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
        }

        .section-card h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 0.9rem;
        }

        .achievements {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .achievement-row {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .achievement-name {
          width: 100px;
          font-weight: 500;
          color: #4B5563;
          font-size: 0.85rem;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #EAEFF2;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #F5A623;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .achievement-count {
          font-size: 0.8rem;
          font-weight: 600;
          color: #06B2B5;
          min-width: 55px;
          text-align: right;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chart-bar {
            width: 2%;
          }

          .chart-labels span {
            display: none;
          }

          .chart-labels span:nth-child(5n) {
            display: inline;
          }

          .stats-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}