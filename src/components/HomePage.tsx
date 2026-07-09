import { Link } from 'react-router-dom'
import { SiriLogo } from './SiriLogo'

export function HomePage() {
  const features = [
    {
      icon: '🔪',
      title: 'AI 智能拆题',
      description: '上传整页试卷，AI 自动识别题目边界，一键拆分成独立试题',
      color: '#06B2B5',
    },
    {
      icon: '✏️',
      title: '单题管理',
      description: '支持自动编号、删除误识别题目、合并拆分错误区域、手动调整边界',
      color: '#04999C',
    },
    {
      icon: '📤',
      title: '导出分享',
      description: '支持导出 PNG、PDF，分享到微信/QQ，保存到题库',
      color: '#028081',
    },
  ]

  const stats = [
    { value: '10万+', label: '识别题目' },
    { value: '5万+', label: '用户信赖' },
    { value: '99%', label: '准确率' },
    { value: '2秒', label: '平均耗时' },
  ]

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="logo-section">
            <SiriLogo size="large" />
          </div>
          <h1 className="hero-title">Clipe</h1>
          <h2>AI 智能试卷拆题学习助手</h2>
          <p>让试卷拆分变得简单高效，助力学习事半功倍</p>
          <div className="hero-buttons">
            <Link to="/workspace" className="primary-btn">
              <span>🚀</span>
              <span>开始拆题</span>
            </Link>
            <Link to="/library" className="secondary-btn">
              <span>📚</span>
              <span>查看题库</span>
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <div className="section-header">
          <h2>✨ 核心功能</h2>
          <p>强大的 AI 能力，让试卷处理更智能</p>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card"
              style={{
                background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}08 100%)`,
                borderLeftColor: feature.color,
              }}
            >
              <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="how-it-works">
        <div className="section-header">
          <h2>📋 使用流程</h2>
          <p>简单四步，轻松完成试卷拆题</p>
        </div>
        <div className="steps-container">
          {[
            { step: 1, icon: '📤', title: '上传试卷', desc: '拖拽或点击上传试卷图片' },
            { step: 2, icon: '🔍', title: 'AI 识别', desc: '系统自动识别题目边界' },
            { step: 3, icon: '✏️', title: '编辑调整', desc: '手动调整题目区域' },
            { step: 4, icon: '📥', title: '导出分享', desc: '导出或分享题目' },
          ].map((item) => (
            <div key={item.step} className="step-item">
              <div className="step-number">{item.step}</div>
              <div className="step-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>准备好开始了吗？</h2>
          <p>立即体验 AI 智能拆题，让学习更高效</p>
          <Link to="/workspace" className="cta-btn">
            <span>🎯</span>
            <span>立即开始</span>
          </Link>
        </div>
      </div>

      <style>{`
        .home-container {
          flex: 1;
          padding: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          background: #FFFFFF;
        }

        .hero-section {
          text-align: center;
          padding: 3rem 1.5rem;
          animation: fade-in 0.6s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-section {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .hero-content h1 {
          font-size: 2.8rem;
          font-weight: 900;
          background: linear-gradient(135deg, #06B2B5 0%, #04999C 30%, #028081 60%, #06B2B5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.75rem 0;
          letter-spacing: -2px;
          animation: title-shine 4s ease-in-out infinite;
          background-size: 200% 200%;
        }

        @keyframes title-shine {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 0.75rem;
        }

        .hero-content p {
          font-size: 1rem;
          color: #4B5563;
          margin-bottom: 2rem;
          max-width: 450px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-buttons {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .primary-btn, .secondary-btn, .cta-btn {
          padding: 0.9rem 1.75rem;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .primary-btn {
          background: #06B2B5;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.25);
        }

        .primary-btn:hover {
          background: #04999C;
          box-shadow: 0 6px 16px rgba(6, 178, 181, 0.35);
          transform: translateY(-1px);
        }

        .secondary-btn {
          background: #F2FCFC;
          color: #028081;
          border: 1px solid #CFEFEF;
        }

        .secondary-btn:hover {
          background: #E3F7F7;
          border-color: #A7E4E4;
          transform: translateY(-1px);
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          margin-top: 3rem;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.8rem;
          font-weight: 700;
          color: #1F2937;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6B7280;
        }

        .features-section {
          margin-top: 1.5rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .section-header h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 0.4rem;
        }

        .section-header p {
          font-size: 0.9rem;
          color: #6B7280;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .feature-card {
          background: #FCFDFD;
          border-radius: 16px;
          padding: 1.5rem;
          border-left: 4px solid;
          border: 1px solid #E7ECEF;
          box-shadow: 0 4px 16px rgba(2, 128, 129, 0.06);
          transition: all 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(6, 178, 181, 0.12);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          font-size: 0.85rem;
          color: #4B5563;
          line-height: 1.6;
        }

        .how-it-works {
          margin-top: 3rem;
        }

        .steps-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .step-item {
          background: #FCFDFD;
          border-radius: 16px;
          padding: 1.5rem 1.25rem;
          text-align: center;
          border: 1px solid #E7ECEF;
          box-shadow: 0 4px 16px rgba(2, 128, 129, 0.06);
          position: relative;
          transition: all 0.2s ease;
        }

        .step-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(6, 178, 181, 0.12);
        }

        .step-number {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #06B2B5;
          color: #FFFFFF;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(6, 178, 181, 0.3);
        }

        .step-icon {
          font-size: 1.8rem;
          margin-bottom: 0.75rem;
        }

        .step-item h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 0.5rem;
        }

        .step-item p {
          font-size: 0.82rem;
          color: #4B5563;
        }

        .cta-section {
          margin-top: 3rem;
          background: #F2FCFC;
          border: 1px solid #CFEFEF;
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
          box-shadow: 0 4px 16px rgba(6, 178, 181, 0.08);
        }

        .cta-content h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 0.5rem;
        }

        .cta-content p {
          font-size: 0.9rem;
          color: #4B5563;
          margin-bottom: 1.5rem;
        }

        .cta-btn {
          background: #06B2B5;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.25);
        }

        .cta-btn:hover {
          background: #04999C;
          box-shadow: 0 6px 16px rgba(6, 178, 181, 0.35);
          transform: translateY(-1px);
        }

        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .steps-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr;
          }

          .steps-container {
            grid-template-columns: 1fr;
          }

          .hero-stats {
            gap: 1.25rem;
          }

          .hero-content h2 {
            font-size: 1.2rem;
          }

          .hero-content h1 {
            font-size: 2rem;
            letter-spacing: -1px;
          }
        }
      `}</style>
    </div>
  )
}

export { HomePage as Home }
